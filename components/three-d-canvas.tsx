"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Float, Sparkles } from "@react-three/drei"
import { useRef, useMemo, useState, useEffect } from "react"
import * as THREE from "three"

function RotatingMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const outerRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = state.clock.elapsedTime * 0.3
      innerRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -state.clock.elapsedTime * 0.15
    }
  })

  // Create custom point cloud geometry
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) {
      const radius = 2 + Math.random() * 1
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef}>
        {/* Core icosahedron - wireframe orange */}
        <mesh ref={innerRef}>
          <icosahedronGeometry args={[1, 2]} />
          <meshPhongMaterial
            color="#F29F67"
            emissive="#F29F67"
            emissiveIntensity={0.4}
            wireframe={true}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Secondary dodecahedron - teal points */}
        <mesh ref={outerRef}>
          <dodecahedronGeometry args={[1.5, 1]} />
          <meshPhongMaterial
            color="#34B1AA"
            emissive="#34B1AA"
            emissiveIntensity={0.3}
            wireframe={true}
            transparent
            opacity={0.5}
          />
        </mesh>

        {/* Point cloud ring */}
        <points geometry={particleGeometry}>
          <pointsMaterial color="#3B8FF3" size={0.03} transparent opacity={0.6} sizeAttenuation />
        </points>

        {/* Inner glow core */}
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial color="#F29F67" transparent opacity={0.15} />
        </mesh>

        {/* Outer atmosphere */}
        <mesh scale={2.5}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#3B8FF3" transparent opacity={0.05} side={THREE.BackSide} />
        </mesh>
      </group>
    </Float>
  )
}

function OrbitalRings() {
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = state.clock.elapsedTime * 0.1
      ring1Ref.current.rotation.z = state.clock.elapsedTime * 0.05
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = state.clock.elapsedTime * 0.08
      ring2Ref.current.rotation.x = Math.PI / 4
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = state.clock.elapsedTime * 0.12
      ring3Ref.current.rotation.y = Math.PI / 3
    }
  })

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#F29F67" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#34B1AA" transparent opacity={0.25} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.8, 0.01, 16, 100]} />
        <meshBasicMaterial color="#3B8FF3" transparent opacity={0.2} />
      </mesh>
    </>
  )
}

export default function ThreeDCanvas() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Canvas className="w-full h-full" dpr={[1, 2]} style={{ width: "100%", height: "100%" }}>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />

      {/* Colored point lights */}
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#F29F67" />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#34B1AA" />
      <pointLight position={[0, 5, -5]} intensity={0.3} color="#3B8FF3" />

      {/* Main rotating mesh */}
      <RotatingMesh />

      {/* Orbital rings */}
      <OrbitalRings />

      {/* Sparkle particles - reduced scale */}
      <Sparkles count={100} size={2} scale={6} speed={0.4} color="#F29F67" opacity={0.5} />

      {/* Controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  )
}
