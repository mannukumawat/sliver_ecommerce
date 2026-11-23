import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getAssets, starTexture } from './materials'

/*
 * Procedural jewellery models (custom geometry, no downloads). Each is centred on the
 * origin facing +Z. Illustrative stand-ins until real product models are available.
 */

const X = new THREE.Vector3(1, 0, 0)
const circle = (r, n = 28) => new THREE.CatmullRomCurve3(Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0) }), true)

export function LinkChain({ curve, links, closed = false, size = 1 }) {
  const ref = useRef()
  const { silver } = getAssets()
  const geo = useMemo(() => new THREE.TorusGeometry(0.052 * size, 0.013 * size, 8, 16).scale(1.55, 1, 1), [size])
  useLayoutEffect(() => {
    const o = new THREE.Object3D()
    for (let i = 0; i < links; i++) {
      const t = closed ? i / links : i / (links - 1)
      o.position.copy(curve.getPointAt(t))
      o.quaternion.setFromUnitVectors(X, curve.getTangentAt(t).normalize())
      if (i % 2) o.rotateX(Math.PI / 2)
      o.updateMatrix()
      ref.current.setMatrixAt(i, o.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [curve, links, closed])
  return <instancedMesh ref={ref} args={[geo, silver, links]} frustumCulled={false} />
}

// light glints that flare on and off over a stone (additive billboards)
let STAR
function Flares({ count = 3, size = 2.2 }) {
  const refs = useRef([])
  const map = useMemo(() => (STAR ||= starTexture()), [])
  const seeds = useMemo(() => Array.from({ length: count }, () => ({ a: Math.random() * 6.28, r: 0.15 + Math.random() * 0.5, f: 0.6 + Math.random() * 1.2, ph: Math.random() * 6.28 })), [count])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    refs.current.forEach((sp, i) => {
      if (!sp) return
      const s = seeds[i]
      const k = Math.max(0, Math.sin(t * s.f + s.ph)) ** 5
      sp.material.opacity = k
      sp.scale.setScalar(size * (0.3 + k * 1.1))
      sp.material.rotation = t * 0.3 + i
    })
  })
  return seeds.map((s, i) => (
    <sprite key={i} ref={(el) => (refs.current[i] = el)} position={[Math.cos(s.a) * s.r, 0.5, Math.sin(s.a) * s.r]}>
      <spriteMaterial map={map} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  ))
}

// round brilliant: gem axis = local +Y (table up)
export function Gem({ scale = 1, clear = true, flares = 0, ...props }) {
  const A = getAssets()
  return (
    <group scale={scale} {...props}>
      <mesh geometry={A.brilliant} material={clear ? A.diamondBack : A.sapphireBack} scale={0.985} />
      <mesh geometry={A.brilliant} material={clear ? A.diamondFront : A.sapphireFront} renderOrder={2} />
      {flares > 0 && <Flares count={flares} />}
    </group>
  )
}

// six-claw solitaire head, axis = local +Y
function Head({ r = 0.4, clear = true, flares = 3 }) {
  const { silver } = getAssets()
  const claws = useMemo(() => Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2), [])
  return (
    <group>
      <Gem scale={r} clear={clear} flares={flares} />
      {claws.map((a, i) => (
        <mesh key={i} material={silver} position={[Math.cos(a) * r * 0.97, -0.05 * r, Math.sin(a) * r * 0.97]} rotation={[-0.24 * Math.sin(a), 0, 0.24 * Math.cos(a)]}>
          <cylinderGeometry args={[r * 0.032, r * 0.055, r * 0.9, 8]} />
        </mesh>
      ))}
      <mesh material={silver} position={[0, -0.5 * r, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r * 0.6, r * 0.05, 10, 36]} /></mesh>
      <mesh material={silver} position={[0, -0.82 * r, 0]}><cylinderGeometry args={[r * 0.3, r * 0.08, r * 0.4, 20]} /></mesh>
    </group>
  )
}

// bezel-set stone, table facing +Z
function SetStone({ r = 0.1, flares = 0, ...props }) {
  const { silver } = getAssets()
  return (
    <group {...props}>
      <mesh material={silver} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r * 1.04, r * 0.26, 10, 24]} /></mesh>
      <Gem scale={r} rotation={[Math.PI / 2, 0, 0]} flares={flares} />
    </group>
  )
}

