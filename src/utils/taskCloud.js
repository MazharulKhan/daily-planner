const CONTENT_ERROR_MESSAGES = {
  add: 'This task could not be added. Check your connection and try again.',
  content: 'Task changes could not be saved.',
  completion: 'Completion status could not be updated.',
  delete: 'This task could not be deleted.',
  detail: 'This task could not be saved. Your changes are still here.',
  playback: 'Video progress could not be synced.',
};

function normalizedCode(error) {
  const code = typeof error?.code === 'string' ? error.code : '';
  return code.replace(/^firestore\//, '');
}

export function mapTaskCloudError(error, operation = 'content') {
  const code = normalizedCode(error);
  let message = CONTENT_ERROR_MESSAGES[operation] || CONTENT_ERROR_MESSAGES.content;

  if (code === 'permission-denied') {
    message = 'You no longer have access to update these cloud tasks. Try signing out and back in.';
  } else if (code === 'unavailable' || code === 'network-request-failed') {
    message = 'The task cloud could not be reached. Check your connection and try again.';
  } else if (code === 'resource-exhausted') {
    message = 'Task cloud sync is temporarily unavailable. Please try again later.';
  }

  const mapped = new Error(message, { cause: error });
  mapped.code = error?.code || code || 'unknown';
  mapped.operation = operation;
  mapped.userMessage = message;
  return mapped;
}

export function deriveChangedFields(baseline, draft, fields) {
  const patch = {};
  for (const field of fields) {
    if (draft[field] !== baseline[field]) {
      patch[field] = draft[field];
    }
  }
  return patch;
}

export function normalizeInlineTaskDraft(draft) {
  return {
    title: draft.title.trim(),
    priority: draft.priority,
    category: draft.category,
    time: draft.time || null,
    dueDate: draft.dueDate || null,
  };
}

export function getDetailSavePlan(currentTask, contentPatch, desiredCompletion) {
  return {
    contentPatch,
    hasContent: Object.keys(contentPatch).length > 0,
    hasCompletion: Boolean(currentTask.completed) !== Boolean(desiredCompletion),
    desiredCompletion: Boolean(desiredCompletion),
  };
}

export function getErrorMessage(error, fallback) {
  return error?.userMessage || error?.message || fallback;
}
