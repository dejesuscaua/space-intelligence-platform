'use client'

import { useReveal } from '../hooks/useReveal'

export default function Problem() {
  const sectionRef = useReveal()

  const problems = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="11" stroke="#ef4444" strokeWidth="1.5" />
          <path d="M14 8v7M14 18h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      title: 'Baixa Previsibilidade',
      desc: 'Decisões reativas ao invés de proativas. Sem correlação entre sinais, empresas só reagem depois do problema.',
      color: '#ef4444',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="4" width="20" height="20" rx="4" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M9 14h10M9 10h6M9 18h4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      title: 'Desperdício Operacional',
      desc: 'Falta de visão sistêmica gera perdas massivas. Cada setor opera em silo, sem saber o que acontece nos outros.',
      color: '#f59e0b',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="8" cy="8" r="4" stroke="#a78bfa" strokeWidth="1.5" />
          <circle cx="20" cy="8" r="4" stroke="#a78bfa" strokeWidth="1.5" />
          <circle cx="14" cy="20" r="4" stroke="#a78bfa" strokeWidth="1.5" />
          <path d="M12 8h4M10 12l-2 4M18 12l2 4" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      ),
      title: 'Dados Fragmentados',
      desc: 'Informação dispersa em silos isolados. Satélites, sensores, ERPs e APIs climáticas nunca se falam.',
      color: '#a78bfa',
    },
  ]

  return (
    <section id="problema" className="section-alt" ref={sectionRef}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge">O Problema Global</div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            DADOS EXISTEM.{' '}
            <span style={{ color: '#ef4444' }}>INTELIGÊNCIA, NÃO.</span>
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              maxWidth: 640,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Empresas têm acesso a dados satelitais, sensores IoT, telemetria e mercados —
            mas cada sistema opera isolado.
          </p>
        </div>

        <div className="grid-3" style={{ marginBottom: 48 }}>
          {problems.map((p, i) => (
            <article
              key={p.title}
              className={`reveal glass-card card-hover delay-${(i + 1) * 200}`}
              style={{
                padding: '32px 28px',
                borderColor: `${p.color}33`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)'
                e.currentTarget.style.boxShadow = `0 16px 48px ${p.color}25`
                e.currentTarget.style.borderColor = `${p.color}66`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = ''
                e.currentTarget.style.borderColor = `${p.color}33`
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  background: `${p.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                {p.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{p.desc}</p>
            </article>
          ))}
        </div>

        {/* Quote highlight */}
        <div
          className="reveal quote-card glass-card"
          style={{
            padding: '32px 40px',
            textAlign: 'center',
            borderColor: 'rgba(0,212,255,0.3)',
            background: 'rgba(0,212,255,0.05)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.6), transparent)',
            }}
          />
          <div style={{ fontSize: '2.4rem', color: 'var(--accent-cyan)', marginBottom: 12, opacity: 0.6 }}>&ldquo;</div>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              fontStyle: 'italic',
              maxWidth: 700,
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Empresas possuem informação. Mas não possuem inteligência integrada.
          </p>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 1, background: 'var(--accent-cyan)', opacity: 0.5 }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              ODS 9 · Inovação e Infraestrutura &nbsp;|&nbsp; ODS 13 · Ação Climática
            </span>
            <div style={{ width: 32, height: 1, background: 'var(--accent-cyan)', opacity: 0.5 }} />
          </div>
        </div>
      </div>
    </section>
  )
}
