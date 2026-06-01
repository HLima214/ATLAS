import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Clock,
  Eye,
  Flame,
  MapPin,
  Radio,
  Satellite,
  Shield,
  ThermometerSun,
  TrendingDown,
  TrendingUp,
  Waves,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";

const regionsData = [
  { id: 1, name: "Serra Gaucha", state: "RS", riskScore: 68, riskType: "Enchente", trend: "increasing", grid: [1, 5, 2, 1] },
  { id: 2, name: "Vale do Itajai", state: "SC", riskScore: 91, riskType: "Deslizamento", trend: "increasing", grid: [3, 5, 2, 1] },
  { id: 3, name: "Litoral Norte", state: "SP", riskScore: 74, riskType: "Enchente", trend: "stable", grid: [5, 4, 2, 1] },
  { id: 4, name: "Regiao Serrana", state: "RJ", riskScore: 87, riskType: "Deslizamento", trend: "increasing", grid: [7, 4, 2, 1] },
  { id: 5, name: "Baixada Fluminense", state: "RJ", riskScore: 61, riskType: "Enchente", trend: "stable", grid: [9, 4, 2, 1] },
  { id: 6, name: "Vale do Ribeira", state: "SP", riskScore: 45, riskType: "Enchente", trend: "decreasing", grid: [4, 5, 2, 1] },
  { id: 7, name: "Triangulo Mineiro", state: "MG", riskScore: 33, riskType: "Seca", trend: "stable", grid: [4, 3, 2, 1] },
  { id: 8, name: "Norte de MG", state: "MG", riskScore: 55, riskType: "Seca", trend: "increasing", grid: [6, 3, 2, 1] },
  { id: 9, name: "Pantanal Norte", state: "MT", riskScore: 71, riskType: "Queimada", trend: "increasing", grid: [2, 2, 2, 1] },
  { id: 10, name: "Chapada Diamantina", state: "BA", riskScore: 52, riskType: "Seca", trend: "stable", grid: [8, 2, 2, 1] },
  { id: 11, name: "Zona da Mata", state: "PE", riskScore: 29, riskType: "Deslizamento", trend: "decreasing", grid: [10, 1, 2, 1] },
  { id: 12, name: "Regiao Amazonica", state: "AM", riskScore: 48, riskType: "Queimada", trend: "stable", grid: [1, 1, 2, 1] },
  { id: 13, name: "Sul do Para", state: "PA", riskScore: 66, riskType: "Queimada", trend: "increasing", grid: [3, 1, 2, 1] },
  { id: 14, name: "Cerrado Baiano", state: "BA", riskScore: 41, riskType: "Queimada", trend: "stable", grid: [6, 2, 2, 1] },
  { id: 15, name: "Serra Catarinense", state: "SC", riskScore: 38, riskType: "Deslizamento", trend: "decreasing", grid: [5, 5, 2, 1] },
  { id: 16, name: "Baixo Acre", state: "AC", riskScore: 57, riskType: "Queimada", trend: "increasing", grid: [0, 2, 2, 1] },
  { id: 17, name: "Rondonia Central", state: "RO", riskScore: 63, riskType: "Queimada", trend: "stable", grid: [1, 3, 2, 1] },
  { id: 18, name: "Ilha de Marajo", state: "PA", riskScore: 44, riskType: "Enchente", trend: "increasing", grid: [5, 0, 2, 1] },
  { id: 19, name: "Sertao do Araripe", state: "CE", riskScore: 49, riskType: "Seca", trend: "stable", grid: [8, 1, 2, 1] },
  { id: 20, name: "Agreste Alagoano", state: "AL", riskScore: 36, riskType: "Seca", trend: "decreasing", grid: [11, 2, 2, 1] },
  { id: 21, name: "Mata Sul", state: "PE", riskScore: 58, riskType: "Enchente", trend: "increasing", grid: [10, 2, 2, 1] },
  { id: 22, name: "Grande Vitoria", state: "ES", riskScore: 64, riskType: "Deslizamento", trend: "stable", grid: [9, 3, 2, 1] },
  { id: 23, name: "Costa Verde", state: "RJ", riskScore: 78, riskType: "Deslizamento", trend: "increasing", grid: [7, 5, 2, 1] },
  { id: 24, name: "Oeste Catarinense", state: "SC", riskScore: 42, riskType: "Enchente", trend: "stable", grid: [2, 6, 2, 1] },
  { id: 25, name: "Campanha Gaucha", state: "RS", riskScore: 27, riskType: "Seca", trend: "decreasing", grid: [4, 6, 2, 1] },
];

