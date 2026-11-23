import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, MeshReflectorMaterial, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { MODELS } from './models'
import { PIECES, SEL0, clamp01, smooth, snapIdx } from '../experience/pieces'
import { radialTexture } from './materials'
import SignaturePendant from './SignaturePendant'

const { damp, lerp } = THREE.MathUtils
const TILT = { ring: 0.55, bracelet: 0.6, anklet: 0.6, necklace: 0.04, earrings: 0.04, set: 0.04 }
const N = PIECES.length
const GAP = 3.6
const FLOOR_Y = -1.12
// sit every model on the floor consistently: [y offset, scale]
const FIT = { ring: [0, 1], necklace: [0.1, 1], earrings: [-0.5, 1], bracelet: [0.05, 1], anklet: [0.2, 0.8], set: [0.15, 1] }

/*
 * One canvas drives the whole pinned experience:
 *   hero pendant (drops in, swings, rotates + zooms into the stone)  ->  row of six pieces that
 *   slides with scroll  ->  inspect mode (drag to rotate / wheel to zoom, written by the overlay).
 */
function Rig({ mobile, animate, rig }) {
  const hero = useRef()
  const swing = useRef()
  const row = useRef()
  const items = useRef([])
  const rings = useRef()
  const dust = useRef()
  const light = useRef()
  const glow = useRef()
  const bokeh = useRef()
  const S = useRef({ p: 0, px: 0, py: 0, idx: 0, ins: 0, iry: Array(N).fill(0), irx: Array(N).fill(0) })

  const glowTex = useMemo(() => radialTexture('rgba(165,185,230,0.85)', 'rgba(165,185,230,0)'), [])
  const bokehTex = useMemo(() => radialTexture('rgba(190,215,255,0.9)', 'rgba(190,215,255,0)'), [])
  const floorAlpha = useMemo(() => radialTexture('rgba(255,255,255,1)', 'rgba(0,0,0,1)'), [])
  const bokehGeo = useMemo(() => {
    const n = mobile ? 14 : 30
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) arr.set([(Math.random() - 0.5) * 14, (Math.random() - 0.5) * 6, -2.5 - Math.random() * 4], i * 3)
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [mobile])
  const dustGeo = useMemo(() => {
    const n = mobile ? 36 : 90
    const arr = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 1.8 + Math.random() * 2.4, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1)
      arr.set([r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph) * 0.8, r * Math.sin(ph) * Math.sin(th) - 0.8], i * 3)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [mobile])

  useFrame(({ clock, camera }, dt) => {
    const t = clock.getElapsedTime()
    const s = S.current
    if (!animate) { hero.current.rotation.set(0.04, 0.28, 0); return }

    const ins = rig.inspect.current
    s.p = damp(s.p, rig.progress.current, 4, dt)
    s.px = damp(s.px, rig.pointer.current.x, 3, dt)
    s.py = damp(s.py, rig.pointer.current.y, 3, dt)
    const p = s.p

    const heroZoom = smooth(0, 0.3, p) * (1 - smooth(0.3, 0.37, p))
    const heroVis = 1 - smooth(0.27, 0.35, p)
    const rowVis = smooth(0.31, 0.4, p)
    const idxT = ins ? ins.i : snapIdx(clamp01((p - SEL0) / (1 - SEL0)) * (N - 1))
    s.idx = damp(s.idx, idxT, ins ? 5 : 7, dt)
    s.ins = damp(s.ins, ins ? 1 : 0, 5, dt)

    // --- hero pendant: intro drop + swing, then scroll-driven turn
    const e = smooth(0, 0.3, p)
    const lead = 1 - Math.min(1, (p / 0.3) * 2.4)
    const it = clamp01((t - 0.25) / 2.2)
    const eb = 1 + 2.2 * (it - 1) ** 3 + 1.2 * (it - 1) ** 2
    const amp = 0.07 * (1 - it) ** 2 + 0.012
    swing.current.rotation.z = Math.sin(t * 2.1) * amp * (it < 1 ? 1 : 0.8 + Math.sin(t * 0.7) * 0.2)
    hero.current.visible = heroVis > 0.01
    hero.current.scale.setScalar(Math.max(0.001, heroVis) * (mobile ? 0.78 : 1.12))
    const halfWidth = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 4.7 * camera.aspect
    hero.current.position.set(mobile ? 0 : lerp(0.55, halfWidth * 0.47, lead * lead), (mobile ? 0.6 : 0.03) + (1 - eb) * 1.4 + (1 - heroVis) * 1.4, 0)
    hero.current.rotation.y = Math.sin(t * 0.38) * 0.25 * (1 - e) + e * Math.PI * 2 + s.px * 0.4
    hero.current.rotation.x = 0.04 + Math.sin(t * 0.27) * 0.04 - s.py * 0.22

    // --- camera
    const far = mobile ? 5.3 : 4.7
    const near = mobile ? 3 : 2.25
    let z = lerp(far + (near - far) * heroZoom, mobile ? 5.9 : 4.6, rowVis)
    if (ins) z = lerp(z, (mobile ? 4.6 : 3.7) / ins.zoom, s.ins)
    camera.position.z = z
    camera.position.y = lerp(0.3 - heroZoom * 0.25, 0.62, rowVis)
    camera.position.x = Math.sin(t * 0.21) * 0.08 + s.px * 0.12
    camera.lookAt(0, lerp(0, -0.18, rowVis), 0)

    // --- piece row
    row.current.visible = rowVis > 0.01
    row.current.position.set(mobile ? 0 : 1.05, mobile ? 0.7 : 0, 0)
    items.current.forEach((g, i) => {
      if (!g) return
      const d = i - s.idx
      const ad = Math.abs(d)
      const isIns = ins && ins.i === i
      const k = rowVis * (ins && !isIns ? 1 - s.ins : 1)
      const sc = (1 - Math.min(1, ad) ** 0.7) * k * (isIns ? 1 + s.ins * 0.1 : 1)
      g.visible = ad < 1 && sc > 0.01
      g.scale.setScalar(Math.max(0.001, sc * (mobile ? 0.9 : 1.25)))
      g.position.set(d * (mobile ? 2.3 : GAP), Math.sin(t * 0.6 + i) * 0.04, -ad * 0.6)

      const tgtY = isIns ? ins.ry : Math.round(s.iry[i] / (Math.PI * 2)) * Math.PI * 2
      const tgtX = isIns ? ins.rx : 0
      s.iry[i] = damp(s.iry[i], tgtY, isIns ? 12 : 4, dt)
      s.irx[i] = damp(s.irx[i], tgtX, isIns ? 12 : 4, dt)
      const near1 = Math.max(0, 1 - ad)
      g.rotation.y = Math.sin(t * 0.4 + i) * 0.3 * (1 - (isIns ? s.ins : 0)) + d * 0.9 + near1 * s.px * 0.3 + s.iry[i]
      g.rotation.x = TILT[PIECES[i].model] + near1 * -s.py * 0.15 + s.irx[i]
    })
    if (ins && !ins.drag) ins.ry += dt * 0.25

    // --- ambience
    light.current.position.set(Math.sin(t * 0.55) * 1.2 + (p * 2 - 1) * 2.4, 0.6 + Math.cos(t * 0.4) * 0.5, 2.2)
    light.current.intensity = 2.5 + Math.sin(t * 0.55) * 0.5
    rings.current.visible = rowVis > 0.1
    rings.current.rotation.z = t * 0.05 + p * 2.6
    rings.current.rotation.x = p * 0.6
    dust.current.rotation.y = t * 0.02 + p * 0.9
    bokeh.current.position.x = -p * 2.2 + Math.sin(t * 0.1) * 0.3
    bokeh.current.position.y = Math.sin(t * 0.13) * 0.2
    glow.current.position.x = lerp(hero.current.position.x, row.current.position.x, rowVis)
    glow.current.material.opacity = 0.12 + 0.025 * Math.sin(t * 0.5)
  })

  return (
    <>
      <pointLight ref={light} color="#cfe2ff" distance={10} decay={1.4} position={[0, 0.6, 2.2]} />
      <group ref={hero}>
        <group ref={swing} position={[0, 0.75, 0]}>
          <group position={[0, -0.75, 0]}><SignaturePendant mobile={mobile} /></group>
        </group>
      </group>
      <group ref={row}>
        {PIECES.map((pc, i) => {
          const M = MODELS[pc.model]
          const [fy, fs] = FIT[pc.model]
          return (
            <group key={pc.slug} ref={(g) => (items.current[i] = g)} visible={false}>
              <group position={[0, fy, 0]} scale={fs}><M mobile={mobile} /></group>
            </group>
          )
        })}
      </group>

      <sprite ref={glow} position={[0, 0, -2]} scale={[9, 9, 1]}>
        <spriteMaterial map={glowTex} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <points ref={bokeh} geometry={bokehGeo}>
        <pointsMaterial map={bokehTex} size={0.28} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
      {mobile ? (
        <ContactShadows position={[0, FLOOR_Y, 0]} opacity={0.5} scale={14} blur={2.6} far={2.2} resolution={256} color="#000a1c" />
      ) : (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, 0]}>
          <circleGeometry args={[4.6, 64]} />
          <MeshReflectorMaterial
            blur={[260, 80]} resolution={512} mixBlur={1} mixStrength={22} mixContrast={1.1} roughness={0.9} depthScale={1.1}
            minDepthThreshold={0.4} maxDepthThreshold={1.4} color="#04060b" metalness={0.6} transparent alphaMap={floorAlpha}
          />
        </mesh>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y + 0.01, 0]}>
        <circleGeometry args={[3.2, 48]} />
        <meshBasicMaterial map={glowTex} transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <group ref={rings}>
        <mesh rotation={[1.25, 0.2, 0]}><torusGeometry args={[1.7, 0.004, 6, 120]} /><meshBasicMaterial color="#8fb4ee" transparent opacity={0.5} /></mesh>
        {!mobile && <mesh rotation={[1.05, -0.5, 0.4]}><torusGeometry args={[2.1, 0.003, 6, 140]} /><meshBasicMaterial color="#bcd3fa" transparent opacity={0.32} /></mesh>}
      </group>
      <points ref={dust} geometry={dustGeo}>
        <pointsMaterial size={0.022} color="#cfe0ff" transparent opacity={0.65} sizeAttenuation depthWrite={false} />
      </points>
    </>
  )
}

