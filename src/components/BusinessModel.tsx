'use client'

import { useReveal } from '../hooks/useReveal'
import {
  EnterpriseIcon,
  ApiIcon,
  RadarIcon,
  BrainIcon,
  WhiteLabelIcon,
} from './icons/NavIcons'

export default function BusinessModel() {
  const sectionRef = useReveal()

  const streams = [
    { icon: <EnterpriseIcon size={20} />, title: 'SaaS Enterprise', desc: 'Licenciamento da plataforma completa por assinatura mensal/anual para grandes corporações.', color: '#00d4ff' },
    { icon: <ApiIcon size={20} />, title: 'APIs Inteligentes', desc: 'Venda de dados processados e insights cognitivos via APIs para desenvolvedores e empresas.', color: '#22c55e' },
    { icon: <RadarIcon size={20} />, title: 'Monitoramento Premium', desc: 'Cobrança por hectare, ativo monitorado ou volume de dados processados em tempo real.', color: '#a78bfa' },
    { icon: <BrainIcon size={20} />, title: 'Predictive Intelligence', desc: 'Insights preditivos avançados e modelos de correlação específicos por assinatura premium.', color: '#f59e0b' },
    { icon: <WhiteLabelIcon size={20} />, title: 'White Label', desc: 'Infraestrutura completa para governos e grandes empresas que precisam de solução própria.', color: '#ef4444' },
  ]

  return (
    <section id="modelo" className="section-alt" ref={sectionRef}>
      <div className="container">
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge">Modelo de Negócio</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Space Intelligence as a Service
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', fontWeight: 500, letterSpacing: '0.04em', marginBottom: 16 }}>
            SIaaS
          </p>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            5 fluxos de receita complementares direcionados ao mercado espacial global projetado em US$ 1 trilhão até 2030.
          </p>
        </div>

        <div className="grid-3" style={{ marginBottom: 48 }}>
          {streams.map((s, i) => (
            <article
              key={s.title}
              className={`reveal glass-card delay-${(i + 1) * 100}`}
              style={{
                padding: '28px',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s, border-color 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)'
                e.currentTarget.style.boxShadow = `0 16px 48px ${s.color}25`
                e.currentTarget.style.borderColor = `${s.color}55`
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
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: `${s.color}18`,
                  border: `1px solid ${s.color}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                  color: s.color,
                }}
              >
                {s.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: s.color, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
            </article>
          ))}
        </div>

        {/* Market size banner */}
        <div
          className="reveal glass-card"
          style={{
            padding: '32px 48px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 32,
            background: 'linear-gradient(135deg, rgba(0,85,204,0.08), rgba(0,212,255,0.04))',
          }}
        >
          {[
            { label: 'Mercado atual', value: 'US$ 630B', color: 'var(--accent-cyan)' },
            { label: 'Projeção 2030', value: 'US$ 1T+', color: '#22c55e' },
            { label: 'Satélites ativos hoje', value: '6.000+', color: '#a78bfa' },
            { label: 'Satélites projetados 2030', value: '100.000+', color: '#f59e0b' },
          ].map((m) => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, color: m.color }}>{m.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
