import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off, set, DatabaseReference } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "default_api_key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "onecall-c9557"}.firebaseapp.com`,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://onecall-c9557-default-rtdb.firebaseio.com/",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "onecall-c9557",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "onecall-c9557"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "default_app_id",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, off, set };
export type { DatabaseReference };
