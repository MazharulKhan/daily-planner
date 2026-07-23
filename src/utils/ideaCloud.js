const IDEA_ERROR_MESSAGES = {
  add: 'This Quick Idea could not be added. Check your connection and try again.',
  content: 'Quick Idea changes could not be saved.',
  delete: 'This Quick Idea could not be deleted.',
};

function normalizedCode(error) {
  const code = typeof error?.code === 'string' ? error.code : '';
  return code.replace(/^firestore\//, '');
}

export function mapIdeaCloudError(error, operation = 'content') {
  const code = normalizedCode(error);
  let message = IDEA_ERROR_MESSAGES[operation] || IDEA_ERROR_MESSAGES.content;

  if (code === 'permission-denied') {
    message = 'You no longer have access to these cloud Quick Ideas. Try signing out and back in.';
  } else if (code === 'unavailable' || code === 'network-request-failed') {
    message = 'Quick Ideas cloud data could not be reached. Check your connection and try again.';
  } else if (code === 'resource-exhausted') {
    message = 'Quick Ideas cloud sync is temporarily unavailable. Please try again later.';
  } else if (code === 'not-found') {
    message = 'This Quick Idea no longer exists.';
  }

  const mapped = new Error(message, { cause: error });
  mapped.code = error?.code || code || 'unknown';
  mapped.operation = operation;
  mapped.userMessage = message;
  return mapped;
}

export function applyIdeaSnapshot(current, ideas, metadata, isOnline = true) {
  const serverBacked = metadata?.fromCache === false;
  const canAdoptSnapshot = serverBacked || current.hasServerSnapshot;

  return {
    ...current,
    ideas: canAdoptSnapshot ? ideas : current.ideas,
    hasServerSnapshot: current.hasServerSnapshot || serverBacked,
    listenerError: null,
    snapshotHasPendingWrites: Boolean(metadata?.hasPendingWrites),
    status: !isOnline
      ? 'offline'
      : serverBacked
        ? 'ready'
        : current.hasServerSnapshot
          ? current.status
          : 'initial-loading',
  };
}

export function applyIdeaListenerFailure(current, listenerError) {
  return {
    ...current,
    status: 'listener-error',
    listenerError,
  };
}

export function deriveCloudStatus(taskStatus, ideaStatus) {
  const statuses = [taskStatus, ideaStatus];
  if (statuses.includes('listener-error')) return 'cloud-issue';
  if (statuses.includes('offline')) return 'offline';
  if (statuses.includes('reconnecting')) return 'reconnecting';
  return null;
}

export function resolveIdeaNotesDraft(
  ideas,
  ideaId,
  currentDraft = '',
  isDirty = false,
) {
  const idea = ideas.find((item) => item.id === ideaId);
  if (!idea) return null;
  return isDirty ? currentDraft : (idea.notes ?? '');
}

export function getIdeaErrorMessage(error, fallback) {
  return error?.userMessage || error?.message || fallback;
}
