'use client'

import { useReveal } from '../hooks/useReveal'

export default function Roadmap() {
  const sectionRef = useReveal()

  const phases = [
    {
      num: '01',
      label: 'MVP',
      title: 'Fase 1',
      color: '#00d4ff',
      status: 'Em andamento',
      active: true,
      items: ['Dashboard geoespacial', 'Dados satelitais (Sentinel/Landsat)', 'Alertas básicos', 'APIs iniciais'],
    },
    {
      num: '02',
      label: 'IA Cognitiva',
      title: 'Fase 2',
      color: '#22c55e',
      status: 'Próxima fase',
      active: false,
      items: ['IA multimodal', 'Correlação automática', 'Modelos preditivos', 'Predição operacional'],
    },
    {
      num: '03',
      label: 'Escala Global',
      title: 'Fase 3',
      color: '#a78bfa',
      status: 'Roadmap 2027',
      active: false,
      items: ['Multi-indústria', 'APIs globais', 'Marketplace de dados', 'Infra distribuída'],
    },
    {
      num: '04',
      label: 'Orbital Native',
      title: 'Fase 4',
      color: '#f59e0b',
      status: 'Roadmap 2029+',
      active: false,
      items: ['Processamento em órbita', 'Satélites próprios', 'Conectividade híbrida', 'Redes autônomas'],
    },
  ]

  return (
    <section id="roadmap" className="section" ref={sectionRef}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge">Roadmap Estratégico</div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            Do MVP ao{' '}
            <span className="gradient-text">Orbital Native</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            4 fases de evolução da plataforma — do primeiro dashboard geoespacial até processamento de IA diretamente em órbita.
          </p>
        </div>

        {/* Timeline */}
        <div className="reveal" style={{ position: 'relative' }}>
          {/* Horizontal connector — hidden on mobile via CSS */}
          <div
            className="roadmap-connector"
            style={{
              position: 'absolute',
              top: 28,
              left: '12.5%',
              right: '12.5%',
              height: 2,
              background: 'linear-gradient(90deg, #00d4ff, #22c55e, #a78bfa, #f59e0b)',
              opacity: 0.3,
              zIndex: 0,
            }}
          />

          <div
            className="roadmap-timeline"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {phases.map((phase, i) => (
              <div
                key={phase.num}
                className={`delay-${(i + 1) * 100}`}
                style={{ textAlign: 'center' }}
              >
                {/* Node */}
                <div
                  aria-hidden="true"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: phase.active ? phase.color : `${phase.color}20`,
                    border: `2px solid ${phase.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: phase.active ? '#0a0f1e' : phase.color,
                    boxShadow: phase.active ? `0 0 24px ${phase.color}66` : 'none',
                    transition: 'box-shadow 0.3s',
                  }}
                >
                  {phase.num}
                </div>

                <article
                  className="glass-card"
                  style={{
                    padding: '20px 16px',
                    borderColor: `${phase.color}33`,
                    opacity: phase.active ? 1 : 0.75,
                    transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, opacity 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = `0 12px 32px ${phase.color}22`
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.opacity = phase.active ? '1' : '0.75'
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: phase.color, marginBottom: 4 }}>
                    {phase.label}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8 }}>{phase.title}</div>
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      background: `${phase.color}15`,
                      border: `1px solid ${phase.color}33`,
                      borderRadius: 999,
                      fontSize: 10,
                      color: phase.color,
                      marginBottom: 12,
                    }}
                  >
                    {phase.status}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {phase.items.map((item) => (
                      <div
                        key={item}
                        style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'left', display: 'flex', gap: 6 }}
                      >
                        <span aria-hidden="true" style={{ color: phase.color }}>·</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
