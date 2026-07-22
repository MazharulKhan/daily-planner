import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test, describe } from 'node:test';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import { serverTimestamp } from 'firebase/firestore';

const PROJECT_ID = 'demo-daily-planner';
const RULES_PATH = 'firestore.rules';

let testEnv;

test.before(async () => {
  const rulesContent = readFileSync(RULES_PATH, 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: rulesContent },
  });
});

test.beforeEach(async () => {
  await testEnv.clearFirestore();
});

test.after(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

function validTaskData(overrides = {}) {
  return {
    title: 'Test Task',
    description: '',
    taskType: 'standard',
    youtubeUrl: '',
    youtubeNotes: '',
    lastWatchedSeconds: 0,
    completed: false,
    completedAt: null,
    priority: 'Medium',
    category: 'Work',
    time: null,
    dueDate: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides,
  };
}

function validIdeaData(overrides = {}) {
  return {
    text: 'Test Idea',
    notes: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides,
  };
}

describe('Unauthenticated access', () => {
  test('Cannot get a task', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection('users').doc('user1').collection('tasks').doc('t1').get());
  });

  test('Cannot list tasks', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection('users').doc('user1').collection('tasks').get());
  });

  test('Cannot create a task', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      db.collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData()),
    );
  });

  test('Cannot update a task', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      db
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({ title: 'New Title', updatedAt: serverTimestamp() }),
    );
  });

  test('Cannot delete a task', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection('users').doc('user1').collection('tasks').doc('t1').delete());
  });

  test('Cannot get an idea', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection('users').doc('user1').collection('ideas').doc('i1').get());
  });

  test('Cannot list ideas', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection('users').doc('user1').collection('ideas').get());
  });

  test('Cannot create an idea', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      db.collection('users').doc('user1').collection('ideas').doc('i1').set(validIdeaData()),
    );
  });

  test('Cannot update an idea', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(
      db
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .update({ text: 'New Text', updatedAt: serverTimestamp() }),
    );
  });

  test('Cannot delete an idea', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection('users').doc('user1').collection('ideas').doc('i1').delete());
  });
});

describe('Owner CRUD — Tasks', () => {
  test('Can create a valid task', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(
      db.collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData()),
    );
  });

  test('Can get own task', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(db.collection('users').doc('user1').collection('tasks').doc('t1').get());
  });

  test('Can list own tasks', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(db.collection('users').doc('user1').collection('tasks').get());
  });

  test('Can content-update own task', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(
      db
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({ title: 'Updated Title', updatedAt: serverTimestamp() }),
    );
  });

  test('Can YouTube URL update with playback reset to 0', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData({ lastWatchedSeconds: 150 }));
    });
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(
      db
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({
          youtubeUrl: 'https://youtube.com/watch?v=new',
          lastWatchedSeconds: 0,
          updatedAt: serverTimestamp(),
        }),
    );
  });

  test('Can complete a task', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(
      db
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({
          completed: true,
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }),
    );
  });

  test('Can reopen a task', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData({ completed: true, completedAt: new Date() }));
    });
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(
      db
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({
          completed: false,
          completedAt: null,
          updatedAt: serverTimestamp(),
        }),
    );
  });

  test('Can playback-only update without updating updatedAt', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(
      db
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({ lastWatchedSeconds: 45 }),
    );
  });

  test('Can delete own task', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(
      db.collection('users').doc('user1').collection('tasks').doc('t1').delete(),
    );
  });
});

describe('Owner CRUD — Ideas', () => {
  test('Can create a valid idea', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(
      db.collection('users').doc('user1').collection('ideas').doc('i1').set(validIdeaData()),
    );
  });

  test('Can get own idea', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .set(validIdeaData());
    });
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(db.collection('users').doc('user1').collection('ideas').doc('i1').get());
  });

  test('Can list own ideas', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(db.collection('users').doc('user1').collection('ideas').get());
  });

  test('Can content-update own idea', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .set(validIdeaData());
    });
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(
      db
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .update({ notes: 'Updated Notes', updatedAt: serverTimestamp() }),
    );
  });

  test('Can delete own idea', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .set(validIdeaData());
    });
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertSucceeds(
      db.collection('users').doc('user1').collection('ideas').doc('i1').delete(),
    );
  });
});

