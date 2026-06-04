"use client";

import { Component, type ReactNode } from "react";

export class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    // Next.js throws this internally for dynamic() SSR bailout — not a real error.
    if (error.message?.includes("Bail out to client-side rendering")) {
      throw error;
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[Scene] 3D crashed, showing gradient fallback:", error.message);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
