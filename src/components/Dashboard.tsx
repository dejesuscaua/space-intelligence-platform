'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  generateNDVIHistory, generateTempHistory,
  ALERTS_BY_CATEGORY, SATELLITE_DISTRIBUTION, MOCK_ALERTS,
} from '@/data/mock'
import { PinIcon } from './icons/NavIcons'

const SEVERITY_COLOR: Record<string, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#22c55e',
}

const SEVERITY_LABEL: Record<string, string> = {
  critical: 'Crítico',
  high: 'Alto',
  medium: 'Médio',
  low: 'Baixo',
}

function useLiveCounter(target: number, interval = 4200) {
  const [value, setValue] = useState(target)
  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => v + Math.floor(Math.random() * 3 - 1))
    }, interval)
    return () => clearInterval(id)
  }, [interval])
  return value
}

function KpiCard({ label, value, unit, color, sub, live }: {
  label: string; value: string; unit?: string; color: string; sub?: string; live?: boolean
}) {
  return (
    <div className="glass-card kpi-card">
      {live && <span className="live-dot" aria-hidden="true" />}
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color }}>
        {value}
        {unit && <span className="kpi-unit">{unit}</span>}
      </div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  )
}

function AlertModal({ alert, onClose }: { alert: typeof MOCK_ALERTS[0]; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const c = SEVERITY_COLOR[alert.severity]
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-severity-badge" style={{ background: `${c}22`, color: c, border: `1px solid ${c}55` }}>
            {SEVERITY_LABEL[alert.severity]}
          </span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <h3 className="modal-title">{alert.title}</h3>
        <p className="modal-region" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <PinIcon size={12} />
          {alert.region}
        </p>
        <div className="modal-section-label">Fatores de Correlação</div>
        <div className="modal-factors">
          {alert.factors.map((f, i) => (
            <div key={i} className="modal-factor">
              <div className="modal-factor-bar-track">
                <div
                  className="modal-factor-bar"
                  style={{ width: `${70 + i * 5}%`, background: c }}
                />
              </div>
              <span>{f}</span>
            </div>
          ))}
        </div>
        <div className="modal-section-label">Recomendação IA</div>
        <div className="modal-recommendation">{alert.recommendation}</div>
        <div className="modal-score">
          Score de Correlação: <strong style={{ color: c }}>{alert.correlationScore}%</strong>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [ndviData, setNdviData] = useState(() => generateNDVIHistory(12))
  const [tempData] = useState(() => generateTempHistory(12))
  const [activeAlerts, setActiveAlerts] = useState(MOCK_ALERTS.slice(0, 4))
  const [selectedAlert, setSelectedAlert] = useState<typeof MOCK_ALERTS[0] | null>(null)
  const [dataPoints, setDataPoints] = useState(2_412_847)
  const [ndviAvg, setNdviAvg] = useState(0.64)
  const alertIdx = useRef(0)
  const activeSats = useLiveCounter(6127)

  const addNdviPoint = useCallback(() => {
    setNdviData((prev) => {
      const last = prev[prev.length - 1]
      const lastHour = parseInt(last.time)
      const nextHour = (lastHour + 1) % 24
      const newNdvi = +(last.ndvi + (Math.random() - 0.5) * 0.04).toFixed(3)
      const newUmidade = +(last.umidade + (Math.random() - 0.5) * 3).toFixed(1)
      setNdviAvg(+(newNdvi * 0.1 + ndviAvg * 0.9).toFixed(3))
      return [...prev.slice(1), { time: `${String(nextHour).padStart(2, '0')}h`, ndvi: newNdvi, umidade: Math.min(95, Math.max(20, newUmidade)) }]
    })
  }, [ndviAvg])

  useEffect(() => {
    const id = setInterval(addNdviPoint, 5000)
    return () => clearInterval(id)
  }, [addNdviPoint])

  useEffect(() => {
    const id = setInterval(() => {
      setDataPoints((p) => p + Math.floor(Math.random() * 24000 + 8000))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      alertIdx.current = (alertIdx.current + 1) % MOCK_ALERTS.length
      setActiveAlerts(MOCK_ALERTS.slice(alertIdx.current, alertIdx.current + 4).concat(
        MOCK_ALERTS.slice(0, Math.max(0, alertIdx.current + 4 - MOCK_ALERTS.length))
      ))
    }, 10000)
    return () => clearInterval(id)
  }, [])

  const dpFormatted = dataPoints.toLocaleString('pt-BR')

  return (
    <section id="dashboard" className="section-alt">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span className="live-dot" style={{ position: 'static', display: 'inline-block' }} />
            Demo ao Vivo — Dados Simulados
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Central de <span className="gradient-text">Inteligência Orbital</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Dados simulados em tempo real: satélites, IoT e IA correlacionando bilhões de sinais simultaneamente.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          <KpiCard label="SATÉLITES ATIVOS" value={activeSats.toLocaleString('pt-BR')} color="#00d4ff" sub="Rede global monitorada" live />
          <KpiCard label="NDVI MÉDIO GLOBAL" value={ndviAvg.toFixed(3)} color="#22c55e" sub="Vegetação saudável" live />
          <KpiCard label="ALERTAS ATIVOS" value="21" color="#ef4444" sub="5 categorias monitoradas" />
          <KpiCard label="UPTIME" value="99.97" unit="%" color="#a78bfa" sub="Últimas 720h" />
        </div>

        <div className="grid-4" style={{ marginBottom: 28 }}>
          <KpiCard label="DATA POINTS / SEG" value="2.4M+" color="#f59e0b" sub="Processamento em tempo real" live />
          <KpiCard label="REGIÕES MONITORADAS" value="847" color="#00d4ff" sub="40 países" />
          <KpiCard label="ACURÁCIA PREDITIVA" value="82" unit="%" color="#22c55e" sub="Correlation Intelligence™" />
          <KpiCard label="PONTOS PROCESSADOS" value={dpFormatted.slice(-9)} color="#a78bfa" sub="Última hora" live />
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="glass-card" style={{ padding: '24px 28px' }}>
            <div className="chart-header">
              <span>NDVI & Umidade — Últimas 24h</span>
              <span className="live-badge">LIVE</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ndviData} margin={{ top: 4, right: 4, bottom: 4, left: -24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} interval={2} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0d1530', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#94a3b8' }} />
                <Line type="monotone" dataKey="ndvi" stroke="#22c55e" strokeWidth={2} dot={false} name="NDVI" isAnimationActive={false} />
                <Line type="monotone" dataKey="umidade" stroke="#3b82f6" strokeWidth={2} dot={false} name="Umidade %" isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '24px 28px' }}>
            <div className="chart-header"><span>Distribuição Orbital</span></div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={SATELLITE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {SATELLITE_DISTRIBUTION.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0d1530', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 8, justifyContent: 'center' }}>
              {SATELLITE_DISTRIBUTION.map((d) => (
                <span key={d.name} style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
                  {d.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div className="glass-card" style={{ padding: '24px 28px' }}>
            <div className="chart-header"><span>Temperatura Orbital — Anomalia Térmica</span></div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={tempData} margin={{ top: 4, right: 4, bottom: 4, left: -24 }}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="anomGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} interval={3} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0d1530', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#94a3b8' }} />
                <Area type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} fill="url(#tempGrad)" name="Temp (°C)" isAnimationActive={false} />
                <Area type="monotone" dataKey="anomalia" stroke="#ef4444" strokeWidth={1.5} fill="url(#anomGrad)" name="Anomalia (°C)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '24px 28px' }}>
            <div className="chart-header"><span>Alertas por Categoria — 24h</span></div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ALERTS_BY_CATEGORY} margin={{ top: 4, right: 4, bottom: 4, left: -24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0d1530', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8, fontSize: 12 }} labelStyle={{ color: '#94a3b8' }} />
                {ALERTS_BY_CATEGORY.map((entry) => (
                  <Bar key={entry.category} dataKey="value" fill={entry.color} radius={[4, 4, 0, 0]} name="Alertas" />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Feed */}
        <div className="glass-card" style={{ padding: '24px 28px' }}>
          <div className="chart-header" style={{ marginBottom: 16 }}>
            <span>Feed de Alertas — Tempo Real</span>
            <span className="live-badge">LIVE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activeAlerts.map((alert) => {
              const c = SEVERITY_COLOR[alert.severity]
              return (
                <div
                  key={alert.id}
                  className="alert-feed-row"
                  style={{ borderLeft: `3px solid ${c}` }}
                  onClick={() => setSelectedAlert(alert)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') setSelectedAlert(alert) }}
                >
                  <span className="alert-feed-severity" style={{ background: `${c}22`, color: c }}>
                    {SEVERITY_LABEL[alert.severity]}
                  </span>
                  <span className="alert-feed-title">{alert.title}</span>
                  <span className="alert-feed-region" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <PinIcon size={11} />
                    {alert.region}
                  </span>
                  <span className="alert-feed-score" style={{ color: c }}>{alert.correlationScore}%</span>
                  <span className="alert-feed-time">{alert.timestamp}</span>
                  <button className="alert-feed-btn">Ver Análise</button>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ marginTop: 24, padding: '18px 28px', background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>ECONOMIA ESPACIAL GLOBAL</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              US$ 630 bilhões <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 400 }}>atual</span>
              {' → '}
              <span style={{ color: '#22c55e' }}>US$ 1 trilhão+</span>{' '}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 400 }}>até 2030</span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
            Fonte: Morgan Stanley · SpaceX · Planet Labs · ESA · 2024
          </div>
        </div>
      </div>

      {selectedAlert && <AlertModal alert={selectedAlert} onClose={() => setSelectedAlert(null)} />}
    </section>
  )
}
