// =====================================================
// js/modules/locomotive-passport.js
// Модуль цифрового паспорта локомотива, телеметрии и проверки пробега
// =====================================================

import { db } from "../app.js";
import { ref, get, update, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { showToast, beep } from "../script.js";

export function initLocomotivePassport() {
    const urlParams = new URLSearchParams(window.location.search);
    const locoId = urlParams.get("id") || urlParams.get("loco") || "001";

    const passportContainer = document.getElementById("locomotive-passport") || document.querySelector(".app-container");
    if (!passportContainer) return;

    loadPassportData(locoId, passportContainer);
}

async function loadPassportData(id, container) {
    try {
        const locoRef = ref(db, `locomotives/${id}`);
        const snapshot = await get(locoRef);

        const data = snapshot.exists() ? snapshot.val() : {
            series: "КЗ8А",
            model: "Электровоз грузовой",
            depot: "ТД-20",
            current_mileage: 142500,
            last_to: "ТО-2 (10.05.2026)",
            temperature: 78,
            vibration: 5.2,
            status: "warning",
            status_text: "ТРЕБУЕТ ПРОВЕРКИ"
        };

        renderPassportHTML(id, data, container);
        setupMileageLogic(id, data.current_mileage || 0);

    } catch (error) {
        console.error("Ошибка загрузки паспорта локомотива:", error);
        showToast("Ошибка загрузки данных из Firebase", "error");
    }
}

function renderPassportHTML(id, data, container) {
    container.innerHTML = `
        <div class="card" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 15px;">
                <div>
                    <h2 style="margin: 0;">ЛОКОМОТИВ № ${id}</h2>
                    <span class="subtitle">Серия: ${data.series || "КЗ8А"} | Модель: ${data.model || "Электровоз"}</span>
                </div>
                <div class="badge ${data.status === 'normal' ? 'success' : 'warning'}" id="loco-status-badge">
                    ${data.status_text || "ТРЕБУЕТ ПРОВЕРКИ"}
                </div>
            </div>

            <!-- Вкладки цифрового паспорта -->
            <div class="train-nav" style="margin-bottom: 20px; display: flex; gap: 10px;">
                <button class="nav-item active" data-tab="general">ОБЩАЯ ИНФОРМАЦИЯ</button>
                <button class="nav-item" data-tab="diag">ДИАГНОСТИКА</button>
                <button class="nav-item" data-tab="journal">ЖУРНАЛ ТУ-152</button>
                <button class="nav-item" data-tab="repair">РЕМОНТ И ТО</button>
            </div>

            <!-- Содержимое паспорта -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="card" style="background: rgba(0,0,0,0.2);">
                    <h3>Эксплуатационные данные</h3>
                    <p><strong>Текущий пробег:</strong> <span id="current-mileage-val">${data.current_mileage || 0}</span> км</p>
                    <p><strong>Депо приписки:</strong> ${data.depot || "ТД-20"}</p>
                    <p><strong>Последнее ТО:</strong> ${data.last_to || "ТО-2"}</p>
                    
                    <div style="margin-top: 15px; display: flex; gap: 10px; align-items: center;">
                        <input type="number" id="input-new-mileage" class="form-control" placeholder="Новый пробег" style="padding: 6px; width: 140px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: inherit;">
                        <button id="btn-update-mileage" class="btn btn-secondary" style="padding: 6px 12px;">Обновить</button>
                    </div>
                </div>

                <div class="card" style="background: rgba(0,0,0,0.2);">
                    <h3>Телеметрия узлов</h3>
                    <p><strong>Температура узла:</strong> <span style="color: #f5c518; font-weight: bold;">${data.temperature || 78} °C</span></p>
                    <p><strong>Вибрация:</strong> <span style="color: #f5c518; font-weight: bold;">${data.vibration || 5.2} мм/с</span></p>
                    <p><strong>Рекомендация Grok:</strong> ${data.recommendation || "Провести техническую проверку узла"}</p>
                </div>
            </div>

            <!-- Быстрые действия -->
            <div style="margin-top: 20px; display: flex; gap: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;">
                <a href="repair.html" class="btn btn-secondary">Открыть журнал ТУ-152</a>
                <button id="btn-create-repair-case" class="btn btn-primary">Создать заявку на ремонт</button>
            </div>
        </div>
    `;

    // Обработчик создания ремонтной заявки
    document.getElementById("btn-create-repair-case").addEventListener("click", async () => {
        const queueRef = ref(db, `service_queue`);
        await push(queueRef, {
            locomotive_id: id,
            status: "waiting",
            priority: "high",
            timestamp: Date.now(),
            description: "Создана заявка из цифрового паспорта локомотива"
        });
        showToast("Заявка успешно создана!", "success");
        beep(700, 0.1);
    });
}

function setupMileageLogic(locoId, previousMileage) {
    const updateBtn = document.getElementById("btn-update-mileage");
    const inputField = document.getElementById("input-new-mileage");

    if (!updateBtn || !inputField) return;

    updateBtn.addEventListener("click", async () => {
        const newMileage = Number(inputField.value);

        if (isNaN(newMileage) || inputField.value.trim() === "") {
            showToast("Введите корректное число пробега", "error");
            return;
        }

        // Защита: если новый пробег меньше предыдущего
        if (newMileage < previousMileage) {
            const reason = prompt("Внимание! Новый пробег меньше предыдущего. Укажите причину корректировки:");
            if (!reason) {
                showToast("Обновление отменено: не указана причина", "warning");
                return;
            }

            // Сохраняем историю корректировки в Firebase
            const historyRef = ref(db, `mileage_corrections/${locoId}`);
            await push(historyRef, {
                old_mileage: previousMileage,
                new_mileage: newMileage,
                reason: reason,
                timestamp: Date.now()
            });
        }

        // Обновляем в Firebase
        const locoRef = ref(db, `locomotives/${locoId}`);
        await update(locoRef, {
            current_mileage: newMileage,
            last_mileage_update: Date.now()
        });

        showToast("Пробег успешно обновлен в системе", "success");
        beep(880, 0.15);
        
        loadPassportData(locoId, document.getElementById("locomotive-passport") || document.querySelector(".app-container"));
    });
}
