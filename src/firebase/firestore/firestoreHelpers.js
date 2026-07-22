import { collection, doc } from 'firebase/firestore';
import { getFirestoreInstance } from '../firebase.js';

export function validateUid(uid) {
  if (!uid || typeof uid !== 'string' || uid.trim() === '') {
    throw new Error('Invalid or missing UID.');
  }
}

function validateId(id, label) {
  if (!id || typeof id !== 'string' || id.trim() === '') {
    throw new Error(`Invalid or missing ${label} ID.`);
  }
}

export function getUserTasksCollection(uid) {
  validateUid(uid);
  return collection(getFirestoreInstance(), 'users', uid, 'tasks');
}

export function getUserIdeasCollection(uid) {
  validateUid(uid);
  return collection(getFirestoreInstance(), 'users', uid, 'ideas');
}

export function getUserTaskDoc(uid, taskId) {
  validateUid(uid);
  validateId(taskId, 'task');
  return doc(getFirestoreInstance(), 'users', uid, 'tasks', taskId);
}

export function getUserIdeaDoc(uid, ideaId) {
  validateUid(uid);
  validateId(ideaId, 'idea');
  return doc(getFirestoreInstance(), 'users', uid, 'ideas', ideaId);
}
