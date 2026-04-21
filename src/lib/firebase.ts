import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, enableIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const databaseId = (firebaseConfig as any).firestoreDatabaseId || '(default)';

console.log(`[Firebase] Initializing with Project: ${firebaseConfig.projectId}, DB: ${databaseId}`);
console.log(`[Firebase] Auth Domain: ${firebaseConfig.authDomain}`);

// Use initializeFirestore with long polling to ensure stability in all environments
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, databaseId);

export const auth = getAuth(app);

// Connectivity Test with Retry
async function testConnection(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[Firestore] Connection attempt ${i + 1}...`);
      // Testing connection to a dummy path
      await getDocFromServer(doc(db, '_internal_', 'probe'));
      console.log('[Firestore] Connection established successfully.');
      return;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.log('[Firestore] Connection established (Access Denied as expected for dummy path).');
        return;
      }
      
      console.warn(`[Firestore] Connection attempt ${i + 1} failed:`, error.message);
      
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  console.error("[Firestore] Reachability Error: Could not establish a stable connection to the backend.");
}

testConnection();
