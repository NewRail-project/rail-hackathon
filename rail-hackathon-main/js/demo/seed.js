import { db } from '../config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

export const seedDatabase = async () => {
    console.log("▶ Инициализация демо-базы NEWRAIL...");
    try {
        // Локомотив 1 (ВЛ80С - Требует внимания)
        const loco1Ref = await addDoc(collection(db, "locomotives"), {
            number: "ВЛ80С-1428", series: "ВЛ80С", type: "Грузовой", power: "Переменный ток (25 кВ)", depot: "Главное депо", status: "attention", createdAt: serverTimestamp()
        });
        
        const equip1Ref = await addDoc(collection(db, "equipment"), {
            locomotiveId: loco1Ref.id, name: "ТЭД НБ-418К6 (1-я ось)", type: "traction_motor", status: "warning"
        });

        await addDoc(collection(db, "diagnosticEvents"), {
            locomotiveId: loco1Ref.id, equipmentId: equip1Ref.id, message: "Аномальный нагрев моторно-осевого подшипника", recommendation: "Внеплановый осмотр МОП и проверка смазки", status: "open", createdAt: serverTimestamp()
        });

        // Локомотив 2 (2ЭС5К - Исправен)
        const loco2Ref = await addDoc(collection(db, "locomotives"), {
            number: "2ЭС5К-089", series: "2ЭС5К", type: "Грузовой", power: "Переменный ток (25 кВ)", depot: "Главное депо", status: "normal", createdAt: serverTimestamp()
        });

        await addDoc(collection(db, "equipment"), {
            locomotiveId: loco2Ref.id, name: "Главный компрессор", type: "compressor", status: "normal"
        });

        // Тестовая задача для Канбан-доски
        await addDoc(collection(db, "maintenanceTasks"), {
            locomotiveId: loco1Ref.id, equipmentId: equip1Ref.id, title: "Замена щеток тягового электродвигателя", priority: "high", status: "planned", createdAt: serverTimestamp()
        });

        console.log("✅ База данных успешно заполнена. Перезагрузите интерфейс.");
    } catch (error) {
        console.error("❌ Сбой генерации:", error);
    }
};
