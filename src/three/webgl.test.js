import { test } from 'node:test'
import assert from 'node:assert/strict'

let version = 0
const freshProbe = async () => (await import(`./webgl.js?test=${version++}`)).webglOK

test('WebGL probe requires WebGL2, caches the result and releases its context', async () => {
  const previous = globalThis.document
  let probes = 0
  let released = 0
  try {
    globalThis.document = {
      createElement: () => ({ getContext: (kind) => {
        probes++
        assert.equal(kind, 'webgl2')
        return { getExtension: () => ({ loseContext: () => released++ }) }
      } }),
    }
    const probe = await freshProbe()
    assert.equal(probe(), true)
    assert.equal(probe(), true)
    assert.equal(probes, 1)
    assert.equal(released, 1)

    globalThis.document.createElement = () => ({ getContext: (kind) => kind === 'webgl' ? {} : null })
    assert.equal((await freshProbe())(), false)

    globalThis.document.createElement = () => { throw new Error('Context unavailable') }
    assert.equal((await freshProbe())(), false)

    delete globalThis.document
    assert.equal((await freshProbe())(), false)
  } finally {
    if (previous === undefined) delete globalThis.document
    else globalThis.document = previous
  }
})
