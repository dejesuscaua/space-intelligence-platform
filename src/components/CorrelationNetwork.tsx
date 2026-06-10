'use client'

/* Rede neural de correlação: sinais convergindo no núcleo de IA
   com partículas de dados fluindo pelas conexões. */

interface Signal {
  label: string
  value: string
  weight: number
  icon: string
  color: string
}

interface Scenario {
  title: string
  region: string
  probability: number
  color: string
  signals: Signal[]
}

const CORE_X = 330
const CORE_Y = 195
const NODE_W = 158
const NODE_H = 40

export default function CorrelationNetwork({
  scenario,
  activeSignals,
  showResult,
}: {
  scenario: Scenario
  activeSignals: number[]
  showResult: boolean
}) {
  const n = scenario.signals.length
  const startY = 195 - ((n - 1) * 56) / 2

  return (
    <svg viewBox="0 0 560 390" style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="Rede de correlação de sinais convergindo no núcleo de IA">
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={`${scenario.color}55`} />
          <stop offset="100%" stopColor={`${scenario.color}00`} />
        </radialGradient>
        <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Conexões sinal → núcleo */}
      {scenario.signals.map((s, i) => {
        const y = startY + i * 56
        const active = activeSignals.includes(i)
        const d = `M${NODE_W + 10},${y} C${230},${y} ${250},${CORE_Y} ${CORE_X - 38},${CORE_Y}`
        return (
          <g key={`edge-${i}`}>
            <path id={`corr-edge-${i}`} d={d} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
            {active && (
              <>
                <path d={d} fill="none" stroke={s.color} strokeWidth="1.2" strokeDasharray="5 7" opacity="0.55" className="beam-flow" />
                {/* Partículas de dados */}
                {[0, 0.8].map((delay) => (
                  <circle key={delay} r="2.6" fill={s.color} filter="url(#nodeGlow)">
                    <animateMotion dur="1.6s" begin={`${delay}s`} repeatCount="indefinite">
                      <mpath href={`#corr-edge-${i}`} />
                    </animateMotion>
                  </circle>
                ))}
              </>
            )}
          </g>
        )
      })}

      {/* Nós de sinal */}
      {scenario.signals.map((s, i) => {
        const y = startY + i * 56
        const active = activeSignals.includes(i)
        return (
          <g key={`node-${i}`} opacity={active ? 1 : 0.32} style={{ transition: 'opacity 0.5s ease' }}>
            <rect x="8" y={y - NODE_H / 2} width={NODE_W} height={NODE_H} rx="9"
              fill="rgba(13,21,48,0.85)"
              stroke={active ? s.color : 'rgba(255,255,255,0.12)'}
              strokeWidth={active ? 1.4 : 1}
            />
            <text x="22" y={y + 5} fontSize="13">{s.icon}</text>
            <text x="40" y={y - 3} fontSize="8.5" fill="#94a3b8">{s.label}</text>
            <text x="40" y={y + 10} fontSize="9.5" fontWeight="700" fill={s.color}>{s.value}</text>
            {/* Peso do sinal */}
            <text x={NODE_W} y={y + 4} textAnchor="end" fontSize="8" fontFamily="monospace" fill={active ? s.color : '#64748b'}>
              {s.weight}%
            </text>
          </g>
        )
      })}

      {/* Núcleo de IA */}
      <circle cx={CORE_X} cy={CORE_Y} r="72" fill="url(#coreGlow)" opacity={showResult ? 1 : 0.45} style={{ transition: 'opacity 0.6s ease' }} />
      <circle cx={CORE_X} cy={CORE_Y} r="46" fill="none" stroke={scenario.color} strokeWidth="0.8" strokeDasharray="3 8" opacity="0.6">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${CORE_X} ${CORE_Y}`} to={`360 ${CORE_X} ${CORE_Y}`} dur="14s" repeatCount="indefinite" />
      </circle>
      <circle cx={CORE_X} cy={CORE_Y} r="38" fill="none" stroke="rgba(0,212,255,0.35)" strokeWidth="0.8" strokeDasharray="14 6">
        <animateTransform attributeName="transform" type="rotate" from={`360 ${CORE_X} ${CORE_Y}`} to={`0 ${CORE_X} ${CORE_Y}`} dur="10s" repeatCount="indefinite" />
      </circle>
      {/* Hexágono central */}
      <polygon
        points={`${CORE_X},${CORE_Y - 26} ${CORE_X + 22.5},${CORE_Y - 13} ${CORE_X + 22.5},${CORE_Y + 13} ${CORE_X},${CORE_Y + 26} ${CORE_X - 22.5},${CORE_Y + 13} ${CORE_X - 22.5},${CORE_Y - 13}`}
        fill="rgba(0,212,255,0.08)"
        stroke={scenario.color}
        strokeWidth="1.4"
        filter="url(#nodeGlow)"
      />
      <circle cx={CORE_X} cy={CORE_Y} r="6" fill={scenario.color}>
        <animate attributeName="opacity" values="1;0.35;1" dur={showResult ? '0.7s' : '2s'} repeatCount="indefinite" />
      </circle>
      <text x={CORE_X} y={CORE_Y + 44} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="rgba(0,212,255,0.8)" fontWeight="700">
        SPACE COGNITIVE ENGINE
      </text>
      <text x={CORE_X} y={CORE_Y + 56} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#64748b">
        {activeSignals.length}/{n} SINAIS CORRELACIONADOS
      </text>

      {/* Saída núcleo → resultado */}
      <path id="corr-out" d={`M${CORE_X + 40},${CORE_Y} L462,${CORE_Y}`} fill="none" stroke={showResult ? scenario.color : 'rgba(255,255,255,0.06)'} strokeWidth="1.4" strokeDasharray="6 7" opacity={showResult ? 0.8 : 1} className={showResult ? 'beam-flow' : undefined} />
      {showResult && (
        <circle r="3" fill={scenario.color} filter="url(#nodeGlow)">
          <animateMotion dur="1s" repeatCount="indefinite">
            <mpath href="#corr-out" />
          </animateMotion>
        </circle>
      )}

      {/* Nó de resultado */}
      <g opacity={showResult ? 1 : 0.25} style={{ transition: 'opacity 0.6s ease' }}>
        <circle cx="500" cy={CORE_Y} r="40" fill="rgba(13,21,48,0.9)" stroke={scenario.color} strokeWidth={showResult ? 1.6 : 1} />
        {showResult && (
          <circle cx="500" cy={CORE_Y} fill="none" stroke={scenario.color} strokeWidth="1">
            <animate attributeName="r" values="40;52" dur="1.6s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0" dur="1.6s" repeatCount="indefinite" />
          </circle>
        )}
        <text x="500" y={CORE_Y - 2} textAnchor="middle" fontSize="20" fontWeight="800" fill={scenario.color}>
          {showResult ? `${scenario.probability}%` : '—'}
        </text>
        <text x="500" y={CORE_Y + 13} textAnchor="middle" fontSize="7" fontFamily="monospace" fill="#94a3b8">
          PROBABILIDADE
        </text>
        <text x="500" y={CORE_Y + 56} textAnchor="middle" fontSize="7.5" fontFamily="monospace" fill={showResult ? scenario.color : '#64748b'} fontWeight="700">
          {showResult ? 'INSIGHT GERADO' : 'PROCESSANDO...'}
        </text>
      </g>
    </svg>
  )
}
