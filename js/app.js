import { initDashboard } from './modules/dashboard.js';
import { initPassport } from './modules/locomotive-passport.js';
import { initMaintenance } from './modules/maintenance.js';
import { seedDatabase } from './demo/seed.js';
import { checkAuth, logoutUser } from './auth.js';

// Активация защиты
checkAuth();

// Обработка кнопки выхода
const logoutBtn = document.getElementById('devLogout');
if (logoutBtn) logoutBtn.onclick = logoutUser;

window.newrailSeed = seedDatabase;

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    
    // Блокируем инициализацию модулей на странице логина
    if (path.includes('login.html')) return;
    
    if (path.includes('locomotive.html')) {
        initPassport();
    } else if (path.includes('maintenance.html')) {
        initMaintenance();
    } else {
        initDashboard();
    }
});
