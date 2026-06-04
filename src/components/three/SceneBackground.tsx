"use client";

import dynamic from "next/dynamic";
import { SceneErrorBoundary } from "./SceneErrorBoundary";

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), {
  ssr: false,
  loading: () => null,
});

export function SceneBackground({ variant = "hero" }: { variant?: "hero" | "subtle" }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* CSS gradient — always visible immediately, no JS needed */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 18% 28%, rgb(99 102 241 / 0.28) 0%, transparent 70%)," +
            "radial-gradient(45% 45% at 82% 72%, rgb(236 72 153 / 0.22) 0%, transparent 70%)," +
            "radial-gradient(50% 50% at 50% 95%, rgb(6 182 212 / 0.22) 0%, transparent 70%)",
        }}
      />

      {/* 3D scene — loads on top, falls back to gradient if WebGL unavailable */}
      <SceneErrorBoundary>
        <Scene variant={variant} />
      </SceneErrorBoundary>

      {/* Radial vignette to keep text readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgb(var(--bg) / 0.45) 55%, rgb(var(--bg) / 0.88) 100%)",
        }}
      />
    </div>
  );
}
