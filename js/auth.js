import { app } from './config.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const auth = getAuth(app);

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-pass').value;
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            // Если запуск локальный или на GitHub Pages, корректируем путь
            window.location.href = window.location.origin + window.location.pathname.replace('/pages/login.html', '/') + 'index.html';
        } catch (error) {
            document.getElementById('auth-error').textContent = 'Доступ запрещен. Неверные учетные данные.';
            document.getElementById('auth-error').style.display = 'block';
        }
    };
}

export const checkAuth = () => {
    onAuthStateChanged(auth, (user) => {
        const isLoginPage = window.location.pathname.includes('login.html');
        if (!user && !isLoginPage) {
            window.location.href = 'pages/login.html'; 
        } else if (user && isLoginPage) {
            window.location.href = '../index.html';
        }
    });
};

export const logoutUser = () => signOut(auth);