const activeAlerts = [
  { id: 1, region: "Blumenau", state: "SC", type: "Deslizamento", severity: "critical", riskScore: 91, minutesAgo: 23, delivery: { app: true, sms: true, lora: true } },
  { id: 2, region: "Petropolis", state: "RJ", type: "Deslizamento", severity: "critical", riskScore: 87, minutesAgo: 41, delivery: { app: true, sms: true, lora: false } },
  { id: 3, region: "Litoral Norte", state: "SP", type: "Enchente", severity: "high", riskScore: 74, minutesAgo: 68, delivery: { app: true, sms: false, lora: true } },
  { id: 4, region: "Pantanal Norte", state: "MT", type: "Queimada", severity: "high", riskScore: 71, minutesAgo: 95, delivery: { app: true, sms: true, lora: false } },
  { id: 5, region: "Serra Gaucha", state: "RS", type: "Enchente", severity: "high", riskScore: 68, minutesAgo: 142, delivery: { app: true, sms: false, lora: false } },
  { id: 6, region: "Chapada Diamantina", state: "BA", type: "Seca", severity: "moderate", riskScore: 52, minutesAgo: 310, delivery: { app: true, sms: true, lora: false } },
];

const metricCards = [
  { label: "Municipios monitorados", value: "127", icon: MapPin },
  { label: "Alertas nas ultimas 24h", value: "14", icon: AlertTriangle },
  { label: "Antecipacao media", value: "61h", icon: Clock },
  { label: "Comunidades off-grid", value: "48", icon: Radio },
  { label: "Sensores IoT ativos", value: "1.247", icon: Activity },
];

const dataSources = [
  { source: "Sentinel-2 (ESA)", type: "Optico", update: "2h atras", status: "Ativo" },
  { source: "Sentinel-1 (ESA)", type: "SAR", update: "4h atras", status: "Ativo" },
  { source: "NOAA GOES-16", type: "Termico", update: "Tempo real", status: "Ativo" },
  { source: "IoT Ground Sensors", type: "Solo", update: "Tempo real", status: "1.247 ativos" },
  { source: "INMET", type: "Meteorologico", update: "Tempo real", status: "Ativo" },
];

const riskFilters = ["Todos", "Queimada", "Deslizamento", "Enchente", "Seca"];

