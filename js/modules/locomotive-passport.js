// =====================================================
// js/modules/locomotive-passport.js
// Цифровой паспорт локомотива и состояние оборудования
// =====================================================

import { db } from "../app.js";
import { ref, get, update, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

export function initLocomotivePassport() {
    const urlParams = new URLSearchParams(window.location.search);
    const locoId = urlParams.get("id") || urlParams.get("loco") || "001";

    const container = document.getElementById("locomotive-passport") || document.querySelector(".app-container");
    if (!container) return;

    loadLocoData(locoId);
}

async function loadLocoData(id) {
    try {
        const locoRef = ref(db, `locomotives/${id}`);
        const snapshot = await get(locoRef);

        if (!snapshot.exists()) {
            console.error("Локомотив не найден");
            return;
        }

        const data = snapshot.val();
        renderPassport(id, data);
        loadEquipmentNodes(id);

    } catch (e) {
        console.error("Ошибка загрузки паспорта локомотива:", e);
    }
}

function renderPassport(id, data) {
    // Ищем контейнер вывода на странице паспорта/локомотива
    const target = document.getElementById("passport-content") || document.body;
    
    // Оставляем оригинальные классы разметки из проекта
    target.insertAdjacentHTML("afterbegin", `
        <div class="card" style="margin-bottom: 20px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h2>ЛОКОМОТИВ № ${id}</h2>
                    <span class="subtitle">Серия: ${data.series || "КЗ8А"} | Депо: ${data.depot || "ТД-20"}</span>
                </div>
                <div class="badge warning" id="passport-status">${data.status_text || "ТРЕБУЕТ ПРОВЕРКИ"}</div>
            </div>
            
            <div style="margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                    <p><strong>Текущий пробег:</strong> <span id="span-mileage">${data.current_mileage || 0}</span> км</p>
                    <p><strong>Последнее ТО:</strong> ${data.last_to || "ТО-2"}</p>
                </div>
                <div>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <input type="number" id="input-mileage-val" class="form-control" placeholder="Новый пробег" style="padding: 6px; width: 140px;">
                        <button id="btn-save-mileage" class="btn btn-secondary">Обновить пробег</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Логика обновления пробега с защитой (проверка на уменьшение)
    const btnSave = document.getElementById("btn-save-mileage");
    if (btnSave) {
        btnSave.onclick = async () => {
            const val = Number(document.getElementById("input-mileage-val").value);
            const prev = Number(data.current_mileage || 0);

            if (isNaN(val)) return;

            if (val < prev) {
                const reason = prompt("Внимание: введенный пробег меньше предыдущего. Укажите причину корректировки:");
                if (!reason) return;
                await push(ref(db, `mileage_corrections/${id}`), {
                    old_mileage: prev,
                    new_mileage: val,
                    reason: reason,
                    timestamp: Date.now()
                });
            }

            await update(ref(db, `locomotives/${id}`), {
                current_mileage: val,
                last_mileage_update: Date.now()
            });
            alert("Пробег успешно обновлен!");
            location.reload();
        };
    }
}

async function loadEquipmentNodes(id) {
    const eqRef = ref(db, `equipment/${id}`);
    const snap = await get(eqRef);
    
    // Стандартные узлы для электровоза КЗ8А если в базе пусто
    const defaultNodes = [
        { name: "Тяговые электродвигатели", status: "norm", desc: "Параметры в норме" },
        { name: "Тяговый трансформатор", status: "warning", desc: "Повышенная температура" },
        { name: "Подшипниковые узлы", status: "norm", desc: "Вибрация в пределах нормы" },
        { name: "Тормозное оборудование", status: "norm", desc: "Проверено при ТО" },
        { name: "Токоприемники", status: "norm", desc: "Износ контактных вставок в норме" }
    ];

    const nodes = snap.exists() ? snap.val() : defaultNodes;
    
    const target = document.getElementById("equipment-list") || document.body;
    
    let html = `<div class="card" style="margin-top:20px;"><h3>Состояние оборудования и узлов</h3><div style="margin-top:10px; display:flex; flex-direction:column; gap:8px;">`;
    
    (Array.isArray(nodes) ? nodes : Object.values(nodes)).forEach(node => {
        const badgeClass = node.status === 'norm' ? 'success' : 'warning';
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; padding: 10px; background: rgba(0,0,0,0.15); border-radius: 6px;">
                <div>
                    <strong>${node.name}</strong>
                    <div style="font-size: 12px; opacity: 0.8;">${node.desc || "Описание отсутствует"}</div>
                </div>
                <div class="badge ${badgeClass}">${node.status === 'norm' ? 'Норма' : 'Требует проверки'}</div>
            </div>
        `;
    });
    html += `</div></div>`;
    
    target.insertAdjacentHTML("afterend", html);
}
