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
    { includeMetadataChanges: true },
    (snapshot) => {
      try {
        const tasks = snapshot.docs.map((docSnap) => taskFromFirestore(docSnap));
        if (typeof onData === 'function') {
          onData(tasks, {
            fromCache: snapshot.metadata.fromCache,
            hasPendingWrites: snapshot.metadata.hasPendingWrites,
          });
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

export function createTask(uid, taskInput, { onWriteQueued } = {}) {
  validateUid(uid);
  const data = taskToFirestoreCreate(taskInput);
  const docRef = doc(getUserTasksCollection(uid));
  const acknowledgement = setDoc(docRef, data);
  onWriteQueued?.({ id: docRef.id });
  return acknowledgement.then(() => ({ id: docRef.id, written: true }));
}

export function updateTaskContent(uid, taskId, currentTask, patch, { onWriteQueued } = {}) {
  const docRef = getUserTaskDoc(uid, taskId);
  const firestorePatch = buildContentPatch(currentTask, patch);

  if (!firestorePatch) {
    return { written: false };
  }

  const acknowledgement = updateDoc(docRef, firestorePatch);
  onWriteQueued?.();
  return acknowledgement.then(() => ({ written: true }));
}

export function setTaskCompletion(uid, taskId, currentTask, completed, { onWriteQueued } = {}) {
  const docRef = getUserTaskDoc(uid, taskId);
  const firestorePatch = buildCompletionPatch(currentTask, completed);

  if (!firestorePatch) {
    return { written: false };
  }

  const acknowledgement = updateDoc(docRef, firestorePatch);
  onWriteQueued?.();
  return acknowledgement.then(() => ({ written: true }));
}

export function updateTaskPlaybackPosition(uid, taskId, currentTask, seconds, { onWriteQueued } = {}) {
  const docRef = getUserTaskDoc(uid, taskId);
  const firestorePatch = buildPlaybackPatch(currentTask, seconds);

  if (!firestorePatch) {
    return { written: false };
  }

  const acknowledgement = updateDoc(docRef, firestorePatch);
  onWriteQueued?.();
  return acknowledgement.then(() => ({ written: true }));
}

export function deleteTask(uid, taskId, { onWriteQueued } = {}) {
  const docRef = getUserTaskDoc(uid, taskId);
  const acknowledgement = deleteDoc(docRef);
  onWriteQueued?.();
  return acknowledgement.then(() => ({ written: true }));
}
