import { serverTimestamp } from 'firebase/firestore';

const ALLOWED_TASK_TYPES = new Set(['standard', 'youtube']);
const ALLOWED_PRIORITIES = new Set(['High', 'Medium', 'Low']);
const ALLOWED_CATEGORIES = new Set(['Work', 'Learning', 'Personal', 'Health']);
const TIME_REGEX = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const DUE_DATE_REGEX = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

const ALLOWED_CONTENT_PATCH_KEYS = new Set([
  'title',
  'description',
  'taskType',
  'youtubeUrl',
  'youtubeNotes',
  'priority',
  'category',
  'time',
  'dueDate',
]);

export function normalizePlaybackSeconds(seconds) {
  if (typeof seconds !== 'number' || !Number.isFinite(seconds) || seconds < 0) {
    throw new Error('lastWatchedSeconds must be a finite non-negative number.');
  }
  return Math.floor(seconds);
}

function validateTitle(title) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('Task title must be a non-empty string.');
  }
}

function validateTaskType(taskType) {
  if (!ALLOWED_TASK_TYPES.has(taskType)) {
    throw new Error(`Invalid taskType: ${taskType}. Allowed: standard, youtube.`);
  }
}

function validatePriority(priority) {
  if (!ALLOWED_PRIORITIES.has(priority)) {
    throw new Error(`Invalid priority: ${priority}. Allowed: High, Medium, Low.`);
  }
}

function validateCategory(category) {
  if (!ALLOWED_CATEGORIES.has(category)) {
    throw new Error(
      `Invalid category: ${category}. Allowed: Work, Learning, Personal, Health.`,
    );
  }
}

function validateTime(time) {
  if (time !== null && (typeof time !== 'string' || !TIME_REGEX.test(time))) {
    throw new Error('time must be null or valid 24-hour HH:MM format (00:00 to 23:59).');
  }
}

function validateDueDate(dueDate) {
  if (dueDate !== null && (typeof dueDate !== 'string' || !DUE_DATE_REGEX.test(dueDate))) {
    throw new Error('dueDate must be null or valid YYYY-MM-DD format.');
  }
}

function validateStringField(val, fieldName) {
  if (typeof val !== 'string') {
    throw new Error(`${fieldName} must be a string.`);
  }
}

export function taskFromFirestore(snapshot) {
  const data = snapshot.data({ serverTimestamps: 'estimate' });
  if (!data) {
    throw new Error(`Task document snapshot ${snapshot.id} returned no data.`);
  }

  if (!data.createdAt || typeof data.createdAt.toDate !== 'function') {
    throw new Error(`Task document ${snapshot.id} is missing valid createdAt timestamp.`);
  }
  if (!data.updatedAt || typeof data.updatedAt.toDate !== 'function') {
    throw new Error(`Task document ${snapshot.id} is missing valid updatedAt timestamp.`);
  }

  let completedAtIso = null;
  if (data.completedAt !== null && data.completedAt !== undefined) {
    if (typeof data.completedAt.toDate === 'function') {
      completedAtIso = data.completedAt.toDate().toISOString();
    } else {
      throw new Error(`Task document ${snapshot.id} has invalid completedAt timestamp.`);
    }
  }

  return {
    id: snapshot.id,
    title: data.title ?? '',
    description: data.description ?? '',
    taskType: data.taskType ?? 'standard',
    youtubeUrl: data.youtubeUrl ?? '',
    youtubeNotes: data.youtubeNotes ?? '',
    lastWatchedSeconds: typeof data.lastWatchedSeconds === 'number' ? Math.floor(data.lastWatchedSeconds) : 0,
    completed: Boolean(data.completed),
    completedAt: completedAtIso,
    priority: data.priority ?? 'Medium',
    category: data.category ?? 'Work',
    time: data.time ?? null,
    dueDate: data.dueDate ?? null,
    createdAt: data.createdAt.toDate().toISOString(),
    updatedAt: data.updatedAt.toDate().toISOString(),
  };
}

