import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, enableIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const databaseId = (firebaseConfig as any).firestoreDatabaseId || '(default)';

console.log(`[Firebase] Initializing with Project: ${firebaseConfig.projectId}, DB: ${databaseId}`);
console.log(`[Firebase] Auth Domain: ${firebaseConfig.authDomain}`);

// Use initializeFirestore with standard settings first to allow better connection detection
export const db = initializeFirestore(app, {
  // Removing experimentalForceLongPolling to allow standard WebSockets which might be more resilient to "offline" false positives
}, databaseId);

export const auth = getAuth(app);

// Connectivity Test with Resilient Retry
async function testConnection(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`[Firestore] Connection attempt ${i + 1} to database: ${databaseId}...`);
      // Testing connection to the probe path which is now public
      await getDocFromServer(doc(db, '_internal_', 'probe'));
      console.log('[Firestore] Connection established successfully.');
      return;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        console.log('[Firestore] Connection established (Access Denied but reachable).');
        return;
      }
      
      const isOffline = error.message && error.message.includes('the client is offline');
      if (isOffline) {
        console.error(`[Firestore] Connection attempt ${i + 1} failed: The client is reported as offline. This usually implies a network block or invalid project/database ID.`);
      } else {
        console.warn(`[Firestore] Connection attempt ${i + 1} failed:`, error.message || error);
      }
      
      if (i < retries - 1) {
        // Exponential backoff
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  console.error("[Firestore] Reachability Critical Failure: After 5 attempts, the document engine remains unreachable.");
}

testConnection();
