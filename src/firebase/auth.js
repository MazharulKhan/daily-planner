import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getAuthInstance } from './firebase.js';

let provider = null;
function getProvider() {
  if (!provider) {
    provider = new GoogleAuthProvider();
    // No additional OAuth scopes (Phase 6A spec).
  }
  return provider;
}

export function mapSignInError(error) {
  const code = error?.code || '';
  switch (code) {
    case 'auth/popup-blocked':
      return {
        kind: 'popup-blocked',
        message: 'Your browser blocked the sign-in popup. Allow popups for this site and try again.',
      };
    case 'auth/popup-closed-by-user':
      return { kind: 'cancelled', message: 'Sign-in was cancelled. Try again when ready.' };
    case 'auth/cancelled-popup-request':
      return { kind: 'cancelled', message: 'Sign-in was cancelled. Try again when ready.' };
    case 'auth/network-request-failed':
      return { kind: 'network', message: 'Could not reach the sign-in service. Check your connection and try again.' };
    case 'auth/unauthorized-domain':
      return { kind: 'setup', message: 'This domain is not authorized for sign-in. Ask the developer to add it in the Firebase Console.' };
    case 'auth/operation-not-allowed':
      return { kind: 'setup', message: 'Google sign-in is not enabled for this project. Ask the developer to enable it.' };
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
    case 'auth/configuration-not-found':
    case 'auth/invalid-auth-domain':
      return { kind: 'setup', message: 'Firebase is not configured correctly. Ask the developer to check the environment values.' };
    default:
      return { kind: 'unknown', message: 'Sign-in failed. Please try again.' };
  }
}

export function mapSignOutError(error) {
  const code = error?.code || '';
  if (code === 'auth/network-request-failed') {
    return { kind: 'network', message: 'Could not reach the service to sign out. Check your connection and try again.' };
  }
  return { kind: 'unknown', message: 'Sign out failed. Please try again.' };
}

export async function signInWithGoogle() {
  const auth = getAuthInstance();
  return signInWithPopup(auth, getProvider());
}

export async function signOutUser() {
  const auth = getAuthInstance();
  return signOut(auth);
}

// Guard seam for future hasPendingWrites confirmation (Phase 6C/6D).
// Phase 6A performs no Firestore content writes, so this is always false.
// The boolean parameter will be wired in Phase 6C/6D; unused now.
// eslint-disable-next-line no-unused-vars
export function shouldConfirmBeforeSignOut(hasPendingWrites = false) {
  return false;
}