export function taskToFirestoreCreate(input = {}) {
  const title = input.title;
  validateTitle(title);

  const taskType = input.taskType ?? 'standard';
  validateTaskType(taskType);

  const priority = input.priority ?? 'Medium';
  validatePriority(priority);

  const category = input.category ?? 'Work';
  validateCategory(category);

  const time = input.time ?? null;
  validateTime(time);

  const dueDate = input.dueDate ?? null;
  validateDueDate(dueDate);

  const description = input.description ?? '';
  validateStringField(description, 'description');

  const youtubeUrl = input.youtubeUrl ?? '';
  validateStringField(youtubeUrl, 'youtubeUrl');

  const youtubeNotes = input.youtubeNotes ?? '';
  validateStringField(youtubeNotes, 'youtubeNotes');

  let lastWatchedSeconds = 0;
  if ('lastWatchedSeconds' in input) {
    lastWatchedSeconds = normalizePlaybackSeconds(input.lastWatchedSeconds);
  }

  return {
    title: title.trim(),
    description,
    taskType,
    youtubeUrl,
    youtubeNotes,
    lastWatchedSeconds,
    completed: false,
    completedAt: null,
    priority,
    category,
    time,
    dueDate,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export function buildContentPatch(currentTask = {}, patch = {}) {
  const patchKeys = Object.keys(patch);
  for (const key of patchKeys) {
    if (!ALLOWED_CONTENT_PATCH_KEYS.has(key)) {
      throw new Error(`Invalid content patch key: ${key}.`);
    }
  }

  const effectivePatch = {};
  let hasChange = false;

  if (patch.title !== undefined) {
    validateTitle(patch.title);
    const trimmedTitle = patch.title.trim();
    if (trimmedTitle !== currentTask.title) {
      effectivePatch.title = trimmedTitle;
      hasChange = true;
    }
  }

  if (patch.description !== undefined) {
    validateStringField(patch.description, 'description');
    if (patch.description !== currentTask.description) {
      effectivePatch.description = patch.description;
      hasChange = true;
    }
  }

  if (patch.taskType !== undefined) {
    validateTaskType(patch.taskType);
    if (patch.taskType !== currentTask.taskType) {
      effectivePatch.taskType = patch.taskType;
      hasChange = true;
    }
  }

  let urlChanged = false;
  if (patch.youtubeUrl !== undefined) {
    validateStringField(patch.youtubeUrl, 'youtubeUrl');
    if (patch.youtubeUrl !== currentTask.youtubeUrl) {
      effectivePatch.youtubeUrl = patch.youtubeUrl;
      hasChange = true;
      urlChanged = true;
    }
  }

  if (urlChanged) {
    effectivePatch.lastWatchedSeconds = 0;
  }

  if (patch.youtubeNotes !== undefined) {
    validateStringField(patch.youtubeNotes, 'youtubeNotes');
    if (patch.youtubeNotes !== currentTask.youtubeNotes) {
      effectivePatch.youtubeNotes = patch.youtubeNotes;
      hasChange = true;
    }
  }

  if (patch.priority !== undefined) {
    validatePriority(patch.priority);
    if (patch.priority !== currentTask.priority) {
      effectivePatch.priority = patch.priority;
      hasChange = true;
    }
  }

  if (patch.category !== undefined) {
    validateCategory(patch.category);
    if (patch.category !== currentTask.category) {
      effectivePatch.category = patch.category;
      hasChange = true;
    }
  }

  if (patch.time !== undefined) {
    validateTime(patch.time);
    if (patch.time !== currentTask.time) {
      effectivePatch.time = patch.time;
      hasChange = true;
    }
  }

  if (patch.dueDate !== undefined) {
    validateDueDate(patch.dueDate);
    if (patch.dueDate !== currentTask.dueDate) {
      effectivePatch.dueDate = patch.dueDate;
      hasChange = true;
    }
  }

  if (!hasChange) {
    return null;
  }

  effectivePatch.updatedAt = serverTimestamp();
  return effectivePatch;
}

export function buildCompletionPatch(currentTask = {}, completed) {
  if (typeof completed !== 'boolean') {
    throw new Error('completed must be a boolean.');
  }

  if (Boolean(currentTask.completed) === completed) {
    return null;
  }

  if (completed) {
    return {
      completed: true,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  }

  return {
    completed: false,
    completedAt: null,
    updatedAt: serverTimestamp(),
  };
}

export function buildPlaybackPatch(currentTask = {}, seconds) {
  const floored = normalizePlaybackSeconds(seconds);
  const currentFloored = normalizePlaybackSeconds(currentTask.lastWatchedSeconds ?? 0);

  if (floored === currentFloored) {
    return null;
  }

  return {
    lastWatchedSeconds: floored,
  };
}
