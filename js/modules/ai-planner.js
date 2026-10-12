// =====================================================
// js/modules/ai-planner.js
// Модуль планирования ТО-1 — ТО-8 и расчёта регламентных работ
// =====================================================

import { db } from "../app.js";
import { ref, get, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { showToast, beep } from "../script.js";

export function initMaintenancePlanner() {
    const container = document.getElementById("planner-container") || document.querySelector(".app-container");
    if (!container) return;

    loadMaintenanceSchedule(container);
}

async function loadMaintenanceSchedule(container) {
    try {
        const recordsRef = ref(db, "maintenanceRecords");
        const snapshot = await get(recordsRef);

        // Стандартные нормативы для ТО (серия КЗ8А)
        const maintenanceTypes = [
            { code: "ТО-1", name: "Ежесменный осмотр", intervalKm: 1000 },
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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <h3 style="margin: 0;">График и планирование ТО (ТО-1 — ТО-8)</h3>
                        <span class="subtitle">Нормативный контроль регламентных работ и пробегов</span>
                    </div>
                    <button id="btn-add-to-record" class="btn btn-primary">Зафиксировать ТО</button>
                </div>
                <div class="table-container" style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <th style="padding: 10px;">Вид ТО</th>
                                <th style="padding: 10px;">Наименование</th>
                                <th style="padding: 10px;">Интервал по пробегу</th>
                                <th style="padding: 10px;">Статус / Расчет</th>
                                <th style="padding: 10px;">Действие</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        maintenanceTypes.forEach(to => {
            html += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <td style="padding: 10px;"><strong>${to.code}</strong></td>
                    <td style="padding: 10px;">${to.name}</td>
                    <td style="padding: 10px;">${to.intervalKm.toLocaleString()} км</td>
                    <td style="padding: 10px;"><span class="badge success">По плану</span></td>
                    <td style="padding: 10px;">
                        <button class="btn btn-secondary btn-complete-to" data-code="${to.code}" style="padding: 4px 8px; font-size: 12px;">Отметить выполнение</button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div></div>`;
        
        container.innerHTML = html;
        setupCompleteTOHandlers();

    } catch (e) {
        console.error("Ошибка загрузки плана ТО:", e);
        showToast("Ошибка загрузки графика ТО", "error");
    }
}

function setupCompleteTOHandlers() {
    document.querySelectorAll(".btn-complete-to").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const toCode = e.target.getAttribute("data-code");
            const locoId = prompt(`Введите номер локомотива для фиксации ${toCode}:`);
            if (!locoId) return;

            const recordsRef = ref(db, "maintenanceRecords");
            await push(recordsRef, {
                locomotive_id: locoId,
                to_type: toCode,
                date: Date.now(),
                status: "completed"
            });

            showToast(`${toCode} успешно зафиксирован для локомотива №${locoId}!`, "success");
            beep(900, 0.1);
        });
    });
}
