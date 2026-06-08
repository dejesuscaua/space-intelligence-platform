'use client'

import { useState, useEffect } from 'react'
import { useReveal } from '../hooks/useReveal'

const layers = [
  {
    num: '01',
    tag: 'ORBITAL LAYER',
    title: 'Camada Espacial',
    color: '#00d4ff',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="5" fill="#00d4ff" opacity="0.8" />
        <ellipse cx="16" cy="16" rx="14" ry="5" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
        <ellipse cx="16" cy="16" rx="14" ry="5" stroke="#00d4ff" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="14" ry="5" stroke="#00d4ff" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)" />
      </svg>
    ),
    desc: 'Aquisição contínua de dados orbitais de satélites ópticos, SAR, LEO e meteorológicos.',
    items: ['NDVI & Temperatura orbital', 'Detecção de queimadas e desmatamento', 'Eventos climáticos e geográficos', 'Parceiros: SpaceX, Planet Labs, ESA, NASA'],
    stat: { value: '6.000+', label: 'satélites ativos' },
  },
  {
    num: '02',
    tag: 'GROUND LAYER',
    title: 'Camada Terrestre',
    color: '#22c55e',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="18" width="20" height="8" rx="2" stroke="#22c55e" strokeWidth="1.5" fill="none" />
        <path d="M10 18v-4a6 6 0 0112 0v4" stroke="#22c55e" strokeWidth="1.5" fill="none" />
        <circle cx="16" cy="10" r="3" stroke="#22c55e" strokeWidth="1.5" fill="none" />
        <path d="M13 22h6M10 24h12" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    desc: 'Integração de dispositivos físicos conectados ao ambiente terrestre em tempo real.',
    items: ['Sensores IoT, drones, veículos conectados', 'Redes LoRaWAN, 4G/5G e satélite', 'Telemetria industrial e agrícola', 'Máquinas, estações meteorológicas'],
    stat: { value: '847', label: 'regiões monitoradas' },
  },
  {
    num: '03',
    tag: 'INTELLIGENCE LAYER',
    title: 'Space Cognitive Engine',
    color: '#a78bfa',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="10" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
        <path d="M16 8c0 0-4 3-4 8s4 8 4 8" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 8c0 0 4 3 4 8s-4 8-4 8" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 16h20" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="16" cy="16" r="2" fill="#a78bfa" />
      </svg>
    ),
    desc: 'Motor cognitivo com IA multimodal correlacionando bilhões de sinais heterogêneos em tempo real.',
    items: ['Computer Vision — detecção geográfica', 'Time Series Forecasting — predição climática', 'LLMs — análise de eventos globais', 'Graph AI + Reinforcement Learning'],
    stat: { value: '82%', label: 'acurácia preditiva' },
  },
  {
    num: '04',
    tag: 'ACTION LAYER',
    title: 'Camada Operacional',
    color: '#f59e0b',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M6 6h20v14H6z" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
        <path d="M10 26h12M16 20v6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 12l3 3 5-5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    desc: 'Transforma inteligência em ação operacional automatizada com integração corporativa.',
    items: ['Alertas inteligentes e geoespaciais', 'Dashboards e APIs corporativas', 'Integração ERP, seguradoras, financeiro', 'Workflows automáticos e recomendações'],
    stat: { value: '2.4M+', label: 'pontos/segundo' },
  },
]

export default function Platform() {
  const sectionRef = useReveal()
  const [activeLayer, setActiveLayer] = useState(0)
  const [dataFlow, setDataFlow] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setDataFlow(true)
      setTimeout(() => setDataFlow(false), 600)
      setActiveLayer((prev) => (prev + 1) % layers.length)
    }, 2500)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="plataforma" className="section" ref={sectionRef}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge">A Plataforma — 4 Camadas</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Arquitetura em{' '}
            <span className="gradient-text">4 Camadas</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Do espaço ao operacional — dados orbitais, sensores terrestres, inteligência cognitiva e automação em uma única infraestrutura.
          </p>
        </div>

        {/* Data flow indicator */}
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
          {layers.map((layer, i) => (
            <div key={layer.num} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                className="flow-node"
                style={{
                  background: activeLayer === i ? `${layer.color}22` : 'rgba(255,255,255,0.03)',
                  border: `2px solid ${activeLayer === i ? layer.color : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: activeLayer === i ? `0 0 20px ${layer.color}44` : 'none',
                  transition: 'all 0.5s ease',
                }}
              >
                <div style={{ fontSize: 9, fontWeight: 700, color: activeLayer === i ? layer.color : 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 4 }}>
                  {layer.tag.split(' ')[0]}
                </div>
                <div style={{ opacity: activeLayer === i ? 1 : 0.4, transition: 'opacity 0.5s' }}>{layer.icon}</div>
              </div>
              {i < layers.length - 1 && (
                <div className="flow-arrow" style={{ background: activeLayer === i && dataFlow ? layers[i].color : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {layers.map((layer, i) => (
            <article
              key={layer.num}
              className={`reveal glass-card platform-layer-card delay-${(i + 1) * 100}`}
              style={{
                padding: '28px 32px',
                display: 'grid',
                gridTemplateColumns: '1fr 2fr auto',
                gap: 32,
                alignItems: 'center',
                borderColor: activeLayer === i ? `${layer.color}66` : `${layer.color}33`,
                boxShadow: activeLayer === i ? `0 4px 32px ${layer.color}20` : 'none',
                transition: 'all 0.5s ease',
              }}
              onMouseEnter={() => setActiveLayer(i)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: `${layer.color}15`, border: `1px solid ${layer.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {layer.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: layer.color, marginBottom: 2 }}>{layer.tag}</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{layer.title}</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{layer.desc}</p>
              </div>

              <div className="platform-items-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {layer.items.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true">
                      <path d="M2 7l4 4 6-6" stroke={layer.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', flexShrink: 0, minWidth: 80 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: layer.color }}>{layer.stat.value}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>{layer.stat.label}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 56, textAlign: 'center' }}>
          <div className="badge" style={{ marginBottom: 20 }}>UNIFIED PLATFORM SERVICES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Space Data', 'IoT & Sensors', 'Connectivity', 'Climate & Environ.', 'Operations', 'Supply Chain', 'Risk & Events', 'People Health'].map((s) => (
              <span key={s} className="service-tag">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
