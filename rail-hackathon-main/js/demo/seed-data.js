import { db } from '../config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

export const seedLocoPredict = async () => {
  try {
    const locoRef = await addDoc(collection(db, "locomotives"), {
      number: "KZ8-001", series: "KZ8A", depot: "Астана-Орлы", status: "attention", demo: true, createdAt: serverTimestamp()
    });
    const equipRef = await addDoc(collection(db, "equipment"), {
      locomotiveId: locoRef.id, name: "Тяговый электродвигатель №1", type: "traction_motor", status: "normal", demo: true
    });
    const measurements = [
      { value: 58, timeOffset: 7200000 },
      { value: 65, timeOffset: 3600000 },
      { value: 76, timeOffset: 0 }
    ];
    for (const m of measurements) {
      await addDoc(collection(db, "measurements"), {
        locomotiveId: locoRef.id, equipmentId: equipRef.id, metric: "temperature", value: m.value, unit: "C", source: "manual", demo: true, recordedAt: new Date(Date.now() - m.timeOffset)
      });
    }
    console.log("Демо-база LOCO PREDICT успешно загружена!");
  } catch (error) {
    console.error("Ошибка загрузки:", error);
  }
};
