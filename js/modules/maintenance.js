// =====================================================
// js/modules/maintenance.js
// Управление ремонтными случаями, задачами и историей ремонта
// =====================================================

import { db } from "../app.js";
import { ref, get, push, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

export function initMaintenanceModule() {
    const container = document.getElementById("maintenance-container") || document.querySelector(".app-container");
    if (!container) return;

    loadRepairCases();
}

async function loadRepairCases() {
    try {
        const casesRef = ref(db, "maintenanceCases");
        const snapshot = await get(casesRef);

        const target = document.getElementById("repair-list-container") || document.body;
        
        let casesHtml = `
            <div class="card" style="margin-top: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3>Ремонтные случаи и история</h3>
                    <button id="btn-new-repair" class="btn btn-primary">Новое поступление</button>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Локомотив</th>
                                <th>Дата поступления</th>
                                <th>Жалоба / Неисправность</th>
                                <th>Стадия ремонта</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody id="repair-table-body">
        `;

        if (snapshot.exists()) {
            const cases = snapshot.val();
            Object.keys(cases).forEach(key => {
                const item = cases[key];
                casesHtml += `
                    <tr>
                        <td><strong>№ ${item.locomotive_id || "—"}</strong></td>
                        <td>${item.date ? new Date(item.date).toLocaleDateString("ru-RU") : "—"}</td>
                        <td>${item.complaint || item.description || "Плановый осмотр"}</td>
                        <td><span class="badge warning">${item.status || "Принят в депо"}</span></td>
                        <td><button class="btn btn-secondary" style="padding: 4px 8px; font-size: 12px;" onclick="window.location.href='repair.html?id=${key}'">Открыть</button></td>
                    </tr>
                `;
            });
        } else {
            casesHtml += `<tr><td colspan="5" style="text-align: center; opacity: 0.7;">Активных ремонтных случаев нет</td></tr>`;
        }

        casesHtml += `</tbody></table></div></div>`;
        
        if (!document.getElementById("repair-list-card")) {
            const wrapper = document.createElement("div");
            wrapper.id = "repair-list-card";
            wrapper.innerHTML = casesHtml;
            target.appendChild(wrapper);
        }

        setupNewRepairHandler();

    } catch (e) {
        console.error("Ошибка загрузки ремонтных случаев:", e);
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

        alert("Ремонтный случай успешно создан!");
        location.reload();
    };
}
