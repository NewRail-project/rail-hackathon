import { db } from '../config.js';
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { generateRepairPlan } from './ai-planner.js';

export const initMaintenance = () => {
    const colPlanned = document.getElementById('tasks-planned');
    const colProgress = document.getElementById('tasks-progress');
    const colDone = document.getElementById('tasks-done');

    const q = query(collection(db, "maintenanceTasks"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        colPlanned.innerHTML = '';
        colProgress.innerHTML = '';
        colDone.innerHTML = '';

        snapshot.forEach(docSnap => {
            const task = docSnap.data();
            const id = docSnap.id;
            
            const card = document.createElement('div');
            card.style.cssText = 'background: #2a2a40; padding: 10px; margin-bottom: 10px; border-radius: 5px; border-left: 4px solid #fff;';
            if (task.priority === 'high') card.style.borderLeftColor = '#ff4d4d';
            
            let buttons = '';
            let aiPlanBlock = task.aiPlan ? `<div style="margin-top:10px; padding:8px; background:#1a1a2e; font-size:12px; color:#a0a0b5; border-radius:4px;"><strong>План ремонта:</strong><br>${task.aiPlan.replace(/\n/g, '<br>')}</div>` : '';

            if (task.status === 'planned') {
                buttons = `
                    <button class="btn-take" data-id="${id}" style="margin-top: 10px; width: 100%;">Взять в работу</button>
                    ${!task.aiPlan ? `<button class="btn-ai btn-secondary" data-id="${id}" data-title="${task.title}" style="margin-top: 5px; width: 100%;">🤖 Сгенерировать план</button>` : ''}
                `;
                colPlanned.appendChild(card);
            } else if (task.status === 'in_progress') {
                buttons = `<button class="btn-complete" data-id="${id}" style="margin-top: 10px; width: 100%;">Завершить</button>`;
                colProgress.appendChild(card);
            } else if (task.status === 'completed') {
                card.style.opacity = '0.6';
                colDone.appendChild(card);
            }

            card.innerHTML = `
                <strong>${task.title}</strong><br>
                <small>Приоритет: ${task.priority}</small>
                ${aiPlanBlock}
                ${buttons}
            `;
        });

        document.querySelectorAll('.btn-take').forEach(btn => btn.onclick = async (e) => await updateDoc(doc(db, "maintenanceTasks", e.target.dataset.id), { status: 'in_progress' }));
        document.querySelectorAll('.btn-complete').forEach(btn => btn.onclick = async (e) => await updateDoc(doc(db, "maintenanceTasks", e.target.dataset.id), { status: 'completed', completedAt: serverTimestamp() }));
        
        document.querySelectorAll('.btn-ai').forEach(btn => {
            btn.onclick = async (e) => {
                const taskId = e.target.dataset.id;
                const title = e.target.dataset.title;
                e.target.textContent = '⏳ Генерация...';
                e.target.disabled = true;
                
                const plan = await generateRepairPlan(title, "Оборудование локомотива");
                if (plan) {
                    await updateDoc(doc(db, "maintenanceTasks", taskId), { aiPlan: plan });
                } else {
                    e.target.textContent = '🤖 Сгенерировать план';
                    e.target.disabled = false;
                }
            };
        });
    });
};
