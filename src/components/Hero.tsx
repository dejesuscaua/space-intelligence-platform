'use client'

import { useState, useEffect } from 'react'

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    // Delay appearance for immersion — shows after hero animations settle
    const t = setTimeout(() => setShowScroll(true), 1400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('app-main-content')
      const y = el ? el.scrollTop : window.scrollY
      setScrolled(y > 40)
      if (y > 80) setShowScroll(false)
    }
    const el = document.getElementById('app-main-content')
    const target: EventTarget = el ?? globalThis
    target.addEventListener('scroll', onScroll, { passive: true })
    return () => target.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = ['Plataforma', 'Casos de Uso', 'Dashboard', 'Roadmap', 'Equipe']

  return (
    <section
      className="stars-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        /* Semi-transparente: deixa o starfield global em canvas aparecer */
        background: 'linear-gradient(135deg, rgba(10,15,30,0.55) 0%, rgba(13,21,48,0.45) 50%, rgba(10,22,40,0.55) 100%)',
        position: 'relative',
      }}
    >
      {/* Grid de horizonte futurista */}
      <div className="hero-grid" aria-hidden="true" />

      {/* Ambient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '8%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,85,204,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'float 7s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'float 9s ease-in-out infinite reverse',
        }}
      />

      {/* Navbar */}
      <nav className={`site-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
            <polygon points="14,7 21,11 21,17 14,21 7,17 7,11" fill="rgba(0,212,255,0.2)" stroke="#00d4ff" strokeWidth="1" />
            <circle cx="14" cy="14" r="3" fill="#00d4ff" />
          </svg>
          <span>SPACE INTELLIGENCE</span>
        </div>

        {/* Desktop nav links — hidden on mobile via CSS only (no inline display) */}
        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="nav-fiap-tag">FIAP · SDTCC · 2026</div>

        {/* Mobile hamburger */}
        <button
          className={`mobile-menu-btn${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="mobile-dropdown">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="nav-link mobile-nav-link"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero content */}
      <div
        className="container"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '80px 24px',
          gap: 24,
        }}
      >
        <div className="badge animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          Sistema Operacional do Mundo Físico
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div
            style={{
              position: 'relative',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Orbiting dot */}
            <div
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--accent-cyan)',
                top: '50%',
                left: '50%',
                marginTop: -4,
                marginLeft: -4,
                animation: 'orbit 4s linear infinite',
                boxShadow: '0 0 12px rgba(0,212,255,0.8)',
              }}
            />
            <svg width="64" height="64" viewBox="0 0 52 52" fill="none" className="animate-float">
              <polygon points="26,3 49,15 49,37 26,49 3,37 3,15" stroke="#00d4ff" strokeWidth="2" fill="none" />
              <polygon points="26,12 41,20 41,32 26,40 11,32 11,20" fill="rgba(0,212,255,0.15)" stroke="#00d4ff" strokeWidth="1.5" />
              <circle cx="26" cy="26" r="6" fill="#00d4ff" className="animate-pulse-glow" />
            </svg>
          </div>
        </div>

        <h1
          className="animate-fade-in-up"
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: 800,
            opacity: 0,
            animationDelay: '0.25s',
          }}
        >
          SPACE{' '}
          <span className="shimmer-text">INTELLIGENCE</span>
          <br />
          PLATFORM
        </h1>

        <p
          className="animate-fade-in-up"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--accent-cyan)',
            fontWeight: 300,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            opacity: 0,
            animationDelay: '0.4s',
          }}
        >
          The Cognitive Infrastructure for a Smarter Planet
        </p>

        <p
          className="animate-fade-in-up"
          style={{
            fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
            color: 'var(--text-secondary)',
            maxWidth: 620,
            lineHeight: 1.7,
            opacity: 0,
            animationDelay: '0.5s',
          }}
        >
          Infraestrutura Global de Inteligência Espacial Aplicada ao Mundo Físico.
          Correlacionando dados orbitais, sensores IoT e IA multimodal em tempo real.
        </p>

        <div
          className="hero-buttons animate-fade-in-up"
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 8,
            opacity: 0,
            animationDelay: '0.65s',
          }}
        >
          <a href="#plataforma" className="btn-primary">
            Explorar Plataforma
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#dashboard" className="btn-secondary">
            Ver Dashboard
          </a>
        </div>

        {/* Stats bar */}
        <div
          className="glass-card animate-fade-in-up hero-stats"
          style={{
            display: 'flex',
            gap: 40,
            padding: '20px 40px',
            marginTop: 48,
            flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: 0,
            animationDelay: '0.8s',
            animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.8s forwards',
            border: '1px solid rgba(0,212,255,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated top border */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
              animation: 'shimmer 3s linear infinite',
              backgroundSize: '200% auto',
            }}
          />
          {[
            { value: 'US$ 1T+', label: 'Economia Espacial 2030' },
            { value: '6.000+', label: 'Satélites Ativos' },
            { value: '82%', label: 'Acurácia Preditiva' },
            { value: '4B', label: 'Pessoas Desconectadas' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="stat-item"
              style={{ textAlign: 'center', animationDelay: `${0.9 + i * 0.1}s` }}
            >
              <div
                style={{
                  fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
                  fontWeight: 800,
                  background: 'var(--gradient-accent)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        aria-label="Rolar para o conteúdo"
        onClick={() => {
          setShowScroll(false)
          document.getElementById('problema')?.scrollIntoView({ behavior: 'smooth' })
        }}
        style={{
          position: 'sticky',
          bottom: 40,
          alignSelf: 'center',
          zIndex: 10,
          pointerEvents: showScroll ? 'auto' : 'none',
          cursor: 'pointer',
          opacity: showScroll ? 1 : 0,
          transition: 'opacity 0.9s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          /* Dark pill so it's readable over any background */
          background: 'rgba(10,15,30,0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0,212,255,0.25)',
          borderRadius: 999,
          padding: '10px 20px 12px',
          boxShadow: '0 0 24px rgba(0,212,255,0.15), 0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <span style={{
          fontSize: 10,
          color: 'rgba(0,212,255,0.7)',
          letterSpacing: '0.2em',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          scroll
        </span>
        {/* Three stacked chevrons with wave animation */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {[0, 1, 2].map((i) => (
            <svg
              key={i}
              width="22"
              height="13"
              viewBox="0 0 22 13"
              fill="none"
              style={{
                animation: 'chevronFade 1.6s ease-in-out infinite',
                animationDelay: `${i * 0.18}s`,
                opacity: 0,
                filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.8))',
              }}
            >
              <path d="M1 1l10 10L21 1" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>
      </button>
    </section>
  )
}