describe('Cross-user isolation', () => {
  test("User A cannot get User B's task", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('userB')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    const db = testEnv.authenticatedContext('userA').firestore();
    await assertFails(db.collection('users').doc('userB').collection('tasks').doc('t1').get());
  });

  test("User A cannot list User B's tasks", async () => {
    const db = testEnv.authenticatedContext('userA').firestore();
    await assertFails(db.collection('users').doc('userB').collection('tasks').get());
  });

  test('User A cannot create task under User B', async () => {
    const db = testEnv.authenticatedContext('userA').firestore();
    await assertFails(
      db.collection('users').doc('userB').collection('tasks').doc('t1').set(validTaskData()),
    );
  });

  test("User A cannot update User B's task", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('userB')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    const db = testEnv.authenticatedContext('userA').firestore();
    await assertFails(
      db
        .collection('users')
        .doc('userB')
        .collection('tasks')
        .doc('t1')
        .update({ title: 'Hacked', updatedAt: serverTimestamp() }),
    );
  });

  test("User A cannot delete User B's task", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('userB')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    const db = testEnv.authenticatedContext('userA').firestore();
    await assertFails(db.collection('users').doc('userB').collection('tasks').doc('t1').delete());
  });

  test("User A cannot get User B's idea", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('userB')
        .collection('ideas')
        .doc('i1')
        .set(validIdeaData());
    });
    const db = testEnv.authenticatedContext('userA').firestore();
    await assertFails(db.collection('users').doc('userB').collection('ideas').doc('i1').get());
  });

  test("User A cannot list User B's ideas", async () => {
    const db = testEnv.authenticatedContext('userA').firestore();
    await assertFails(db.collection('users').doc('userB').collection('ideas').get());
  });

  test('User A cannot create idea under User B', async () => {
    const db = testEnv.authenticatedContext('userA').firestore();
    await assertFails(
      db.collection('users').doc('userB').collection('ideas').doc('i1').set(validIdeaData()),
    );
  });

  test("User A cannot update User B's idea", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('userB')
        .collection('ideas')
        .doc('i1')
        .set(validIdeaData());
    });
    const db = testEnv.authenticatedContext('userA').firestore();
    await assertFails(
      db
        .collection('users')
        .doc('userB')
        .collection('ideas')
        .doc('i1')
        .update({ notes: 'Hacked', updatedAt: serverTimestamp() }),
    );
  });

  test("User A cannot delete User B's idea", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('userB')
        .collection('ideas')
        .doc('i1')
        .set(validIdeaData());
    });
    const db = testEnv.authenticatedContext('userA').firestore();
    await assertFails(db.collection('users').doc('userB').collection('ideas').doc('i1').delete());
  });
});

describe('Unknown paths and fields', () => {
  test('Cannot read users/{uid} parent doc', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertFails(db.collection('users').doc('user1').get());
  });

  test('Cannot write users/{uid} parent doc', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertFails(db.collection('users').doc('user1').set({ name: 'User' }));
  });

  test('Cannot read/write unknown subcollection', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertFails(db.collection('users').doc('user1').collection('settings').get());
    await assertFails(
      db.collection('users').doc('user1').collection('settings').doc('s1').set({ theme: 'dark' }),
    );
  });

  test('Cannot create task with missing field', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    const data = validTaskData();
    delete data.description;
    await assertFails(db.collection('users').doc('user1').collection('tasks').doc('t1').set(data));
  });

  test('Cannot create task with extra field', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    const data = validTaskData({ extraField: 'bogus' });
    await assertFails(db.collection('users').doc('user1').collection('tasks').doc('t1').set(data));
  });

  test('Cannot update task to add extra field', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    const db = testEnv.authenticatedContext('user1').firestore();
    await assertFails(
      db
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({ extraField: 'bogus', updatedAt: serverTimestamp() }),
    );
  });

  test('Cannot create idea with missing field', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    const data = validIdeaData();
    delete data.notes;
    await assertFails(db.collection('users').doc('user1').collection('ideas').doc('i1').set(data));
  });

  test('Cannot create idea with extra field', async () => {
    const db = testEnv.authenticatedContext('user1').firestore();
    const data = validIdeaData({ extraField: 'bogus' });
    await assertFails(db.collection('users').doc('user1').collection('ideas').doc('i1').set(data));
  });
});

