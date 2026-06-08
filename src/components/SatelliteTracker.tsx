'use client'

import { useState } from 'react'
import { SATELLITES } from '@/data/mock'

interface TooltipState {
  sat: typeof SATELLITES[0]
  x: number
  y: number
}

const ORBIT_RINGS = [
  { label: 'LEO', rx: 130, ry: 50, speed: 12, color: '#00d4ff', count: 4 },
  { label: 'MEO', rx: 165, ry: 65, speed: 22, color: '#a78bfa', count: 1 },
  { label: 'GEO', rx: 198, ry: 78, speed: 38, color: '#22c55e', count: 1 },
]

const SAT_ASSIGNMENTS = [
  { satIdx: 0, ring: 0, offset: 0 },
  { satIdx: 1, ring: 0, offset: 90 },
  { satIdx: 4, ring: 0, offset: 180 },
  { satIdx: 5, ring: 0, offset: 270 },
  { satIdx: 3, ring: 1, offset: 45 },
  { satIdx: 2, ring: 2, offset: 120 },
]

export default function SatelliteTracker() {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  return (
    <section id="rede-orbital" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge">Rede Orbital Global</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
            6.000+ Satélites <span className="gradient-text">Monitorando a Terra</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Rede híbrida orbital com parceiros como ESA, NASA, SpaceX e Planet Labs. Passe o mouse sobre os satélites para ver dados ao vivo.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          {/* SVG Orbital Viz */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <svg
              width="420"
              height="420"
              viewBox="0 0 420 420"
              style={{ maxWidth: '100%', overflow: 'visible' }}
              aria-label="Visualização orbital de satélites"
            >
              <defs>
                <radialGradient id="earthGrad" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#1a3a6e" />
                  <stop offset="60%" stopColor="#0d1f4a" />
                  <stop offset="100%" stopColor="#060d1f" />
                </radialGradient>
                <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                </radialGradient>
                <filter id="satGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Ambient glow */}
              <ellipse cx="210" cy="210" rx="110" ry="110" fill="url(#glowGrad)" />

              {/* Orbit rings */}
              {ORBIT_RINGS.map((ring) => (
                <g key={ring.label}>
                  <ellipse
                    cx="210" cy="210"
                    rx={ring.rx} ry={ring.ry}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth="0.8"
                    strokeDasharray="4 6"
                    opacity="0.35"
                  />
                  <text x={210 + ring.rx + 4} y={212} fill={ring.color} fontSize="9" opacity="0.6" fontFamily="monospace">{ring.label}</text>
                </g>
              ))}

              {/* Earth */}
              <circle cx="210" cy="210" r="62" fill="url(#earthGrad)" />
              {/* Continent shapes (simplified) */}
              <ellipse cx="195" cy="200" rx="18" ry="24" fill="#1e4d7a" opacity="0.7" />
              <ellipse cx="225" cy="195" rx="12" ry="16" fill="#1e4d7a" opacity="0.6" />
              <ellipse cx="210" cy="225" rx="14" ry="10" fill="#1e4d7a" opacity="0.5" />
              <ellipse cx="188" cy="218" rx="8" ry="12" fill="#1e4d7a" opacity="0.6" />
              {/* Atmosphere rim */}
              <circle cx="210" cy="210" r="62" fill="none" stroke="#00d4ff" strokeWidth="1.5" opacity="0.3" />
              <circle cx="210" cy="210" r="70" fill="none" stroke="#00d4ff" strokeWidth="0.5" opacity="0.1" />

              {/* Animated satellites */}
              {SAT_ASSIGNMENTS.map(({ satIdx, ring: ringIdx, offset }) => {
                const ring = ORBIT_RINGS[ringIdx]
                const sat = SATELLITES[satIdx]
                const animId = `sat-orbit-${satIdx}`
                return (
                  <g key={satIdx}>
                    <animateTransform
                      xlinkHref={`#${animId}`}
                      attributeName="transform"
                      type="rotate"
                      from={`${offset} 210 210`}
                      to={`${offset + 360} 210 210`}
                      dur={`${ring.speed}s`}
                      repeatCount="indefinite"
                    />
                    <g
                      id={animId}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        const rect = (e.currentTarget.closest('svg') as SVGElement).getBoundingClientRect()
                        setTooltip({ sat, x: e.clientX - rect.left, y: e.clientY - rect.top })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      filter="url(#satGlow)"
                    >
                      {/* Orbit position — translate to ring edge */}
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from={`${offset} 210 210`}
                        to={`${offset + 360} 210 210`}
                        dur={`${ring.speed}s`}
                        repeatCount="indefinite"
                      />
                      <g transform={`translate(${210 + ring.rx}, 210)`}>
                        <rect x="-5" y="-3" width="10" height="6" rx="1" fill={ring.color} opacity="0.9" />
                        <rect x="-9" y="-1.5" width="4" height="3" fill={ring.color} opacity="0.6" />
                        <rect x="5" y="-1.5" width="4" height="3" fill={ring.color} opacity="0.6" />
                        <circle cx="0" cy="0" r="1.5" fill="white" opacity="0.8" />
                      </g>
                    </g>
                  </g>
                )
              })}

              {/* Center label */}
              <text x="210" y="205" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">TERRA</text>
              <text x="210" y="218" textAnchor="middle" fill="#00d4ff" fontSize="8" fontFamily="monospace">6.000+ SATS</text>
            </svg>

            {/* Tooltip */}
            {tooltip && (
              <div
                className="sat-tooltip glass-card"
                style={{
                  position: 'absolute',
                  top: tooltip.y - 90,
                  left: Math.min(tooltip.x - 10, 200),
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              >
                <div className="sat-tooltip-name">{tooltip.sat.name}</div>
                <div className="sat-tooltip-row">
                  <span>Órbita</span><span>{tooltip.sat.orbit}</span>
                </div>
                <div className="sat-tooltip-row">
                  <span>Parceiro</span><span>{tooltip.sat.partner}</span>
                </div>
                <div className="sat-tooltip-row">
                  <span>Cobertura</span><span>{tooltip.sat.coverage}</span>
                </div>
                <div className="sat-tooltip-data">{tooltip.sat.currentData}</div>
              </div>
            )}
          </div>

          {/* Satellite list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SATELLITES.map((sat) => (
              <div key={sat.id} className="glass-card sat-list-row">
                <div className="sat-list-icon">🛰️</div>
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
            ))}

            <div style={{ marginTop: 8, padding: '14px 18px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>PARCEIROS ORBITAIS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['SpaceX', 'Planet Labs', 'ESA', 'NASA', 'Maxar', 'Airbus DS', 'NOAA', 'Amazon Kuiper'].map((p) => (
                  <span key={p} className="service-tag" style={{ fontSize: 11, padding: '4px 10px' }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
