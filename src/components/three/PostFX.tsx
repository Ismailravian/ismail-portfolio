"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export function PostFX({ dark }: { dark: boolean }) {
  return (
    <EffectComposer>
      <Bloom
        intensity={dark ? 0.8 : 0.25}
        luminanceThreshold={0.25}
        luminanceSmoothing={0.4}
      />
      <Vignette
        eskil={false}
        offset={0.15}
        darkness={dark ? 0.65 : 0.2}
      />
    </EffectComposer>
  );
}
