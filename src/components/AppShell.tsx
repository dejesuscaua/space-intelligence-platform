'use client'

import { useState, useEffect, Fragment } from 'react'
import Dashboard from './Dashboard'
import SpaceBackground from './SpaceBackground'
import SatelliteTracker from './SatelliteTracker'
import AlertCenter from './AlertCenter'
import AgricultureDeepDive from './AgricultureDeepDive'
import CorrelationExample from './CorrelationExample'
import Sobre from './Sobre'
import {
  DashboardIcon,
  OrbitalMapIcon,
  AlertIcon,
  AgroIcon,
  CorrelationIcon,
  AboutIcon,
  SearchIcon,
  BellIcon,
  UserAvatarIcon,
} from './icons/NavIcons'

type ModuleId = 'dashboard' | 'orbital' | 'alertas' | 'agro' | 'correlacoes' | 'sobre'

const MODULES: { id: ModuleId; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'dashboard',   label: 'Dashboard',    icon: <DashboardIcon />,   desc: 'Visão geral em tempo real' },
  { id: 'orbital',     label: 'Mapa Orbital', icon: <OrbitalMapIcon />,  desc: 'Rede de satélites ativos' },
  { id: 'alertas',     label: 'Alertas',      icon: <AlertIcon />,       desc: 'Central de comando e ações' },
  { id: 'agro',        label: 'Agronegócio',  icon: <AgroIcon />,        desc: 'Monitoramento agrícola ao vivo' },
  { id: 'correlacoes', label: 'Correlações',  icon: <CorrelationIcon />, desc: 'Correlation Intelligence Engine' },
  { id: 'sobre',       label: 'Sobre',        icon: <AboutIcon />,       desc: 'Sobre o projeto' },
]

const OrbitalIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="4" fill="#00d4ff" opacity="0.85" />
    <ellipse cx="11" cy="11" rx="10" ry="4" stroke="#00d4ff" strokeWidth="1.2" fill="none" />
    <ellipse cx="11" cy="11" rx="10" ry="4" stroke="#00d4ff" strokeWidth="1.2" fill="none" transform="rotate(60 11 11)" />
  </svg>
)

const HamburgerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function AppShell() {
  const [active, setActive] = useState<ModuleId>('dashboard')
  const [time, setTime] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const navigate = (id: ModuleId) => {
    setActive(id)
    setSidebarOpen(false)
  }

  return (
    <div className="app-shell">
      <SpaceBackground />
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="app-header-left">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen((o) => !o)} aria-label="Abrir menu">
            <HamburgerIcon />
          </button>
          <div className="app-logo">
            <OrbitalIcon />
            <span className="app-logo-text">Space<span>Intel</span></span>
          </div>
        </div>

        <div className="app-header-center">
          <span className="app-breadcrumb">
            {MODULES.find((m) => m.id === active)?.label}
          </span>
        </div>

        <div className="app-header-right">
          <div className="app-clock">{time}</div>
          <button className="header-icon-btn" aria-label="Pesquisar">
            <SearchIcon size={16} />
          </button>
          <button className="header-icon-btn" aria-label="Notificações" style={{ position: 'relative' }}>
            <BellIcon size={16} />
            <span className="notif-badge" aria-label="3 notificações">3</span>
          </button>
          <button className="header-avatar-btn" aria-label="Conta do usuário">
            <UserAvatarIcon size={16} />
          </button>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────── */}
      <div className="app-body">
        {/* Sidebar */}
        <aside className={`sidebar${sidebarOpen ? ' sidebar-open' : ''}`}>
          <nav className="sidebar-nav" aria-label="Módulos da plataforma">
            {MODULES.map((m) => (
              <Fragment key={m.id}>
                {m.id === 'sobre' && <div className="nav-divider" />}
                <button
                  className={`nav-item${active === m.id ? ' nav-item-active' : ''}`}
                  onClick={() => navigate(m.id)}
                  aria-current={active === m.id ? 'page' : undefined}
                >
                  {active === m.id && <span className="nav-indicator" aria-hidden="true" />}
                  <span className="nav-icon" aria-hidden="true">{m.icon}</span>
                  <span className="nav-label">{m.label}</span>
                </button>
              </Fragment>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-footer-status">
              <span className="sidebar-status-dot" aria-hidden="true" />
              <div className="sidebar-status-text">
                <div className="sidebar-status-label">OPERACIONAL</div>
                <div className="sidebar-status-sub">{time} UTC-3</div>
              </div>
            </div>
            <div className="sidebar-footer-live">
              <span className="app-live-dot" aria-hidden="true" />
              <span className="sidebar-live-label">LIVE</span>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
        )}

        {/* Main content */}
        <main className="app-main" id="app-main-content">
          <div key={active} className="module-enter">
            {active === 'dashboard'   && <Dashboard />}
            {active === 'orbital'     && <SatelliteTracker />}
            {active === 'alertas'     && <AlertCenter />}
            {active === 'agro'        && <AgricultureDeepDive />}
            {active === 'correlacoes' && <CorrelationExample />}
            {active === 'sobre'       && <Sobre />}
          </div>
        </main>
      </div>

      {/* ── Mobile bottom tabs ─────────────────────────────────────── */}
      <nav className="bottom-tabs" aria-label="Navegação rápida">
        {MODULES.slice(0, 5).map((m) => (
          <button
            key={m.id}
            className={`bottom-tab${active === m.id ? ' bottom-tab-active' : ''}`}
            onClick={() => navigate(m.id)}
            aria-current={active === m.id ? 'page' : undefined}
          >
            <span aria-hidden="true">{m.icon}</span>
            <span>{m.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
