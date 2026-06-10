'use client'

import { useState, useEffect } from 'react'
import { MOCK_ALERTS, MockAlert } from '@/data/mock'
import { PinIcon } from './icons/NavIcons'

const SEV_COLOR: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
}
const SEV_LABEL: Record<string, string> = {
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Médio',
  low: 'Baixo',
}

/* Silhueta simplificada do Brasil (lon/lat → x=(lon+74.5)*10, y=(6-lat)*10) */
const BRAZIL_PATH =
  'M46,54 L74,38 L111,35 L145,8 L180,41 L227,16 L235,60 L260,67 L302,82 L327,89 ' +
  'L360,97 L395,115 L397,135 L375,170 L360,190 L355,235 L345,265 L310,290 L280,300 ' +
  'L260,315 L259,345 L245,365 L225,382 L211,397 L169,362 L188,334 L199,315 L202,300 ' +
  'L169,282 L167,267 L170,240 L143,223 L140,198 L92,175 L40,170 L7,133 L45,103 Z'

/* Posição geográfica aproximada de cada alerta no mapa */
const ALERT_POS: Record<string, { x: number; y: number }> = {
  a1: { x: 190, y: 170 }, // Norte do Mato Grosso
  a2: { x: 290, y: 272 }, // Corredor SE — MG/SP
  a3: { x: 280, y: 301 }, // Porto de Santos
  a4: { x: 348, y: 222 }, // Sul da Bahia
  a5: { x: 262, y: 248 }, // Triângulo Mineiro
}