describe('Task validation — field types and formats', () => {
  const db = () => testEnv.authenticatedContext('user1').firestore();

  test('Fails: empty title', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ title: '' })),
    );
  });

  test('Fails: whitespace-only title', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ title: '   ' })),
    );
  });

  test('Fails: invalid taskType', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ taskType: 'video' })),
    );
  });

  test('Fails: invalid priority', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ priority: 'Urgent' })),
    );
  });

  test('Fails: invalid category', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ category: 'General' })),
    );
  });

  test('Fails: non-boolean completed', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ completed: 'false' })),
    );
  });

  test('Fails: non-null completedAt on create', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ completedAt: serverTimestamp() })),
    );
  });

  test('Fails: completed=true on create', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ completed: true })),
    );
  });

  test('Fails: negative lastWatchedSeconds', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ lastWatchedSeconds: -1 })),
    );
  });

  test('Fails: fractional lastWatchedSeconds', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ lastWatchedSeconds: 12.5 })),
    );
  });

  test('Fails: time 9:30 (missing leading zero)', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ time: '9:30' })),
    );
  });

  test('Fails: time invalid string/type ("abc", non-string)', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ time: 'abc' })),
    );
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t2').set(validTaskData({ time: 1230 })),
    );
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t3').set(validTaskData({ time: true })),
    );
  });

  test('Fails: time 24:00 / 25:00 / 29:59 (hour out of range)', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ time: '24:00' })),
    );
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t2').set(validTaskData({ time: '25:00' })),
    );
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t3').set(validTaskData({ time: '29:59' })),
    );
  });

  test('Fails: dueDate invalid string/type ("abc", wrong-order, non-string)', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ dueDate: 'abc' })),
    );
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t2').set(validTaskData({ dueDate: '01-15-2024' })),
    );
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t3').set(validTaskData({ dueDate: 20240115 })),
    );
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t4').set(validTaskData({ dueDate: true })),
    );
  });

  test('Succeeds: time as null, 00:00, 09:30, 23:59', async () => {
    await assertSucceeds(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ time: null })),
    );
    await assertSucceeds(
      db().collection('users').doc('user1').collection('tasks').doc('t2').set(validTaskData({ time: '00:00' })),
    );
    await assertSucceeds(
      db().collection('users').doc('user1').collection('tasks').doc('t3').set(validTaskData({ time: '09:30' })),
    );
    await assertSucceeds(
      db().collection('users').doc('user1').collection('tasks').doc('t4').set(validTaskData({ time: '23:59' })),
    );
  });

  test('Fails: dueDate invalid format / month 00/13 / day 00/32', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ dueDate: '2024/01/15' })),
    );
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t2').set(validTaskData({ dueDate: '2024-00-15' })),
    );
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t3').set(validTaskData({ dueDate: '2024-13-15' })),
    );
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t4').set(validTaskData({ dueDate: '2024-01-00' })),
    );
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t5').set(validTaskData({ dueDate: '2024-01-32' })),
    );
  });

  test('Succeeds: dueDate as null, 2024-01-15, 2024-12-31', async () => {
    await assertSucceeds(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({ dueDate: null })),
    );
    await assertSucceeds(
      db().collection('users').doc('user1').collection('tasks').doc('t2').set(validTaskData({ dueDate: '2024-01-15' })),
    );
    await assertSucceeds(
      db().collection('users').doc('user1').collection('tasks').doc('t3').set(validTaskData({ dueDate: '2024-12-31' })),
    );
  });
});

