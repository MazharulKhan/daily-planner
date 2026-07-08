import { useEffect, useRef } from 'react';

const API_URL = 'https://www.youtube.com/iframe_api';
const READY_STATE = 'ready';
const LOADING_STATE = 'loading';

function ensureApiLoaded() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));

  if (window.__ytIframeApiState === READY_STATE && window.YT && window.YT.Player) {
    return Promise.resolve();
  }

  if (window.__ytIframeApiPromise) {
    return window.__ytIframeApiPromise;
  }

  window.__ytIframeApiPromise = new Promise((resolve, reject) => {
    window.__ytIframeApiState = LOADING_STATE;
    window.onYouTubeIframeAPIReady = () => {
      window.__ytIframeApiState = READY_STATE;
      resolve();
    };

    const existing = document.querySelector(`script[src="${API_URL}"]`);
    if (existing) {
      return;
    }

    const script = document.createElement('script');
    script.src = API_URL;
    script.async = true;
    script.onerror = () => {
      window.__ytIframeApiPromise = null;
      reject(new Error('failed to load YouTube IFrame API'));
    };
    document.head.appendChild(script);
  });

  return window.__ytIframeApiPromise;
}

const PLAYER_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
};

export function useYouTubePlayer({
  containerId,
  videoId,
  startSeconds,
  enabled = true,
  onReady,
  onPositionChange,
  onPaused,
  onEnded,
  onLeave,
  onError,
}) {
  const playerRef = useRef(null);
  const positionRef = useRef(0);
  const intervalRef = useRef(null);
  const endedRef = useRef(false);
  const startSecondsRef = useRef(typeof startSeconds === 'number' ? startSeconds : 0);
  const callbacksRef = useRef({
    onReady,
    onPositionChange,
    onPaused,
    onEnded,
    onLeave,
    onError,
  });

  useEffect(() => {
    startSecondsRef.current =
      typeof startSeconds === 'number' ? startSeconds : 0;
  }, [startSeconds]);

  useEffect(() => {
    callbacksRef.current = {
      onReady,
      onPositionChange,
      onPaused,
      onEnded,
      onLeave,
      onError,
    };
  });

  useEffect(() => {
    if (!enabled || !videoId) {
      return undefined;
    }

    let cancelled = false;

    ensureApiLoaded()
      .then(() => {
        if (cancelled) return;
        if (typeof window === 'undefined' || !window.YT || !window.YT.Player) {
          return;
        }

        const player = new window.YT.Player(containerId, {
          videoId,
          playerVars: {
            start: Math.max(0, Math.floor(startSecondsRef.current || 0)),
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event) => {
              if (startSecondsRef.current && startSecondsRef.current >= 5) {
                try {
                  event.target.seekTo(startSecondsRef.current, true);
                } catch {
                  /* ignore seek errors */
                }
              }
              if (callbacksRef.current.onReady) {
                callbacksRef.current.onReady(event.target);
              }
            },
            onStateChange: (event) => {
              const state = event.data;
              const cb = callbacksRef.current;

              if (state === PLAYER_STATE.PLAYING) {
                endedRef.current = false;
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                }
                intervalRef.current = setInterval(() => {
                  let current;
                  try {
                    current = playerRef.current
                      ? playerRef.current.getCurrentTime()
                      : 0;
                  } catch {
                    current = 0;
                  }
                  if (typeof current === 'number' && Number.isFinite(current)) {
                    positionRef.current = current;
                    if (cb.onPositionChange) {
                      cb.onPositionChange(current);
                    }
                  }
                }, 5000);
              } else if (state === PLAYER_STATE.PAUSED) {
                let current;
                try {
                  current = playerRef.current
                    ? playerRef.current.getCurrentTime()
                    : 0;
                } catch {
                  current = 0;
                }
                if (typeof current === 'number' && Number.isFinite(current)) {
                  positionRef.current = current;
                }
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                if (cb.onPaused) {
                  cb.onPaused(positionRef.current);
                }
              } else if (state === PLAYER_STATE.ENDED) {
                endedRef.current = true;
                positionRef.current = 0;
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                if (cb.onEnded) {
                  cb.onEnded(0);
                }
              }
            },
            onError: (event) => {
              const cb = callbacksRef.current;
              if (cb.onError) {
                cb.onError(event.data);
              }
            },
          },
        });

        playerRef.current = player;
      })
      .catch(() => {
        if (!cancelled && callbacksRef.current.onError) {
          callbacksRef.current.onError(-1);
        }
      });

    return () => {
      cancelled = true;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (playerRef.current) {
        try {
          if (!endedRef.current) {
            let current;
            try {
              current = playerRef.current.getCurrentTime();
            } catch {
              current = 0;
            }
            if (typeof current === 'number' && Number.isFinite(current)) {
              positionRef.current = current;
            }
          }
          if (callbacksRef.current.onLeave) {
            callbacksRef.current.onLeave(
              endedRef.current ? 0 : positionRef.current,
            );
          }
          playerRef.current.destroy();
        } catch {
          /* ignore destroy errors */
        }
        playerRef.current = null;
      }
    };
  }, [containerId, videoId, enabled]);

  return {
    playerRef,
    positionRef,
    seekAndPlay: (seconds) => {
      const player = playerRef.current;
      if (!player) return;
      try {
        player.seekTo(seconds, true);
        player.playVideo();
      } catch {
        /* ignore */
      }
    },
  };
}
