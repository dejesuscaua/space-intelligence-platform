export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type AlertCategory = 'agricultural' | 'climate' | 'logistics' | 'energy' | 'security'

export interface MockAlert {
  id: string
  severity: AlertSeverity
  category: AlertCategory
  region: string
  title: string
  description: string
  correlationScore: number
  factors: string[]
  recommendation: string
  timestamp: string
  status: 'active' | 'investigating' | 'resolved'
}

export interface SatelliteInfo {
  id: string
  name: string
  orbit: 'LEO' | 'MEO' | 'GEO'
  partner: string
  coverage: string
  currentData: string
  ndvi?: number
  temp?: number
}

export interface IoTSensor {
  id: string
  name: string
  region: string
  type: 'humidity' | 'temperature' | 'pressure' | 'flow'
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  status: 'normal' | 'warning' | 'critical'
}

export const SATELLITES: SatelliteInfo[] = [
  { id: 's1', name: 'Sentinel-2A', orbit: 'LEO', partner: 'ESA', coverage: 'Europa/América do Sul', currentData: 'NDVI: 0.67', ndvi: 0.67, temp: 28.4 },
  { id: 's2', name: 'Planet Labs SkySat', orbit: 'LEO', partner: 'Planet Labs', coverage: 'Brasil/Mato Grosso', currentData: 'Queimadas: 3 detectadas', ndvi: 0.51, temp: 34.1 },
  { id: 's3', name: 'GOES-16', orbit: 'GEO', partner: 'NOAA', coverage: 'América do Sul completa', currentData: 'Tempestade Cat.2 formando', temp: 31.8 },
  { id: 's4', name: 'Starlink SAR-1', orbit: 'LEO', partner: 'SpaceX', coverage: 'Atlântico Sul', currentData: 'Frente fria: 72h', temp: 22.1 },
  { id: 's5', name: 'Landsat-9', orbit: 'LEO', partner: 'NASA/USGS', coverage: 'Amazônia Legal', currentData: 'Desmatamento: 0.3ha/h', ndvi: 0.78, temp: 29.6 },
  { id: 's6', name: 'SPOT-7', orbit: 'LEO', partner: 'Airbus DS', coverage: 'São Paulo/Paraná', currentData: 'Safra soja: 94% viável', ndvi: 0.71, temp: 26.3 },
]

export const IOT_SENSORS: IoTSensor[] = [
  { id: 'iot1', name: 'Sensor Umidade Solo #MT-047', region: 'Mato Grosso', type: 'humidity', value: 34, unit: '%', trend: 'down', status: 'warning' },
  { id: 'iot2', name: 'Estação Meteorológica #PR-012', region: 'Paraná', type: 'temperature', value: 31.2, unit: '°C', trend: 'up', status: 'warning' },
  { id: 'iot3', name: 'Sensor Pressão Hídrica #SP-089', region: 'São Paulo', type: 'pressure', value: 2.1, unit: 'bar', trend: 'stable', status: 'normal' },
  { id: 'iot4', name: 'Fluxo Hídrico Pivô #MT-113', region: 'Mato Grosso', type: 'flow', value: 18.4, unit: 'm³/h', trend: 'down', status: 'critical' },
]

