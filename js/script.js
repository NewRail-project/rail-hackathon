import { firebaseConfig } from './data.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

// Инициализация архитектуры
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Фоновый вход для доступа к БД
signInAnonymously(auth)
  .then(() => console.log("System Online: Database and Auth connected."))
  .catch((error) => console.error("Connection failed:", error));

// Экспорт для накидывания логики в будущем
export { db, auth };
