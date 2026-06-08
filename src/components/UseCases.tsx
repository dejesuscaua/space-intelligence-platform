'use client'

import { useReveal } from '../hooks/useReveal'

export default function UseCases() {
  const sectionRef = useReveal()

  const cases = [
    {
      icon: '🌾',
      title: 'Agronegócio',
      color: '#22c55e',
      desc: 'Monitoramento inteligente correlacionando satélites, sensores, clima, logística e mercado.',
      items: ['Perda de safra e estresse hídrico', 'Detecção de pragas e fungos', 'Queimadas e eventos climáticos'],
    },
    {
      icon: '⚡',
      title: 'Energia',
      color: '#f59e0b',
      desc: 'Monitoramento de infraestrutura crítica de transmissão e geração de energia renovável.',
      items: ['Linhas de transmissão e subestações', 'Parques solares e eólicos', 'Risco climático e falhas estruturais'],
    },
    {
      icon: '🚢',
      title: 'Logística',
      color: '#3b82f6',
      desc: 'Rastreamento global de cadeias de suprimento e detecção de eventos extremos em rotas.',
      items: ['Portos, rodovias e supply chain', 'Eventos extremos em rotas globais', 'Rastreamento marítimo via satélite'],
    },
    {
      icon: '⛏️',
      title: 'Mineração',
      color: '#a78bfa',
      desc: 'Monitoramento orbital de barragens, risco geológico e segurança territorial.',
      items: ['Monitoramento de barragens', 'Risco geológico e subsidência', 'Movimentação territorial via SAR'],
    },
    {
      icon: '🚨',
      title: 'Defesa Civil',
      color: '#ef4444',
      desc: 'Resposta rápida a desastres naturais com alertas preventivos baseados em dados orbitais.',
      items: ['Enchentes, deslizamentos e secas', 'Queimadas e furacões', 'Alertas precoces com 72h de antecedência'],
    },
    {
      icon: '🏙️',
      title: 'Smart Cities',
      color: '#00d4ff',
      desc: 'Monitoramento urbano de infraestrutura, eficiência de serviços públicos e qualidade de vida.',
      items: ['Monitoramento de infraestrutura urbana', 'Eficiência de serviços públicos', 'Qualidade ambiental e mobilidade'],
    },
  ]

  return (
    <section id="casos-de-uso" className="section" ref={sectionRef}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge">Casos de Uso</div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            6 Indústrias,{' '}
            <span className="gradient-text">1 Infraestrutura</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
            A mesma plataforma cognitiva adaptada para os maiores desafios de cada setor da economia.
          </p>
        </div>

        <div className="grid-3">
          {cases.map((c, i) => (
            <article
              key={c.title}
              className={`reveal glass-card delay-${Math.min((i + 1) * 100, 600)}`}
              style={{
                padding: '28px',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.01)'
                e.currentTarget.style.boxShadow = `0 20px 56px ${c.color}25`
                e.currentTarget.style.borderColor = `${c.color}55`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.borderColor = 'var(--accent-cyan-border)'
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${c.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  marginBottom: 16,
                  transition: 'transform 0.3s',
                }}
              >
                {c.icon}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, color: c.color }}>
                {c.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                {c.desc}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {c.items.map((item) => (
                  <div
                    key={item}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}
                  >
                    <span aria-hidden="true" style={{ color: c.color, flexShrink: 0 }}>→</span>
                    {item}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
