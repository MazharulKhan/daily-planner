import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  getUserIdeasCollection,
  getUserIdeaDoc,
  validateUid,
} from './firestoreHelpers.js';
import {
  ideaFromFirestore,
  ideaToFirestoreCreate,
  buildIdeaContentPatch,
} from './ideaConverter.js';

export function subscribeToIdeas(uid, { onData, onError }) {
  validateUid(uid);
  const collectionRef = getUserIdeasCollection(uid);

  return onSnapshot(
    collectionRef,
    { includeMetadataChanges: true },
    (snapshot) => {
      try {
        const ideas = snapshot.docs.map((docSnap) => ideaFromFirestore(docSnap));
        if (typeof onData === 'function') {
          onData(ideas, {
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

export function createIdea(uid, ideaInput, { onWriteQueued } = {}) {
  validateUid(uid);
  const data = ideaToFirestoreCreate(ideaInput);
  const docRef = doc(getUserIdeasCollection(uid));
  const acknowledgement = setDoc(docRef, data);
  onWriteQueued?.({ id: docRef.id });
  return acknowledgement.then(() => ({ id: docRef.id, written: true }));
}

export function updateIdeaContent(uid, ideaId, currentIdea, patch, { onWriteQueued } = {}) {
  const docRef = getUserIdeaDoc(uid, ideaId);
  const firestorePatch = buildIdeaContentPatch(currentIdea, patch);

  if (!firestorePatch) {
    return { written: false };
  }

  const acknowledgement = updateDoc(docRef, firestorePatch);
  onWriteQueued?.();
  return acknowledgement.then(() => ({ written: true }));
}

export function deleteIdea(uid, ideaId, { onWriteQueued } = {}) {
  const docRef = getUserIdeaDoc(uid, ideaId);
  const acknowledgement = deleteDoc(docRef);
  onWriteQueued?.();
  return acknowledgement.then(() => ({ written: true }));
}
