"use client";

import { Canvas, useFrame, extend } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars, Preload } from "@react-three/drei";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";

function Orb({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    ref.current.rotation.x = t * 0.2;
    ref.current.rotation.y = t * 0.3;
  });
  return (
    <Float speed={1.4 * speed} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          distort={0.4}
          speed={1.5}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>
    </Float>
  );
}

function TorusKnot({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.25;
    ref.current.position.y = Math.sin(t * 0.6) * 0.4;
  });
  return (
    <mesh ref={ref} position={[0, 0, -2]} scale={0.9}>
      <torusKnotGeometry args={[1.2, 0.32, 160, 24]} />
      <meshStandardMaterial
        color={color}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

function Particles({ color }: { color: string }) {
  const ref = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 28;
      positions[i + 1] = (Math.random() - 0.5) * 16;
      positions[i + 2] = (Math.random() - 0.5) * 18;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.018;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.045}
        color={color}
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

function PostFX({ dark }: { dark: boolean }) {
  // Dynamically load postprocessing to avoid SSR / WebGL1 crashes
  const [FX, setFX] = useState<React.ComponentType<{ dark: boolean }> | null>(null);
  useEffect(() => {
    import("./PostFX").then((m) => setFX(() => m.PostFX)).catch(() => null);
  }, []);
  if (!FX) return null;
  return <FX dark={dark} />;
}

export function Scene({ variant = "hero" }: { variant?: "hero" | "subtle" }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const dark = resolvedTheme === "dark";
  const palette = dark
    ? { a: "#7c3aed", b: "#06b6d4", c: "#ec4899", knot: "#818cf8", particle: "#c4c9f0" }
    : { a: "#6366f1", b: "#0ea5e9", c: "#f472b6", knot: "#6366f1", particle: "#374151" };

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 55 }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={dark ? 0.4 : 0.7} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} />
      <pointLight position={[-5, -3, 4]} intensity={1.0} color={palette.c} />
      <pointLight position={[5, 3, -2]} intensity={1.0} color={palette.b} />

      <Suspense fallback={null}>
        {variant === "hero" && <TorusKnot color={palette.knot} />}
        <Orb position={[-3.2, 1.2, 0]} color={palette.a} scale={0.9} speed={0.9} />
        <Orb position={[3.0, -1.4, 0.5]} color={palette.b} scale={0.7} speed={1.2} />
        <Orb position={[2.4, 2.2, -1.5]} color={palette.c} scale={0.5} speed={1.5} />
        <Particles color={palette.particle} />
        {dark && <Stars radius={50} depth={40} count={900} factor={3} fade speed={0.5} />}
        <Preload all />
      </Suspense>

      <PostFX dark={dark} />
    </Canvas>
  );
}
