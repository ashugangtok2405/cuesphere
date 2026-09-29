"use client";

import * as React from "react";

const WIDTH = 1920;
const HEIGHT = 1080;

/** Renders a fixed 1920×1080 design scaled to fill the screen (letterboxed),
 * so the TV and overlay look identical on any display or OBS source size. */
export function ScaledStage({ children, background }: { children: React.ReactNode; background: string }) {
  const [scale, setScale] = React.useState<number | null>(null);

  React.useLayoutEffect(() => {
    function fit() {
      setScale(Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT));
    }
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden" style={{ background }}>
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          flexShrink: 0,
          transform: `scale(${scale ?? 1})`,
          visibility: scale === null ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </div>
  );
}
