'use client'

import { useState, useEffect } from 'react'
import { MOCK_ALERTS, MockAlert } from '@/data/mock'
import {
  AgriCatIcon,
  ClimateCatIcon,
  LogisticsCatIcon,
  EnergyCatIcon,
  SecurityCatIcon,
  PinIcon,
  AlertIcon,
  SearchIcon,
  CheckIcon,
} from './icons/NavIcons'

const SEV_COLOR: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
}
const SEV_LABEL: Record<string, string> = {
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Médio',
  low: 'Baixo',
}
const CAT_ICON: Record<string, React.ReactNode> = {
  agricultural: <AgriCatIcon size={16} />,
  climate:      <ClimateCatIcon size={16} />,
  logistics:    <LogisticsCatIcon size={16} />,
  energy:       <EnergyCatIcon size={16} />,
  security:     <SecurityCatIcon size={16} />,
}

const ACTIONS_LOG = [
  { time: '14:24', action: 'Irrigação ativada — Fazenda São João, MT', status: 'success' },
  { time: '14:23', action: 'Seguradora notificada — Apólice #AGR-7721', status: 'success' },
  { time: '14:21', action: 'Equipe manutenção despachada — Torre T-247', status: 'success' },
  { time: '14:18', action: 'Rota alternativa ativada — Paranaguá', status: 'success' },
  { time: '14:15', action: 'Defesa Civil notificada — Sul da Bahia', status: 'pending' },
]

function AlertCard({ alert, onAction }: { alert: MockAlert; onAction: (id: string) => void }) {
  const c = SEV_COLOR[alert.severity]
  const [actioned, setActioned] = useState(false)

  return (
    <div
      className={`alert-center-card glass-card ${alert.severity === 'critical' ? 'alert-pulse-border' : ''}`}
      style={{ borderLeft: `3px solid ${c}` }}
    >
      <div className="alert-center-top">
        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
          {CAT_ICON[alert.category]}
        </span>
        <span className="alert-center-severity" style={{ background: `${c}20`, color: c }}>
          {SEV_LABEL[alert.severity]}
        </span>
        <span className="alert-center-time">{alert.timestamp}</span>
      </div>
      <div className="alert-center-title">{alert.title}</div>
      <div className="alert-center-region" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <PinIcon size={11} />
        {alert.region}
      </div>
      <div className="alert-center-factors">
        {alert.factors.slice(0, 3).map((f, i) => (
          <div key={i} className="alert-center-factor">{f}</div>
        ))}
        {alert.factors.length > 3 && (
          <div className="alert-center-factor" style={{ color: 'var(--text-muted)' }}>+{alert.factors.length - 3} fatores</div>
        )}
      </div>
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Score: <span style={{ color: c, fontWeight: 700 }}>{alert.correlationScore}%</span>
        </span>
        <button
          className={`alert-action-btn ${actioned ? 'alert-action-btn-done' : ''}`}
          style={actioned ? { background: '#22c55e22', color: '#22c55e', borderColor: '#22c55e44' } : { borderColor: `${c}44`, color: c }}
          onClick={() => { setActioned(true); onAction(alert.id) }}
          disabled={actioned}
        >
          {actioned ? 'Executado' : 'Executar Ação'}
        </button>
      </div>
    </div>
  )
}

export default function AlertCenter() {
  const [critical, setCritical] = useState(MOCK_ALERTS.filter((a) => a.severity === 'critical'))
  const [investigating, setInvestigating] = useState(MOCK_ALERTS.filter((a) => a.status === 'investigating'))
  const [resolved] = useState(MOCK_ALERTS.filter((a) => a.status === 'resolved'))
  const [actionsLog, setActionsLog] = useState(ACTIONS_LOG)
  const [newAlertFlash, setNewAlertFlash] = useState(false)
  const [systemTime, setSystemTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setSystemTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`)
    }
    updateTime()
    const id = setInterval(updateTime, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setNewAlertFlash(true)
      setTimeout(() => setNewAlertFlash(false), 3000)
      setActionsLog((prev) => [
        {
          time: systemTime || '14:30',
          action: ['Sistema monitorando anomalia — Região Sul MT', 'Análise preditiva atualizada — 6 regiões', 'Relatório automático gerado — exportadores'][Math.floor(Math.random() * 3)],
          status: 'success' as const,
        },
        ...prev.slice(0, 4),
      ])
    }, 18000)
    return () => clearInterval(id)
  }, [systemTime])

  const handleAction = (id: string) => {
    setActionsLog((prev) => [
      { time: systemTime, action: `Ação executada para alerta #${id} — workflow automatizado`, status: 'success' as const },
      ...prev.slice(0, 4),
    ])
  }

  return (
    <section id="alert-center" className="section-alt">
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <div className="badge" style={{ marginBottom: 8 }}>Action Layer — Camada Operacional</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.02em' }}>
              Central de <span className="gradient-text">Comando</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8, maxWidth: 480, lineHeight: 1.6 }}>
              Inteligência convertida em ação. Alertas automáticos, recomendações IA e workflows executados em tempo real.
            </p>
          </div>
          <div className="system-status-panel">
            <div className="system-status-dot" />
            <div>
              <div className="system-status-label">SISTEMA OPERACIONAL</div>
              <div className="system-status-time">{systemTime} UTC-3</div>
            </div>
          </div>
        </div>

        {/* New alert flash */}
        {newAlertFlash && (
          <div className="new-alert-banner" role="alert">
            <span className="live-dot" style={{ position: 'static', display: 'inline-block' }} />
            Novo sinal orbital detectado — análise em processamento...
          </div>
        )}

        {/* 3-column board */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 28 }}>
          {/* Critical */}
          <div>
            <div className="board-col-header" style={{ borderColor: '#ef444444', color: '#ef4444' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <AlertIcon size={14} />
                Alertas Críticos
              </span>
              <span className="board-col-count" style={{ background: '#ef444422' }}>{critical.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {critical.map((a) => <AlertCard key={a.id} alert={a} onAction={handleAction} />)}
            </div>
          </div>

          {/* Investigating */}
          <div>
            <div className="board-col-header" style={{ borderColor: '#f97316aa', color: '#f97316' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <SearchIcon size={14} />
                Em Investigação
              </span>
              <span className="board-col-count" style={{ background: '#f9731622' }}>{investigating.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {investigating.map((a) => <AlertCard key={a.id} alert={a} onAction={handleAction} />)}
            </div>
          </div>

          {/* Resolved */}
          <div>
            <div className="board-col-header" style={{ borderColor: '#22c55e44', color: '#22c55e' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <CheckIcon size={14} />
                Resolvidos
              </span>
              <span className="board-col-count" style={{ background: '#22c55e22' }}>{resolved.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {resolved.map((a) => <AlertCard key={a.id} alert={a} onAction={handleAction} />)}
            </div>
          </div>
        </div>

        {/* Actions log */}
        <div className="glass-card" style={{ padding: '20px 24px' }}>
          <div className="chart-header" style={{ marginBottom: 14 }}>
            <span>Log de Automações — Workflows Executados</span>
            <span className="live-badge">LIVE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {actionsLog.map((log, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 8, fontSize: '0.85rem', animation: i === 0 ? 'fadeInUp 0.4s ease' : 'none' }}>
                <span style={{ color: '#22c55e', fontFamily: 'monospace', fontSize: 11, flexShrink: 0 }}>{log.time}</span>
                <CheckIcon size={12} style={{ color: '#22c55e', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{log.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
