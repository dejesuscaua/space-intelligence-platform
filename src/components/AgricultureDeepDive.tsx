'use client'

import { useState, useEffect } from 'react'
import { NDVI_GRID, REGIONS_RISK, IOT_SENSORS } from '@/data/mock'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { HumidityIcon, TemperatureIcon, PressureIcon, FlowIcon, PinIcon, BrainIcon } from './icons/NavIcons'

const SENSOR_ICON: Record<string, React.ReactNode> = {
  humidity:    <HumidityIcon size={18} />,
  temperature: <TemperatureIcon size={18} />,
  pressure:    <PressureIcon size={18} />,
  flow:        <FlowIcon size={18} />,
}

function ndviColor(v: number): string {
  if (v >= 0.65) return '#16a34a'
  if (v >= 0.55) return '#22c55e'
  if (v >= 0.45) return '#84cc16'
  if (v >= 0.35) return '#eab308'
  if (v >= 0.25) return '#f97316'
  return '#ef4444'
}

const STATUS_COLOR: Record<string, string> = { normal: '#22c55e', warning: '#f59e0b', critical: '#ef4444' }
const STATUS_LABEL: Record<string, string> = { normal: 'Normal', warning: 'Alerta', critical: 'Crítico' }
const SENSOR_MAX: Record<string, number> = { humidity: 100, temperature: 50, pressure: 5, flow: 40 }

function IoTGauge({ sensor }: { sensor: typeof IOT_SENSORS[0] }) {
  const statusColor = STATUS_COLOR[sensor.status] ?? '#22c55e'
  const statusLabel = STATUS_LABEL[sensor.status] ?? 'Normal'
  const max = SENSOR_MAX[sensor.type] ?? 100
  const pct = Math.min(100, (sensor.value / max) * 100)

  return (
    <div className="glass-card iot-gauge-card">
      <div className="iot-gauge-header">
        <span className="iot-gauge-icon" style={{ color: statusColor, display: 'flex', alignItems: 'center' }}>
          {SENSOR_ICON[sensor.type]}
        </span>
        <div>
          <div className="iot-gauge-name">{sensor.name.split('#')[0].trim()}</div>
          <div className="iot-gauge-region" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <PinIcon size={10} />
            {sensor.region}
          </div>
        </div>
        <div className="iot-gauge-status-dot" style={{ background: statusColor }} />
      </div>
      <div className="iot-gauge-value" style={{ color: statusColor }}>
        {sensor.value}<span className="iot-gauge-unit">{sensor.unit}</span>
      </div>
      <div className="iot-gauge-bar-track">
        <div className="iot-gauge-bar-fill" style={{ width: `${pct}%`, background: statusColor }} />
      </div>
      <div className="iot-gauge-trend">
        <span style={{ color: sensor.trend === 'up' ? '#ef4444' : sensor.trend === 'down' ? '#f97316' : '#22c55e' }}>
          {sensor.trend === 'up' ? '↑ subindo' : sensor.trend === 'down' ? '↓ caindo' : '→ estável'}
        </span>
        <span style={{ color: statusColor, fontWeight: 600, fontSize: 11 }}>{statusLabel}</span>
      </div>
    </div>
  )
}

const HARVEST_FORECAST = [
  { month: 'Jun', viavel: 94, risco: 6 },
  { month: 'Jul', viavel: 88, risco: 12 },
  { month: 'Ago', viavel: 79, risco: 21 },
  { month: 'Set', viavel: 71, risco: 29 },
]

