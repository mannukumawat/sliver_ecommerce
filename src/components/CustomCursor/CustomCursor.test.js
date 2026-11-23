import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

test('cursor cleanup survives detached refs and removes handlers during StrictMode replay', () => {
  const source = readFileSync(new URL('./CustomCursor.jsx', import.meta.url), 'utf8')
  const marker = '  useEffect(() => {'
  const effect = source.slice(source.indexOf(marker) + marker.length, source.indexOf('\n  }, [])'))
  const listeners = new Map()
  const target = () => ({
    addEventListener(name, fn) { listeners.set(fn, name) },
    removeEventListener(name, fn) { listeners.delete(fn) },
  })
  const classes = new Set()
  const root = { ...target(), classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c) } }
  const media = { ...target(), matches: true }
  const node = () => ({ dataset: {}, style: {} })
  const cursor = { current: node() }, dot = { current: node() }
  let cancelled = false
  const context = { cursor, dot, window: { ...target(), matchMedia: () => media },
    document: { ...target(), documentElement: root }, Element: class {},
    performance: { now: () => 0 }, requestAnimationFrame: () => 1,
    cancelAnimationFrame: () => { cancelled = true } }
  const mount = () => runInNewContext(`(() => {${effect}\n})()`, context)
  const cleanup = mount()
  const move = [...listeners].find(([, name]) => name === 'pointermove')[0]
  move({ pointerType: 'mouse', clientX: 100, clientY: 80 })
  assert.equal(classes.has('has-custom-cursor'), true)
  cursor.current = null
  dot.current = null
  assert.doesNotThrow(cleanup)
  assert.equal(listeners.size, 0)
  assert.equal(classes.size, 0)
  assert.equal(cancelled, true)
  cursor.current = node(); dot.current = node()
  const replayCleanup = mount()
  assert.ok(listeners.size > 0)
  replayCleanup()
  assert.equal(listeners.size, 0)
})
