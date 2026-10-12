import { db } from '../config.js';
import { doc, getDoc, collection, addDoc, updateDoc, onSnapshot, serverTimestamp, query, where } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { checkMeasurement } from '../logic/anomaly-rules.js';

export const initPassport = async () => {
    const params = new URLSearchParams(window.location.search);
    const locoId = params.get('id');
    if (!locoId) return alert("Локомотив не найден");

    const locoRef = doc(db, "locomotives", locoId);
    
    // 1. Шапка паспорта
    const locoSnap = await getDoc(locoRef);
    if (locoSnap.exists()) {
        const data = locoSnap.data();
        document.getElementById('loco-title').textContent = `${data.number} (${data.series})`;
        document.getElementById('loco-specs').innerHTML = `Тип: ${data.type || '-'} <br> Питание: ${data.power || '-'} <br> Депо: ${data.depot || '-'}`;
        document.getElementById('loco-status-badge').textContent = data.status;
        if (data.photo) document.getElementById('loco-photo-container').innerHTML = `<img src="${data.photo}" style="width:100%; height:100%; object-fit:cover;">`;
    }

    // 2. Оборудование и Диагностика
    const equipSelect = document.getElementById('equip-select');
    const equipList = document.getElementById('equipment-list');
    const qEquip = query(collection(db, "equipment"), where("locomotiveId", "==", locoId));
    
    let equipmentData = {};
    onSnapshot(qEquip, (snapshot) => {
        equipSelect.innerHTML = '<option value="">Выберите узел...</option>';
        equipList.innerHTML = '';
        snapshot.forEach(docSnap => {
            const eq = docSnap.data();
            equipmentData[docSnap.id] = eq;
            
            equipSelect.innerHTML += `<option value="${docSnap.id}">${eq.name}</option>`;
            equipList.innerHTML += `<div class="card"><h4>${eq.name}</h4><p>Последнее измерение: <span id="val-${docSnap.id}">-</span></p></div>`;
        });
    });

    document.getElementById('measurement-form').onsubmit = async (e) => {
        e.preventDefault();
        const eqId = equipSelect.value;
        const val = parseFloat(document.getElementById('metric-value').value);
        if (!eqId || isNaN(val)) return;

        const eqType = equipmentData[eqId].type || 'traction_motor';
        const measureRef = await addDoc(collection(db, "measurements"), {
            locomotiveId: locoId, equipmentId: eqId, metric: "temperature", value: val, recordedAt: serverTimestamp()
        });

        document.getElementById(`val-${eqId}`).textContent = `${val} °C`;

        const diagnosticResult = checkMeasurement(eqType, "temperature", val, null); // Для демо упростим до проверки порога
        
        if (diagnosticResult.hasDeviation) {
            await addDoc(collection(db, "diagnosticEvents"), {
                locomotiveId: locoId, equipmentId: eqId, value: val, message: diagnosticResult.message, recommendation: diagnosticResult.recommendation, status: "open", createdAt: serverTimestamp()
            });
            await updateDoc(locoRef, { status: 'critical' });
            alert(`Аномалия зафиксирована: ${diagnosticResult.message}`);
        }
        document.getElementById('measurement-form').reset();
    };

    // 3. Трекинг Отклонений (Событий)
    const anomaliesList = document.getElementById('anomalies-list');
    onSnapshot(query(collection(db, "diagnosticEvents"), where("locomotiveId", "==", locoId), where("status", "==", "open")), (snapshot) => {
        anomaliesList.innerHTML = snapshot.empty ? 'Нет активных отклонений' : '';
        snapshot.forEach(docSnap => {
            const ev = docSnap.data();
            anomaliesList.innerHTML += `
                <div style="border: 1px solid #ff4d4d; padding: 10px; margin-bottom: 5px;">
                    <strong>${ev.message}</strong><br><small>${ev.recommendation}</small><br>
                    <button class="btn-create-task" data-id="${docSnap.id}" data-eq="${ev.equipmentId}">В ремонт (Создать задачу)</button>
                </div>
            `;
        });

        document.querySelectorAll('.btn-create-task').forEach(btn => {
            btn.onclick = async (e) => {
                const eventId = e.target.getAttribute('data-id');
                const eqId = e.target.getAttribute('data-eq');
                // Создаем задачу
                await addDoc(collection(db, "maintenanceTasks"), {
                    locomotiveId: locoId, equipmentId: eqId, relatedEventId: eventId, title: "Внеплановый осмотр", status: "planned", priority: "high", createdAt: serverTimestamp()
                });
                // Закрываем событие
                await updateDoc(doc(db, "diagnosticEvents", eventId), { status: "task_created" });
            };
        });
    });

    // 4. Трекинг Задач ТО
    const tasksList = document.getElementById('tasks-list');
    onSnapshot(query(collection(db, "maintenanceTasks"), where("locomotiveId", "==", locoId)), (snapshot) => {
        tasksList.innerHTML = snapshot.empty ? 'Нет активных задач' : '';
        snapshot.forEach(docSnap => {
            const task = docSnap.data();
            if (task.status === 'completed') return; // Скрываем выполненные
            
            tasksList.innerHTML += `
                <div style="border: 1px solid #4da6ff; padding: 10px; margin-bottom: 5px;">
                    <strong>${task.title}</strong> (Приоритет: ${task.priority})<br><small>Статус: ${task.status}</small><br>
                    <button class="btn-complete-task" data-id="${docSnap.id}">Завершить работу</button>
                </div>
            `;
        });

        document.querySelectorAll('.btn-complete-task').forEach(btn => {
            btn.onclick = async (e) => {
                const taskId = e.target.getAttribute('data-id');
                await updateDoc(doc(db, "maintenanceTasks", taskId), { status: "completed", completedAt: serverTimestamp() });
                // Если задач больше нет, можно вернуть статус локомотива в normal (требует доп проверки, но для демо ок)
            };
        });
    });

    // 5. QR Код
    const qrModal = document.getElementById('qr-modal');
    document.getElementById('btn-generate-qr').onclick = () => {
        document.getElementById('qr-container').innerHTML = '';
        new QRCode(document.getElementById('qr-container'), { text: window.location.href, width: 200, height: 200 });
        qrModal.style.display = 'flex';
    };
    document.getElementById('btn-close-qr').onclick = () => qrModal.style.display = 'none';
};
