import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
export const firebaseConfig = {
  apiKey: "AIzaSyDoD1pNfA_cfiqCUwAKT7XHfNLOsedmhdU",
  authDomain: "rail-hackathon-db.firebaseapp.com",
  projectId: "rail-hackathon-db",
  storageBucket: "rail-hackathon-db.firebasestorage.app",
  messagingSenderId: "257494735942",
  appId: "1:257494735942:web:1aa10dcb7f25c83fcf3e47"
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
