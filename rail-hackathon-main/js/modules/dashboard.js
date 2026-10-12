// =====================================================
// js/modules/dashboard.js
// Личный кабинет депо и управление документацией/файлами
// =====================================================

import { db } from "../app.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { showToast, beep } from "../script.js";

export function initDepotDashboard() {
    const container = document.getElementById("depot-dashboard") || document.querySelector(".app-container");
    if (!container) return;

    renderDepotInterface(container);
}

function renderDepotInterface(container) {
    let html = `
        <div class="card" style="margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                    <h3 style="margin: 0;">Личный кабинет депо: Управление и документация</h3>
                    <span class="subtitle">Загрузка актов, диагностических заключений и фотоматериалов</span>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                <div class="card" style="background: rgba(0,0,0,0.2);">
                    <h4>Загрузка документов и актов</h4>
                    <p style="font-size: 13px; opacity: 0.8; margin-bottom: 10px;">Поддерживаются файлы: PDF, DOCX, JPG, PNG</p>
                    <input type="file" id="file-upload-input" style="margin-bottom: 10px; width: 100%; color: inherit;">
                    <button id="btn-upload-file" class="btn btn-secondary">Загрузить в систему</button>
                </div>

                <div class="card" style="background: rgba(0,0,0,0.2);">
                    <h4>Быстрые операции депо</h4>
                    <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
                        <button class="btn btn-primary" onclick="window.location.href='park.html'">Перейти к реестру парка</button>
                        <button class="btn btn-secondary" onclick="window.location.href='repair.html'">Открыть журнал ТУ-152</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    setupFileUploadHandler();
}

function setupFileUploadHandler() {
    const btnUpload = document.getElementById("btn-upload-file");
    if (!btnUpload) return;

    btnUpload.onclick = async () => {
        const fileInput = document.getElementById("file-upload-input");
        if (!fileInput || fileInput.files.length === 0) {
            showToast("Выберите файл для загрузки!", "error");
            return;
        }

        const file = fileInput.files[0];
        
        try {
            // Сохраняем метаданные файла в Firebase Realtime Database
            const filesRef = ref(db, "files");
            await push(filesRef, {
                name: file.name,
                size: file.size,
                type: file.type,
                uploaded_at: Date.now(),
                author: "Сотрудник депо"
            });

            showToast(`Файл "${file.name}" успешно прикреплен к системе!`, "success");
            beep(950, 0.1);
            fileInput.value = "";
        } catch (e) {
            console.error("Ошибка загрузки файла:", e);
            showToast("Не удалось загрузить файл", "error");
        }
    };
}
