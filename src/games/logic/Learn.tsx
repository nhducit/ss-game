import { useState } from 'react'
import { Bulb, Switch, OperatorBlock, BoolBlock } from './blocks'
import { cn } from '@/lib/utils'

type Level = 'easy' | 'medium' | 'hard'

function TruthRow({ cols, values, highlight }: { cols: string[]; values: (boolean | string)[][]; highlight?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="mx-auto text-sm border-separate border-spacing-0 font-mono">
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th key={i} className="px-3 py-1.5 bg-muted font-bold border border-border">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((row, ri) => (
            <tr key={ri} className={cn(highlight === ri && 'bg-amber-100 dark:bg-amber-900/40')}>
              {row.map((v, ci) => (
                <td key={ci} className={cn(
                  'px-3 py-1.5 border border-border text-center',
                  typeof v === 'boolean' && (v ? 'text-emerald-600 font-bold' : 'text-rose-500'),
                )}>
                  {typeof v === 'boolean' ? (v ? 'true ✅' : 'false ❌') : v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Easy: single operator demos ───────────────────────────
function AndDemo() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const result = a && b
  const highlight = (a ? 2 : 0) + (b ? 1 : 0)
  return (
    <Section title="AND — both must be true" subtitle="The bulb lights only when A AND B are both ON">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Switch on={a} label="A" onToggle={() => setA(!a)} />
        <Switch on={b} label="B" onToggle={() => setB(!b)} />
        <div className="flex flex-col items-center">
          <Bulb on={result} />
          <OperatorBlock op="and" result={result}>
            <BoolBlock value={a} label="A" size="sm" />
            <BoolBlock value={b} label="B" size="sm" />
          </OperatorBlock>
        </div>
      </div>
      <TruthRow
        cols={['A', 'B', 'A and B']}
        values={[
          [false, false, false],
          [false, true, false],
          [true, false, false],
          [true, true, true],
        ]}
        highlight={highlight}
      />
    </Section>
  )
}

function OrDemo() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const result = a || b
  const highlight = (a ? 2 : 0) + (b ? 1 : 0)
  return (
    <Section title="OR — at least one must be true" subtitle="The bulb lights when A OR B (or both) are ON">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Switch on={a} label="A" onToggle={() => setA(!a)} />
        <Switch on={b} label="B" onToggle={() => setB(!b)} />
        <div className="flex flex-col items-center">
          <Bulb on={result} />
          <OperatorBlock op="or" result={result}>
            <BoolBlock value={a} label="A" size="sm" />
            <BoolBlock value={b} label="B" size="sm" />
          </OperatorBlock>
        </div>
      </div>
      <TruthRow
        cols={['A', 'B', 'A or B']}
        values={[
          [false, false, false],
          [false, true, true],
          [true, false, true],
          [true, true, true],
        ]}
        highlight={highlight}
      />
    </Section>
  )
}

function NotDemo() {
  const [a, setA] = useState(false)
  const result = !a
  return (
    <Section title="NOT — flips the value" subtitle="NOT turns true into false and false into true">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Switch on={a} label="A" onToggle={() => setA(!a)} />
        <div className="flex flex-col items-center">
          <Bulb on={result} />
          <OperatorBlock op="not" result={result}>
            <BoolBlock value={a} label="A" size="sm" />
          </OperatorBlock>
        </div>
      </div>
      <TruthRow
        cols={['A', 'not A']}
        values={[
          [false, true],
          [true, false],
        ]}
        highlight={a ? 1 : 0}
      />
    </Section>
  )
}

// ── Medium: 2-operator combos ───────────────────────────
function AndNotDemo() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const result = a && !b
  return (
    <Section title="A AND (NOT B)" subtitle="Only lights when A is ON and B is OFF">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Switch on={a} label="A" onToggle={() => setA(!a)} />
        <Switch on={b} label="B" onToggle={() => setB(!b)} />
        <div className="flex flex-col items-center">
          <Bulb on={result} />
          <OperatorBlock op="and" result={result} depth={0}>
            <BoolBlock value={a} label="A" size="sm" />
            <OperatorBlock op="not" result={!b} depth={1}>
              <BoolBlock value={b} label="B" size="sm" />
            </OperatorBlock>
          </OperatorBlock>
        </div>
      </div>
      <TruthRow
        cols={['A', 'B', 'not B', 'A and (not B)']}
        values={[
          [false, false, true, false],
          [false, true, false, false],
          [true, false, true, true],
          [true, true, false, false],
        ]}
        highlight={(a ? 2 : 0) + (b ? 1 : 0)}
      />
    </Section>
  )
}

function NotOrDemo() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const result = !a || b
  return (
    <Section title="(NOT A) OR B" subtitle="Lights unless A is ON and B is OFF">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Switch on={a} label="A" onToggle={() => setA(!a)} />
        <Switch on={b} label="B" onToggle={() => setB(!b)} />
        <div className="flex flex-col items-center">
          <Bulb on={result} />
          <OperatorBlock op="or" result={result} depth={0}>
            <OperatorBlock op="not" result={!a} depth={1}>
              <BoolBlock value={a} label="A" size="sm" />
            </OperatorBlock>
            <BoolBlock value={b} label="B" size="sm" />
          </OperatorBlock>
        </div>
      </div>
      <TruthRow
        cols={['A', 'B', 'not A', '(not A) or B']}
        values={[
          [false, false, true, true],
          [false, true, true, true],
          [true, false, false, false],
          [true, true, false, true],
        ]}
        highlight={(a ? 2 : 0) + (b ? 1 : 0)}
      />
    </Section>
  )
}

function TripleAndDemo() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const [c, setC] = useState(false)
  const result = a && b && c
  return (
    <Section title="A AND B AND C" subtitle="All three must be ON">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Switch on={a} label="A" onToggle={() => setA(!a)} />
        <Switch on={b} label="B" onToggle={() => setB(!b)} />
        <Switch on={c} label="C" onToggle={() => setC(!c)} />
        <div className="flex flex-col items-center">
          <Bulb on={result} />
          <OperatorBlock op="and" result={result} depth={0}>
            <OperatorBlock op="and" result={a && b} depth={1}>
              <BoolBlock value={a} label="A" size="sm" />
              <BoolBlock value={b} label="B" size="sm" />
            </OperatorBlock>
            <BoolBlock value={c} label="C" size="sm" />
          </OperatorBlock>
        </div>
      </div>
    </Section>
  )
}

// ── Hard: 3-input complex ───────────────────────────
function OrAndNotDemo() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const [c, setC] = useState(false)
  const inner = a || b
  const notC = !c
  const result = inner && notC
  return (
    <Section title="(A OR B) AND (NOT C)" subtitle="At least A or B is ON, but C must be OFF">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Switch on={a} label="A" onToggle={() => setA(!a)} />
        <Switch on={b} label="B" onToggle={() => setB(!b)} />
        <Switch on={c} label="C" onToggle={() => setC(!c)} />
        <div className="flex flex-col items-center">
          <Bulb on={result} />
          <OperatorBlock op="and" result={result} depth={0}>
            <OperatorBlock op="or" result={inner} depth={1}>
              <BoolBlock value={a} label="A" size="sm" />
              <BoolBlock value={b} label="B" size="sm" />
            </OperatorBlock>
            <OperatorBlock op="not" result={notC} depth={1}>
              <BoolBlock value={c} label="C" size="sm" />
            </OperatorBlock>
          </OperatorBlock>
        </div>
      </div>
    </Section>
  )
}

function AndOrAndNotDemo() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const [c, setC] = useState(false)
  const [d, setD] = useState(false)
  const left = a && b
  const notD = !d
  const right = c && notD
  const result = left || right
  return (
    <Section title="(A AND B) OR (C AND NOT D)" subtitle="Two paths: either A+B are both ON, or C is ON while D is OFF">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Switch on={a} label="A" onToggle={() => setA(!a)} />
        <Switch on={b} label="B" onToggle={() => setB(!b)} />
        <Switch on={c} label="C" onToggle={() => setC(!c)} />
        <Switch on={d} label="D" onToggle={() => setD(!d)} />
        <div className="flex flex-col items-center">
          <Bulb on={result} />
          <OperatorBlock op="or" result={result} depth={0}>
            <OperatorBlock op="and" result={left} depth={1}>
              <BoolBlock value={a} label="A" size="sm" />
              <BoolBlock value={b} label="B" size="sm" />
            </OperatorBlock>
            <OperatorBlock op="and" result={right} depth={1}>
              <BoolBlock value={c} label="C" size="sm" />
              <OperatorBlock op="not" result={notD} depth={2}>
                <BoolBlock value={d} label="D" size="sm" />
              </OperatorBlock>
            </OperatorBlock>
          </OperatorBlock>
        </div>
      </div>
    </Section>
  )
}

function NotOrNotDemo() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(false)
  const result = !a || !b
  return (
    <Section title="(NOT A) OR (NOT B)" subtitle="Lights unless BOTH A and B are ON (same as 'NOT (A AND B)')">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Switch on={a} label="A" onToggle={() => setA(!a)} />
        <Switch on={b} label="B" onToggle={() => setB(!b)} />
        <div className="flex flex-col items-center">
          <Bulb on={result} />
          <OperatorBlock op="or" result={result} depth={0}>
            <OperatorBlock op="not" result={!a} depth={1}>
              <BoolBlock value={a} label="A" size="sm" />
            </OperatorBlock>
            <OperatorBlock op="not" result={!b} depth={1}>
              <BoolBlock value={b} label="B" size="sm" />
            </OperatorBlock>
          </OperatorBlock>
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground max-w-md mx-auto">
        💡 This is called <strong>De Morgan's Law</strong>: "not A or not B" is the same as "not (A and B)".
      </p>
    </Section>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card shadow-sm">
      <div className="text-center">
        <h3 className="text-lg font-extrabold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      {children}
    </section>
  )
}

export function Learn({ level }: { level: Level }) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {level === 'easy' && (
        <>
          <AndDemo />
          <OrDemo />
          <NotDemo />
        </>
      )}
      {level === 'medium' && (
        <>
          <AndNotDemo />
          <NotOrDemo />
          <TripleAndDemo />
        </>
      )}
      {level === 'hard' && (
        <>
          <OrAndNotDemo />
          <NotOrNotDemo />
          <AndOrAndNotDemo />
        </>
      )}
    </div>
  )
}
