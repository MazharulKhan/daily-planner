import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  subscribeToIdeas,
  createIdea as createIdeaDocument,
  updateIdeaContent as updateIdeaContentDocument,
  deleteIdea as deleteIdeaDocument,
} from '../firebase/firestore/ideaRepository.js';
import {
  applyIdeaListenerFailure,
  applyIdeaSnapshot,
  mapIdeaCloudError,
} from '../utils/ideaCloud.js';

const initialState = {
  ideas: [],
  status: 'initial-loading',
  hasServerSnapshot: false,
  listenerError: null,
  snapshotHasPendingWrites: false,
  suspended: false,
};

function onlineNow() {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

export function useIdeaCloud(uid) {
  const [state, setState] = useState(initialState);
  const [retryVersion, setRetryVersion] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [mutationNotices, setMutationNotices] = useState([]);

  const ideasRef = useRef([]);
  const unsubscribeRef = useRef(null);
  const generationRef = useRef(0);
  const operationIdRef = useRef(0);
  const pendingOperationsRef = useRef(new Map());
  const suspendedRef = useRef(false);

  const isCurrent = useCallback(
    (generation) => generationRef.current === generation && !suspendedRef.current,
    [],
  );

  const removePending = useCallback((operationId, generation) => {
    if (!isCurrent(generation)) return;
    if (pendingOperationsRef.current.delete(operationId)) {
      setPendingCount(pendingOperationsRef.current.size);
    }
  }, [isCurrent]);

  const addNotice = useCallback((operation, error = null, message = null) => {
    const mapped = error ? mapIdeaCloudError(error, operation) : null;
    const id = `${Date.now()}-${operationIdRef.current += 1}`;
    setMutationNotices((current) => [
      ...current,
      {
        id,
        operation,
        message: message || mapped?.userMessage || 'Quick Ideas cloud sync could not be completed.',
        code: mapped?.code || null,
        cause: error || null,
      },
    ]);
    return id;
  }, []);

  useEffect(() => {
    if (!uid || suspendedRef.current) return undefined;

    const generation = generationRef.current + 1;
    generationRef.current = generation;
    let active = true;

    const handleOffline = () => {
      if (!active || !isCurrent(generation)) return;
      setState((current) => ({ ...current, status: 'offline' }));
    };
    const handleOnline = () => {
      if (!active || !isCurrent(generation)) return;
      setState((current) => ({
        ...current,
        status: current.hasServerSnapshot ? 'reconnecting' : 'initial-loading',
      }));
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    try {
      unsubscribeRef.current = subscribeToIdeas(uid, {
        onData: (ideas, metadata) => {
          if (!active || !isCurrent(generation)) return;
          const serverBacked = metadata?.fromCache === false;

          setState((current) => {
            const next = applyIdeaSnapshot(current, ideas, metadata, onlineNow());
            if (serverBacked || current.hasServerSnapshot) {
              ideasRef.current = next.ideas;
            }
            return next;
          });
        },
        onError: (error) => {
          if (!active || !isCurrent(generation)) return;
          const mapped = mapIdeaCloudError(error, 'content');
          setState((current) => applyIdeaListenerFailure(current, mapped));
        },
      });
    } catch (error) {
      if (isCurrent(generation)) {
        const mapped = mapIdeaCloudError(error, 'content');
        setState((current) => applyIdeaListenerFailure(current, mapped));
      }
    }

    return () => {
      active = false;
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      unsubscribeRef.current?.();
      if (unsubscribeRef.current) unsubscribeRef.current = null;
      if (generationRef.current === generation) generationRef.current += 1;
    };
  }, [uid, retryVersion, isCurrent]);

  const runMutation = useCallback(async (operation, invoke) => {
    const generation = generationRef.current;
    let queued = false;
    let queuedValue;
    let acknowledgement;

    const onWriteQueued = (value) => {
      queued = true;
      queuedValue = value;
    };

    try {
      acknowledgement = invoke(onWriteQueued);
    } catch (error) {
      throw mapIdeaCloudError(error, operation);
    }

    if (!queued) {
      try {
        return await acknowledgement;
      } catch (error) {
        throw mapIdeaCloudError(error, operation);
      }
    }

    const operationId = operationIdRef.current += 1;
    pendingOperationsRef.current.set(operationId, { operation, generation });
    setPendingCount(pendingOperationsRef.current.size);

    try {
      const acknowledgedValue = await acknowledgement;
      removePending(operationId, generation);
      return {
        ...acknowledgedValue,
        written: true,
        queued: true,
        acknowledged: true,
        ...queuedValue,
      };
    } catch (error) {
      if (isCurrent(generation)) {
        removePending(operationId, generation);
        addNotice(operation, error);
      }
      throw mapIdeaCloudError(error, operation);
    }
  }, [addNotice, isCurrent, removePending]);

  const getCurrentIdea = useCallback((ideaId, operation) => {
    const idea = ideasRef.current.find((item) => item.id === ideaId);
    if (!idea) {
      const error = new Error('The Quick Idea no longer exists.');
      error.code = 'not-found';
      throw mapIdeaCloudError(error, operation);
    }
    return idea;
  }, []);

  const createIdea = useCallback((input) => runMutation(
    'add',
    (onWriteQueued) => createIdeaDocument(uid, input, { onWriteQueued }),
  ), [runMutation, uid]);

  const updateIdeaContent = useCallback((ideaId, patch) => runMutation(
    'content',
    (onWriteQueued) => updateIdeaContentDocument(
      uid,
      ideaId,
      getCurrentIdea(ideaId, 'content'),
      patch,
      { onWriteQueued },
    ),
  ), [getCurrentIdea, runMutation, uid]);

  const deleteIdea = useCallback((ideaId) => {
    getCurrentIdea(ideaId, 'delete');
    return runMutation(
      'delete',
      (onWriteQueued) => deleteIdeaDocument(uid, ideaId, { onWriteQueued }),
    );
  }, [getCurrentIdea, runMutation, uid]);

  const retry = useCallback(() => {
    suspendedRef.current = false;
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    generationRef.current += 1;
    setState((current) => ({
      ...current,
      listenerError: null,
      suspended: false,
      status: current.hasServerSnapshot ? 'reconnecting' : 'initial-loading',
    }));
    setRetryVersion((version) => version + 1);
  }, []);

  const clearSession = useCallback(() => {
    suspendedRef.current = true;
    generationRef.current += 1;
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    ideasRef.current = [];
    pendingOperationsRef.current.clear();
    setPendingCount(0);
    setMutationNotices([]);
    setState({ ...initialState, suspended: true });
  }, []);

  const resumeSession = useCallback(() => {
    suspendedRef.current = false;
    setState(initialState);
    setRetryVersion((version) => version + 1);
  }, []);

  const dismissNotice = useCallback((noticeId) => {
    setMutationNotices((current) => current.filter((notice) => notice.id !== noticeId));
  }, []);

  const notifyRemoteDeletion = useCallback(() => addNotice(
    'remote-delete',
    null,
    'This Quick Idea was deleted in another session.',
  ), [addNotice]);

  const ideaMap = useMemo(
    () => new Map(state.ideas.map((idea) => [idea.id, idea])),
    [state.ideas],
  );

  return {
    ...state,
    ideaMap,
    isConfirmedEmpty: state.hasServerSnapshot && state.ideas.length === 0,
    canMutate: state.hasServerSnapshot && !state.suspended,
    hasPendingWrites: pendingCount > 0 || state.snapshotHasPendingWrites,
    mutationNotices,
    createIdea,
    updateIdeaContent,
    deleteIdea,
    retry,
    clearSession,
    resumeSession,
    dismissNotice,
    notifyRemoteDeletion,
  };
}
