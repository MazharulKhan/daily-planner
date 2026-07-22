import { useCallback, useEffect, useState } from 'react';
import { normalizePlaybackSeconds } from '../firebase/firestore/taskConverter.js';

const CONTINUED_INTERVAL_MS = 30_000;

export function createPlaybackPersistenceController({
  initialSeconds = 0,
  write,
  onImmediateError,
  now = () => Date.now(),
}) {
  let latestSeconds = normalizePlaybackSeconds(initialSeconds);
  let lastDispatchedSeconds = latestSeconds;
  let lastContinuedAt = now();
  let ended = false;

  function report(error) {
    onImmediateError?.(error);
  }

  function dispatch(seconds, immediate) {
    let normalized;
    try {
      normalized = normalizePlaybackSeconds(seconds);
    } catch (error) {
      report(error);
      return false;
    }

    latestSeconds = normalized;
    if (normalized === lastDispatchedSeconds) return false;

    const timestamp = now();
    if (!immediate && timestamp - lastContinuedAt < CONTINUED_INTERVAL_MS) {
      return false;
    }

    const previousDispatchedSeconds = lastDispatchedSeconds;
    lastDispatchedSeconds = normalized;
    lastContinuedAt = timestamp;
    let acknowledgement;
    try {
      acknowledgement = write(normalized);
    } catch (error) {
      lastDispatchedSeconds = previousDispatchedSeconds;
      report(error);
      return false;
    }
    Promise.resolve(acknowledgement).catch((error) => {
      if (lastDispatchedSeconds === normalized) {
        lastDispatchedSeconds = previousDispatchedSeconds;
      }
      report(error);
    });
    return true;
  }

  return {
    updateLatest(seconds) {
      try {
        latestSeconds = normalizePlaybackSeconds(seconds);
        ended = false;
      } catch (error) {
        report(error);
      }
    },
    continued(seconds) {
      ended = false;
      return dispatch(seconds, false);
    },
    immediate(seconds) {
      ended = false;
      return dispatch(seconds, true);
    },
    end() {
      ended = true;
      latestSeconds = 0;
      if (lastDispatchedSeconds === 0) return false;
      lastDispatchedSeconds = 0;
      lastContinuedAt = now();
      let acknowledgement;
      try {
        acknowledgement = write(0);
      } catch (error) {
        lastDispatchedSeconds = -1;
        report(error);
        return false;
      }
      Promise.resolve(acknowledgement).catch((error) => {
        if (lastDispatchedSeconds === 0) lastDispatchedSeconds = -1;
        report(error);
      });
      return true;
    },
    leave(seconds = latestSeconds) {
      return dispatch(ended ? 0 : seconds, true);
    },
    checkpoint() {
      return dispatch(ended ? 0 : latestSeconds, true);
    },
    getLatest() {
      return latestSeconds;
    },
  };
}

export function useTaskPlaybackPersistence({
  taskId,
  initialSeconds,
  onSavePlayback,
  onImmediateError,
}) {
  const [controller] = useState(() =>
    createPlaybackPersistenceController({
      initialSeconds,
      write: (seconds) => onSavePlayback(taskId, seconds),
      onImmediateError,
    }),
  );

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') controller.checkpoint();
    };
    const handlePageLeave = () => controller.checkpoint();
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pagehide', handlePageLeave);
    window.addEventListener('beforeunload', handlePageLeave);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pagehide', handlePageLeave);
      window.removeEventListener('beforeunload', handlePageLeave);
      controller.leave();
    };
  }, [controller]);

  return {
    onPositionChange: useCallback((seconds) => {
      controller.updateLatest(seconds);
      controller.continued(seconds);
    }, [controller]),
    onPaused: useCallback((seconds) => {
      controller.updateLatest(seconds);
      controller.immediate(seconds);
    }, [controller]),
    onEnded: useCallback(() => controller.end(), [controller]),
    onLeave: useCallback((seconds) => controller.leave(seconds), [controller]),
  };
}
