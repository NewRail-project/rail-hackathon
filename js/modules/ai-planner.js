// =====================================================
// js/modules/ai-planner.js
// Модуль планирования ТО-1 — ТО-8 и расчёта регламентных работ
// =====================================================

import { db } from "../app.js";
import { ref, get, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

export function initMaintenancePlanner() {
    const container = document.getElementById("planner-container") || document.querySelector(".app-container");
    if (!container) return;

    loadMaintenanceSchedule();
}

async function loadMaintenanceSchedule() {
    try {
        const recordsRef = ref(db, "maintenanceRecords");
        const snapshot = await get(recordsRef);

        const target = document.getElementById("planner-list-container") || document.body;

        // Стандартные нормативы для ТО (пример для КЗ8А)
        const maintenanceTypes = [
            { code: "ТО-1", name:имость: "Ежесменный осмотр", intervalKm: 1000 },
            { code: "ТО-2", name: "Техническое обслуживание при отстое", intervalKm: 5000 },
            { code: "ТО-3", name: "Периодическое ТО", intervalKm: 25000 },
            { code: "ТО-4", name: "Обточка бандажей колесных пар", intervalKm: 100000 },
            { code: "ТО-5", name: "Сезонное обслуживание / консервация", intervalKm: 200000 },
            { code: "ТО-6", name: "Малый периодический ремонт", intervalKm: 400000 },
            { code: "ТО-7", name: "Средний ремонт", intervalKm: 800000 },
            { code: "ТО-8", name: "Капитальный ремонт", intervalKm: 1600000 }
        ];

        let html = `
            <div class="card" style="margin-top: 20px;">
                <h3>График и планирование ТО (ТО-1 — ТО-8)</h3>
                <div class="subtitle" style="margin-bottom: 15px;">Нормативный контроль регламентных работ и пробегов</div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Вид ТО</th>
                                <th>Наименование</th>
                                <th>Интервал по пробегу</th>
                                <th>Статус / Расчет</th>
                                <th>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        maintenanceTypes.forEach(to => {
            html += `
                <tr>
                    <td><strong>${to.code}</strong></td>
                    <td>${to.name}</td>
                    <td>${to.intervalKm.toLocaleString()} км</td>
                    <td><span class="badge success">По плану</span></td>
                    <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="alert('Фиксация выполнения ${to.code}')">Отметить выполнение</button></td>
                </tr>
            `;
        });

        html += `</tbody></table></div></div>`;

        if (!document.getElementById("planner-card")) {
            const wrapper = document.createElement("div");
            wrapper.id = "planner-card";
            wrapper.innerHTML = html;
            target.appendChild(wrapper);
        }

    } catch (e) {
        console.error("Ошибка загрузки плана ТО:", e);
    }
}
