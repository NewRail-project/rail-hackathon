import { db } from '../config.js';
import { collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

export const initDashboard = async () => {
    const locoTableBody = document.getElementById('loco-table-body');
    if (!locoTableBody) return;

    const loadLocomotives = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "locomotives"));
            let total = 0, ok = 0, warning = 0, critical = 0;
            locoTableBody.innerHTML = '';
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                total++;
                if (data.status === 'normal') ok++;
                else if (data.status === 'attention') warning++;
                else if (data.status === 'critical') critical++;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${data.number || '-'}</td>
                    <td>${data.series || '-'} (${data.type || '-'})</td>
                    <td>${data.power || '-'}</td>
                    <td><span class="badge status-${data.status}">${data.status}</span></td>
                    <td><a href="pages/locomotive.html?id=${doc.id}" class="btn-action">Паспорт</a></td>
                `;
                locoTableBody.appendChild(row);
            });
            document.querySelector('#stat-total span').textContent = total;
            document.querySelector('#stat-ok span').textContent = ok;
            document.querySelector('#stat-warning span').textContent = warning;
            document.querySelector('#stat-critical span').textContent = critical;
        } catch (error) { console.error(error); }
    };

    await loadLocomotives();

    const modal = document.getElementById('add-loco-modal');
    document.getElementById('btn-add-loco').onclick = () => modal.style.display = 'flex';
    document.getElementById('btn-close-modal').onclick = () => modal.style.display = 'none';

    document.getElementById('add-loco-form').onsubmit = async (e) => {
        e.preventDefault();
        const photoInput = document.getElementById('loco-photo');
        let photoBase64 = null;

        // Конвертация фото в строку для демо-сохранения
        if (photoInput.files.length > 0) {
            const file = photoInput.files[0];
            photoBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        }

        try {
            await addDoc(collection(db, "locomotives"), {
                number: document.getElementById('loco-num').value.trim(),
                series: document.getElementById('loco-series').value.trim(),
                type: document.getElementById('loco-type').value.trim(),
                power: document.getElementById('loco-power').value,
                depot: document.getElementById('loco-depot').value.trim(),
                photo: photoBase64,
                status: 'normal',
                createdAt: serverTimestamp()
            });
            document.getElementById('add-loco-form').reset();
            modal.style.display = 'none';
            await loadLocomotives();
        } catch (error) { console.error(error); }
    };
};
