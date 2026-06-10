'use client'

import { useState, useEffect } from 'react'

/* Vista orbital com IMAGEM DE SATÉLITE REAL (Esri World Imagery — mesma classe
   de imagem do Google Maps) do polo agrícola de Cristalina-GO, região com a
   maior concentração de pivôs centrais do Brasil. Overlays de análise NDVI,
   hotspots de risco e sensores IoT em realidade aumentada por cima. */

const TILE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/12'
// Mosaico 3×2 (z=12): colunas 1506–1508, linhas 2236–2237 → 768×512 px
const TILE_COLS = [1506, 1507, 1508]
const TILE_ROWS = [2236, 2237]

/* Círculos de análise NDVI posicionados sobre pivôs reais da imagem */
const ANALYSIS_ZONES = [
  { id: 'z1', cx: 190, cy: 84,  r: 36, ndvi: 0.74 },
  { id: 'z2', cx: 318, cy: 92,  r: 30, ndvi: 0.69 },
  { id: 'z3', cx: 346, cy: 204, r: 34, ndvi: 0.42 },
  { id: 'z4', cx: 660, cy: 318, r: 40, ndvi: 0.66 },
  { id: 'z5', cx: 70,  cy: 410, r: 38, ndvi: 0.31 },
  { id: 'z6', cx: 455, cy: 405, r: 30, ndvi: 0.55 },
]

function ndviColor(v: number): string {
  if (v >= 0.65) return '#22c55e'
  if (v >= 0.45) return '#84cc16'
  if (v >= 0.35) return '#eab308'
  if (v >= 0.25) return '#f97316'
  return '#ef4444'
}

interface Hotspot {
  id: string
  x: number
  y: number
  severity: 'critical' | 'high' | 'medium'
  title: string
  desc: string
  action: string
}

const HOTSPOTS: Hotspot[] = [
  { id: 'h1', x: 70,  y: 410, severity: 'critical', title: 'Déficit hídrico severo', desc: 'Pivô com NDVI 0.31 em queda há 6 dias. Umidade do solo em 28% (limite: 38%). Correlação com anomalia térmica orbital +3.2°C.', action: 'Acionar irrigação de emergência' },
  { id: 'h2', x: 346, y: 204, severity: 'high', title: 'Estresse vegetativo', desc: 'NDVI 0.42 abaixo da média dos pivôs vizinhos (0.70). Padrão espectral compatível com início de infestação fúngica.', action: 'Despachar drone de inspeção' },
  { id: 'h3', x: 560, y: 120, severity: 'medium', title: 'Solo exposto — janela de plantio', desc: 'Talhões em pousio detectados. Umidade adequada para plantio nos próximos 9 dias segundo previsão correlacionada.', action: 'Gerar plano de plantio' },
]

const SEV_COLOR: Record<string, string> = { critical: '#ef4444', high: '#f97316', medium: '#f59e0b' }
const SEV_LABEL: Record<string, string> = { critical: 'Crítico', high: 'Alto', medium: 'Médio' }

const SENSOR_PINS = [
  { id: 'sp1', x: 120, y: 200, label: 'UMID',  base: 34,   unit: '%',    color: '#f59e0b' },
  { id: 'sp2', x: 290, y: 430, label: 'FLUXO', base: 18.4, unit: 'm³/h', color: '#ef4444' },
  { id: 'sp3', x: 620, y: 70,  label: 'TEMP',  base: 31.2, unit: '°C',   color: '#f59e0b' },
  { id: 'sp4', x: 700, y: 430, label: 'PRESS', base: 2.1,  unit: 'bar',  color: '#22c55e' },
]

/* Setores monitorados (bounding boxes estilo visão computacional) */
const SECTORS = [
  { x: 40,  y: 30,  w: 330, h: 220, label: 'SETOR A — 14 PIVÔS' },
  { x: 390, y: 280, w: 340, h: 200, label: 'SETOR B — 9 PIVÔS' },
]