// Mounted with the scene only after its environment has resolved. Wait until
// a frame has been rendered before allowing the DOM fallback to disappear.
function SceneReady({ onReady }) {
  const frames = useRef(0)
  useFrame(({ invalidate }) => {
    if (frames.current === 0) {
      frames.current = 1
      invalidate()
    } else if (frames.current === 1) {
      frames.current = 2
      onReady?.()
    }
  })
  return null
}

function ContextEvents({ onFail }) {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const lost = (event) => { event.preventDefault(); onFail?.() }
    gl.domElement.addEventListener('webglcontextlost', lost)
    return () => gl.domElement.removeEventListener('webglcontextlost', lost)
  }, [gl, onFail])
  return null
}

export default function ExperienceScene({ active, animate, mobile, rig, onReady, onFail }) {
  return (
    <Canvas
      frameloop={active ? (animate ? 'always' : 'demand') : 'never'}
      dpr={[1, mobile ? 1.25 : 1.75]}
      camera={{ position: [0, 0.3, mobile ? 5.3 : 4.7], fov: 34 }}
      gl={{ antialias: !mobile, alpha: true, powerPreference: mobile ? 'default' : 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.05
      }}
      aria-hidden="true"
    >
      <hemisphereLight args={['#dfe9ff', '#10265a', 0.9]} />
      <directionalLight position={[2.5, 3, 4]} intensity={2} color="#fff2de" />
      <directionalLight position={[-3, 1, 2]} intensity={1.6} color="#bbd8ff" />
      <directionalLight position={[2, 2, -3]} intensity={3} color="#ffffff" />
      <ContextEvents onFail={onFail} />
      <Suspense fallback={null}>
        <Environment files={`${import.meta.env.BASE_URL}hdri/studio_small_09_1k.hdr`} environmentIntensity={1.7} />
        <Rig mobile={mobile} animate={animate} rig={rig} />
        <SceneReady onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
