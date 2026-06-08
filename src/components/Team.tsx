'use client'

import { useReveal } from '../hooks/useReveal'

export default function Team() {
  const sectionRef = useReveal()

  const members = [
    { name: 'Davi Passanha de Sousa Guerra', rm: 'RM551605', role: 'Cloud Architecture' },
    { name: 'Cauã Gonçalves de Jesus', rm: 'RM97648', role: 'DevOps & CI/CD' },
    { name: 'Luan Silveira Macea', rm: 'RM98290', role: 'Backend & APIs' },
    { name: 'Rui Amorim Siqueira', rm: 'RM98436', role: 'Security & IAM' },
    { name: 'Luigi Ferrara Sinno', rm: 'RM98047', role: 'Frontend & UX' },
  ]

  return (
    <section id="equipe" className="section" ref={sectionRef}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge">Equipe</div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              marginBottom: 16,
            }}
          >
            A{' '}
            <span className="gradient-text">Equipe</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Engenheiros de Software — 4º Ano · FIAP · Global Solution 2026 · SDTCC
          </p>
        </div>

        <div
          className="team-grid"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            justifyContent: 'center',
          }}
        >
          {members.map((m, i) => (
            <article
              key={m.rm}
              className={`reveal glass-card team-card delay-${(i + 1) * 100}`}
              style={{
                padding: '28px 32px',
                width: 220,
                textAlign: 'center',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 20px 56px rgba(0,212,255,0.18)'
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)'
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
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'var(--gradient-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#0a0f1e',
                  boxShadow: '0 0 20px rgba(0,212,255,0.25)',
                }}
              >
                {m.name.charAt(0)}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{m.name}</div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.05em',
                  marginBottom: 6,
                }}
              >
                {m.rm}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  padding: '4px 10px',
                  background: 'rgba(0,212,255,0.06)',
                  borderRadius: 999,
                  display: 'inline-block',
                }}
              >
                {m.role}
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <div className="reveal divider" />
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 16,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <polygon points="10,2 18,6 18,14 10,18 2,14 2,6" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
              <circle cx="10" cy="10" r="3" fill="#00d4ff" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              SPACE INTELLIGENCE PLATFORM
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
            Global Solution 2026 · FIAP · Engenharia de Software · 4º Ano · SDTCC
          </p>
          <p style={{ fontSize: 11, color: '#334155' }}>
            Deployado no Microsoft Azure App Service · GitHub Actions CI/CD · Azure Key Vault · Application Insights
          </p>
          <p style={{ fontSize: 11, color: '#334155', marginTop: 8 }}>
            ODS 9 — Inovação e Infraestrutura &nbsp;|&nbsp; ODS 13 — Ação Climática
          </p>
        </div>
      </div>
    </section>
  )
}
