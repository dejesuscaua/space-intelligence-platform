'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { SATELLITES } from '@/data/mock'
import Globe3D, { ORBIT_CLASSES, SAT_CONFIG, SWARM } from './Globe3D'

/* ──────────────────────────── Lista lateral (memoizada) ──────────────────────────── */

const SatList = memo(function SatList({
  selected,
  onSelect,
}: {
  selected: number | null
  onSelect: (idx: number | null) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {SATELLITES.map((sat, idx) => {
        const cfg = SAT_CONFIG.find((c) => c.satIdx === idx)
        const cls = cfg ? ORBIT_CLASSES[cfg.cls] : ORBIT_CLASSES[0]
        const isSelected = selected === idx
        return (
          <div
            key={sat.id}
            className={`glass-card sat-list-row${isSelected ? ' sat-list-row-active' : ''}`}
            onClick={() => onSelect(isSelected ? null : idx)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelect(isSelected ? null : idx) }}
            aria-pressed={isSelected}
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: cls.color, boxShadow: `0 0 8px ${cls.color}`, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="sat-list-name">{sat.name}</div>
              <div className="sat-list-meta">{sat.partner} · {sat.orbit} · {sat.coverage}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="sat-list-data">{sat.currentData}</div>
              {sat.ndvi !== undefined && (
                <div className="sat-list-ndvi">NDVI: {sat.ndvi.toFixed(2)}</div>
              )}
            </div>
            <div className="sat-status-dot" />
          </div>
        )
      })}

      <div style={{ marginTop: 8, padding: '14px 18px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 10 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>PARCEIROS ORBITAIS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['SpaceX', 'Planet Labs', 'ESA', 'NASA', 'Maxar', 'Airbus DS', 'NOAA', 'Amazon Kuiper'].map((p) => (
            <span key={p} className="service-tag" style={{ fontSize: 11, padding: '4px 10px' }}>{p}</span>
          ))}
        </div>
      </div>
    </div>
  )
})

/* ──────────────────────────── Telemetria do HUD ──────────────────────────── */

function HudTelemetry({ selected }: { selected: number | null }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const lat = (-12.4 + 9 * Math.sin(tick * 0.1)).toFixed(2)
  const lon = (-55.8 + 14 * Math.cos(tick * 0.07)).toFixed(2)
  const sat = selected !== null ? SATELLITES[selected] : null

  return (
    <>
      <div className="globe-hud globe-hud-tl hud-flicker">
        <div className="globe-hud-title">ORBITAL TRACKING — LIVE</div>
        <div>LAT {lat}° · LON {lon}°</div>
        <div>UPLINK 98.7% · 6.127 OBJ</div>
      </div>
      <div className="globe-hud globe-hud-br hud-flicker">
        {sat ? `TRK ▸ ${sat.name.toUpperCase()}` : 'SCAN ▸ AUTO'}
      </div>
      <span className="globe-hud-corner globe-hud-corner-tl" aria-hidden="true" />
      <span className="globe-hud-corner globe-hud-corner-tr" aria-hidden="true" />
      <span className="globe-hud-corner globe-hud-corner-bl" aria-hidden="true" />
      <span className="globe-hud-corner globe-hud-corner-br" aria-hidden="true" />
    </>
  )
}

/* ──────────────────────────── Componente principal ──────────────────────────── */

export default function SatelliteTracker() {
  const [selected, setSelected] = useState<number | null>(null)

  const onSelect = useCallback((idx: number | null) => {
    setSelected(idx)
  }, [])

  return (
    <section id="rede-orbital" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge">Rede Orbital Global</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
            6.000+ Satélites <span className="gradient-text">Monitorando a Terra</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Rede híbrida orbital com parceiros como ESA, NASA, SpaceX e Planet Labs.
            Arraste para girar o planeta, use scroll ou pinça para zoom e clique em um satélite para rastreá-lo.
          </p>
        </div>

        <div className="orbital-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          {/* ── Globo 3D ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, minWidth: 0 }}>
            <div className="globe-frame">
              <Globe3D selected={selected} onSelect={onSelect} />
              <HudTelemetry selected={selected} />
            </div>

            {/* Legenda de órbitas */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {ORBIT_CLASSES.map((r) => (
                <span key={r.id} className="orbit-legend-chip">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, boxShadow: `0 0 6px ${r.color}` }} />
                  {r.label} · {r.alt}
                </span>
              ))}
              <span className="orbit-legend-chip">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: SWARM.color, boxShadow: `0 0 6px ${SWARM.color}` }} />
                Constelação · {SWARM.count} un.
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              🖱️ Arraste para girar · Scroll/pinça para zoom · Clique no satélite
            </div>
          </div>

          {/* ── Lista de satélites ── */}
          <SatList selected={selected} onSelect={onSelect} />
        </div>
      </div>
    </section>
  )
}
