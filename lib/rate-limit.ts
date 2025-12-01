const buckets = new Map<string, { tokens: number; last: number }>()

export function limit(key: string, max = 10, refillMs = 60_000) {
  const now = Date.now()
  const b = buckets.get(key) ?? { tokens: max, last: now }
  const elapsed = now - b.last
  const refill = Math.floor(elapsed / refillMs) * max
  b.tokens = Math.min(max, b.tokens + refill)
  b.last = now
  if (b.tokens <= 0) {
    buckets.set(key, b)
    return false
  }
  b.tokens -= 1
  buckets.set(key, b)
  return true
}

