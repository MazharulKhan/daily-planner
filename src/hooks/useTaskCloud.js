import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  subscribeToTasks,
  createTask as createTaskDocument,
  updateTaskContent as updateTaskContentDocument,
  setTaskCompletion as setTaskCompletionDocument,
  updateTaskPlaybackPosition,
  deleteTask as deleteTaskDocument,
} from '../firebase/firestore/taskRepository.js';
import { getDetailSavePlan, mapTaskCloudError } from '../utils/taskCloud.js';

const initialState = {
  tasks: [],
  status: 'initial-loading',
  hasServerSnapshot: false,
  listenerError: null,
  snapshotHasPendingWrites: false,
  suspended: false,
};

function onlineNow() {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

export function useTaskCloud(uid) {
  const [state, setState] = useState(initialState);
  const [retryVersion, setRetryVersion] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [mutationNotices, setMutationNotices] = useState([]);

  const tasksRef = useRef([]);
  const unsubscribeRef = useRef(null);
  const generationRef = useRef(0);
  const operationIdRef = useRef(0);
  const pendingOperationsRef = useRef(new Map());
  const hasServerSnapshotRef = useRef(false);
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
    const mapped = error ? mapTaskCloudError(error, operation) : null;
    const id = `${Date.now()}-${operationIdRef.current += 1}`;
    setMutationNotices((current) => [
      ...current,
      {
        id,
        operation,
        message: message || mapped?.userMessage || 'Task cloud sync could not be completed.',
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
      unsubscribeRef.current = subscribeToTasks(uid, {
        onData: (tasks, metadata) => {
          if (!active || !isCurrent(generation)) return;
          const serverBacked = metadata?.fromCache === false;
          const hadServerSnapshot = hasServerSnapshotRef.current;

          if (serverBacked) {
            hasServerSnapshotRef.current = true;
          }

          if (serverBacked || hadServerSnapshot) {
            tasksRef.current = tasks;
          }

          setState((current) => ({
            ...current,
            tasks: serverBacked || hadServerSnapshot ? tasks : current.tasks,
            hasServerSnapshot: current.hasServerSnapshot || serverBacked,
            listenerError: null,
            snapshotHasPendingWrites: Boolean(metadata?.hasPendingWrites),
            status: !onlineNow()
              ? 'offline'
              : serverBacked
                ? 'ready'
                : current.hasServerSnapshot
                  ? current.status
                  : 'initial-loading',
          }));
        },
        onError: (error) => {
          if (!active || !isCurrent(generation)) return;
          setState((current) => ({
            ...current,
            status: 'listener-error',
            listenerError: mapTaskCloudError(error, 'content'),
          }));
        },
      });
    } catch (error) {
      if (isCurrent(generation)) {
        setState((current) => ({
          ...current,
          status: 'listener-error',
          listenerError: mapTaskCloudError(error, 'content'),
        }));
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
      throw mapTaskCloudError(error, operation);
    }

    if (!queued) {
      try {
        return await acknowledgement;
      } catch (error) {
        throw mapTaskCloudError(error, operation);
      }
    }

    const operationId = operationIdRef.current += 1;
    pendingOperationsRef.current.set(operationId, { operation, generation });
    setPendingCount(pendingOperationsRef.current.size);

    Promise.resolve(acknowledgement).then(
      () => removePending(operationId, generation),
      (error) => {
        if (!isCurrent(generation)) return;
        removePending(operationId, generation);
        addNotice(operation, error);
      },
    );

    return { written: true, queued: true, ...queuedValue };
  }, [addNotice, isCurrent, removePending]);

  const getCurrentTask = useCallback((taskId, operation) => {
    const task = tasksRef.current.find((item) => item.id === taskId);
    if (!task) {
      const error = new Error('The task no longer exists.');
      error.code = 'not-found';
      throw mapTaskCloudError(error, operation);
    }
    return task;
  }, []);

  const createTask = useCallback((input) => runMutation(
    'add',
    (onWriteQueued) => createTaskDocument(uid, input, { onWriteQueued }),
  ), [runMutation, uid]);

  const updateTaskContent = useCallback((taskId, patch) => runMutation(
    'content',
    (onWriteQueued) => updateTaskContentDocument(
      uid,
      taskId,
      getCurrentTask(taskId, 'content'),
      patch,
      { onWriteQueued },
    ),
  ), [getCurrentTask, runMutation, uid]);

  const setTaskCompletion = useCallback((taskId, completed) => runMutation(
    'completion',
    (onWriteQueued) => setTaskCompletionDocument(
      uid,
      taskId,
      getCurrentTask(taskId, 'completion'),
      completed,
      { onWriteQueued },
    ),
  ), [getCurrentTask, runMutation, uid]);

  const toggleTaskCompletion = useCallback((taskId) => {
    const current = getCurrentTask(taskId, 'completion');
    return setTaskCompletion(taskId, !current.completed);
  }, [getCurrentTask, setTaskCompletion]);

  const deleteTask = useCallback((taskId) => {
    getCurrentTask(taskId, 'delete');
    return runMutation(
      'delete',
      (onWriteQueued) => deleteTaskDocument(uid, taskId, { onWriteQueued }),
    );
  }, [getCurrentTask, runMutation, uid]);

  const savePlaybackPosition = useCallback((taskId, seconds) => runMutation(
    'playback',
    (onWriteQueued) => updateTaskPlaybackPosition(
      uid,
      taskId,
      getCurrentTask(taskId, 'playback'),
      seconds,
      { onWriteQueued },
    ),
  ), [getCurrentTask, runMutation, uid]);

  const saveTaskDetail = useCallback(async (taskId, contentPatch, desiredCompletion) => {
    const current = getCurrentTask(taskId, 'detail');
    const plan = getDetailSavePlan(current, contentPatch, desiredCompletion);
    try {
      if (plan.hasContent) await updateTaskContent(taskId, plan.contentPatch);
      const latest = getCurrentTask(taskId, 'detail');
      if (Boolean(latest.completed) !== plan.desiredCompletion) {
        await setTaskCompletion(taskId, plan.desiredCompletion);
      }
      return { saved: true };
    } catch (error) {
      throw mapTaskCloudError(error.cause || error, 'detail');
    }
  }, [getCurrentTask, setTaskCompletion, updateTaskContent]);

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
    tasksRef.current = [];
    hasServerSnapshotRef.current = false;
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
    'This task was deleted on another device.',
  ), [addNotice]);

  const reportPlaybackError = useCallback(
    (error) => addNotice('playback', error),
    [addNotice],
  );

  const taskMap = useMemo(
    () => new Map(state.tasks.map((task) => [task.id, task])),
    [state.tasks],
  );

  return {
    ...state,
    taskMap,
    isConfirmedEmpty: state.hasServerSnapshot && state.tasks.length === 0,
    canMutate: state.hasServerSnapshot && !state.suspended,
    hasPendingWrites: pendingCount > 0 || state.snapshotHasPendingWrites,
    mutationNotices,
    createTask,
    updateTaskContent,
    setTaskCompletion,
    toggleTaskCompletion,
    deleteTask,
    saveTaskDetail,
    savePlaybackPosition,
    retry,
    clearSession,
    resumeSession,
    dismissNotice,
    notifyRemoteDeletion,
    reportPlaybackError,
  };
}
