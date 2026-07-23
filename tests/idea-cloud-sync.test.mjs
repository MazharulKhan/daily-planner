import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  applyIdeaListenerFailure,
  applyIdeaSnapshot,
  deriveCloudStatus,
  mapIdeaCloudError,
  resolveIdeaNotesDraft,
} from '../src/utils/ideaCloud.js';

const initialState = {
  ideas: [],
  status: 'initial-loading',
  hasServerSnapshot: false,
  listenerError: null,
  snapshotHasPendingWrites: false,
  suspended: false,
};

test('cache-only first idea snapshot does not confirm an empty cloud account', () => {
  const next = applyIdeaSnapshot(
    initialState,
    [],
    { fromCache: true, hasPendingWrites: false },
  );

  assert.equal(next.hasServerSnapshot, false);
  assert.equal(next.status, 'initial-loading');
  assert.deepEqual(next.ideas, []);
});

test('server snapshot becomes trustworthy and later pending cache snapshots are adopted', () => {
  const serverIdea = { id: 'server', text: 'Server idea' };
  const ready = applyIdeaSnapshot(
    initialState,
    [serverIdea],
    { fromCache: false, hasPendingWrites: false },
  );
  const pendingIdea = { id: 'pending', text: 'Pending idea' };
  const pending = applyIdeaSnapshot(
    ready,
    [serverIdea, pendingIdea],
    { fromCache: true, hasPendingWrites: true },
  );

  assert.equal(ready.hasServerSnapshot, true);
  assert.equal(ready.status, 'ready');
  assert.deepEqual(pending.ideas, [serverIdea, pendingIdea]);
  assert.equal(pending.snapshotHasPendingWrites, true);
});

test('later listener failure retains the last committed idea list', () => {
  const ready = {
    ...initialState,
    ideas: [{ id: 'idea-1', text: 'Keep me' }],
    status: 'ready',
    hasServerSnapshot: true,
  };
  const error = mapIdeaCloudError({ code: 'unavailable' }, 'content');
  const failed = applyIdeaListenerFailure(ready, error);

  assert.deepEqual(failed.ideas, ready.ideas);
  assert.equal(failed.hasServerSnapshot, true);
  assert.equal(failed.status, 'listener-error');
  assert.equal(failed.listenerError, error);
});

test('idea cloud errors map permission, unavailable, quota, not-found, and operation failures', () => {
  assert.match(mapIdeaCloudError({ code: 'permission-denied' }).userMessage, /access/i);
  assert.match(mapIdeaCloudError({ code: 'unavailable' }).userMessage, /could not be reached/i);
  assert.match(mapIdeaCloudError({ code: 'resource-exhausted' }).userMessage, /temporarily unavailable/i);
  assert.match(mapIdeaCloudError({ code: 'not-found' }).userMessage, /no longer exists/i);
  assert.equal(
    mapIdeaCloudError({ code: 'unknown' }, 'delete').userMessage,
    'This Quick Idea could not be deleted.',
  );
});

test('combined cloud status preserves independent streams with explicit precedence', () => {
  assert.equal(deriveCloudStatus('ready', 'ready'), null);
  assert.equal(deriveCloudStatus('reconnecting', 'ready'), 'reconnecting');
  assert.equal(deriveCloudStatus('ready', 'offline'), 'offline');
  assert.equal(deriveCloudStatus('listener-error', 'offline'), 'cloud-issue');
  assert.equal(deriveCloudStatus('ready', 'listener-error'), 'cloud-issue');
});

test('idea repository emits metadata and queues only after SDK dispatch', async () => {
  const repository = await readFile(
    new URL('../src/firebase/firestore/ideaRepository.js', import.meta.url),
    'utf8',
  );

  assert.match(repository, /includeMetadataChanges:\s*true/);
  assert.match(repository, /fromCache:\s*snapshot\.metadata\.fromCache/);
  assert.match(repository, /hasPendingWrites:\s*snapshot\.metadata\.hasPendingWrites/);
  assert.doesNotMatch(repository, /\baddDoc\b/);
  assert.match(repository, /const docRef = doc\(getUserIdeasCollection\(uid\)\)/);
  assert.match(
    repository,
    /const acknowledgement = setDoc\(docRef, data\);\s*onWriteQueued\?\.\(\{ id: docRef\.id \}\);\s*return acknowledgement\.then/s,
  );
  assert.match(
    repository,
    /if \(!firestorePatch\) \{\s*return \{ written: false \};\s*\}\s*const acknowledgement = updateDoc/s,
  );
});

