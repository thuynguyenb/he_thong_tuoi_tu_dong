import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDkpUchUQsrWn2EMMfIGxFWq2szSYU3e40",
  authDomain: "smart-irrigation-829e4.firebaseapp.com",
  databaseURL: "https://smart-irrigation-829e4-default-rtdb.firebaseio.com",
  projectId: "smart-irrigation-829e4",
  storageBucket: "smart-irrigation-829e4.firebasestorage.app",
  messagingSenderId: "853514304437",
  appId: "1:853514304437:web:41199957c171ab736437fc",
  measurementId: "G-4WSBXKKWBG"
};

const app = initializeApp(firebaseConfig);

getAnalytics(app);

export const database = getDatabase(app);

export default app;