export const MOCK_ALERTS: MockAlert[] = [
  {
    id: 'a1',
    severity: 'critical',
    category: 'agricultural',
    region: 'Norte do Mato Grosso',
    title: 'Risco de Queda de Produtividade — Soja',
    description: 'Combinação de fatores orbitais e terrestres indica alta probabilidade de perda.',
    correlationScore: 82,
    factors: ['Aumento térmico orbital +3.2°C', 'Umidade solo -18%', 'Atraso logístico fertilizantes +72h', 'Previsão climática severa Sev.3', 'Histórico regional fungos Alto'],
    recommendation: 'Acionar irrigação de emergência e antecipar colheita em 12 dias.',
    timestamp: '14:23',
    status: 'active',
  },
  {
    id: 'a2',
    severity: 'high',
    category: 'energy',
    region: 'Corredor SE — MG/SP',
    title: 'Risco Falha Linha de Transmissão',
    description: 'Detecção térmica orbital identificou ponto crítico em torre de 500kV.',
    correlationScore: 74,
    factors: ['Anomalia térmica +41°C em torre T-247', 'Ventos fortes >80km/h previstos', 'Falha estrutural histórica nesta região', 'Pico demanda energética próximas 48h'],
    recommendation: 'Despachar equipe de manutenção e ativar rota alternativa de transmissão.',
    timestamp: '13:47',
    status: 'investigating',
  },
  {
    id: 'a3',
    severity: 'high',
    category: 'logistics',
    region: 'Porto de Santos — SP',
    title: 'Atraso Operacional Previsto',
    description: 'Frente fria e congestionamento correlacionados indicam interrupção.',
    correlationScore: 91,
    factors: ['Frente fria: ventos 65km/h em 72h', 'Ocupação do porto: 94%', 'Atraso médio 18h na semana', 'Safra soja pico exportação'],
    recommendation: 'Redirecionar 40% carga para Paranaguá. Notificar exportadores com antecedência.',
    timestamp: '12:55',
    status: 'active',
  },
  {
    id: 'a4',
    severity: 'medium',
    category: 'climate',
    region: 'Sul da Bahia',
    title: 'Detecção de Queimada Ativa',
    description: 'Satélite identificou foco ativo com risco de propagação.',
    correlationScore: 88,
    factors: ['Foco térmico 340°C detectado orbital', 'Umidade relativa: 23%', 'Vento: 40km/h direção NE', 'Vegetação ressecada NDVI 0.31'],
    recommendation: 'Acionar defesa civil regional. Área estimada: 120ha.',
    timestamp: '12:11',
    status: 'investigating',
  },
  {
    id: 'a5',
    severity: 'low',
    category: 'agricultural',
    region: 'Triângulo Mineiro',
    title: 'Estresse Hídrico Inicial — Cana-de-açúcar',
    description: 'Sensores indicam queda gradual na umidade do solo.',
    correlationScore: 61,
    factors: ['NDVI caiu 0.12 em 7 dias', 'Umidade solo: 41% (limite: 38%)', 'Sem chuva prevista: 5 dias'],
    recommendation: 'Monitorar diariamente. Irrigação complementar em 48h se tendência mantida.',
    timestamp: '11:30',
    status: 'resolved',
  },
]

export function generateNDVIHistory(points = 24) {
  const now = new Date()
  return Array.from({ length: points }, (_, i) => {
    const t = new Date(now.getTime() - (points - i) * 3600 * 1000)
    const hour = t.getHours()
    return {
      time: `${String(hour).padStart(2, '0')}h`,
      ndvi: +(0.60 + Math.sin(i * 0.4) * 0.07 + (Math.random() - 0.5) * 0.03).toFixed(3),
      umidade: +(52 + Math.cos(i * 0.35) * 14 + (Math.random() - 0.5) * 4).toFixed(1),
    }
  })
}