test('queued but unacknowledged notes stay in a neutral syncing state', async () => {
  const [hookSource, workspaceSource, itemSource] = await Promise.all([
    readFile(new URL('../src/hooks/useIdeaCloud.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/QuickIdeasWorkspace.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/WorkspaceIdeaItem.jsx', import.meta.url), 'utf8'),
  ]);

  assert.match(itemSource, /notesPending \? 'Syncing notes\.\.\.'/);
  assert.match(
    workspaceSource,
    /setNotesSavedAt\(null\);\s+try \{\s+const result = await onEditIdea/s,
  );
  assert.match(
    workspaceSource,
    /if \(result\?\.written && result\?\.acknowledged\) \{[\s\S]*?setNotesSavedAt/,
  );
  assert.doesNotMatch(hookSource, /return \{ written: true, queued: true/);
});

test('Firestore acknowledgement enables the notes saved-success message', async () => {
  const [hookSource, workspaceSource] = await Promise.all([
    readFile(new URL('../src/hooks/useIdeaCloud.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/QuickIdeasWorkspace.jsx', import.meta.url), 'utf8'),
  ]);

  assert.match(
    hookSource,
    /const acknowledgedValue = await acknowledgement;[\s\S]*?acknowledged: true/,
  );
  assert.match(
    workspaceSource,
    /const result = await onEditIdea[\s\S]*?result\?\.acknowledged[\s\S]*?setNotesSavedAt/,
  );
});

test('late rejection clears notes success and creates the persistent operation notice', async () => {
  const [hookSource, workspaceSource] = await Promise.all([
    readFile(new URL('../src/hooks/useIdeaCloud.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/QuickIdeasWorkspace.jsx', import.meta.url), 'utf8'),
  ]);

  assert.match(
    hookSource,
    /const acknowledgedValue = await acknowledgement;[\s\S]*?catch \(error\) \{[\s\S]*?addNotice\(operation, error\);[\s\S]*?throw mapIdeaCloudError/,
  );
  assert.match(
    workspaceSource,
    /async function handleNotesSave[\s\S]*?catch \(error\) \{\s+setNotesSavedAt\(null\);[\s\S]*?setActionError/,
  );
});

test('immediate idea mutation rejection preserves the originating draft or confirmation', async () => {
  const [formSource, workspaceSource] = await Promise.all([
    readFile(new URL('../src/components/AddIdeaForm.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/QuickIdeasWorkspace.jsx', import.meta.url), 'utf8'),
  ]);

  const formCatchStart = formSource.indexOf('} catch (submissionError) {');
  const formCatchEnd = formSource.indexOf('} finally {', formCatchStart);
  const formCatch = formSource.slice(formCatchStart, formCatchEnd);
  assert.notEqual(formCatchStart, -1);
  assert.notEqual(formCatchEnd, -1);
  assert.match(formCatch, /setError/);
  assert.doesNotMatch(formCatch, /setText|onClose/);

  const editStart = workspaceSource.indexOf('async function handleEditSave');
  const editEnd = workspaceSource.indexOf('function handleEditCancel', editStart);
  const editSection = workspaceSource.slice(editStart, editEnd);
  const editCatch = editSection.slice(
    editSection.indexOf('} catch (error) {'),
    editSection.indexOf('} finally {'),
  );
  assert.match(editCatch, /setActionError/);
  assert.doesNotMatch(editCatch, /setAction\(null\)/);

  const notesStart = workspaceSource.indexOf('async function handleNotesSave');
  const notesEnd = workspaceSource.indexOf('function handleNotesCancel', notesStart);
  const notesSection = workspaceSource.slice(notesStart, notesEnd);
  const notesCatch = notesSection.slice(
    notesSection.indexOf('} catch (error) {'),
    notesSection.indexOf('} finally {'),
  );
  assert.match(notesCatch, /setActionError/);
  assert.doesNotMatch(notesCatch, /setDraftNotes/);

  const deleteStart = workspaceSource.indexOf('async function handleDeleteConfirm');
  const deleteEnd = workspaceSource.indexOf('function handleDeleteCancel', deleteStart);
  const deleteSection = workspaceSource.slice(deleteStart, deleteEnd);
  const deleteCatch = deleteSection.slice(
    deleteSection.indexOf('} catch (error) {'),
  );
  assert.match(deleteCatch, /setActionError/);
  assert.doesNotMatch(deleteCatch, /setAction\(null\)/);
});

test('pending-write sign-out protection remains active until acknowledgement settles', async () => {
  const [hookSource, plannerSource] = await Promise.all([
    readFile(new URL('../src/hooks/useIdeaCloud.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/Planner.jsx', import.meta.url), 'utf8'),
  ]);

  assert.match(
    hookSource,
    /pendingOperationsRef\.current\.set[\s\S]*?setPendingCount[\s\S]*?const acknowledgedValue = await acknowledgement/,
  );
  assert.match(
    hookSource,
    /hasPendingWrites: pendingCount > 0 \|\| state\.snapshotHasPendingWrites/,
  );
  assert.match(
    plannerSource,
    /taskCloud\.hasPendingWrites \|\| ideaCloud\.hasPendingWrites/,
  );
});

test('opening a Dashboard idea by stable ID hydrates its saved notes from shared ideas', async () => {
  const [cardSource, plannerSource, workspaceSource] = await Promise.all([
    readFile(new URL('../src/components/QuickIdeasCard.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/Planner.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/QuickIdeasWorkspace.jsx', import.meta.url), 'utf8'),
  ]);
  const ideas = [{ id: 'idea-saved', notes: 'Saved cloud notes' }];

  assert.equal(
    resolveIdeaNotesDraft(ideas, 'idea-saved'),
    'Saved cloud notes',
  );
  assert.match(cardSource, /onOpenWorkspace\?\.\(idea\.id\)/);
  assert.match(plannerSource, /setSelectedIdeaId\(ideaId\)/);
  assert.match(plannerSource, /<QuickIdeasWorkspace\s+ideas=\{ideas\}/s);
  assert.match(workspaceSource, /selectedIdeaOnMount\?\.notes \?\? ''/);
});

test('opening an idea with empty notes keeps the notes placeholder available', async () => {
  const itemSource = await readFile(
    new URL('../src/components/WorkspaceIdeaItem.jsx', import.meta.url),
    'utf8',
  );

  assert.equal(resolveIdeaNotesDraft([{ id: 'idea-empty', notes: '' }], 'idea-empty'), '');
  assert.match(itemSource, /value=\{draftNotes\}/);
  assert.match(itemSource, /placeholder="Add notes\.\.\."/);
});

test('delayed availability hydrates the selected idea with its saved notes', async () => {
  const workspaceSource = await readFile(
    new URL('../src/components/QuickIdeasWorkspace.jsx', import.meta.url),
    'utf8',
  );

  assert.equal(resolveIdeaNotesDraft([], 'idea-delayed'), null);
  assert.equal(
    resolveIdeaNotesDraft(
      [{ id: 'idea-delayed', notes: 'Arrived after first render' }],
      'idea-delayed',
    ),
    'Arrived after first render',
  );
  assert.match(
    workspaceSource,
    /resolveIdeaNotesDraft\(ideas, selectedIdeaId\)[\s\S]*?setDraftNotes\(selectedNotes\)[\s\S]*?setExpandedId\(selectedIdeaId\)/,
  );
});

test('a later remote snapshot does not overwrite a dirty notes draft', () => {
  const latestIdeas = [{ id: 'idea-dirty', notes: 'New remote notes' }];

  assert.equal(
    resolveIdeaNotesDraft(latestIdeas, 'idea-dirty', 'Unsaved local draft', true),
    'Unsaved local draft',
  );
});

test('Discard resolves and restores the latest committed remote notes', async () => {
  const workspaceSource = await readFile(
    new URL('../src/components/QuickIdeasWorkspace.jsx', import.meta.url),
    'utf8',
  );
  const latestIdeas = [{ id: 'idea-discard', notes: 'Latest committed notes' }];

  assert.equal(
    resolveIdeaNotesDraft(latestIdeas, 'idea-discard', 'Unsaved local draft', false),
    'Latest committed notes',
  );
  assert.match(
    workspaceSource,
    /function handleNotesCancel\(\)[\s\S]*?ideas\.find[\s\S]*?setDraftNotes\(idea\?\.notes \?\? ''\)/,
  );
});

test('Today resets to Dashboard only after a successful explicit sign-out', async () => {
  const plannerSource = await readFile(
    new URL('../src/components/Planner.jsx', import.meta.url),
    'utf8',
  );
  const successStart = plannerSource.indexOf("result?.status === 'success'");
  const successEnd = plannerSource.indexOf('return result;', successStart);
  const successBranch = plannerSource.slice(successStart, successEnd);

  assert.match(plannerSource, /view === 'today'/);
  assert.match(successBranch, /storage\.saveActiveView\('dashboard'\)/);
  assert.doesNotMatch(successBranch, /saveActiveView\('today'\)/);
});

test('Quick Ideas resets to Dashboard only after a successful explicit sign-out', async () => {
  const plannerSource = await readFile(
    new URL('../src/components/Planner.jsx', import.meta.url),
    'utf8',
  );
  const successStart = plannerSource.indexOf("result?.status === 'success'");
  const successEnd = plannerSource.indexOf('return result;', successStart);
  const successBranch = plannerSource.slice(successStart, successEnd);

  assert.match(plannerSource, /setView\('quick-ideas'\)/);
  assert.match(successBranch, /storage\.saveActiveView\('dashboard'\)/);
  assert.doesNotMatch(successBranch, /saveActiveView\('quick-ideas'\)/);
});

test('failed sign-out preserves the current page and saved active view', async () => {
  const plannerSource = await readFile(
    new URL('../src/components/Planner.jsx', import.meta.url),
    'utf8',
  );
  const failureStart = plannerSource.indexOf("result?.status === 'failure'");
  const failureEnd = plannerSource.indexOf("result?.status === 'success'", failureStart);
  const failureBranch = plannerSource.slice(failureStart, failureEnd);

  assert.doesNotMatch(failureBranch, /setView\(/);
  assert.doesNotMatch(failureBranch, /saveActiveView/);
  assert.match(failureBranch, /taskCloud\.resumeSession\(\)/);
  assert.match(failureBranch, /ideaCloud\.resumeSession\(\)/);
});

test('refresh while signed in restores and continues persisting the current page', async () => {
  const plannerSource = await readFile(
    new URL('../src/components/Planner.jsx', import.meta.url),
    'utf8',
  );

  assert.match(
    plannerSource,
    /useState\(\(\) => storage\.loadActiveView\('dashboard'\)\)/,
  );
  assert.match(
    plannerSource,
    /useEffect\(\(\) => \{\s+storage\.saveActiveView\(view\);\s+\}, \[view\]\)/s,
  );
});

test('active Quick Ideas graph has no local idea persistence, samples, IDs, or timestamps', async () => {
  const planner = await readFile(new URL('../src/components/Planner.jsx', import.meta.url), 'utf8');
  const addForm = await readFile(new URL('../src/components/AddIdeaForm.jsx', import.meta.url), 'utf8');
  const workspace = await readFile(
    new URL('../src/components/QuickIdeasWorkspace.jsx', import.meta.url),
    'utf8',
  );
  const activeSource = `${planner}\n${addForm}\n${workspace}`;

  assert.doesNotMatch(planner, /useLocalIdeas|makeSampleIdeas|loadIdeas|saveIdeas|migrateIdeas/);
  assert.doesNotMatch(activeSource, /makeId\('idea'\)|\bid:\s*makeId/);
  assert.doesNotMatch(addForm, /createdAt|updatedAt/);
  assert.doesNotMatch(workspace, /Stored on this browser|createdAt:\s*now|updatedAt:\s*now/);
  assert.match(planner, /useIdeaCloud\(user\.uid\)/);
});
