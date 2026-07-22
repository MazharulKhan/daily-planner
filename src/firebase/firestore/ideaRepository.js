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
    (snapshot) => {
      try {
        const ideas = snapshot.docs.map((docSnap) => ideaFromFirestore(docSnap));
        if (typeof onData === 'function') {
          onData(ideas);
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

export async function createIdea(uid, ideaInput) {
  validateUid(uid);
  const data = ideaToFirestoreCreate(ideaInput);
  const docRef = doc(getUserIdeasCollection(uid));
  await setDoc(docRef, data);
  return { id: docRef.id };
}

export async function updateIdeaContent(uid, ideaId, currentIdea, patch) {
  const docRef = getUserIdeaDoc(uid, ideaId);
  const firestorePatch = buildIdeaContentPatch(currentIdea, patch);

  if (!firestorePatch) {
    return { written: false };
  }

  await updateDoc(docRef, firestorePatch);
  return { written: true };
}

export async function deleteIdea(uid, ideaId) {
  const docRef = getUserIdeaDoc(uid, ideaId);
  await deleteDoc(docRef);
}