export default function BrazilAlertMap({ onAction }: { onAction: (id: string) => void }) {
  const [selectedId, setSelectedId] = useState<string>(MOCK_ALERTS[0].id)
  const [userPicked, setUserPicked] = useState(false)
  const [executed, setExecuted] = useState<Set<string>>(new Set())

  // Ciclo automático pelos alertas até o usuário interagir
  useEffect(() => {
    if (userPicked) return
    const id = setInterval(() => {
      setSelectedId((prev) => {
        const i = MOCK_ALERTS.findIndex((a) => a.id === prev)
        return MOCK_ALERTS[(i + 1) % MOCK_ALERTS.length].id
      })
    }, 6500)
    return () => clearInterval(id)
  }, [userPicked])

  const selected = MOCK_ALERTS.find((a) => a.id === selectedId) as MockAlert
  const selPos = ALERT_POS[selectedId]
  const selColor = SEV_COLOR[selected.severity]
  const isExecuted = executed.has(selectedId)

  const sevCounts = MOCK_ALERTS.reduce<Record<string, number>>((acc, a) => {
    acc[a.severity] = (acc[a.severity] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="alert-map-layout">
      {/* ── Mapa tático ── */}
      <div className="viz-frame">
        <svg viewBox="0 0 405 412" style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="Mapa tático de alertas no Brasil">
          <defs>
            <pattern id="tacGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28,0 L0,0 0,28" fill="none" stroke="rgba(0,212,255,0.05)" strokeWidth="0.6" />
            </pattern>
            <linearGradient id="sweepTac" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(0,212,255,0.25)" />
              <stop offset="100%" stopColor="rgba(0,212,255,0)" />
            </linearGradient>
            <filter id="countryGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <clipPath id="brClip"><path d={BRAZIL_PATH} /></clipPath>
          </defs>

          {/* Grade de fundo */}
          <rect x="0" y="0" width="405" height="412" fill="url(#tacGrid)" />

          {/* País */}
          <path d={BRAZIL_PATH} fill="rgba(0,85,204,0.13)" stroke="rgba(0,212,255,0.45)" strokeWidth="1.4" filter="url(#countryGlow)" strokeLinejoin="round" />

          {/* Linhas internas estilizadas (graticule clipado) */}
          <g clipPath="url(#brClip)" stroke="rgba(0,212,255,0.08)" strokeWidth="0.7">
            {[80, 140, 200, 260, 320].map((y) => <line key={`h${y}`} x1="0" y1={y} x2="405" y2={y} />)}
            {[80, 150, 220, 290, 360].map((x) => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="412" />)}
          </g>

          {/* Varredura de radar */}
          <g opacity="0.16">
            <path d="M205,205 L390,205 A185,185 0 0 1 348,330 Z" fill="url(#sweepTac)">
              <animateTransform attributeName="transform" type="rotate" from="0 205 205" to="360 205 205" dur="11s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Linha conectando marcador selecionado ao canto do painel */}
          {selPos && (
            <line x1={selPos.x} y1={selPos.y} x2="402" y2="30" stroke={selColor} strokeWidth="0.8" strokeDasharray="3 4" opacity="0.5" className="beam-flow" />
          )}

          {/* Marcadores de alerta */}
          {MOCK_ALERTS.map((a) => {
            const pos = ALERT_POS[a.id]
            const c = SEV_COLOR[a.severity]
            const isSel = a.id === selectedId
            return (
              <g
                key={a.id}
                className="map-marker"
                onClick={() => { setSelectedId(a.id); setUserPicked(true) }}
                role="button"
                aria-label={`Alerta: ${a.title}`}
              >
                {/* Área de toque generosa */}
                <circle cx={pos.x} cy={pos.y} r="16" fill="transparent" />
                {/* Anel pulsante */}
                <circle cx={pos.x} cy={pos.y} fill="none" stroke={c} strokeWidth="1.2">
                  <animate attributeName="r" values="4;16" dur={a.severity === 'critical' ? '1.2s' : '2s'} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur={a.severity === 'critical' ? '1.2s' : '2s'} repeatCount="indefinite" />
                </circle>
                <circle cx={pos.x} cy={pos.y} r="6.5" fill={`${c}22`} stroke={c} strokeWidth="1" />
                <circle cx={pos.x} cy={pos.y} r="2.6" fill={c} />
                {/* Retícula no selecionado */}
                {isSel && (
                  <g stroke="#ffffff" strokeWidth="1.1" opacity="0.9">
                    <path d={`M${pos.x - 13},${pos.y - 7} v-6 h6 M${pos.x + 13},${pos.y - 7} v-6 h-6 M${pos.x - 13},${pos.y + 7} v6 h6 M${pos.x + 13},${pos.y + 7} v6 h-6`} fill="none" />
                  </g>
                )}
              </g>
            )
          })}

          {/* Rótulo do selecionado */}
          {selPos && (
            <g fontFamily="monospace" fontSize="8.5">
              <text x={selPos.x + 18} y={selPos.y - 8} fill={selColor} fontWeight="700">{selected.region.toUpperCase()}</text>
              <text x={selPos.x + 18} y={selPos.y + 3} fill="rgba(148,163,184,0.9)">SCORE {selected.correlationScore}% · {selected.timestamp}</text>
            </g>
          )}
        </svg>

        {/* HUD */}
        <div className="globe-hud globe-hud-tl hud-flicker">
          <div className="globe-hud-title">TEATRO DE OPERAÇÕES — BRASIL</div>
          <div>{MOCK_ALERTS.length} ALERTAS GEORREFERENCIADOS</div>
          <div>
            {(['critical', 'high', 'medium', 'low'] as const).map((s) => (
              sevCounts[s] ? <span key={s} style={{ color: SEV_COLOR[s], marginRight: 8 }}>{SEV_LABEL[s].toUpperCase()} {sevCounts[s]}</span> : null
            ))}
          </div>
        </div>
        <div className="globe-hud globe-hud-br hud-flicker">SAT-LINK ▸ GOES-16 · SENTINEL-2A</div>
        <span className="globe-hud-corner globe-hud-corner-tl" aria-hidden="true" />
        <span className="globe-hud-corner globe-hud-corner-tr" aria-hidden="true" />
        <span className="globe-hud-corner globe-hud-corner-bl" aria-hidden="true" />
        <span className="globe-hud-corner globe-hud-corner-br" aria-hidden="true" />
      </div>

      {/* ── Painel de detalhe ── */}
      <div className="glass-card" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', borderColor: `${selColor}44` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span className="alert-center-severity" style={{ background: `${selColor}20`, color: selColor }}>
            {SEV_LABEL[selected.severity]}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{selected.timestamp} UTC-3</span>
        </div>

        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6, lineHeight: 1.3 }}>{selected.title}</h3>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
          <PinIcon size={11} />
          {selected.region}
        </div>

        <div className="modal-section-label">Fatores de Correlação</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {selected.factors.slice(0, 4).map((f, i) => (
            <div key={f} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden', marginBottom: 3 }}>
                <div style={{ height: '100%', width: `${78 - i * 9}%`, background: selColor, borderRadius: 2, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
              </div>
              {f}
            </div>
          ))}
        </div>

        <div className="modal-section-label">Recomendação IA</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, padding: '10px 14px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 8, marginBottom: 16 }}>
          {selected.recommendation}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Score: <strong style={{ color: selColor }}>{selected.correlationScore}%</strong>
          </span>
          <button
            className="alert-action-btn"
            style={isExecuted
              ? { background: '#22c55e22', color: '#22c55e', borderColor: '#22c55e44', padding: '8px 18px' }
              : { borderColor: `${selColor}55`, color: selColor, padding: '8px 18px' }}
            disabled={isExecuted}
            onClick={() => {
              setExecuted((prev) => new Set(prev).add(selectedId))
              onAction(selectedId)
            }}
          >
            {isExecuted ? '✓ Workflow Executado' : 'Executar Ação'}
          </button>
        </div>
      </div>
    </div>
  )
}
