import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  getUserTasksCollection,
  getUserTaskDoc,
  validateUid,
} from './firestoreHelpers.js';
import {
  taskFromFirestore,
  taskToFirestoreCreate,
  buildContentPatch,
  buildCompletionPatch,
  buildPlaybackPatch,
} from './taskConverter.js';

export function subscribeToTasks(uid, { onData, onError }) {
  validateUid(uid);
  const collectionRef = getUserTasksCollection(uid);

  return onSnapshot(
    collectionRef,
    (snapshot) => {
      try {
        const tasks = snapshot.docs.map((docSnap) => taskFromFirestore(docSnap));
        if (typeof onData === 'function') {
          onData(tasks);
        }
      } catch (err) {
        if (typeof onError === 'function') {
          onError(err);
        }
      }
    },
    (error) => {
      if (typeof onError === 'function') {
        onError(error);
      }
    },
  );
}

export async function createTask(uid, taskInput) {
  validateUid(uid);
  const data = taskToFirestoreCreate(taskInput);
  const docRef = doc(getUserTasksCollection(uid));
  await setDoc(docRef, data);
  return { id: docRef.id };
}

export async function updateTaskContent(uid, taskId, currentTask, patch) {
  const docRef = getUserTaskDoc(uid, taskId);
  const firestorePatch = buildContentPatch(currentTask, patch);

  if (!firestorePatch) {
    return { written: false };
  }

  await updateDoc(docRef, firestorePatch);
  return { written: true };
}

export async function setTaskCompletion(uid, taskId, currentTask, completed) {
  const docRef = getUserTaskDoc(uid, taskId);
  const firestorePatch = buildCompletionPatch(currentTask, completed);

  if (!firestorePatch) {
    return { written: false };
  }

  await updateDoc(docRef, firestorePatch);
  return { written: true };
}

export async function updateTaskPlaybackPosition(uid, taskId, currentTask, seconds) {
  const docRef = getUserTaskDoc(uid, taskId);
  const firestorePatch = buildPlaybackPatch(currentTask, seconds);

  if (!firestorePatch) {
    return { written: false };
  }

  await updateDoc(docRef, firestorePatch);
  return { written: true };
}

export async function deleteTask(uid, taskId) {
  const docRef = getUserTaskDoc(uid, taskId);
  await deleteDoc(docRef);
}
