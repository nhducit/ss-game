export type Expr =
  | { kind: 'var'; name: string }
  | { kind: 'not'; x: Expr }
  | { kind: 'and'; a: Expr; b: Expr }
  | { kind: 'or'; a: Expr; b: Expr }

export const V = (n: string): Expr => ({ kind: 'var', name: n })
export const NOT = (x: Expr): Expr => ({ kind: 'not', x })
export const AND = (a: Expr, b: Expr): Expr => ({ kind: 'and', a, b })
export const OR = (a: Expr, b: Expr): Expr => ({ kind: 'or', a, b })

export function evalExpr(e: Expr, env: Record<string, boolean>): boolean {
  if (e.kind === 'var') return env[e.name] ?? false
  if (e.kind === 'not') return !evalExpr(e.x, env)
  if (e.kind === 'and') return evalExpr(e.a, env) && evalExpr(e.b, env)
  return evalExpr(e.a, env) || evalExpr(e.b, env)
}

export function variables(e: Expr): string[] {
  const set = new Set<string>()
  const walk = (x: Expr) => {
    if (x.kind === 'var') set.add(x.name)
    else if (x.kind === 'not') walk(x.x)
    else { walk(x.a); walk(x.b) }
  }
  walk(e)
  return Array.from(set).sort()
}

export function allAssignments(vars: string[]): Record<string, boolean>[] {
  const n = vars.length
  const out: Record<string, boolean>[] = []
  for (let i = 0; i < 1 << n; i++) {
    const env: Record<string, boolean> = {}
    for (let j = 0; j < n; j++) {
      env[vars[j]] = Boolean(i & (1 << (n - 1 - j)))
    }
    out.push(env)
  }
  return out
}

export function equivalent(a: Expr, b: Expr): boolean {
  const vars = Array.from(new Set([...variables(a), ...variables(b)])).sort()
  for (const env of allAssignments(vars)) {
    if (evalExpr(a, env) !== evalExpr(b, env)) return false
  }
  return true
}

export function toString(e: Expr): string {
  if (e.kind === 'var') return e.name
  if (e.kind === 'not') return `not ${toString(e.x)}`
  if (e.kind === 'and') return `(${toString(e.a)} and ${toString(e.b)})`
  return `(${toString(e.a)} or ${toString(e.b)})`
}
