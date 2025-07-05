import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import * as dotenv from "dotenv";
dotenv.config();

const clientApp = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

export const clientAuth = getAuth(clientApp);