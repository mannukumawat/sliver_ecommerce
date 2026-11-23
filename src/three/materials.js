import * as THREE from 'three'

// Shared materials/geometry for every 3D model (created once, on first use).
let cache

function heartShape() {
  const s = new THREE.Shape()
  s.moveTo(0, -0.5)
  s.bezierCurveTo(-0.15, -0.35, -0.55, -0.1, -0.5, 0.18)
  s.bezierCurveTo(-0.47, 0.42, -0.12, 0.5, 0, 0.26)
  s.bezierCurveTo(0.12, 0.5, 0.47, 0.42, 0.5, 0.18)
  s.bezierCurveTo(0.55, -0.1, 0.15, -0.35, 0, -0.5)
  return s
}

function starShape() {
  const s = new THREE.Shape()
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2
    const r = i % 2 ? 0.24 : 0.5
    const x = Math.cos(a) * r, y = Math.sin(a) * r
    i ? s.lineTo(x, y) : s.moveTo(x, y)
  }
  return s
}

const extrude = (shape, depth = 0.18) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06, bevelSegments: 4, curveSegments: 16 }).center()

export function getAssets() {
  if (cache) return cache

  const silver = new THREE.MeshStandardMaterial({ color: '#f8fafc', metalness: 0.9, roughness: 0.13, envMapIntensity: 1.9 })
  const satin = new THREE.MeshStandardMaterial({ color: '#e6ecf5', metalness: 0.78, roughness: 0.3, envMapIntensity: 1.7 })
  const pearl = new THREE.MeshPhysicalMaterial({
    color: '#f1e6d8', roughness: 0.14, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.1,
    iridescence: 0.7, iridescenceIOR: 1.35, iridescenceThicknessRange: [200, 500], sheen: 0.8, sheenColor: new THREE.Color('#ffffff'), envMapIntensity: 1.8,
  })
  // cheap faceted stones (used where transmission would be too costly)
  const stone = new THREE.MeshPhysicalMaterial({
    color: '#4a86e6', metalness: 0.2, roughness: 0.02, clearcoat: 1, flatShading: true, envMapIntensity: 3.4, emissive: '#1a4ea8', emissiveIntensity: 0.55, iridescence: 0.35, iridescenceIOR: 1.6,
  })
  const diamond = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0, metalness: 0.1, clearcoat: 1, flatShading: true, envMapIntensity: 3.2 })

  const brilliant = brilliantCut()
  const diamondFront = new THREE.MeshPhysicalMaterial({
    color: '#ffffff', metalness: 0, roughness: 0, transparent: true, opacity: 0.38, envMapIntensity: 5,
    clearcoat: 1, clearcoatRoughness: 0, flatShading: true, depthWrite: false, iridescence: 0.5, iridescenceIOR: 2,
  })
  // inner bounce: back faces mirror the studio, which is what makes a cut stone "fire"
  const diamondBack = new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 1, roughness: 0.02, envMapIntensity: 5.5, emissive: '#7189bd', emissiveIntensity: 0.28, side: THREE.BackSide, flatShading: true })
  const sapphireBack = new THREE.MeshStandardMaterial({ color: '#2f63c8', metalness: 1, roughness: 0.04, envMapIntensity: 2.6, side: THREE.BackSide, flatShading: true })
  const sapphireFront = new THREE.MeshPhysicalMaterial({ color: '#6fa0ff', metalness: 0, roughness: 0, transparent: true, opacity: 0.45, envMapIntensity: 3.4, clearcoat: 1, flatShading: true, depthWrite: false })

  // rounded-rectangle band profile, revolved: comfortable ring shank
  const band = (() => {
    const pts = []
    for (let i = 0; i <= 40; i++) {
      const t = (i / 40) * Math.PI * 2
      const c = Math.cos(t), s = Math.sin(t)
      pts.push(new THREE.Vector2(0.64 + 0.05 * Math.sign(c) * Math.abs(c) ** 0.55, 0.095 * Math.sign(s) * Math.abs(s) ** 0.55))
    }
    return new THREE.LatheGeometry(pts, 96)
  })()

  cache = { silver, satin, pearl, stone, diamond, diamondFront, diamondBack, sapphireFront, sapphireBack, brilliant, band, heart: extrude(heartShape()), star: extrude(starShape(), 0.12) }
  return cache
}

// soft round sprite for glows / bokeh
export function radialTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  gr.addColorStop(0, inner)
  gr.addColorStop(1, outer)
  g.fillStyle = gr
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Flat-faceted round brilliant (radius 1): table, crown stars/kites, girdle, pavilion mains.
function brilliantCut() {
  const P = (r, y, a) => new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)
  const N = 8
  const ang = (k, n) => (k / n) * Math.PI * 2
  const T = (i) => P(0.56, 0.36, ang(((i % N) + N) % N, N))
  const G = (k) => P(1, 0.03, ang(((k % 16) + 16) % 16, 16))
  const L = (k) => P(1, -0.03, ang(((k % 16) + 16) % 16, 16))
  const Q = (i) => P(0.42, -0.32, ang(((i % N) + N) % N, N))
  const C = new THREE.Vector3(0, -0.64, 0)
  const top = new THREE.Vector3(0, 0.36, 0)
  const centre = new THREE.Vector3(0, -0.1, 0)
  const pos = []
  const tri = (a, b, c) => {
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a))
    const m = new THREE.Vector3().add(a).add(b).add(c).multiplyScalar(1 / 3).sub(centre)
    if (n.dot(m) < 0) [b, c] = [c, b]
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z)
  }
  for (let i = 0; i < N; i++) {
    tri(top, T(i), T(i + 1))                                  // table
    tri(T(i), T(i + 1), G(2 * i + 1))                         // crown kite
    tri(T(i), G(2 * i + 1), G(2 * i))                         // upper girdle facets
    tri(T(i + 1), G(2 * i + 2), G(2 * i + 1))
    tri(C, Q(i), Q(i + 1))                                    // pavilion mains
    tri(Q(i), L(2 * i), L(2 * i + 1))
    tri(Q(i), L(2 * i + 1), Q(i + 1))
    tri(Q(i + 1), L(2 * i + 1), L(2 * i + 2))
  }
  for (let k = 0; k < 16; k++) { tri(G(k), G(k + 1), L(k)); tri(G(k + 1), L(k + 1), L(k)) } // girdle
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.computeVertexNormals()
  return g
}

// four-point flare for sparkle sprites
export function starTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.12, 'rgba(255,255,255,.8)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  g.globalCompositeOperation = 'lighter'
  const ray = (w, h) => { const r = g.createLinearGradient(64 - w, 64, 64 + w, 64); r.addColorStop(0, 'rgba(255,255,255,0)'); r.addColorStop(0.5, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(64 - w, 64 - h / 2, w * 2, h) }
  ray(64, 3)
  g.save(); g.translate(64, 64); g.rotate(Math.PI / 2); g.translate(-64, -64); ray(64, 3); g.restore()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
