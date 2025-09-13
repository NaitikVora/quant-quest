// Firebase Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Check if we have valid Firebase configuration
const hasValidConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                      import.meta.env.VITE_FIREBASE_PROJECT_ID &&
                      import.meta.env.VITE_FIREBASE_API_KEY !== "demo-api-key";

let app: any = null;
let auth: any = null;
let db: any = null;

if (hasValidConfig) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  // Initialize Firebase only if not already initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);

  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
} else {
  console.warn('Firebase configuration not found. Authentication features will be disabled.');
  console.warn('To enable Firebase, please set up your environment variables:');
  console.warn('- VITE_FIREBASE_API_KEY');
  console.warn('- VITE_FIREBASE_PROJECT_ID');
  console.warn('- VITE_FIREBASE_AUTH_DOMAIN');
  console.warn('- VITE_FIREBASE_STORAGE_BUCKET');
  console.warn('- VITE_FIREBASE_MESSAGING_SENDER_ID');
  console.warn('- VITE_FIREBASE_APP_ID');
}

export { auth, db };

// Emulator connection disabled to avoid console warnings
// Uncomment the following code if you want to use Firebase emulators in development
/*
if (import.meta.env.DEV) {
  try {
    // Only connect if not already connected
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, "http://localhost:9099");
    }
    if (!db._delegate._databaseId.projectId.includes('demo')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
  } catch (error) {
    console.log('Emulator connection failed, using production:', error);
  }
}
*/

export default app;