const styles = `
:root {
  color-scheme: dark;
  --bg: #07111f;
  --panel: #0d1b2a;
  --panel-2: #0a1725;
  --line: rgba(136, 135, 128, 0.24);
  --text: #e7ecef;
  --muted: #888780;
  --teal: #1d9e75;
  --amber: #ef9f27;
  --red: #e24b4a;
  --green: #639922;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 16px;
  background:
    linear-gradient(rgba(29, 158, 117, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(29, 158, 117, 0.035) 1px, transparent 1px),
    var(--bg);
  background-size: 44px 44px;
}

.topbar {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto minmax(260px, auto);
  gap: 16px;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(13, 27, 42, 0.92);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(29, 158, 117, 0.58);
  border-radius: 8px;
  color: var(--teal);
  background: rgba(29, 158, 117, 0.08);
}

.brand h1 {
  margin: 0;
  font-size: 24px;
  line-height: 1;
  font-weight: 800;
}

.tagline {
  margin-top: 4px;
  color: var(--muted);
  font-size: 12px;
}

.satellite-strip,
.status-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.badge,
.status-pill,
.severity,
.delivery-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--line);
  border-radius: 999px;
  min-height: 28px;
  padding: 5px 9px;
  color: var(--text);
  background: rgba(7, 17, 31, 0.74);
  font-size: 12px;
}

.mono,
.badge,
.status-pill,
.delivery-pill,
.map-label,
.briefing-paper {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--teal);
}

.status-strip {
  justify-content: flex-end;
}

.status-pill.operational {
  border-color: rgba(29, 158, 117, 0.44);
  color: #c8f3e5;
}

.status-pill.time {
  color: #d8dbd5;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(150px, 1fr));
  gap: 12px;
  margin: 14px 0;
}

.metric-card,
.panel {
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(13, 27, 42, 0.92);
}

.metric-card {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 10px;
  align-items: center;
  min-height: 78px;
  padding: 12px;
}

.metric-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(29, 158, 117, 0.24);
  border-radius: 6px;
  color: var(--teal);
  background: rgba(29, 158, 117, 0.06);
}

.metric-value {
  font-size: 24px;
  font-weight: 750;
}

.metric-label {
  margin-top: 2px;
  color: var(--muted);
  font-size: 12px;
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(520px, 1.5fr) minmax(360px, 1fr);
  gap: 14px;
  align-items: start;
}

.stack {
  display: grid;
  gap: 14px;
}

.panel {
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 54px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--line);
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  font-size: 14px;
  font-weight: 760;
}

.panel-title svg {
  color: var(--teal);
}

.risk-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.risk-tab,
.icon-button,
.briefing-button,
.close-button {
  border: 1px solid var(--line);
  border-radius: 6px;
  color: var(--text);
  background: rgba(7, 17, 31, 0.65);
  cursor: pointer;
}

.risk-tab {
  min-height: 30px;
  padding: 5px 9px;
  font-size: 12px;
}

.risk-tab.active {
  border-color: rgba(29, 158, 117, 0.62);
  background: rgba(29, 158, 117, 0.12);
  color: #d8fbef;
}

.map-wrap {
  position: relative;
  padding: 14px;
}

.map-frame {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(136, 135, 128, 0.2);
  border-radius: 8px;
  background: #091625;
}

.scanline {
  position: absolute;
  left: 0;
  right: 0;
  top: -8%;
  height: 2px;
  background: #1d9e75;
  box-shadow: 0 0 18px rgba(29, 158, 117, 0.32);
  opacity: 0.38;
  animation: orbital-scan 5.8s linear infinite;
  pointer-events: none;
}

@keyframes orbital-scan {
  0% { transform: translateY(0); }
  100% { transform: translateY(560px); }
}

.risk-map {
  display: block;
  width: 100%;
  height: auto;
  min-height: 430px;
}

.risk-cell {
  cursor: pointer;
  transition: opacity 160ms ease, stroke-width 160ms ease, filter 160ms ease;
}

.risk-cell:hover {
  filter: brightness(1.13);
}

.risk-cell.dimmed {
  opacity: 0.18;
}

.map-label {
  pointer-events: none;
  fill: #f1f5f2;
  font-size: 10px;
  font-weight: 700;
}

.map-score {
  pointer-events: none;
  fill: rgba(241, 245, 242, 0.78);
  font-size: 10px;
}

.map-tooltip {
  position: fixed;
  z-index: 20;
  width: 210px;
  padding: 10px;
  border: 1px solid rgba(29, 158, 117, 0.36);
  border-radius: 6px;
  background: rgba(7, 17, 31, 0.96);
  color: var(--text);
  pointer-events: none;
}

.tooltip-name {
  font-weight: 760;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 6px;
  color: var(--muted);
  font-size: 12px;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding-top: 12px;
  color: var(--muted);
  font-size: 12px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.swatch {
  width: 12px;
  height: 12px;
  border: 1px solid rgba(231, 236, 239, 0.2);
  border-radius: 3px;
}

.prediction-body {
  min-height: 302px;
  padding: 14px;
}

.chart-box {
  width: 100%;
  height: 216px;
}

.empty-prompt {
  display: grid;
  place-items: center;
  min-height: 260px;
  border: 1px dashed rgba(136, 135, 128, 0.24);
  border-radius: 8px;
  color: var(--muted);
  text-align: center;
}

.peak-row,
.region-detail-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.signal-box {
  min-height: 58px;
  padding: 10px;
  border: 1px solid rgba(136, 135, 128, 0.18);
  border-radius: 6px;
  background: rgba(7, 17, 31, 0.5);
}

.signal-label {
  color: var(--muted);
  font-size: 11px;
}

.signal-value {
  margin-top: 5px;
  font-size: 16px;
  font-weight: 750;
}

.alerts-list {
  display: grid;
  gap: 8px;
  padding: 12px;
}

.alert-item {
  display: grid;
  grid-template-columns: 34px 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border: 1px solid rgba(136, 135, 128, 0.18);
  border-radius: 8px;
  background: rgba(7, 17, 31, 0.45);
}

.alert-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--line);
  border-radius: 6px;
}

.alert-main {
  min-width: 0;
}

.alert-topline,
.alert-meta,
.delivery {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
}

.alert-place {
  font-weight: 760;
}

.alert-meta {
  margin-top: 5px;
  color: var(--muted);
  font-size: 12px;
}

.delivery {
  margin-top: 8px;
}

.delivery-pill {
  min-height: 24px;
  padding: 3px 7px;
  color: #cdd3d1;
}

.delivery-pill.ok {
  border-color: rgba(29, 158, 117, 0.42);
  color: #c8f3e5;
}

.delivery-pill.fail {
  border-color: rgba(136, 135, 128, 0.2);
  color: #777a76;
}

.briefing-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 34px;
  padding: 7px 10px;
  white-space: nowrap;
}

.briefing-button:hover,
.close-button:hover,
.risk-tab:hover {
  border-color: rgba(29, 158, 117, 0.5);
}

.severity {
  min-height: 24px;
  padding: 3px 7px;
  font-size: 11px;
  text-transform: uppercase;
}

.severity.critical {
  border-color: rgba(226, 75, 74, 0.5);
  color: #ffd7d7;
  background: rgba(226, 75, 74, 0.11);
}

.severity.high {
  border-color: rgba(239, 159, 39, 0.46);
  color: #ffe2b8;
  background: rgba(239, 159, 39, 0.1);
}

.severity.moderate {
  border-color: rgba(239, 159, 39, 0.32);
  color: #f4dcae;
}

.sources-table {
  width: 100%;
  border-collapse: collapse;
}

.sources-table th,
.sources-table td {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(136, 135, 128, 0.16);
  text-align: left;
  font-size: 12px;
}

.sources-table th {
  color: var(--muted);
  font-weight: 600;
}

.sources-table tr:last-child td {
  border-bottom: 0;
}

.source-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #c8f3e5;
}

.mini-trend {
  height: 72px;
  padding: 0 12px 10px;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(3, 8, 15, 0.72);
}

.modal-panel {
  width: min(860px, 100%);
  max-height: min(88vh, 820px);
  overflow: auto;
  border: 1px solid rgba(29, 158, 117, 0.28);
  border-radius: 8px;
  background: #0b1826;
}

.modal-head {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--line);
  background: rgba(11, 24, 38, 0.96);
}

.close-button {
  min-height: 34px;
  padding: 7px 11px;
}

.briefing-paper {
  margin: 0;
  padding: 18px;
  white-space: pre-wrap;
  color: #e8ece9;
  font-size: 13px;
  line-height: 1.62;
}

@media (max-width: 1180px) {
  .topbar,
  .main-grid {
    grid-template-columns: 1fr;
  }

  .status-strip,
  .satellite-strip {
    justify-content: flex-start;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }
}

@media (max-width: 680px) {
  .app-shell {
    padding: 10px;
  }

  .metrics-grid,
  .peak-row,
  .region-detail-grid {
    grid-template-columns: 1fr;
  }

  .panel-header,
  .alert-item {
    grid-template-columns: 1fr;
  }

  .panel-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .alert-item {
    display: grid;
  }

  .briefing-button {
    width: 100%;
    justify-content: center;
  }
}
`;

