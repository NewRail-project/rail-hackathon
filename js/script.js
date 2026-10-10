// =====================================================
// script.js — UI (toast, beep, modal) + рендер HUD
// =====================================================

import { listenRecords } from "./data.js";

// ---------- TOAST ----------
export function showToast(text, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText =
      "position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:997;display:flex;flex-direction:column;gap:8px;align-items:center;";
    document.body.appendChild(container);
  }
  const colors = { info: "#2a7fd4", success: "#27ae60", warning: "#f5c518", error: "#e74c3c" };
  const t = document.createElement("div");
  t.style.cssText = `
    background: rgba(13,21,32,.95);
    border: 1px solid ${colors[type] || colors.info};
    border-radius: 8px;
    padding: 10px 16px;
    color: #e8eef5;
    font-size: 14px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    transition: .3s;
    box-shadow: 0 4px 20px rgba(0,0,0,.5);
  `;
  t.textContent = text;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateY(-10px)";
    setTimeout(() => t.remove(), 300);
  }, 2600);
}

// ---------- BEEP ----------
let actx = null;
export function beep(freq = 880, dur = 0.2, type = "sine", vol = 0.15) {
  try {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    o.connect(g); g.connect(actx.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + dur);
    o.stop(actx.currentTime + dur);
  } catch (e) {}
}

// ---------- MODAL ----------
export function toggleModal(id, state) {
  const m = document.getElementById(id);
  if (m) m.classList.toggle("open", !!state);
}

// =====================================================
// HUD — рендер главной панели
// =====================================================
const contentArea = document.getElementById("content-area");
let queueData = [];
let locoData = [];

function renderHud() {
  if (!contentArea) return;

  const waiting = queueData.filter(q => q.status === "waiting").length;
  const inProgress = queueData.filter(q => q.status === "in_progress").length;
  const done = queueData.filter(q => q.status === "done").length;

  const critical = locoData
    .map(l => ({ ...l, pct: Math.min(100, Math.round(((l.mileage || 0) / (l.next_to || 1)) * 100)) }))
    .filter(l => l.pct >= 80)
    .slice(0, 5);

  const queuePreview = queueData.filter(q => q.status === "waiting").slice(0, 5);

  contentArea.innerHTML = `
    <div class="grid grid-4">
      <div class="stat"><div class="label">Всего локомотивов</div><div class="value accent">${locoData.length}</div></div>
      <div class="stat"><div class="label">Ожидают</div><div class="value red">${waiting}</div></div>
      <div class="stat"><div class="label">В ремонте</div><div class="value yellow">${inProgress}</div></div>
      <div class="stat"><div class="label">Готовы</div><div class="value green">${done}</div></div>
    </div>
    <div class="grid grid-2" style="margin-top:16px">
      <div class="card">
        <h2>Очередь на ТО</h2>
        <div class="subtitle">Локомотивы в ожидании</div>
        ${queuePreview.length
          ? queuePreview.map(q => `
              <div class="kanban-item">
                <div class="id">${q.locomotive_id || "—"}</div>
                <div class="meta">${q.priority === "high" ? '<span class="badge waiting">СРОЧНО</span> ' : ""}${q.timestamp ? new Date(q.timestamp).toLocaleTimeString("ru-RU") : ""}</div>
              </div>`).join("")
          : '<div class="empty">Очередь пуста</div>'}
      </div>
      <div class="card">
        <h2>Требуют внимания</h2>
        <div class="subtitle">Пробег близок к нормативу</div>
        ${critical.length
          ? critical.map(l => `
              <div class="kanban-item">
                <div class="id">${l.id || l.locomotive_id}</div>
                <div class="meta">Пробег: ${l.pct}% до ТО</div>
                <div class="progress"><div class="progress-fill" style="width:${l.pct}%"></div></div>
              </div>`).join("")
          : '<div class="empty">Всё в норме</div>'}
      </div>
    </div>
  `;
}

listenRecords("service_queue", (data) => {
  queueData = data.sort((a, b) =>
    (b.priority === "high") - (a.priority === "high") ||
    (a.timestamp || 0) - (b.timestamp || 0));
  renderHud();
});

listenRecords("locomotives_telemetry", (data) => {
  locoData = data;
  renderHud();
});

renderHud();
