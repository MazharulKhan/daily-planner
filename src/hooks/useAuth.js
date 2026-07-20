import { useCallback, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuthInstance } from '../firebase/firebase.js';
import {
  signInWithGoogle,
  signOutUser,
  mapSignInError,
  mapSignOutError,
  shouldConfirmBeforeSignOut,
} from '../firebase/auth.js';

export function useAuth() {
  const [status, setStatus] = useState('initializing');
  const [user, setUser] = useState(null);
  const [signInError, setSignInError] = useState(null);
  const [signOutError, setSignOutError] = useState(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const hasPendingWritesRef = useRef(false);

  useEffect(() => {
    const auth = getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setStatus('signed-in');
        setSignInError(null);
        setSignOutError(null);
        // The observer is the authoritative signal that a sign-in reached
        // Firebase. Clear pending sign-in here, not only in signIn's finally:
        // the Auth emulator can fire onAuthStateChanged before signInWithPopup's
        // own promise resolves, and if that promise never settles the finally
        // never runs, leaving isSigningIn=true. After sign-out the AuthScreen
        // would remount with the button stuck disabled ("Signing in…") and no
        // further sign-in could open a popup until a page refresh.
        setIsSigningIn(false);
      } else {
        setStatus('signed-out');
        // A transition to signed-out completes any pending sign-out and also
        // cancels any in-flight sign-in (e.g. the user signed out while a
        // popup promise was still pending).
        setIsSigningOut(false);
        setIsSigningIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async () => {
    setSignInError(null);
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      setSignInError(mapSignInError(error));
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setSignOutError(null);
    if (isSigningOut) return;

    const hasPendingWrites = hasPendingWritesRef.current;
    if (shouldConfirmBeforeSignOut(hasPendingWrites)) {
      // Phase 6A: shouldConfirmBeforeSignOut is always false. This branch
      // exists as the seam for Phase 6C/6D when real writes exist.
      return;
    }

    setIsSigningOut(true);
    try {
      await signOutUser();
      // Success: the auth-state observer will transition the app to
      // signed-out. Reset signing-out within the callback (not an effect)
      // so a future sign-out cycle is not blocked after the user signs
      // back in.
      setIsSigningOut(false);
    } catch (error) {
      setSignOutError(mapSignOutError(error));
      setIsSigningOut(false);
    }
  }, [isSigningOut]);

  const clearSignInError = useCallback(() => setSignInError(null), []);
  const clearSignOutError = useCallback(() => setSignOutError(null), []);

  return {
    status,
    user,
    signIn,
    signOut,
    signInError,
    signOutError,
    isSigningIn,
    isSigningOut,
    clearSignInError,
    clearSignOutError,
  };
}