describe('Task validation — timestamps and update classification', () => {
  const db = () => testEnv.authenticatedContext('user1').firestore();

  test('Fails: client literal timestamps instead of server timestamps on create', async () => {
    const literal = new Date();
    await assertFails(
      db().collection('users').doc('user1').collection('tasks').doc('t1').set(validTaskData({
        createdAt: literal,
        updatedAt: literal,
      })),
    );
  });

  test('Fails: changing createdAt on update', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({ createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
    );
  });

  test('Fails: content update without server updatedAt', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({ title: 'New Title' }),
    );
  });

  test('Fails: completing without server completedAt', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({ completed: true, updatedAt: serverTimestamp() }),
    );
  });

  test('Fails: reopening with non-null completedAt', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData({ completed: true, completedAt: new Date() }));
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({
          completed: false,
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }),
    );
  });

  test('Fails: updatedAt-only update without content/completion/playback change', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({ updatedAt: serverTimestamp() }),
    );
  });

  test('Fails: changing completedAt while completed remains unchanged', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData({ completed: false, completedAt: null }));
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }),
    );
  });

  test('Fails: negative playback-only update', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({ lastWatchedSeconds: -10 }),
    );
  });

  test('Fails: fractional playback-only update', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({ lastWatchedSeconds: 15.5 }),
    );
  });

  test('Fails: mixed content-plus-completion update', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({
          title: 'New Title',
          completed: true,
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }),
    );
  });

  test('Fails: playback + title change together', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({
          title: 'New Title',
          lastWatchedSeconds: 10,
          updatedAt: serverTimestamp(),
        }),
    );
  });

  test('Fails: playback + updatedAt change together', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({
          lastWatchedSeconds: 10,
          updatedAt: serverTimestamp(),
        }),
    );
  });

  test('Fails: changing youtubeUrl without resetting playback to 0', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({
          youtubeUrl: 'https://youtube.com/watch?v=123',
          lastWatchedSeconds: 50,
          updatedAt: serverTimestamp(),
        }),
    );
  });

  test('Fails: changing playback during content update when youtubeUrl did not change', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .set(validTaskData({ youtubeUrl: 'https://youtube.com/watch?v=123' }));
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('tasks')
        .doc('t1')
        .update({
          title: 'New Title',
          lastWatchedSeconds: 50,
          updatedAt: serverTimestamp(),
        }),
    );
  });
});

describe('Idea validation', () => {
  const db = () => testEnv.authenticatedContext('user1').firestore();

  test('Fails: empty text', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('ideas').doc('i1').set(validIdeaData({ text: '' })),
    );
  });

  test('Fails: whitespace-only text', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('ideas').doc('i1').set(validIdeaData({ text: '   ' })),
    );
  });

  test('Fails: non-string notes', async () => {
    await assertFails(
      db().collection('users').doc('user1').collection('ideas').doc('i1').set(validIdeaData({ notes: 123 })),
    );
  });

  test('Fails: client literal timestamps on create', async () => {
    const literal = new Date();
    await assertFails(
      db().collection('users').doc('user1').collection('ideas').doc('i1').set(validIdeaData({
        createdAt: literal,
        updatedAt: literal,
      })),
    );
  });

  test('Fails: changing createdAt on update', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .set(validIdeaData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .update({ createdAt: serverTimestamp(), updatedAt: serverTimestamp() }),
    );
  });

  test('Fails: update without server updatedAt', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .set(validIdeaData());
    });
    await assertFails(
      db().collection('users').doc('user1').collection('ideas').doc('i1').update({ notes: 'New' }),
    );
  });

  test('Fails: updating only updatedAt without content change', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .set(validIdeaData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .update({ updatedAt: serverTimestamp() }),
    );
  });

  test('Fails: adding unexpected field on update', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .set(validIdeaData());
    });
    await assertFails(
      db()
        .collection('users')
        .doc('user1')
        .collection('ideas')
        .doc('i1')
        .update({ extra: 'bogus', updatedAt: serverTimestamp() }),
    );
  });
});