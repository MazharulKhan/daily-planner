import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  connectAuthEmulator,
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
  connectFirestoreEmulator,
} from 'firebase/firestore';

const REQUIRED = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

function readEnvBoolean(name) {
  const raw = import.meta.env[name];
  if (raw === undefined || raw === '' ) return false;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  throw new Error(
    `Invalid Firebase config: ${name} must be "true" or "false" (or empty).`,
  );
}

function validateBaseConfig(env) {
  const missing = REQUIRED.filter((name) => !env[name]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required Firebase configuration: ${missing.join(', ')}. ` +
        'Copy .env.example to .env and fill in the values from the Firebase Console.',
    );
  }
}

function validateEmulatorContext(env, useEmulators) {
  if (!useEmulators) return;

  if (import.meta.env.DEV !== true && import.meta.env.PROD === true) {
    throw new Error(
      'VITE_USE_FIREBASE_EMULATORS="true" is only allowed in Vite development mode.',
    );
  }

  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    throw new Error(
      'VITE_USE_FIREBASE_EMULATORS="true" requires a localhost browser hostname.',
    );
  }

  const projectId = env.VITE_FIREBASE_PROJECT_ID || '';
  if (!projectId.startsWith('demo-')) {
    throw new Error(
      'VITE_USE_FIREBASE_EMULATORS="true" requires a "demo-" project ID.',
    );
  }
}

let app;
let auth;
let firestore;
let initialized = false;
let emulatorsConnected = false;

function getFirebaseConfig(env) {
  return {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };
}

function initFirebase() {
  if (initialized) return { app, auth, firestore };

  const env = import.meta.env;
  validateBaseConfig(env);

  const useEmulators = readEnvBoolean('VITE_USE_FIREBASE_EMULATORS');
  validateEmulatorContext(env, useEmulators);

  app = initializeApp(getFirebaseConfig(env));
  auth = getAuth(app);

  // Firestore uses memory-only cache. Never IndexedDB or persistent caching
  // (Phase 6A invariant + master spec memory-only offline rule).
  try {
    firestore = initializeFirestore(app, {
      localCache: memoryLocalCache(),
    });
  } catch {
    // Already initialized in this page load (StrictMode double-invoke safety).
    firestore = getFirestore(app);
  }

  if (useEmulators) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    emulatorsConnected = true;
  }

  // Persistent local browser auth session (Phase 6A spec).
  // setPersistence returns a promise; we don't await here — it resolves
  // before any sign-in attempt and is safe to fire-and-forget.
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Persistence failures are non-fatal for reading the auth-state observer.
  });

  initialized = true;
  return { app, auth, firestore };
}

export function getFirebase() {
  return initFirebase();
}

export function getAuthInstance() {
  return initFirebase().auth;
}

export function getFirestoreInstance() {
  return initFirebase().firestore;
}

export function isEmulatorMode() {
  return readEnvBoolean('VITE_USE_FIREBASE_EMULATORS') && emulatorsConnected;
}