export function generateTempHistory(points = 24) {
  return Array.from({ length: points }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}h`,
    temp: +(19 + Math.sin((i - 6) * Math.PI / 12) * 9 + (Math.random() - 0.5) * 1.5).toFixed(1),
    anomalia: +(Math.max(0, Math.sin((i - 10) * 0.6) * 3.5 + (Math.random() - 0.5) * 0.8)).toFixed(2),
  }))
}

export const ALERTS_BY_CATEGORY = [
  { category: 'Agrícola', value: 7, color: '#22c55e' },
  { category: 'Clima', value: 4, color: '#3b82f6' },
  { category: 'Logística', value: 5, color: '#a78bfa' },
  { category: 'Energia', value: 3, color: '#f59e0b' },
  { category: 'Segurança', value: 2, color: '#ef4444' },
]

export const SATELLITE_DISTRIBUTION = [
  { name: 'LEO Óptico', value: 42, color: '#00d4ff' },
  { name: 'Starlink/LEO', value: 28, color: '#0055cc' },
  { name: 'SAR', value: 14, color: '#a78bfa' },
  { name: 'GEO/Meteor.', value: 10, color: '#22c55e' },
  { name: 'Outros', value: 6, color: '#f59e0b' },
]

export const NDVI_GRID = Array.from({ length: 64 }, (_, i) => {
  const base = [
    0.72, 0.68, 0.71, 0.65, 0.48, 0.42, 0.38, 0.45,
    0.70, 0.74, 0.69, 0.60, 0.44, 0.39, 0.35, 0.41,
    0.66, 0.71, 0.73, 0.55, 0.40, 0.36, 0.31, 0.38,
    0.63, 0.68, 0.64, 0.50, 0.37, 0.33, 0.28, 0.35,
    0.58, 0.62, 0.59, 0.46, 0.34, 0.30, 0.25, 0.32,
    0.54, 0.57, 0.55, 0.43, 0.31, 0.27, 0.22, 0.29,
    0.51, 0.53, 0.50, 0.40, 0.28, 0.24, 0.20, 0.26,
    0.48, 0.50, 0.47, 0.37, 0.25, 0.21, 0.18, 0.23,
  ]
  return +(base[i] + (Math.random() - 0.5) * 0.04).toFixed(2)
})

export const REGIONS_RISK = [
  { name: 'Mato Grosso', risk: 78, ndvi: 0.52, moisture: 34, status: 'critical' },
  { name: 'Paraná', risk: 45, ndvi: 0.71, moisture: 58, status: 'warning' },
  { name: 'São Paulo', risk: 32, ndvi: 0.68, moisture: 62, status: 'normal' },
  { name: 'Bahia', risk: 61, ndvi: 0.41, moisture: 29, status: 'warning' },
]

export const CORRELATION_SCENARIOS = {
  agricultural: {
    title: 'Queda de Produtividade — Soja',
    region: 'Norte do Mato Grosso',
    probability: 82,
    color: '#22c55e',
    signals: [
      { label: 'Aumento térmico orbital', value: '+3.2°C', weight: 88, icon: '🛰️', color: '#ef4444' },
      { label: 'Queda de umidade local', value: '-18%', weight: 76, icon: '💧', color: '#f59e0b' },
      { label: 'Atraso logístico detectado', value: '+72h', weight: 64, icon: '🚛', color: '#a78bfa' },
      { label: 'Previsão climática severa', value: 'Sev 3', weight: 91, icon: '⛈️', color: '#f97316' },
      { label: 'Histórico regional de fungos', value: 'Alto risco', weight: 72, icon: '🌿', color: '#22c55e' },
      { label: 'Aumento preço commodities', value: '+12%', weight: 55, icon: '📈', color: '#00d4ff' },
    ],
    recommendation: 'Acionar irrigação de emergência e antecipar colheita em 12 dias. Notificar seguradora.',
  },
  energy: {
    title: 'Falha em Linha de Transmissão',
    region: 'Corredor MG/SP — 500kV',
    probability: 74,
    color: '#f59e0b',
    signals: [
      { label: 'Anomalia térmica em torre', value: '+41°C', weight: 94, icon: '🔥', color: '#ef4444' },
      { label: 'Vento forte previsto', value: '>80km/h', weight: 82, icon: '💨', color: '#3b82f6' },
      { label: 'Histórico falhas estruturais', value: '3 ocorr.', weight: 69, icon: '⚡', color: '#f59e0b' },
      { label: 'Pico de demanda energética', value: '+28%', weight: 77, icon: '📊', color: '#a78bfa' },
      { label: 'Umidade corrosiva detectada', value: '94% UR', weight: 61, icon: '💦', color: '#00d4ff' },
    ],
    recommendation: 'Despachar equipe manutenção urgente. Ativar rota alternativa de transmissão preventivamente.',
  },
  logistics: {
    title: 'Interrupção Porto de Santos',
    region: 'Baixada Santista — SP',
    probability: 91,
    color: '#00d4ff',
    signals: [
      { label: 'Frente fria detectada orbital', value: '65km/h', weight: 89, icon: '🌊', color: '#3b82f6' },
      { label: 'Ocupação porto crítica', value: '94%', weight: 95, icon: '⚓', color: '#ef4444' },
      { label: 'Atraso médio semanal', value: '+18h', weight: 78, icon: '⏱️', color: '#f59e0b' },
      { label: 'Pico safra exportação soja', value: 'Máx.', weight: 85, icon: '🌾', color: '#22c55e' },
      { label: 'Congestionamento rodoviário', value: '+340%', weight: 72, icon: '🚛', color: '#a78bfa' },
    ],
    recommendation: 'Redirecionar 40% da carga para Paranaguá. Notificar exportadores com 72h de antecedência.',
  },
}
