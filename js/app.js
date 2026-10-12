// =====================================================
// js/app.js — Главный файл инициализации приложения и Firebase
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// Конфигурация Firebase для проекта LOCO PREDICT
const firebaseConfig = {
    databaseURL: "https://rail-hackathon-default-rtdb.firebaseio.com/"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Импорт модулей
import { initLocomotivePassport } from "./modules/locomotive-passport.js";
import { initMaintenanceModule } from "./modules/maintenance.js";
import { initMaintenancePlanner } from "./modules/ai-planner.js";
import { initDepotDashboard } from "./modules/dashboard.js";

// Автоматический запуск модулей при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    console.log("LOCO PREDICT: Система инициализирована");

    // Инициализируем компоненты в зависимости от наличия контейнеров на странице
    initLocomotivePassport();
    initMaintenanceModule();
    initMaintenancePlanner();
    initDepotDashboard();
});

