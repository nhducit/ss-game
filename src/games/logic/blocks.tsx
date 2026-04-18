import { cn } from '@/lib/utils'

// Scratch-style colors
// Operator (green): #59C059
// Boolean (reporter, hexagon): #59C059 dark: #389438
// Variable (orange): #FF8C1A

export function BoolBlock({
  value,
  label,
  onClick,
  size = 'md',
}: {
  value: boolean
  label: string
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}) {
  const pad = size === 'sm' ? 'px-3 py-1 text-xs' : size === 'lg' ? 'px-5 py-2 text-base' : 'px-4 py-1.5 text-sm'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        'inline-flex items-center font-bold text-white shadow-sm select-none transition-transform',
        'hexagon-block',
        pad,
        value ? 'bg-[#ffbf00]' : 'bg-[#9a6b1f]',
        onClick ? 'cursor-pointer active:scale-95 hover:brightness-110' : 'cursor-default',
      )}
    >
      {label}
      <span className={cn('ml-2 inline-block size-2.5 rounded-full', value ? 'bg-white shadow-[0_0_6px_white]' : 'bg-white/30')} />
    </button>
  )
}

export function OperatorBlock({
  op,
  children,
  result,
  depth = 0,
}: {
  op: 'and' | 'or' | 'not'
  children: React.ReactNode
  result?: boolean
  depth?: number
}) {
  const shade = DEPTH_SHADES[Math.min(depth, DEPTH_SHADES.length - 1)]
  const off = result === false
  const ring = result === true ? 'ring-4 ring-[#ffbf00]/60' : ''
  const bg = off ? 'bg-[#2f7f2f] border-[#1d4f1d]' : shade
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-white font-bold text-sm shadow-sm border-2',
        bg,
        ring,
      )}
    >
      {op !== 'not' && <span className="contents">{arrayFirst(children)}</span>}
      <span className="uppercase text-xs tracking-wide">{op}</span>
      {op !== 'not' ? <span className="contents">{arraySecond(children)}</span> : <span className="contents">{children}</span>}
    </span>
  )
}

// Outer → inner. Each depth darkens the fill slightly and uses a distinct
// border so nested operator blocks read as separate groups.
const DEPTH_SHADES = [
  'bg-[#3f9c3f] border-[#1f5a1f]',
  'bg-[#59C059] border-[#2f7f2f]',
  'bg-[#74d474] border-[#3a8a3a]',
  'bg-[#8fe38f] border-[#4a9a4a]',
]

function arrayFirst(children: React.ReactNode): React.ReactNode {
  if (Array.isArray(children)) return children[0]
  return children
}
function arraySecond(children: React.ReactNode): React.ReactNode {
  if (Array.isArray(children)) return children[1]
  return null
}

export function Bulb({ on, size = 80 }: { on: boolean; size?: number }) {
  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <svg viewBox="0 0 80 100" width={size} height={size * 1.25}>
        <defs>
          <radialGradient id={`glow-${on ? 'on' : 'off'}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={on ? '#fff9a6' : '#e5e7eb'} />
            <stop offset="60%" stopColor={on ? '#fcd34d' : '#9ca3af'} />
            <stop offset="100%" stopColor={on ? '#f59e0b' : '#4b5563'} />
          </radialGradient>
        </defs>
        {on && (
          <circle cx="40" cy="38" r="38" fill="#fde68a" opacity="0.45">
            <animate attributeName="opacity" values="0.3;0.55;0.3" dur="1.2s" repeatCount="indefinite" />
          </circle>
        )}
        <path
          d="M 40 8 C 22 8, 10 22, 10 38 C 10 50, 18 58, 24 64 L 24 72 L 56 72 L 56 64 C 62 58, 70 50, 70 38 C 70 22, 58 8, 40 8 Z"
          fill={`url(#glow-${on ? 'on' : 'off'})`}
          stroke="#1f2937"
          strokeWidth="2"
        />
        <rect x="26" y="72" width="28" height="6" fill="#6b7280" stroke="#1f2937" strokeWidth="1.5" />
        <rect x="28" y="78" width="24" height="5" fill="#6b7280" stroke="#1f2937" strokeWidth="1.5" />
        <rect x="30" y="83" width="20" height="5" fill="#6b7280" stroke="#1f2937" strokeWidth="1.5" />
        <path d="M 34 88 L 46 94" stroke="#1f2937" strokeWidth="2" fill="none" />
      </svg>
    </div>
  )
}

export function Switch({
  on,
  label,
  onToggle,
}: {
  on: boolean
  label: string
  onToggle: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-bold text-lg text-foreground">{label}</span>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'relative flex items-center justify-center rounded-2xl border-4 border-gray-700 shadow-lg transition-all active:scale-95 touch-manipulation',
          'w-20 h-28',
          on ? 'bg-gradient-to-b from-amber-300 to-amber-500' : 'bg-gradient-to-b from-gray-600 to-gray-800',
        )}
      >
        <div
          className={cn(
            'w-12 h-10 rounded-lg border-2 border-gray-900 shadow-md transition-all',
            on
              ? 'bg-gradient-to-b from-white to-gray-200 translate-y-[-22px]'
              : 'bg-gradient-to-b from-gray-300 to-gray-500 translate-y-[22px]',
          )}
        />
        <span className={cn(
          'absolute text-[10px] font-extrabold tracking-wider',
          on ? 'top-1.5 text-amber-900' : 'bottom-1.5 text-gray-200',
        )}>
          {on ? 'ON' : 'OFF'}
        </span>
      </button>
    </div>
  )
}
