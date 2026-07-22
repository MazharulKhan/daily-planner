import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  deriveChangedFields,
  getDetailSavePlan,
  mapTaskCloudError,
  normalizeInlineTaskDraft,
} from '../src/utils/taskCloud.js';
import { createPlaybackPersistenceController } from '../src/hooks/useTaskPlaybackPersistence.js';

test('task cloud errors map permission, unavailable, quota, and unknown failures', () => {
  assert.match(mapTaskCloudError({ code: 'permission-denied' }, 'content').userMessage, /access/i);
  assert.match(mapTaskCloudError({ code: 'unavailable' }, 'content').userMessage, /could not be reached/i);
  assert.match(mapTaskCloudError({ code: 'resource-exhausted' }, 'content').userMessage, /temporarily unavailable/i);
  assert.equal(
    mapTaskCloudError({ code: 'something-new' }, 'delete').userMessage,
    'This task could not be deleted.',
  );
});

test('inline changed fields preserve untouched remote fields and support no-op patches', () => {
  const baseline = normalizeInlineTaskDraft({
    title: 'Original', priority: 'Medium', category: 'Work', time: '', dueDate: '',
  });
  const draft = normalizeInlineTaskDraft({
    title: '  Renamed  ', priority: 'Medium', category: 'Work', time: '', dueDate: '',
  });
  assert.deepEqual(
    deriveChangedFields(baseline, draft, ['title', 'priority', 'category', 'time', 'dueDate']),
    { title: 'Renamed' },
  );
  assert.deepEqual(
    deriveChangedFields(baseline, baseline, ['title', 'priority', 'category', 'time', 'dueDate']),
    {},
  );
});

test('detail save planning separates content and completion operations', () => {
  assert.deepEqual(getDetailSavePlan({ completed: false }, {}, false), {
    contentPatch: {}, hasContent: false, hasCompletion: false, desiredCompletion: false,
  });
  assert.deepEqual(getDetailSavePlan({ completed: false }, { title: 'Changed' }, true), {
    contentPatch: { title: 'Changed' }, hasContent: true, hasCompletion: true, desiredCompletion: true,
  });
});

test('playback controller throttles continued writes and lets lifecycle checkpoints bypass', () => {
  let clock = 0;
  const writes = [];
  const controller = createPlaybackPersistenceController({
    initialSeconds: 0,
    now: () => clock,
    write: (seconds) => writes.push(seconds),
  });

  clock = 5_000;
  assert.equal(controller.continued(5.9), false);
  clock = 30_000;
  assert.equal(controller.continued(30.8), true);
  assert.deepEqual(writes, [30]);
  assert.equal(controller.immediate(30.2), false);
  assert.equal(controller.immediate(34.9), true);
  assert.deepEqual(writes, [30, 34]);
});

test('playback end stores zero before leave cleanup and invalid values do not write', () => {
  const writes = [];
  const errors = [];
  const controller = createPlaybackPersistenceController({
    initialSeconds: 12,
    write: (seconds) => writes.push(seconds),
    onImmediateError: (error) => errors.push(error),
  });
  assert.equal(controller.end(), true);
  assert.equal(controller.leave(99), false);
  assert.deepEqual(writes, [0]);
  assert.equal(controller.immediate(-1), false);
  assert.equal(errors.length, 1);
});

test('playback controller allows a later checkpoint after an immediate write rejection', async () => {
  const writes = [];
  let rejectFirst = true;
  const controller = createPlaybackPersistenceController({
    initialSeconds: 0,
    write: (seconds) => {
      writes.push(seconds);
      if (rejectFirst) {
        rejectFirst = false;
        return Promise.reject(new Error('offline rejection'));
      }
      return Promise.resolve();
    },
  });

  assert.equal(controller.immediate(12), true);
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(controller.immediate(12), true);
  assert.deepEqual(writes, [12, 12]);
});

test('repository queues only after SDK dispatch and retains acknowledgement promises', async () => {
  const repository = await readFile(new URL('../src/firebase/firestore/taskRepository.js', import.meta.url), 'utf8');
  const addModal = await readFile(new URL('../src/components/AddTaskModal.jsx', import.meta.url), 'utf8');

  assert.doesNotMatch(repository, /\baddDoc\b/);
  assert.match(repository, /const docRef = doc\(getUserTasksCollection\(uid\)\)/);
  assert.match(repository, /const acknowledgement = setDoc\(docRef, data\);\s*onWriteQueued\?\.\(\{ id: docRef\.id \}\);\s*return acknowledgement\.then/s);
  assert.doesNotMatch(addModal, /makeId\('task'\)/);
  assert.doesNotMatch(addModal, /\bid:\s*makeId/);
  assert.doesNotMatch(addModal, /completedAt|createdAt|updatedAt/);
});
