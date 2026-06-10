'use client'

import { useState, useEffect, useCallback } from 'react'
import { useReveal } from '../hooks/useReveal'
import { CORRELATION_SCENARIOS } from '@/data/mock'
import CorrelationNetwork from './CorrelationNetwork'

type Sector = 'agricultural' | 'energy' | 'logistics'

const SECTOR_TABS: { key: Sector; label: string; icon: string }[] = [
  { key: 'agricultural', label: 'Agronegócio', icon: '🌾' },
  { key: 'energy', label: 'Energia', icon: '⚡' },
  { key: 'logistics', label: 'Logística', icon: '🚢' },
]

function GaugeSVG({ value, color }: { value: number; color: string }) {
  const radius = 54
  const circumference = Math.PI * radius
  const dash = (value / 100) * circumference
  const angle = -180 + (value / 100) * 180

  return (
    <svg width="140" height="80" viewBox="0 0 140 80" aria-label={`${value}% probabilidade`}>
      <path
        d="M 15 75 A 55 55 0 0 1 125 75"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M 15 75 A 55 55 0 0 1 125 75"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)' }}
      />
      {/* Needle */}
      <line
        x1="70" y1="75"
        x2={70 + 38 * Math.cos(((angle - 90) * Math.PI) / 180)}
        y2={75 + 38 * Math.sin(((angle - 90) * Math.PI) / 180)}
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ transition: 'x2 1s cubic-bezier(0.16,1,0.3,1), y2 1s cubic-bezier(0.16,1,0.3,1)' }}
      />
      <circle cx="70" cy="75" r="4" fill="white" />
      <text x="70" y="60" textAnchor="middle" fill={color} fontSize="20" fontWeight="800">{value}%</text>
      <text x="70" y="72" textAnchor="middle" fill="#64748b" fontSize="8">probabilidade</text>
    </svg>
  )
}

export default function CorrelationExample() {
  const sectionRef = useReveal()
  const [sector, setSector] = useState<Sector>('agricultural')
  const [activeSignals, setActiveSignals] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const scenario = CORRELATION_SCENARIOS[sector]

  const runAnimation = useCallback(() => {
    setActiveSignals([])
    setShowResult(false)
    scenario.signals.forEach((_, i) => {
      setTimeout(() => setActiveSignals((prev) => [...prev, i]), i * 500 + 200)
    })
    setTimeout(() => setShowResult(true), scenario.signals.length * 500 + 700)
  }, [scenario])

  useEffect(() => {
    runAnimation()
    const loop = setInterval(runAnimation, 14000)
    return () => clearInterval(loop)
  }, [runAnimation])

  return (
    <section id="correlação" className="section-alt" ref={sectionRef}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge">Correlation Intelligence™</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
            A plataforma não exibe dados —<br />
            <span className="gradient-text">ela ENTENDE relações</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
            Selecione um setor e veja como a IA correlaciona sinais de satélite, sensores e dados externos em tempo real.
          </p>
        </div>

        {/* Sector tabs */}
        <div className="reveal" style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
          {SECTOR_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`sector-tab ${sector === tab.key ? 'sector-tab-active' : ''}`}
              onClick={() => setSector(tab.key)}
              style={sector === tab.key ? { borderColor: CORRELATION_SCENARIOS[tab.key].color, color: CORRELATION_SCENARIOS[tab.key].color, background: `${CORRELATION_SCENARIOS[tab.key].color}15` } : {}}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Rede neural de correlação */}
        <div className="reveal" style={{ marginBottom: 24 }}>
          <div className="viz-frame" style={{ padding: '18px 8px 8px' }}>
            <CorrelationNetwork scenario={scenario} activeSignals={activeSignals} showResult={showResult} />
            <div className="globe-hud globe-hud-tl hud-flicker">
              <div className="globe-hud-title">CORRELATION INTELLIGENCE™ — PIPELINE</div>
              <div>{scenario.region.toUpperCase()}</div>
            </div>
            <div className="globe-hud globe-hud-br hud-flicker">
              {showResult ? 'STATUS ▸ INSIGHT EMITIDO' : 'STATUS ▸ INGESTÃO DE SINAIS'}
            </div>
            <span className="globe-hud-corner globe-hud-corner-tl" aria-hidden="true" />
            <span className="globe-hud-corner globe-hud-corner-tr" aria-hidden="true" />
            <span className="globe-hud-corner globe-hud-corner-bl" aria-hidden="true" />
            <span className="globe-hud-corner globe-hud-corner-br" aria-hidden="true" />
          </div>
        </div>

        <div className="reveal grid-2" style={{ marginBottom: 40 }}>
          {/* Market vs SIP */}
          <div className="glass-card" style={{ padding: '28px 32px', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', letterSpacing: '0.08em', marginBottom: 16 }}>
              ✗ O QUE O MERCADO OFERECE
            </div>
            {['Apenas satélites', 'Apenas sensores', 'Apenas dashboards', 'Apenas analytics', 'Apenas conectividade'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'line-through' }}>
                {item}
              </div>
            ))}
            <div style={{ marginTop: 20, padding: '12px', background: 'rgba(239,68,68,0.07)', borderRadius: 8, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Resultado: dados isolados sem contexto. Decisões reativas. Perdas evitáveis.
            </div>
          </div>

          {/* Live correlation */}
          <div className="glass-card" style={{ padding: '28px 32px', borderColor: `${scenario.color}44` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: scenario.color, letterSpacing: '0.08em', marginBottom: 4 }}>
              ✓ SPACE INTELLIGENCE — CORRELAÇÃO EM TEMPO REAL
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 16 }}>
              📍 {scenario.region}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {scenario.signals.map((s, i) => (
                <div key={s.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, opacity: activeSignals.includes(i) ? 1 : 0.3, transition: 'opacity 0.4s ease' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <span>{s.icon}</span> {s.label}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: s.color }}>{s.value}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: activeSignals.includes(i) ? `${s.weight}%` : '0%',
                        background: s.color,
                        borderRadius: 2,
                        transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                        transitionDelay: `${i * 0.1}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {showResult && (
              <div style={{ animation: 'fadeInUp 0.5s ease-out', padding: '16px', background: `${scenario.color}12`, border: `1px solid ${scenario.color}44`, borderRadius: 10, textAlign: 'center' }}>
                <GaugeSVG value={scenario.probability} color={scenario.color} />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{scenario.title}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full insight + recommendation */}
        <div className="reveal glass-card" style={{ padding: '32px 44px', background: `linear-gradient(135deg, ${scenario.color}08, rgba(0,212,255,0.03))`, borderColor: `${scenario.color}33`, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: scenario.color, letterSpacing: '0.1em', marginBottom: 12 }}>
            INSIGHT GERADO — CORRELATION INTELLIGENCE™
          </div>
          <p style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 700, margin: '0 auto 20px' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              &ldquo;Existe <span style={{ color: scenario.color, fontSize: '1.15em' }}>{scenario.probability}%</span> de probabilidade de{' '}
              <span style={{ textTransform: 'lowercase' }}>{scenario.title}</span>{' '}
              — {scenario.region}.&rdquo;
            </span>
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, maxWidth: 620, margin: '0 auto', fontSize: '0.9rem' }}>
            <span style={{ fontSize: '1.2em' }}>🤖</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Ação Recomendada:</strong> {scenario.recommendation}
            </span>
          </div>
          <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text-muted)' }}>
            Acurácia: {scenario.probability}% · Space Cognitive Engine · Multimodal AI
          </div>
        </div>
      </div>
    </section>
  )
}
