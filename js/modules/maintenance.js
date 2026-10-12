// =====================================================
// js/modules/maintenance.js
// Управление ремонтными случаями, задачами и историей ремонта
// =====================================================

import { db } from "../app.js";
import { ref, get, push, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { showToast, beep } from "../script.js";

export function initMaintenanceModule() {
    const container = document.getElementById("maintenance-container") || document.querySelector(".app-container");
    if (!container) return;

    loadRepairCases(container);
}

async function loadRepairCases(container) {
    try {
        const casesRef = ref(db, "maintenanceCases");
        const snapshot = await get(casesRef);

        let casesHtml = `
            <div class="card" style="margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <h3 style="margin: 0;">Ремонтные случаи и история</h3>
                        <span class="subtitle">Управление диагностикой, этапами и выполнением работ</span>
                    </div>
                    <button id="btn-new-repair" class="btn btn-primary">Новое поступление</button>
                </div>
                <div class="table-container" style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                <th style="padding: 10px;">Локомотив</th>
                                <th style="padding: 10px;">Дата поступления</th>
                                <th style="padding: 10px;">Жалоба / Неисправность</th>
                                <th style="padding: 10px;">Стадия ремонта</th>
                                <th style="padding: 10px;">Действия</th>
                            </tr>
                        </thead>
                        <tbody id="repair-table-body">
        `;

        if (snapshot.exists()) {
            const cases = snapshot.val();
            Object.keys(cases).forEach(key => {
                const item = cases[key];
                casesHtml += `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 10px;"><strong>№ ${item.locomotive_id || "—"}</strong></td>
                        <td style="padding: 10px;">${item.date ? new Date(item.date).toLocaleDateString("ru-RU") : "—"}</td>
                        <td style="padding: 10px;">${item.complaint || item.description || "Плановый осмотр"}</td>
                        <td style="padding: 10px;"><span class="badge warning">${item.status || "Принят в депо"}</span></td>
                        <td style="padding: 10px;">
                            <button class="btn btn-secondary btn-open-case" data-id="${key}" style="padding: 4px 8px; font-size: 12px;">Открыть</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            casesHtml += `<tr><td colspan="5" style="text-align: center; opacity: 0.7; padding: 20px;">Активных ремонтных случаев нет</td></tr>`;
        }

        casesHtml += `</tbody></table></div></div>`;
        
        container.innerHTML = casesHtml;
        setupNewRepairHandler();
        setupOpenCaseHandlers();

    } catch (e) {
        console.error("Ошибка загрузки ремонтных случаев:", e);
        showToast("Ошибка загрузки ремонтных данных", "error");
    }
}

function setupNewRepairHandler() {
    const btnNew = document.getElementById("btn-new-repair");
    if (!btnNew) return;

    btnNew.onclick = async () => {
        const locoId = prompt("Введите номер локомотива для создания ремонтного случая:");
        if (!locoId) return;

        const complaint = prompt("Укажите заявленную неисправность или причину обращения:");
        
        const casesRef = ref(db, "maintenanceCases");
        await push(casesRef, {
            locomotive_id: locoId,
            complaint: complaint || "Внеплановый осмотр",
            status: "Принят в депо",
            date: Date.now(),
            stage: "Приемка"
        });

        showToast("Ремонтный случай успешно создан!", "success");
        beep(750, 0.1);
        
        // Перезагружаем список
        initMaintenanceModule();
    };
}

function setupOpenCaseHandlers() {
    document.querySelectorAll(".btn-open-case").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const caseId = e.target.getAttribute("data-id");
            window.location.href = `repair.html?id=${caseId}`;
        });
    });
}