export default function FarmOrbitalView() {
  const [sensorJitter, setSensorJitter] = useState<number[]>([0, 0, 0, 0])
  const [pass, setPass] = useState(147)
  const [hotspot, setHotspot] = useState<Hotspot | null>(null)
  const [actioned, setActioned] = useState<Set<string>>(new Set())

  useEffect(() => {
    const id = setInterval(() => {
      setSensorJitter((prev) => prev.map(() => (Math.random() - 0.5) * 2))
      setPass((p) => p + 1)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="viz-frame">
      <svg viewBox="0 0 768 512" style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="Imagem de satélite real de polo agrícola com análise NDVI, pontos de risco e sensores IoT">
        <defs>
          <radialGradient id="farmVignette" cx="50%" cy="50%" r="72%">
            <stop offset="60%" stopColor="rgba(6,10,24,0)" />
            <stop offset="100%" stopColor="rgba(6,10,24,0.55)" />
          </radialGradient>
          <linearGradient id="scanGradH" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,212,255,0)" />
            <stop offset="70%" stopColor="rgba(0,212,255,0.10)" />
            <stop offset="100%" stopColor="rgba(0,212,255,0.35)" />
          </linearGradient>
          <pattern id="farmGrid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M64,0 L0,0 0,64" fill="none" stroke="rgba(0,212,255,0.06)" strokeWidth="0.7" />
          </pattern>
        </defs>

        {/* Fallback escuro (visível apenas se os tiles não carregarem) */}
        <rect x="0" y="0" width="768" height="512" fill="#0a0f1e" />

        {/* Mosaico de imagem de satélite real */}
        {TILE_ROWS.map((row, ri) =>
          TILE_COLS.map((col, ci) => (
            <image
              key={`${row}-${col}`}
              href={`${TILE_URL}/${row}/${col}`}
              x={ci * 256}
              y={ri * 256}
              width="256"
              height="256"
              preserveAspectRatio="none"
            />
          ))
        )}

        {/* Integração com o tema: vinheta + grade sutil */}
        <rect x="0" y="0" width="768" height="512" fill="url(#farmVignette)" pointerEvents="none" />
        <rect x="0" y="0" width="768" height="512" fill="url(#farmGrid)" pointerEvents="none" />

        {/* Setores monitorados (bounding boxes de visão computacional) */}
        {SECTORS.map((s) => (
          <g key={s.label} pointerEvents="none">
            <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="1" strokeDasharray="6 6" rx="4" />
            {/* Cantos reforçados */}
            <path d={`M${s.x},${s.y + 14} v-14 h14 M${s.x + s.w},${s.y + 14} v-14 h-14 M${s.x},${s.y + s.h - 14} v14 h14 M${s.x + s.w},${s.y + s.h - 14} v14 h-14`} fill="none" stroke="rgba(0,212,255,0.8)" strokeWidth="1.6" />
            <rect x={s.x} y={s.y - 14} width={s.label.length * 5.6 + 12} height="13" rx="3" fill="rgba(6,10,24,0.8)" stroke="rgba(0,212,255,0.35)" strokeWidth="0.7" />
            <text x={s.x + 6} y={s.y - 4.5} fontSize="8" fontFamily="monospace" fill="#00d4ff" fontWeight="700">{s.label}</text>
          </g>
        ))}

        {/* Círculos de análise NDVI sobre pivôs reais */}
        {ANALYSIS_ZONES.map((z) => {
          const c = ndviColor(z.ndvi)
          return (
            <g key={z.id} pointerEvents="none">
              <circle cx={z.cx} cy={z.cy} r={z.r} fill={`${c}14`} stroke={c} strokeWidth="1.3" strokeDasharray="5 5">
                <animateTransform attributeName="transform" type="rotate" from={`0 ${z.cx} ${z.cy}`} to={`360 ${z.cx} ${z.cy}`} dur="26s" repeatCount="indefinite" />
              </circle>
              <g transform={`translate(${z.cx - 26}, ${z.cy + z.r + 4})`}>
                <rect width="52" height="14" rx="3" fill="rgba(6,10,24,0.85)" stroke={`${c}66`} strokeWidth="0.7" />
                <text x="26" y="10" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="700" fill={c}>NDVI {z.ndvi.toFixed(2)}</text>
              </g>
            </g>
          )
        })}

        {/* Sensores IoT */}
        {SENSOR_PINS.map((s, i) => {
          const value = +(s.base + sensorJitter[i] * (s.base > 10 ? 1 : 0.05)).toFixed(1)
          return (
            <g key={s.id} pointerEvents="none">
              <line x1={s.x} y1={s.y} x2={s.x} y2={s.y - 16} stroke={s.color} strokeWidth="1" opacity="0.8" />
              <circle cx={s.x} cy={s.y} r="3.5" fill={s.color}>
                <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx={s.x} cy={s.y} fill="none" stroke={s.color} strokeWidth="1">
                <animate attributeName="r" values="4;13" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <g transform={`translate(${s.x - 28}, ${s.y - 40})`}>
                <rect width="56" height="23" rx="4" fill="rgba(6,10,24,0.88)" stroke={`${s.color}77`} strokeWidth="0.8" />
                <text x="28" y="9.5" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="rgba(148,163,184,0.95)">{s.label}</text>
                <text x="28" y="19" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fontWeight="700" fill={s.color}>{value}{s.unit}</text>
              </g>
            </g>
          )
        })}

        {/* Hotspots de risco */}
        {HOTSPOTS.map((h) => {
          const c = SEV_COLOR[h.severity]
          const isSel = hotspot?.id === h.id
          return (
            <g key={h.id} className="map-marker" onClick={() => setHotspot(isSel ? null : h)} role="button" aria-label={`Risco: ${h.title}`}>
              <circle cx={h.x} cy={h.y} r="20" fill="transparent" />
              <circle cx={h.x} cy={h.y} fill="none" stroke={c} strokeWidth="1.6">
                <animate attributeName="r" values="6;24" dur={h.severity === 'critical' ? '1.1s' : '1.8s'} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur={h.severity === 'critical' ? '1.1s' : '1.8s'} repeatCount="indefinite" />
              </circle>
              <circle cx={h.x} cy={h.y} r="9" fill="rgba(6,10,24,0.55)" stroke={c} strokeWidth="1.4" />
              <path d={`M${h.x},${h.y - 5} L${h.x + 4.5},${h.y + 3.5} L${h.x - 4.5},${h.y + 3.5} Z`} fill={c} />
              {isSel && (
                <g stroke="#ffffff" strokeWidth="1.2" opacity="0.95">
                  <path d={`M${h.x - 17},${h.y - 10} v-7 h7 M${h.x + 17},${h.y - 10} v-7 h-7 M${h.x - 17},${h.y + 10} v7 h7 M${h.x + 17},${h.y + 10} v7 h-7`} fill="none" />
                </g>
              )}
            </g>
          )
        })}

        {/* Varredura de satélite */}
        <g className="scan-band" pointerEvents="none">
          <rect x="0" y="0" width="768" height="36" fill="url(#scanGradH)" />
          <line x1="0" y1="36" x2="768" y2="36" stroke="rgba(0,212,255,0.65)" strokeWidth="1.3" />
          <text x="754" y="28" textAnchor="end" fontSize="9" fontFamily="monospace" fill="rgba(0,212,255,0.85)" fontWeight="700">
            SENTINEL-2A ▸ VARREDURA
          </text>
        </g>
      </svg>

      {/* HUD */}
      <div className="globe-hud globe-hud-tl hud-flicker">
        <div className="globe-hud-title">POLO AGRÍCOLA — CRISTALINA, GO</div>
        <div>RES 38 m/px · LAT −16.31° LON −47.52°</div>
        <div>PASSAGEM #{pass} · {HOTSPOTS.length} RISCOS ATIVOS</div>
      </div>
      <div className="globe-hud globe-hud-br hud-flicker">NDVI MULTIESPECTRAL · BANDAS B04/B08</div>
      <div className="globe-hud" style={{ bottom: 6, left: 10, fontSize: 8, opacity: 0.55 }}>
        Imagens: Esri · Maxar · Earthstar Geographics
      </div>
      <span className="globe-hud-corner globe-hud-corner-tl" aria-hidden="true" />
      <span className="globe-hud-corner globe-hud-corner-tr" aria-hidden="true" />
      <span className="globe-hud-corner globe-hud-corner-bl" aria-hidden="true" />
      <span className="globe-hud-corner globe-hud-corner-br" aria-hidden="true" />

      {/* Painel do hotspot selecionado */}
      {hotspot && (
        <div className="hotspot-panel glass-card" style={{ borderColor: `${SEV_COLOR[hotspot.severity]}55` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="alert-center-severity" style={{ background: `${SEV_COLOR[hotspot.severity]}20`, color: SEV_COLOR[hotspot.severity] }}>
              {SEV_LABEL[hotspot.severity]}
            </span>
            <strong style={{ fontSize: 12 }}>{hotspot.title}</strong>
            <button
              onClick={() => setHotspot(null)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12, padding: 2 }}
              aria-label="Fechar"
            >✕</button>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10, fontSize: 11.5 }}>{hotspot.desc}</p>
          <button
            className="alert-action-btn"
            style={actioned.has(hotspot.id)
              ? { background: '#22c55e22', color: '#22c55e', borderColor: '#22c55e44', width: '100%' }
              : { borderColor: `${SEV_COLOR[hotspot.severity]}55`, color: SEV_COLOR[hotspot.severity], width: '100%' }}
            disabled={actioned.has(hotspot.id)}
            onClick={() => setActioned((prev) => new Set(prev).add(hotspot.id))}
          >
            {actioned.has(hotspot.id) ? '✓ Ação registrada' : hotspot.action}
          </button>
        </div>
      )}
    </div>
  )
}
