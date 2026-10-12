// =====================================================
// js/modules/dashboard.js
// Личный кабинет депо и управление документацией/файлами
// =====================================================

import { db } from "../app.js";
import { ref, get, push } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

export function initDepotDashboard() {
    const container = document.getElementById("depot-dashboard") || document.querySelector(".app-container");
    if (!container) return;

    renderDepotInterface(container);
}

async function renderDepotInterface(container) {
    const target = document.getElementById("depot-content-area") || container;

    let html = `
        <div class="card" style="margin-top: 20px;">
            <h3>Личный кабинет депо: Управление и документация</h3>
            <div class="subtitle" style="margin-bottom: 15px;">Загрузка актов, диагностических заключений и фотоматериалов</div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                <div class="card" style="background: rgba(0,0,0,0.2);">
                    <h4>Загрузка документов и актов</h4>
                    <p style="font-size: 13px; opacity: 0.8; margin-bottom: 10px;">Поддерживаются файлы: PDF, DOCX, JPG, PNG</p>
                    <input type="file" id="file-upload-input" style="margin-bottom: 10px; width: 100%;">
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

    if (!document.getElementById("depot-dashboard-card")) {
        const wrapper = document.createElement("div");
        wrapper.id = "depot-dashboard-card";
        wrapper.innerHTML = html;
        target.appendChild(wrapper);
    }

    setupFileUploadHandler();
}

function setupFileUploadHandler() {
    const btnUpload = document.getElementById("btn-upload-file");
    if (!btnUpload) return;

    btnUpload.onclick = async () => {
        const fileInput = document.getElementById("file-upload-input");
        if (!fileInput || fileInput.files.length === 0) {
            alert("Выберите файл для загрузки!");
            return;
        }

        const file = fileInput.files[0];
        
        // Сохраняем метаданные файла в Firestore/Realtime Database
        const filesRef = ref(db, "files");
        await push(filesRef, {
            name: file.name,
            size: file.size,
            type: file.type,
            uploaded_at: Date.now(),
            author: "Сотрудник депо"
        });

        alert(`Файл "${file.name}" успешно прикреплен к системе!`);
        fileInput.value = "";
    };
}