// solitaire pendant on a fine chain
export function PendantBody({ mobile }) {
  const { silver } = getAssets()
  const curve = useMemo(() => {
    const half = [[0, 0.74], [0.35, 0.86], [0.75, 1.15], [1.2, 1.7], [1.75, 2.45], [2.4, 3.4]]
    return new THREE.CatmullRomCurve3([...half.slice(1).reverse().map(([x, y]) => new THREE.Vector3(-x, y, 0)), ...half.map(([x, y]) => new THREE.Vector3(x, y, 0))])
  }, [])
  return (
    <group>
      <group rotation={[Math.PI / 2, 0, 0]}><Head r={0.46} flares={mobile ? 2 : 4} /></group>
      <mesh position={[0, 0.62, 0]} rotation={[0, Math.PI / 2, 0]} material={silver}><torusGeometry args={[0.1, 0.024, 12, 28]} /></mesh>
      <mesh position={[0, 0.5, 0]} material={silver}><cylinderGeometry args={[0.026, 0.026, 0.14, 8]} /></mesh>
      <LinkChain curve={curve} links={mobile ? 56 : 84} size={0.85} />
    </group>
  )
}

function Ring() {
  const { silver, band, diamond } = getAssets()
  const halo = useMemo(() => Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return [Math.cos(a), Math.sin(a)] }), [])
  return (
    <group>
      <mesh geometry={band} material={silver} rotation={[Math.PI / 2, 0, 0]} />
      <group position={[0, 0.84, 0]}>
        <Head r={0.36} flares={4} />
        {halo.map(([x, z], i) => <mesh key={i} material={diamond} position={[x * 0.5, -0.12, z * 0.5]} scale={0.04}><sphereGeometry args={[1, 8, 8]} /></mesh>)}
      </group>
    </group>
  )
}

function Earrings() {
  const { silver, pearl } = getAssets()
  return (
    <group>
      {[-0.55, 0.55].map((x) => (
        <group key={x} position={[x, 0, 0]} rotation={[0, 0, x * 0.08]}>
          <SetStone r={0.11} position={[0, 0.98, 0]} flares={1} />
          <mesh position={[0, 0.74, 0]} material={silver}><cylinderGeometry args={[0.016, 0.016, 0.46, 10]} /></mesh>
          <mesh position={[0, 0.5, 0]} material={silver} scale={[1, 0.6, 1]}><sphereGeometry args={[0.1, 20, 20]} /></mesh>
          <mesh position={[0, 0.2, 0]} material={pearl} scale={[1, 1.04, 1]}><sphereGeometry args={[0.29, 48, 48]} /></mesh>
        </group>
      ))}
    </group>
  )
}

function Bracelet({ mobile }) {
  const { silver } = getAssets()
  const curve = useMemo(() => circle(0.85, 32), [])
  const n = mobile ? 16 : 22
  const stones = useMemo(() => Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2; return [Math.cos(a) * 0.85, Math.sin(a) * 0.85] }), [n])
  return (
    <group>
      <LinkChain curve={curve} links={mobile ? 36 : 48} closed size={1} />
      {stones.map(([x, y], i) => <SetStone key={i} r={mobile ? 0.095 : 0.075} position={[x, y, 0.02]} flares={i % 7 === 0 ? 1 : 0} />)}
      <mesh material={silver} position={[0.85, 0, 0]}><boxGeometry args={[0.12, 0.18, 0.08]} /></mesh>
    </group>
  )
}

function Anklet({ mobile }) {
  const { silver, heart, star } = getAssets()
  const curve = useMemo(() => circle(0.95, 36), [])
  const charms = [[-112, 'heart'], [-90, 'gem'], [-68, 'star']]
  return (
    <group>
      <LinkChain curve={curve} links={mobile ? 48 : 64} closed size={0.85} />
      {charms.map(([deg, kind]) => {
        const a = (deg * Math.PI) / 180
        return (
          <group key={deg} position={[Math.cos(a) * 0.95, Math.sin(a) * 0.95, 0]}>
            <mesh position={[0, -0.09, 0]} material={silver}><cylinderGeometry args={[0.008, 0.008, 0.18, 6]} /></mesh>
            <group position={[0, -0.28, 0]}>
              {kind === 'heart' && <mesh geometry={heart} material={silver} scale={0.3} />}
              {kind === 'star' && <mesh geometry={star} material={silver} scale={0.3} />}
              {kind === 'gem' && <Gem scale={0.12} rotation={[Math.PI / 2, 0, 0]} flares={1} />}
            </group>
          </group>
        )
      })}
    </group>
  )
}

function SetModel({ mobile }) {
  return (
    <group>
      <group position={[0, 0.62, 0]} scale={0.5}><PendantBody mobile={mobile} /></group>
      <group position={[0, -0.72, 0]} scale={0.48}><Earrings /></group>
    </group>
  )
}

export const MODELS = { ring: Ring, necklace: PendantBody, earrings: Earrings, bracelet: Bracelet, anklet: Anklet, set: SetModel }