function getRiskLevel(score) {
  if (score >= 80) return { key: "critical", label: "Critico", color: "#E24B4A" };
  if (score >= 60) return { key: "high", label: "Alto", color: "#EF9F27" };
  if (score >= 40) return { key: "moderate", label: "Moderado", color: "#D5B043" };
  return { key: "low", label: "Baixo", color: "#639922" };
}

function getFilteredScore(region, filter) {
  if (filter === "Todos" || region.riskType === filter) return region.riskScore;
  return Math.max(12, Math.round(region.riskScore * 0.22));
}

function formatTimestamp(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function generatePrediction(region) {
  if (!region) return [];
  const peakHour = region.trend === "decreasing" ? 12 : region.trend === "stable" ? 36 : region.riskScore >= 80 ? 36 : 48;
  return [0, 12, 24, 36, 48, 60, 72].map((hour, index) => {
    const distance = Math.abs(hour - peakHour) / 12;
    const lift = region.trend === "decreasing" ? 4 : region.trend === "stable" ? 8 : 16;
    const peak = Math.min(98, region.riskScore + lift + (region.id % 4));
    const taper = distance * (region.trend === "increasing" ? 6 : 4);
    const earlyAdjustment = hour < peakHour ? -Math.max(0, 3 - index) * 2 : 0;
    return {
      hour,
      label: hour === 0 ? "Agora" : `+${hour}h`,
      riskScore: Math.max(8, Math.min(100, Math.round(peak - taper + earlyAdjustment))),
    };
  });
}

function typeIcon(type, size = 18) {
  const props = { size, strokeWidth: 1.8 };
  if (type === "Queimada") return <Flame {...props} />;
  if (type === "Enchente") return <Waves {...props} />;
  if (type === "Seca") return <ThermometerSun {...props} />;
  return <AlertTriangle {...props} />;
}

function severityLabel(severity) {
  return severity === "critical" ? "Critico" : severity === "high" ? "Alto" : "Moderado";
}

function buildBriefing(alert, timestamp) {
  const regionLine = alert.region === "Blumenau"
    ? "Vale do Itajai - Blumenau, SC"
    : `${alert.region}, ${alert.state}`;
  const sourceLine = alert.type === "Queimada"
    ? "Sentinel-2 (Optico) · NOAA GOES-16 · IoT Solo #BR-118"
    : alert.type === "Enchente"
      ? "Sentinel-1 (SAR) · INMET Radar · IoT Hidro #BR-092"
      : alert.type === "Seca"
        ? "Sentinel-2 (NDVI) · NOAA GOES-16 · INMET"
        : "Sentinel-1 (SAR) · NOAA GOES-16 · IoT Solo #SC-047";

  if (alert.region === "Blumenau") {
    return `ATLAS · BRIEFING OPERACIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Regiao        : ${regionLine}
Gerado em     : ${timestamp}
Fontes        : ${sourceLine}
Indice de Risco: ${alert.riskScore}/100 · CRITICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SITUACAO ATUAL
Monitoramento SAR identificou saturacao de solo acima de 87% na bacia
do Rio Itajai-Acu. Precipitacao acumulada nas ultimas 48h: 143mm
(340% acima da media historica). Sensor IoT #SC-047 reporta deslocamento
de 4,2mm na encosta monitorada em Alto da Serra.

RISCO PREVISTO
Probabilidade de deslizamento: 91% · Pico em 36h
Areas criticas: encostas com declividade > 30 graus nos setores
Alto da Serra, Progresso e Vila Nova.

ACOES RECOMENDADAS [PRIORIDADE: CRITICA]
1. Evacuar zonas de risco identificadas (~1.200 residentes)
2. Acionar Corpo de Bombeiros e equipes de busca e resgate
3. Fechar Rodovia SC-418 nos trechos km 34 ao km 51
4. Abrir abrigos de emergencia nos locais pre-definidos no PEC

CANAIS DE ALERTA ATIVADOS
✓ App ATLAS    · 847 dispositivos notificados
✓ SMS          · 1.203 numeros na area de risco
✓ LoRa #SC-014 · 34 sensores reportando ativamente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  const priority = alert.severity === "critical" ? "CRITICA" : alert.severity === "high" ? "ALTA" : "MODERADA";
  const probability = Math.min(96, alert.riskScore + 7);
  return `ATLAS · BRIEFING OPERACIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Regiao        : ${regionLine}
Gerado em     : ${timestamp}
Fontes        : ${sourceLine}
Indice de Risco: ${alert.riskScore}/100 · ${priority}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SITUACAO ATUAL
Fusao orbital e telemetria local indicam elevacao relevante do risco de
${alert.type.toLowerCase()} no municipio monitorado. A anomalia foi confirmada por
series temporais de satelite, leitura de sensores de solo e previsao meteorologica
regional para as proximas 72 horas.

RISCO PREVISTO
Probabilidade operacional estimada: ${probability}% · Pico entre 36h e 48h
Setores prioritarios: areas urbanas vulneraveis, vias de acesso secundarias
e comunidades com baixa redundancia de comunicacao.

ACOES RECOMENDADAS [PRIORIDADE: ${priority}]
1. Ativar sala municipal de crise e protocolo preventivo
2. Notificar liderancas comunitarias e unidades de saude
3. Posicionar equipes em pontos de resposta pre-mapeados
4. Atualizar rotas de evacuacao e zonas de abrigo

CANAIS DE ALERTA ATIVADOS
${alert.delivery.app ? "✓" : "×"} App ATLAS    · notificacao operacional emitida
${alert.delivery.sms ? "✓" : "×"} SMS          · base municipal sincronizada
${alert.delivery.lora ? "✓" : "×"} LoRa        · malha off-grid em acompanhamento
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

function Header({ timestamp, alertCount }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark"><Satellite size={21} /></div>
        <div>
          <h1>ATLAS</h1>
          <div className="tagline">Sistema Preditivo de Alertas Territoriais</div>
        </div>
      </div>
      <div className="satellite-strip" aria-label="Status dos satelites">
        {["SAR-1", "OPT-2", "THM-1"].map((satellite) => (
          <span className="badge" key={satellite}><span className="dot" />{satellite} · ATIVO</span>
        ))}
      </div>
      <div className="status-strip">
        <span className="status-pill time"><Clock size={14} />{formatTimestamp(timestamp)}</span>
        <span className="status-pill operational"><Shield size={14} />OPERACIONAL · {alertCount} alertas ativos</span>
      </div>
    </header>
  );
}

function MetricsBar() {
  return (
    <section className="metrics-grid" aria-label="Metricas rapidas">
      {metricCards.map(({ label, value, icon: Icon }) => (
        <div className="metric-card" key={label}>
          <div className="metric-icon"><Icon size={18} /></div>
          <div>
            <div className="metric-value mono">{value}</div>
            <div className="metric-label">{label}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

function RiskMap({ selectedRegion, onSelectRegion }) {
  const [riskFilter, setRiskFilter] = useState("Todos");
  const [hovered, setHovered] = useState(null);
  const mapRef = useRef(null);

  const handleMove = useCallback((event, region, score) => {
    setHovered({
      region,
      score,
      x: event.clientX + 14,
      y: event.clientY + 14,
    });
  }, []);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title"><MapPin size={18} />Mapa de Risco Territorial</h2>
        <div className="risk-tabs" aria-label="Filtro de tipo de risco">
          {riskFilters.map((filter) => (
            <button
              className={`risk-tab ${riskFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setRiskFilter(filter)}
              type="button"
            >
              {filter === "Queimada" ? "Queimadas" : filter === "Enchente" ? "Enchentes" : filter}
            </button>
          ))}
        </div>
      </div>
      <div className="map-wrap">
        <div className="map-frame" ref={mapRef}>
          <div className="scanline" />
          <svg className="risk-map" viewBox="0 0 760 470" role="img" aria-label="Grade operacional de risco no Brasil">
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(136,135,128,0.11)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="760" height="470" fill="url(#mapGrid)" />
            <path d="M72 66 C206 14 384 42 533 90 C647 128 705 222 678 322 C641 458 458 458 324 434 C184 409 78 354 48 244 C28 168 34 94 72 66Z" fill="rgba(29,158,117,0.025)" stroke="rgba(29,158,117,0.16)" />
            {regionsData.map((region) => {
              const [gx, gy, gw, gh] = region.grid;
              const x = 28 + gx * 54;
              const y = 28 + gy * 58;
              const w = gw * 50;
              const h = gh * 48;
              const score = getFilteredScore(region, riskFilter);
              const level = getRiskLevel(score);
              const dimmed = riskFilter !== "Todos" && region.riskType !== riskFilter;
              const selected = selectedRegion?.id === region.id;
              return (
                <g key={region.id}>
                  <rect
                    className={`risk-cell ${dimmed ? "dimmed" : ""}`}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx="6"
                    fill={level.color}
                    fillOpacity={dimmed ? 0.34 : 0.78}
                    stroke={selected ? "#F1F5F2" : "rgba(241,245,242,0.22)"}
                    strokeWidth={selected ? 3 : 1}
                    onClick={() => onSelectRegion(region)}
                    onMouseMove={(event) => handleMove(event, region, score)}
                    onMouseLeave={() => setHovered(null)}
                  />
                  <text className="map-label" x={x + 8} y={y + 19}>{region.state} · {region.name.slice(0, 16)}</text>
                  <text className="map-score mono" x={x + 8} y={y + 36}>{region.riskType} · {score}/100</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="legend">
          <span className="legend-item"><span className="swatch" style={{ background: "#639922" }} />Baixo 0-39</span>
          <span className="legend-item"><span className="swatch" style={{ background: "#D5B043" }} />Moderado 40-59</span>
          <span className="legend-item"><span className="swatch" style={{ background: "#EF9F27" }} />Alto 60-79</span>
          <span className="legend-item"><span className="swatch" style={{ background: "#E24B4A" }} />Critico 80-100</span>
        </div>
      </div>
      {hovered && (
        <div className="map-tooltip" style={{ left: hovered.x, top: hovered.y }}>
          <div className="tooltip-name">{hovered.region.name}, {hovered.region.state}</div>
          <div className="tooltip-row"><span>Risco atual</span><strong>{hovered.score}/100</strong></div>
          <div className="tooltip-row"><span>Tipo dominante</span><strong>{hovered.region.riskType}</strong></div>
          <div className="tooltip-row"><span>Tendencia</span><strong>{hovered.region.trend}</strong></div>
        </div>
      )}
    </section>
  );
}

function PredictionPanel({ region }) {
  const prediction = useMemo(() => generatePrediction(region), [region]);
  const peak = useMemo(() => prediction.reduce((best, point) => (point.riskScore > best.riskScore ? point : best), { riskScore: 0, label: "" }), [prediction]);
  const level = region ? getRiskLevel(region.riskScore) : null;

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title"><Activity size={18} />Predicao Temporal</h2>
        {region && <span className="badge">{region.state} · {region.riskType}</span>}
      </div>
      <div className="prediction-body">
        {!region ? (
          <div className="empty-prompt">
            <div>
              <MapPin size={26} />
              <p>Clique em uma regiao no mapa para ver a predicao</p>
            </div>
          </div>
        ) : (
          <>
            <div className="panel-title">Predicao de Risco - {region.name} - proximas 72h</div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prediction} margin={{ top: 12, right: 20, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="riskFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor={level.color} stopOpacity={0.5} />
                      <stop offset="95%" stopColor={level.color} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(136,135,128,0.16)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#888780", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#888780", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <ChartTooltip contentStyle={{ background: "#07111F", border: "1px solid rgba(136,135,128,0.28)", borderRadius: 6 }} />
                  <ReferenceLine y={70} stroke="#E24B4A" strokeDasharray="4 4" label={{ value: "Alto", fill: "#E24B4A", fontSize: 11 }} />
                  <ReferenceLine y={40} stroke="#EF9F27" strokeDasharray="4 4" label={{ value: "Moderado", fill: "#EF9F27", fontSize: 11 }} />
                  <Area type="monotone" dataKey="riskScore" stroke={level.color} strokeWidth={2} fill="url(#riskFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="peak-row">
              <div className="signal-box">
                <div className="signal-label">Pico previsto</div>
                <div className="signal-value mono">{peak.riskScore} · em {peak.label}</div>
              </div>
              <div className="signal-box">
                <div className="signal-label">Nivel atual</div>
                <div className="signal-value">{level.label}</div>
              </div>
              <div className="signal-box">
                <div className="signal-label">Tendencia</div>
                <div className="signal-value">{region.trend === "increasing" ? <TrendingUp size={16} /> : region.trend === "decreasing" ? <TrendingDown size={16} /> : <Activity size={16} />} {region.trend}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function AlertsPanel({ onOpenBriefing }) {
  const summary = activeAlerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title"><AlertTriangle size={18} />Alertas Ativos</h2>
        <span className="badge">{activeAlerts.length} alertas · {summary.critical} criticos · {summary.high} altos · {summary.moderate} moderado</span>
      </div>
      <div className="alerts-list">
        {activeAlerts.map((alert) => {
          const level = getRiskLevel(alert.riskScore);
          return (
            <article className="alert-item" key={alert.id}>
              <div className="alert-icon" style={{ color: level.color }}>{typeIcon(alert.type)}</div>
              <div className="alert-main">
                <div className="alert-topline">
                  <span className="alert-place">{alert.region}, {alert.state}</span>
                  <span className={`severity ${alert.severity}`}>{severityLabel(alert.severity)}</span>
                </div>
                <div className="alert-meta">
                  <span>{alert.type}</span>
                  <span className="mono">{alert.riskScore}/100</span>
                  <span>ha {alert.minutesAgo} min</span>
                </div>
                <div className="delivery">
                  <span className={`delivery-pill ${alert.delivery.app ? "ok" : "fail"}`}><Wifi size={13} />App {alert.delivery.app ? "✓" : "×"}</span>
                  <span className={`delivery-pill ${alert.delivery.sms ? "ok" : "fail"}`}><Zap size={13} />SMS {alert.delivery.sms ? "✓" : "×"}</span>
                  <span className={`delivery-pill ${alert.delivery.lora ? "ok" : "fail"}`}><Radio size={13} />LoRa {alert.delivery.lora ? "✓" : "×"}</span>
                </div>
              </div>
              <button className="briefing-button" type="button" onClick={() => onOpenBriefing(alert)}>
                <Eye size={16} />Ver Briefing IA →
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RegionDetails({ region }) {
  const data = region ? [
    { label: "Regiao selecionada", value: `${region.name}, ${region.state}` },
    { label: "Risco dominante", value: region.riskType },
    { label: "Indice atual", value: `${region.riskScore}/100` },
  ] : [
    { label: "Regiao selecionada", value: "Aguardando clique no mapa" },
    { label: "Risco dominante", value: "Todos os modelos ativos" },
    { label: "Indice atual", value: "Monitoramento continuo" },
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title"><Shield size={18} />Detalhes da Regiao</h2>
      </div>
      <div className="region-detail-grid" style={{ padding: 12, marginTop: 0 }}>
        {data.map((item) => (
          <div className="signal-box" key={item.label}>
            <div className="signal-label">{item.label}</div>
            <div className="signal-value">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DataSourcesPanel() {
  const miniSeries = [
    { t: "00", v: 46 }, { t: "06", v: 49 }, { t: "12", v: 53 }, { t: "18", v: 61 }, { t: "24", v: 58 }, { t: "30", v: 64 },
  ];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2 className="panel-title"><Satellite size={18} />Status das Fontes de Dados</h2>
        <span className="badge"><span className="dot" />Sincronizacao nominal</span>
      </div>
      <table className="sources-table">
        <thead>
          <tr>
            <th>Fonte</th>
            <th>Tipo</th>
            <th>Ultima atualizacao</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dataSources.map((source) => (
            <tr key={source.source}>
              <td>{source.source}</td>
              <td>{source.type}</td>
              <td className="mono">{source.update}</td>
              <td><span className="source-status"><span className="dot" />{source.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mini-trend">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={miniSeries} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
            <Line type="monotone" dataKey="v" stroke="#1D9E75" strokeWidth={2} dot={false} />
            <XAxis dataKey="t" hide />
            <YAxis hide domain={[35, 70]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function BriefingModal({ alert, timestamp, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!alert) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="presentation">
      <div className="modal-panel" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Briefing operacional ATLAS">
        <div className="modal-head">
          <h2 className="panel-title"><Satellite size={18} />ATLAS · Briefing IA</h2>
          <button className="close-button" type="button" ref={closeRef} onClick={onClose}>Fechar</button>
        </div>
        <pre className="briefing-paper">{buildBriefing(alert, formatTimestamp(timestamp))}</pre>
      </div>
    </div>
  );
}

export default function App() {
  const [timestamp, setTimestamp] = useState(() => new Date());
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [briefingAlert, setBriefingAlert] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimestamp(new Date());
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const closeBriefing = useCallback(() => setBriefingAlert(null), []);

  return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        <Header timestamp={timestamp} alertCount={activeAlerts.length} />
        <MetricsBar />
        <main className="main-grid">
          <div className="stack">
            <RiskMap selectedRegion={selectedRegion} onSelectRegion={setSelectedRegion} />
            <RegionDetails region={selectedRegion} />
          </div>
          <div className="stack">
            <PredictionPanel region={selectedRegion} />
            <AlertsPanel onOpenBriefing={setBriefingAlert} />
            <DataSourcesPanel />
          </div>
        </main>
      </div>
      <BriefingModal alert={briefingAlert} timestamp={timestamp} onClose={closeBriefing} />
    </>
  );
}
