// =====================================================
// data.js — Firebase config + CRUD + утилиты
// =====================================================

export const firebaseConfig = {
  projectId: "rail-hackathon-db",
  appId: "1:257494735942:web:1aa10dcb7f25c83fcf3e47",
  storageBucket: "rail-hackathon-db.firebasestorage.app",
  apiKey: "AIzaSyDo0IpNwFA_cfiqCUwAKT7XHfNL0sedmhdU",
  authDomain: "rail-hackathon-db.firebaseapp.com",
  messagingSenderId: "257494735942"
};

export const demoData = { status: "System Online" };

// ---------- Firebase ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, updateDoc,
  deleteDoc, doc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// анонимный вход (нужен для Firestore Rules)
signInAnonymously(auth)
  .then(() => console.log("System Online"))
  .catch(err => console.error("Auth error:", err));

// ---------- CRUD ----------
export const createRecord = async (col, data) =>
  await addDoc(collection(db, col), data);

export const readRecords = async (col) => {
  const snap = await getDocs(collection(db, col));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateRecord = async (col, id, data) =>
  await updateDoc(doc(db, col, id), data);

export const deleteRecord = async (col, id) =>
  await deleteDoc(doc(db, col, id));

export const listenRecords = (col, callback) => {
  onSnapshot(collection(db, col), (snapshot) => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

// ---------- Утилиты ----------
export const searchData = (data, query, keys) => {
  const q = query.toLowerCase();
  return data.filter(item =>
    keys.some(k => String(item[k] || "").toLowerCase().includes(q))
  );
};

export const filterData = (data, key, value) =>
  data.filter(item => item[key] === value);
