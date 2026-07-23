import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { Timestamp } from 'firebase/firestore';
import {
  taskFromFirestore,
  taskToFirestoreCreate,
  buildContentPatch,
  buildCompletionPatch,
  buildPlaybackPatch,
} from '../src/firebase/firestore/taskConverter.js';
import {
  ideaFromFirestore,
  ideaToFirestoreCreate,
  buildIdeaContentPatch,
} from '../src/firebase/firestore/ideaConverter.js';

describe('Task Converter Unit Tests', () => {
  const mockNow = new Date('2026-07-21T12:00:00.000Z');
  const mockTimestamp = Timestamp.fromDate(mockNow);

  describe('taskFromFirestore', () => {
    test('extracts snapshot.id as domain id and converts timestamps to ISO strings', () => {
      const mockSnapshot = {
        id: 'task-123',
        data: () => ({
          title: 'Test Task',
          description: 'Desc',
          taskType: 'standard',
          youtubeUrl: '',
          youtubeNotes: '',
          lastWatchedSeconds: 0,
          completed: false,
          completedAt: null,
          priority: 'High',
          category: 'Work',
          time: '09:00',
          dueDate: '2026-07-25',
          createdAt: mockTimestamp,
          updatedAt: mockTimestamp,
        }),
      };

      const result = taskFromFirestore(mockSnapshot);
      assert.equal(result.id, 'task-123');
      assert.equal(result.title, 'Test Task');
      assert.equal(result.completed, false);
      assert.equal(result.completedAt, null);
      assert.equal(result.createdAt, mockNow.toISOString());
      assert.equal(result.updatedAt, mockNow.toISOString());
    });

    test('handles completed task with completedAt timestamp', () => {
      const mockSnapshot = {
        id: 'task-456',
        data: () => ({
          title: 'Done Task',
          description: '',
          taskType: 'youtube',
          youtubeUrl: 'https://youtube.com/watch?v=123',
          youtubeNotes: 'Notes',
          lastWatchedSeconds: 120,
          completed: true,
          completedAt: mockTimestamp,
          priority: 'Medium',
          category: 'Learning',
          time: null,
          dueDate: null,
          createdAt: mockTimestamp,
          updatedAt: mockTimestamp,
        }),
      };

      const result = taskFromFirestore(mockSnapshot);
      assert.equal(result.id, 'task-456');
      assert.equal(result.completed, true);
      assert.equal(result.completedAt, mockNow.toISOString());
    });

    test('converts pending estimated timestamp to ISO string', () => {
      const mockSnapshot = {
        id: 'task-pending',
        data: (options) => {
          assert.equal(options?.serverTimestamps, 'estimate');
          return {
            title: 'Pending Task',
            description: '',
            taskType: 'standard',
            youtubeUrl: '',
            youtubeNotes: '',
            lastWatchedSeconds: 0,
            completed: false,
            completedAt: null,
            priority: 'Low',
            category: 'Personal',
            time: null,
            dueDate: null,
            createdAt: mockTimestamp,
            updatedAt: mockTimestamp,
          };
        },
      };

      const result = taskFromFirestore(mockSnapshot);
      assert.equal(result.createdAt, mockNow.toISOString());
    });

    test('throws if createdAt is missing or invalid', () => {
      const mockSnapshot = {
        id: 'task-invalid',
        data: () => ({
          title: 'Invalid',
          updatedAt: mockTimestamp,
        }),
      };
      assert.throws(() => taskFromFirestore(mockSnapshot), /missing valid createdAt/);
    });

    test('throws if updatedAt is missing or invalid', () => {
      const mockSnapshot = {
        id: 'task-invalid-2',
        data: () => ({
          title: 'Invalid',
          createdAt: mockTimestamp,
        }),
      };
      assert.throws(() => taskFromFirestore(mockSnapshot), /missing valid updatedAt/);
    });
  });

  describe('taskToFirestoreCreate', () => {
    test('creates valid 14-field object with default values and server timestamps', () => {
      const input = {
        title: ' New Task ',
        description: 'Detail',
        priority: 'High',
        category: 'Health',
      };

      const result = taskToFirestoreCreate(input);
      assert.equal(result.title, 'New Task');
      assert.equal(result.description, 'Detail');
      assert.equal(result.taskType, 'standard');
      assert.equal(result.youtubeUrl, '');
      assert.equal(result.youtubeNotes, '');
      assert.equal(result.lastWatchedSeconds, 0);
      assert.equal(result.completed, false);
      assert.equal(result.completedAt, null);
      assert.equal(result.priority, 'High');
      assert.equal(result.category, 'Health');
      assert.equal(result.time, null);
      assert.equal(result.dueDate, null);
      assert.ok(result.createdAt);
      assert.ok(result.updatedAt);
      assert.equal(Object.keys(result).length, 14);
    });

    test('strips id and caller-supplied timestamps', () => {
      const input = {
        id: 'bogus-id',
        title: 'Task',
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01',
        completedAt: '2020-01-01',
        completed: true,
      };

      const result = taskToFirestoreCreate(input);
      assert.equal(result.id, undefined);
      assert.equal(result.completed, false);
      assert.equal(result.completedAt, null);
    });

    test('floors fractional lastWatchedSeconds during creation', () => {
      const input = {
        title: 'Task',
        lastWatchedSeconds: 45.9,
      };
      const result = taskToFirestoreCreate(input);
      assert.equal(result.lastWatchedSeconds, 45);
    });

    test('rejects empty title', () => {
      assert.throws(() => taskToFirestoreCreate({ title: '' }), /non-empty string/);
      assert.throws(() => taskToFirestoreCreate({ title: '   ' }), /non-empty string/);
    });

    test('rejects invalid enum values', () => {
      assert.throws(() => taskToFirestoreCreate({ title: 'T', taskType: 'invalid' }), /Invalid taskType/);
      assert.throws(() => taskToFirestoreCreate({ title: 'T', priority: 'Urgent' }), /Invalid priority/);
      assert.throws(() => taskToFirestoreCreate({ title: 'T', category: 'General' }), /Invalid category/);
    });

    test('missing creation playback defaults to 0', () => {
      const result = taskToFirestoreCreate({ title: 'Task' });
      assert.equal(result.lastWatchedSeconds, 0);
    });

    test('explicit null and undefined creation playback are rejected', () => {
      assert.throws(() => taskToFirestoreCreate({ title: 'Task', lastWatchedSeconds: null }), /finite non-negative/);
      assert.throws(() => taskToFirestoreCreate({ title: 'Task', lastWatchedSeconds: undefined }), /finite non-negative/);
    });

    test('other invalid creation playback inputs remain rejected', () => {
      assert.throws(() => taskToFirestoreCreate({ title: 'Task', lastWatchedSeconds: '10' }), /finite non-negative/);
      assert.throws(() => taskToFirestoreCreate({ title: 'Task', lastWatchedSeconds: -1 }), /finite non-negative/);
      assert.throws(() => taskToFirestoreCreate({ title: 'Task', lastWatchedSeconds: NaN }), /finite non-negative/);
      assert.throws(() => taskToFirestoreCreate({ title: 'Task', lastWatchedSeconds: Infinity }), /finite non-negative/);
    });

    test('rejects invalid time and dueDate formats', () => {
      assert.throws(() => taskToFirestoreCreate({ title: 'T', time: '25:00' }), /valid 24-hour HH:MM/);
      assert.throws(() => taskToFirestoreCreate({ title: 'T', dueDate: '2026/07/21' }), /valid YYYY-MM-DD/);
    });
  });

  describe('buildContentPatch', () => {
    const currentTask = {
      title: 'Current',
      description: 'Desc',
      taskType: 'standard',
      youtubeUrl: 'https://youtube.com/watch?v=old',
      youtubeNotes: '',
      priority: 'Medium',
      category: 'Work',
      time: null,
      dueDate: null,
      lastWatchedSeconds: 30,
    };

    test('returns null when patch introduces no change', () => {
      const patch = { title: 'Current', description: 'Desc' };
      const result = buildContentPatch(currentTask, patch);
      assert.equal(result, null);
    });

    test('rejects unknown patch keys', () => {
      assert.throws(
        () => buildContentPatch(currentTask, { createdAt: 'bogus' }),
        /Invalid content patch key/,
      );
      assert.throws(
        () => buildContentPatch(currentTask, { unknownField: 123 }),
        /Invalid content patch key/,
      );
    });

    test('resets lastWatchedSeconds to 0 when youtubeUrl changes', () => {
      const patch = { youtubeUrl: 'https://youtube.com/watch?v=new' };
      const result = buildContentPatch(currentTask, patch);
      assert.notEqual(result, null);
      assert.equal(result.youtubeUrl, 'https://youtube.com/watch?v=new');
      assert.equal(result.lastWatchedSeconds, 0);
      assert.ok(result.updatedAt);
    });

    test('does not reset lastWatchedSeconds when youtubeUrl is unchanged', () => {
      const patch = { title: 'Updated Title' };
      const result = buildContentPatch(currentTask, patch);
      assert.notEqual(result, null);
      assert.equal(result.title, 'Updated Title');
      assert.equal(result.lastWatchedSeconds, undefined);
    });
  });

  describe('buildCompletionPatch', () => {
    test('returns null when requested completed state matches current state', () => {
      assert.equal(buildCompletionPatch({ completed: true }, true), null);
      assert.equal(buildCompletionPatch({ completed: false }, false), null);
    });

    test('completing sets completed: true, completedAt serverTimestamp, updatedAt serverTimestamp', () => {
      const result = buildCompletionPatch({ completed: false }, true);
      assert.equal(result.completed, true);
      assert.ok(result.completedAt);
      assert.ok(result.updatedAt);
    });

    test('reopening sets completed: false, completedAt: null, updatedAt serverTimestamp', () => {
      const result = buildCompletionPatch({ completed: true }, false);
      assert.equal(result.completed, false);
      assert.equal(result.completedAt, null);
      assert.ok(result.updatedAt);
    });
  });

  describe('buildPlaybackPatch', () => {
    const currentTask = { lastWatchedSeconds: 60 };

    test('floors fractional input and returns playback patch without updatedAt', () => {
      const result = buildPlaybackPatch(currentTask, 75.8);
      assert.notEqual(result, null);
      assert.equal(result.lastWatchedSeconds, 75);
      assert.equal(result.updatedAt, undefined);
    });

    test('returns null when floored value matches current floored value', () => {
      const result = buildPlaybackPatch(currentTask, 60.9);
      assert.equal(result, null);
    });

    test('rejects negative, non-number, NaN, Infinity inputs', () => {
      assert.throws(() => buildPlaybackPatch(currentTask, -5), /finite non-negative/);
      assert.throws(() => buildPlaybackPatch(currentTask, '60'), /finite non-negative/);
      assert.throws(() => buildPlaybackPatch(currentTask, NaN), /finite non-negative/);
      assert.throws(() => buildPlaybackPatch(currentTask, Infinity), /finite non-negative/);
      assert.throws(() => buildPlaybackPatch(currentTask, undefined), /finite non-negative/);
      assert.throws(() => buildPlaybackPatch(currentTask, null), /finite non-negative/);
    });
  });
});

