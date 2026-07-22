import { serverTimestamp } from 'firebase/firestore';

const ALLOWED_IDEA_PATCH_KEYS = new Set(['text', 'notes']);

function validateText(text) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Idea text must be a non-empty string.');
  }
}

function validateNotes(notes) {
  if (typeof notes !== 'string') {
    throw new Error('Idea notes must be a string.');
  }
  return notes;
}

export function ideaFromFirestore(snapshot) {
  const data = snapshot.data({ serverTimestamps: 'estimate' });
  if (!data) {
    throw new Error(`Idea document snapshot ${snapshot.id} returned no data.`);
  }

  if (!data.createdAt || typeof data.createdAt.toDate !== 'function') {
    throw new Error(`Idea document ${snapshot.id} is missing valid createdAt timestamp.`);
  }
  if (!data.updatedAt || typeof data.updatedAt.toDate !== 'function') {
    throw new Error(`Idea document ${snapshot.id} is missing valid updatedAt timestamp.`);
  }

  return {
    id: snapshot.id,
    text: data.text ?? '',
    notes: data.notes ?? '',
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  };
}

export function ideaToFirestoreCreate(input = {}) {
  validateText(input.text);
  let notes = '';
  if ('notes' in input) {
    notes = validateNotes(input.notes);
  }

  return {
    text: input.text.trim(),
    notes,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export function buildIdeaContentPatch(currentIdea = {}, patch = {}) {
  const patchKeys = Object.keys(patch);
  for (const key of patchKeys) {
    if (!ALLOWED_IDEA_PATCH_KEYS.has(key)) {
      throw new Error(`Invalid idea patch key: ${key}.`);
    }
  }

  const effectivePatch = {};
  let hasChange = false;

  if (patch.text !== undefined) {
    validateText(patch.text);
    const trimmedText = patch.text.trim();
    if (trimmedText !== currentIdea.text) {
      effectivePatch.text = trimmedText;
      hasChange = true;
    }
  }

  if (patch.notes !== undefined) {
    validateNotes(patch.notes);
    if (patch.notes !== currentIdea.notes) {
      effectivePatch.notes = patch.notes;
      hasChange = true;
    }
  }

  if (!hasChange) {
    return null;
  }

  effectivePatch.updatedAt = serverTimestamp();
  return effectivePatch;
}
