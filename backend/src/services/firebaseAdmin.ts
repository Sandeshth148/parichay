import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (serviceAccountPath) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  // Initialize without credentials for local development
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project',
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export default admin;