describe('Idea Converter Unit Tests', () => {
  const mockNow = new Date('2026-07-21T15:00:00.000Z');
  const mockTimestamp = Timestamp.fromDate(mockNow);

  describe('ideaFromFirestore', () => {
    test('extracts snapshot.id and converts timestamps to ISO strings', () => {
      const mockSnapshot = {
        id: 'idea-123',
        data: () => ({
          text: 'Great Idea',
          notes: 'Some notes',
          createdAt: mockTimestamp,
          updatedAt: mockTimestamp,
        }),
      };

      const result = ideaFromFirestore(mockSnapshot);
      assert.equal(result.id, 'idea-123');
      assert.equal(result.text, 'Great Idea');
      assert.equal(result.notes, 'Some notes');
      assert.equal(result.createdAt, mockNow.toISOString());
      assert.equal(result.updatedAt, mockNow.toISOString());
    });

    test('throws if required timestamp is missing', () => {
      const mockSnapshot = {
        id: 'idea-invalid',
        data: () => ({ text: 'Text', updatedAt: mockTimestamp }),
      };
      assert.throws(() => ideaFromFirestore(mockSnapshot), /missing valid createdAt/);
    });

    test('throws if updatedAt is missing or invalid', () => {
      const missingSnapshot = {
        id: 'idea-missing-updated',
        data: () => ({ text: 'Text', notes: '', createdAt: mockTimestamp }),
      };
      const invalidSnapshot = {
        id: 'idea-invalid-updated',
        data: () => ({
          text: 'Text', notes: '', createdAt: mockTimestamp, updatedAt: 'not-a-timestamp',
        }),
      };
      assert.throws(() => ideaFromFirestore(missingSnapshot), /missing valid updatedAt/);
      assert.throws(() => ideaFromFirestore(invalidSnapshot), /missing valid updatedAt/);
    });
  });

  describe('ideaToFirestoreCreate', () => {
    test('creates valid 4-field idea document', () => {
      const input = { text: ' My Idea ', notes: 'Notes' };
      const result = ideaToFirestoreCreate(input);

      assert.equal(result.text, 'My Idea');
      assert.equal(result.notes, 'Notes');
      assert.ok(result.createdAt);
      assert.ok(result.updatedAt);
      assert.equal(Object.keys(result).length, 4);
    });

    test('defaults missing notes to empty string', () => {
      const input = { text: 'Idea' };
      const result = ideaToFirestoreCreate(input);
      assert.equal(result.notes, '');
    });

    test('explicit null and undefined idea notes are rejected', () => {
      assert.throws(() => ideaToFirestoreCreate({ text: 'Idea', notes: null }), /must be a string/);
      assert.throws(() => ideaToFirestoreCreate({ text: 'Idea', notes: undefined }), /must be a string/);
    });

    test('rejects empty text and non-string notes', () => {
      assert.throws(() => ideaToFirestoreCreate({ text: '  ' }), /non-empty string/);
      assert.throws(() => ideaToFirestoreCreate({ text: 'Idea', notes: 123 }), /must be a string/);
    });
  });

  describe('buildIdeaContentPatch', () => {
    const currentIdea = { text: 'Idea Text', notes: 'Notes' };

    test('returns null when patch introduces no change', () => {
      const result = buildIdeaContentPatch(currentIdea, { text: 'Idea Text', notes: 'Notes' });
      assert.equal(result, null);
    });

    test('rejects unknown patch keys', () => {
      assert.throws(
        () => buildIdeaContentPatch(currentIdea, { createdAt: 'bogus' }),
        /Invalid idea patch key/,
      );
    });

    test('returns patch with updatedAt when content changes', () => {
      const result = buildIdeaContentPatch(currentIdea, { notes: 'Updated Notes' });
      assert.notEqual(result, null);
      assert.equal(result.notes, 'Updated Notes');
      assert.ok(result.updatedAt);
    });
  });
});
