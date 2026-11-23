import { useMemo } from 'react'
import * as THREE from 'three'
import { LinkChain } from './models'
import { getAssets } from './materials'

// A dimensional claw setting, pavé halo and individually interlocked chain.
export default function SignaturePendant({ mobile }) {
  const { silver, brilliant, diamond } = getAssets()
  const chain = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.65, 3.5, -0.3),
    new THREE.Vector3(-1.05, 2.05, -0.16),
    new THREE.Vector3(-0.48, 1.15, 0),
    new THREE.Vector3(0, 0.85, 0.04),
    new THREE.Vector3(0.48, 1.15, 0),
    new THREE.Vector3(1.05, 2.05, -0.16),
    new THREE.Vector3(1.65, 3.5, -0.3),
  ]), [])
  return (
    <group>
      <LinkChain curve={chain} links={mobile ? 100 : 150} size={0.64} />
      <mesh material={silver} position={[0, 0.76, 0]} scale={[0.65, 1, 1]}>
        <torusGeometry args={[0.16, 0.038, 12, 40]} />
      </mesh>
      <group scale={[0.86, 1.08, 1]}>
        <mesh material={silver} position={[0, 0, -0.08]}>
          <torusGeometry args={[0.63, 0.055, 16, 80]} />
        </mesh>
        <mesh material={silver} position={[0, 0, -0.22]}>
          <torusGeometry args={[0.43, 0.035, 12, 64]} />
        </mesh>
        <mesh geometry={brilliant} rotation={[Math.PI / 2, 0, 0]} scale={0.55}>
          <meshPhysicalMaterial color="#2268a5" metalness={0.12} roughness={0.055}
            clearcoat={1} clearcoatRoughness={0.04} envMapIntensity={2.2}
            transmission={mobile ? 0 : 0.42} thickness={0.65} ior={1.77}
            attenuationColor="#124577" attenuationDistance={0.7} flatShading />
        </mesh>
        {Array.from({ length: 28 }, (_, i) => {
          const a = i / 28 * Math.PI * 2
          return <mesh key={i} geometry={brilliant} material={diamond}
            position={[Math.cos(a) * 0.635, Math.sin(a) * 0.635, 0.035]}
            rotation={[Math.PI / 2, 0, a]} scale={0.047} />
        })}
        {Array.from({ length: 6 }, (_, i) => {
          const a = i / 6 * Math.PI * 2
          return <mesh key={i} material={silver}
            position={[Math.cos(a) * 0.52, Math.sin(a) * 0.52, 0.055]}
            rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.025, 0.23, 4, 8]} />
          </mesh>
        })}
      </group>
    </group>
  )
}
