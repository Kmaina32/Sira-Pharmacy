
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCMFg1ivJt_0Ueivfc1p41p2u9c9FVXjOI",
  authDomain: "sira-pharmacy-online.firebaseapp.com",
  projectId: "sira-pharmacy-online",
  storageBucket: "sira-pharmacy-online.appspot.com",
  messagingSenderId: "1072978083547",
  appId: "1:1072978083547:web:8655883944a67f08d3e230"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
