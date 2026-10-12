// =====================================================
// demo.js — демонстрационные данные для хакатона
// Используются, когда USE_DEMO = true
// ВАЖНО: все значения условные, для показа интерфейса
// =====================================================

export const USE_DEMO = true;   // ← переключи на false, чтобы читать из Firestore

// ---------- ЛОКОМОТИВЫ ----------
export const demoLocomotives = [
  {
    id: "KZ8A-001",
    model: "КЗ8А",
    inventory: "001",
    status: "warning",           // ok | warning | critical | nodata
    mileage: 124500,
    next_to: 250000,
    last_to: "2026-09-12",
    depot: "Депо Алматы"
  },
  {
    id: "KZ8A-014",
    model: "КЗ8А",
    inventory: "014",
    status: "ok",
    mileage: 88300,
    next_to: 250000,
    last_to: "2026-10-01",
    depot: "Депо Алматы"
  },
  {
    id: "KZ8A-022",
    model: "КЗ8А",
    inventory: "022",
    status: "critical",
    mileage: 238200,
    next_to: 250000,
    last_to: "2026-08-05",
    depot: "Депо Шымкент"
  },
  {
    id: "KZ4A-007",
    model: "КЗ4А",
    inventory: "007",
    status: "ok",
    mileage: 98300,
    next_to: 200000,
    last_to: "2026-09-28",
    depot: "Депо Астана"
  },
  {
    id: "KZ8A-003",
    model: "КЗ8А",
    inventory: "003",
    status: "nodata",
    mileage: 176400,
    next_to: 250000,
    last_to: "—",
    depot: "Депо Алматы"
  }
];

// ---------- ИЗМЕРЕНИЯ (для диагностики) ----------
// Структура: по локомотиву — история измерений
export const demoMeasurements = {
  "KZ8A-001": {
    temperature: {
      current: 78,
      unit: "°C",
      threshold: 75,
      history: [62, 64, 66, 69, 71, 73, 75, 78]   // рост!
    },
    vibration: {
      current: 5.2,
      unit: "мм/с",
      threshold: 4.5,
      history: [3.1, 3.4, 3.6, 3.9, 4.2, 4.5, 4.9, 5.2] // рост!
    }
  },
  "KZ8A-014": {
    temperature: { current: 58, unit: "°C", threshold: 75,
      history: [55, 56, 57, 57, 58, 58, 58, 58] },
    vibration: { current: 3.0, unit: "мм/с", threshold: 4.5,
      history: [2.8, 2.9, 3.0, 3.0, 3.0, 3.0, 3.0, 3.0] }
  },
  "KZ8A-022": {
    temperature: { current: 82, unit: "°C", threshold: 75,
      history: [70, 72, 74, 76, 78, 80, 81, 82] },
    vibration: { current: 6.1, unit: "мм/с", threshold: 4.5,
      history: [4.0, 4.4, 4.8, 5.1, 5.4, 5.7, 5.9, 6.1] }
  }
};

// ---------- ЖУРНАЛ (ТУ-152 — дополнение, не замена) ----------
export const demoJournal = [
  { id: "j1", loco: "KZ8A-001", date: "2026-10-10", type: "Наблюдение",
    text: "Повышение температуры буксового узла до 78 °C", status: "open" },
  { id: "j2", loco: "KZ8A-001", date: "2026-10-08", type: "Замечание",
    text: "Рост вибрации в динамике: 4,2 → 5,2 мм/с", status: "open" },
  { id: "j3", loco: "KZ8A-022", date: "2026-10-09", type: "Отклонение",
    text: "Вибрация выше порога 4,5 мм/с на 35%", status: "open" },
  { id: "j4", loco: "KZ8A-014", date: "2026-10-05", type: "Осмотр",
    text: "Осмотр пройден, отклонений не выявлено", status: "done" },
  { id: "j5", loco: "KZ4A-007", date: "2026-10-01", type: "ТО-2",
    text: "Плановое ТО-2 выполнено", status: "done" }
];

// ---------- РЕМОНТЫ / ЗАЯВКИ ----------
export const demoRepairs = [
  { id: "r1", loco: "KZ8A-001", title: "Проверка буксового узла",
    priority: "high", status: "waiting", created: "2026-10-10", due: "2026-10-13" },
  { id: "r2", loco: "KZ8A-022", title: "Диагностика вибрации",
    priority: "high", status: "in_progress", created: "2026-10-09", due: "2026-10-12" },
  { id: "r3", loco: "KZ4A-007", title: "Плановое ТО-2",
    priority: "normal", status: "done", created: "2026-10-01", due: "2026-10-05" }
];

// ---------- ЛЕНТА СОБЫТИЙ (для Обзора) ----------
export const demoEvents = [
  { time: "10:42", type: "warning", text: "KZ8A-001: температура 78 °C (порог 75 °C)" },
  { time: "10:20", type: "danger",  text: "KZ8A-022: вибрация 6,1 мм/с — критично" },
  { time: "09:55", type: "info",    text: "KZ8A-014: осмотр завершён, отклонений нет" },
  { time: "09:30", type: "warning", text: "KZ8A-001: создана заявка на ТО" },
  { time: "08:50", type: "info",    text: "KZ4A-007: ТО-2 завершено" }
];

// ---------- ЗАГОЛОВКИ И СТАТУСЫ ----------
export const statusLabels = {
  ok: "В норме",
  warning: "Требует проверки",
  critical: "Критично",
  nodata: "Нет данных"
};

export const statusBadge = {
  ok: "done",
  warning: "progress",
  critical: "waiting",
  nodata: "nodata"
};
