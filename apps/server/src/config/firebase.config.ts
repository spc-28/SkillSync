import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { ConfigService } from "@nestjs/config";

let firestoreInstance: Firestore | null = null;

export const initializeFirebase = (configService: ConfigService) => {
  // Return existing instance if already initialized
  if (firestoreInstance) {
    return firestoreInstance;
  }

  // Check if Firebase app is already initialized
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      }),
    });
  }

  firestoreInstance = getFirestore();
  return firestoreInstance;
};