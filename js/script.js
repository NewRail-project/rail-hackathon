/* =====================================================
   ОБНОВЛЕНИЕ 2026-10 — Диагностика / Паспорт / Обзор
   ===================================================== */

/* --- Статус "нет данных" --- */
.badge.nodata {
  background: rgba(138,155,176,.15);
  color: var(--text-dim);
}

/* --- Кликабельные stat --- */
.stat.clickable {
  cursor: pointer;
  transition: all .2s;
}
.stat.clickable:hover {
  border-color: var(--kz8-blue-bright);
  transform: translateY(-2px);
}

/* --- Лента событий (Обзор) --- */
.events {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.event {
  display: flex;
  gap: 12px;
  padding: 10px 12px;
  background: var(--panel-2);
  border-left: 3px solid var(--border);
  border-radius: 6px;
  font-size: 13px;
}
.event .time {
  color: var(--text-dim);
  min-width: 48px;
  font-variant-numeric: tabular-nums;
}
.event.info    { border-left-color: var(--kz8-blue-bright); }
.event.warning { border-left-color: var(--kz8-yellow); }
.event.danger  { border-left-color: var(--danger); }
.event.success { border-left-color: var(--success); }

/* --- Парк: карточки локомотивов --- */
.loco-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.loco-card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  transition: all .2s;
  cursor: pointer;
}
.loco-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 3px; height: 100%;
  background: var(--kz8-yellow);
}
.loco-card.ok::before       { background: var(--success); }
.loco-card.warning::before  { background: var(--kz8-yellow); }
.loco-card.critical::before { background: var(--danger); }
.loco-card.nodata::before   { background: var(--text-dim); }
.loco-card:hover {
  transform: translateY(-2px);
  border-color: var(--kz8-blue-bright);
  box-shadow: 0 4px 24px rgba(42,127,212,.2);
}
.loco-card .num {
  font-size: 18px;
  font-weight: 700;
  color: var(--kz8-blue-bright);
  margin-bottom: 4px;
}
.loco-card .meta {
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 12px;
}
.loco-card .mileage {
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 8px;
}

/* --- Карточка локомотива: шапка паспорта --- */
.passport {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}
.passport .head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.passport h2 {
  font-size: 22px;
  color: var(--text);
  margin-bottom: 6px;
}
.passport .props {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--text-dim);
}
.passport .props b { color: var(--text); font-weight: 500; }

/* --- Табы внутри карточки --- */
.tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.tab {
  padding: 10px 16px;
  font-size: 13px;
  color: var(--text-dim);
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  text-transform: uppercase;
  letter-spacing: .5px;
}
.tab:hover { color: var(--text); }
.tab.active {
  color: var(--kz8-yellow);
  border-bottom-color: var(--kz8-yellow);
}

/* --- Timeline --- */
.timeline {
  position: relative;
  padding-left: 24px;
  margin-top: 12px;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 7px; top: 0; bottom: 0;
  width: 2px;
  background: var(--border);
}
.timeline .item {
  position: relative;
  padding: 8px 0 16px 0;
  font-size: 13px;
}
.timeline .item::before {
  content: '';
  position: absolute;
  left: -22px; top: 12px;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--kz8-blue-bright);
  box-shadow: 0 0 0 3px var(--bg);
}
.timeline .item.warning::before { background: var(--kz8-yellow); }
.timeline .item.danger::before  { background: var(--danger); }
.timeline .item.success::before { background: var(--success); }
.timeline .date {
  font-size: 11px;
  color: var(--text-dim);
  margin-bottom: 2px;
}

/* --- Trend chart (простой SVG) --- */
.trend {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
}
.trend svg { width: 100%; height: 120px; display: block; }
.trend .legend {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 6px;
}

/* --- Панель QR --- */
.qr-panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}
.qr-panel #qr {
  display: inline-block;
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  margin: 16px 0;
}