export default function AgricultureDeepDive() {
  const [grid, setGrid] = useState(NDVI_GRID)
  const [sensors, setSensors] = useState(IOT_SENSORS)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setGrid((prev) =>
        prev.map((v) => +(Math.max(0.15, Math.min(0.85, v + (Math.random() - 0.5) * 0.04))).toFixed(2))
      )
      setSensors((prev) =>
        prev.map((s) => ({
          ...s,
          value: +(s.value + (Math.random() - 0.5) * (s.type === 'temperature' ? 0.5 : s.type === 'humidity' ? 1.5 : 0.3)).toFixed(1),
        }))
      )
      setTick((t) => t + 1)
    }, 6000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="agro-demo" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge">Demo ao Vivo — Agronegócio</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Monitoramento Agrícola <span className="gradient-text">Inteligente</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Dados satelitais NDVI, sensores IoT e previsão de safra correlacionados em tempo real.
            Atualiza a cada 6 segundos simulando feed orbital.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* NDVI Grid */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div className="chart-header" style={{ marginBottom: 16 }}>
              <span>Mapa NDVI — Sentinel-2A</span>
              <span className="live-badge">LIVE</span>
            </div>
            <div className="ndvi-grid" aria-label="Grade de índice NDVI por satélite">
              {grid.map((v, i) => (
                <div
                  key={i}
                  className="ndvi-cell"
                  title={`NDVI: ${v}`}
                  style={{ background: ndviColor(v) }}
                />
              ))}
            </div>
            <div className="ndvi-legend">
              {[
                { color: '#16a34a', label: '>0.65 Saudável' },
                { color: '#84cc16', label: '0.45–0.55 Moderado' },
                { color: '#eab308', label: '0.35–0.44 Estresse' },
                { color: '#ef4444', label: '<0.25 Crítico' },
              ].map((l) => (
                <span key={l.label} className="ndvi-legend-item">
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color, display: 'inline-block' }} />
                  {l.label}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, textAlign: 'center' }}>
              Resolução 10m/px · Norte MT · Atualização #{tick + 1}
            </div>
          </div>

          {/* Region Risk Scores */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div className="chart-header" style={{ marginBottom: 16 }}>
              <span>Score de Risco por Região</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {REGIONS_RISK.map((r) => {
                const c = r.risk >= 70 ? '#ef4444' : r.risk >= 50 ? '#f97316' : r.risk >= 35 ? '#f59e0b' : '#22c55e'
                return (
                  <div key={r.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{r.name}</span>
                      <span style={{ fontSize: '0.85rem', color: c, fontWeight: 700 }}>Risco: {r.risk}%</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${r.risk}%`, background: c, borderRadius: 4, transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                      <span>NDVI: {r.ndvi}</span>
                      <span>Umidade: {r.moisture}%</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: 20 }}>
              <div className="chart-header" style={{ marginBottom: 12 }}>
                <span>Previsão Viabilidade Safra — Próx. 4 meses</span>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={HARVEST_FORECAST} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                  <defs>
                    <linearGradient id="viavelGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="riscoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#0d1530', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="viavel" stroke="#22c55e" strokeWidth={2} fill="url(#viavelGrad)" name="Viável %" />
                  <Area type="monotone" dataKey="risco" stroke="#ef4444" strokeWidth={1.5} fill="url(#riscoGrad)" name="Risco %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* IoT Sensors */}
        <div>
          <div className="chart-header" style={{ marginBottom: 16 }}>
            <span style={{ fontSize: '1rem', fontWeight: 700 }}>Sensores IoT em Campo</span>
            <span className="live-badge">LIVE</span>
          </div>
          <div className="grid-4">
            {sensors.map((s) => <IoTGauge key={s.id} sensor={s} />)}
          </div>
        </div>

        <div style={{ marginTop: 24, padding: '16px 24px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ color: '#22c55e', display: 'flex', alignItems: 'center', paddingTop: 2, flexShrink: 0 }}>
            <BrainIcon size={22} />
          </span>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 700, marginBottom: 4 }}>Insight IA — Space Cognitive Engine</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Correlação identificada entre <strong style={{ color: 'var(--text-primary)' }}>déficit hídrico no MT</strong> e{' '}
              <strong style={{ color: 'var(--text-primary)' }}>anomalia térmica orbital (+3.2°C)</strong>.
              Probabilidade de queda na produtividade de soja: <strong style={{ color: '#ef4444' }}>82%</strong>.
              Recomendação: acionar irrigação emergencial e antecipar janela de colheita em 12 dias.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
