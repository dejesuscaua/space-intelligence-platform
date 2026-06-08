type IconProps = { size?: number; className?: string; style?: React.CSSProperties }

const defaults = (size = 18) => ({
  width: size,
  height: size,
  viewBox: '0 0 18 18',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
})

// ── Sidebar navigation ────────────────────────────────────────────────────────

export function DashboardIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <rect x="2" y="2" width="6" height="6" rx="1.5" />
      <rect x="10" y="2" width="6" height="6" rx="1.5" />
      <rect x="2" y="10" width="6" height="6" rx="1.5" />
      <rect x="10" y="10" width="6" height="6" rx="1.5" />
    </svg>
  )
}

export function OrbitalMapIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <circle cx="9" cy="9" r="3" />
      <ellipse cx="9" cy="9" rx="8" ry="3.5" />
      <ellipse cx="9" cy="9" rx="8" ry="3.5" transform="rotate(60 9 9)" />
      <ellipse cx="9" cy="9" rx="8" ry="3.5" transform="rotate(120 9 9)" />
    </svg>
  )
}

export function AlertIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M9 2L16.5 15H1.5L9 2Z" />
      <line x1="9" y1="7.5" x2="9" y2="10.5" />
      <circle cx="9" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function AgroIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <rect x="2" y="10" width="2.5" height="6" rx="1" />
      <rect x="6" y="6" width="2.5" height="10" rx="1" />
      <rect x="10" y="8" width="2.5" height="8" rx="1" />
      <rect x="14" y="4" width="2.5" height="12" rx="1" />
    </svg>
  )
}

export function CorrelationIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <circle cx="6.5" cy="9" r="5" />
      <circle cx="11.5" cy="9" r="5" />
    </svg>
  )
}

export function AboutIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <circle cx="9" cy="9" r="7.5" />
      <line x1="9" y1="8" x2="9" y2="13" />
      <circle cx="9" cy="5.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────

export function SearchIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <circle cx="7.5" cy="7.5" r="5" />
      <line x1="11.5" y1="11.5" x2="16" y2="16" />
    </svg>
  )
}

export function BellIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M9 2a5 5 0 0 1 5 5v3l1.5 2.5H2.5L4 10V7a5 5 0 0 1 5-5Z" />
      <path d="M7.5 14.5a1.5 1.5 0 0 0 3 0" />
    </svg>
  )
}

export function UserAvatarIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <circle cx="9" cy="6.5" r="3" />
      <path d="M2 16c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </svg>
  )
}

// ── BusinessModel cards ───────────────────────────────────────────────────────

export function EnterpriseIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <rect x="3" y="6" width="12" height="10" rx="1" />
      <path d="M1 16h16" />
      <path d="M6 6V4a3 3 0 0 1 6 0v2" />
      <line x1="6" y1="10" x2="6" y2="10" strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="10" x2="9" y2="10" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="10" x2="12" y2="10" strokeWidth="2" strokeLinecap="round" />
      <rect x="7" y="12" width="4" height="4" rx="0.5" />
    </svg>
  )
}

export function ApiIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M5 5L2 9l3 4" />
      <path d="M13 5l3 4-3 4" />
      <line x1="11" y1="3" x2="7" y2="15" />
    </svg>
  )
}

export function RadarIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M9 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
      <path d="M5.5 5.5a5 5 0 0 0 0 7" />
      <path d="M12.5 5.5a5 5 0 0 1 0 7" />
      <path d="M3 3a9 9 0 0 0 0 12" />
      <path d="M15 3a9 9 0 0 1 0 12" />
    </svg>
  )
}

export function BrainIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M9 4C9 4 7 3 5.5 4.5C4 6 4 8 5 9.5C4 10 3 11.5 3.5 13C4 14.5 5.5 15 7 14.5" />
      <path d="M9 4C9 4 11 3 12.5 4.5C14 6 14 8 13 9.5C14 10 15 11.5 14.5 13C14 14.5 12.5 15 11 14.5" />
      <path d="M7 14.5C7.5 15.5 8 16 9 16C10 16 10.5 15.5 11 14.5" />
      <line x1="9" y1="4" x2="9" y2="16" />
      <line x1="6" y1="9" x2="12" y2="9" />
    </svg>
  )
}

export function WhiteLabelIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M9 2L15.5 5V10C15.5 13.5 12.5 16 9 16C5.5 16 2.5 13.5 2.5 10V5L9 2Z" />
      <polyline points="6.5,9 8,11 11.5,7" />
    </svg>
  )
}

// ── Utility ───────────────────────────────────────────────────────────────────

export function PinIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <circle cx="9" cy="7" r="3.5" />
      <path d="M9 10.5V16" />
    </svg>
  )
}

export function CheckIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <polyline points="3,9 7,13 15,5" />
    </svg>
  )
}

// ── Alert category icons ──────────────────────────────────────────────────────

export function AgriCatIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M9 16V9" />
      <path d="M9 9C9 9 5 8 4 4C7 4 9 7 9 9Z" />
      <path d="M9 9C9 9 13 8 14 4C11 4 9 7 9 9Z" />
      <path d="M6 12C6 12 5 11 4 9C6 9 7.5 10.5 6 12Z" />
    </svg>
  )
}

export function ClimateCatIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M3 9a6 6 0 1 1 10.5 4H3" />
      <path d="M3 13l2 2 2-2 2 2 2-2 2 2" />
    </svg>
  )
}

export function LogisticsCatIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <rect x="1" y="7" width="11" height="8" rx="1" />
      <path d="M12 10h3l2 3v2h-5V10Z" />
      <circle cx="4.5" cy="16" r="1.5" />
      <circle cx="13.5" cy="16" r="1.5" />
    </svg>
  )
}

export function EnergyCatIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <polygon points="10,2 4,10 9,10 8,16 14,8 9,8 10,2" />
    </svg>
  )
}

export function SecurityCatIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M9 2L15.5 5V10C15.5 13.5 12.5 16 9 16C5.5 16 2.5 13.5 2.5 10V5L9 2Z" />
      <line x1="9" y1="7" x2="9" y2="10.5" />
      <circle cx="9" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

// ── IoT sensor icons ──────────────────────────────────────────────────────────

export function HumidityIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M9 3L13.5 9A5 5 0 1 1 4.5 9L9 3Z" />
    </svg>
  )
}

export function TemperatureIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M10 10.5V4a1 1 0 0 0-2 0v6.5a3 3 0 1 0 2 0Z" />
      <line x1="11.5" y1="5" x2="13.5" y2="5" />
      <line x1="11.5" y1="7.5" x2="13.5" y2="7.5" />
    </svg>
  )
}

export function PressureIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <circle cx="9" cy="9" r="7" />
      <path d="M9 9L13.5 4.5" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <path d="M4 13.5A6 6 0 0 1 3 9" />
      <path d="M14 13.5A6 6 0 0 0 15 9" />
    </svg>
  )
}

export function FlowIcon({ size, className, style }: IconProps) {
  return (
    <svg {...defaults(size)} className={className} style={style}>
      <path d="M2 6C4 4 6 4 9 6S12 8 16 6" />
      <path d="M2 9C4 7 6 7 9 9S12 11 16 9" />
      <path d="M2 12C4 10 6 10 9 12S12 14 16 12" />
    </svg>
  )
}
