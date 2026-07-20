import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { initializeTestEnvironment, assertFails } from '@firebase/rules-unit-testing';

const PROJECT_ID = 'demo-daily-planner';
const RULES_PATH = 'firestore.rules';

let testEnv;

test.before(async () => {
  // initializeTestEnvironment expects the rules *contents*, not a file path.
  // See @firebase/rules-unit-testing docs:
  //   firestore: { rules: fs.readFileSync("firestore.rules", "utf8") }
  const rulesContent = readFileSync(RULES_PATH, 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: rulesContent },
  });
});

test.after(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

test('unauthenticated Firestore read is denied under deny-all rules', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  await assertFails(db.collection('users').doc('uid').get());
});

test('unauthenticated Firestore write is denied under deny-all rules', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  await assertFails(db.collection('users').doc('uid').set({ title: 'task' }));
});

test('authenticated Firestore read is denied under deny-all rules', async () => {
  const db = testEnv.authenticatedContext('uid').firestore();
  await assertFails(db.collection('users').doc('uid').get());
});

test('authenticated Firestore write is denied under deny-all rules', async () => {
  const db = testEnv.authenticatedContext('uid').firestore();
  await assertFails(db.collection('users').doc('uid').set({ title: 'task' }));
});