"use client";

import * as React from "react";
import Image from "next/image";

import type { TableMatch } from "@/features/table-display/types";

/** Full-screen rotating ad images (1920×1080 stage) with a score strip
 * along the bottom, shown during frame breaks on the TV and stream. */
export function AdBreak({
  images,
  secondsPerImage,
  strip,
  background = "#000",
}: {
  images: string[];
  secondsPerImage: number;
  strip: React.ReactNode;
  background?: string;
}) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), secondsPerImage * 1000);
    return () => clearInterval(id);
  }, [images.length, secondsPerImage]);

  return (
    <div className="absolute inset-0" style={{ background }}>
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === index % images.length ? 1 : 0 }}
          aria-hidden={i !== index % images.length}
        >
          <Image src={src} alt="Advertisement" fill unoptimized priority={i === 0} className="object-contain" />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0">{strip}</div>
    </div>
  );
}

/** "Frame 1 to Sameer · 71–22 · Frames 1–0 · Frame 2 next" */
export function FrameBreakStrip({ match, accent, table }: { match: TableMatch; accent: string; table: number }) {
  const last = match.frames[match.frames.length - 1];
  const lastWinner = last ? (last.player1Score > last.player2Score ? match.p1.name : match.p2.name) : null;
  return (
    <StripShell accent={accent} table={table} label="FRAME BREAK">
      {last && lastWinner ? (
        <span>
          Frame {last.frame} to <strong className="text-white">{lastWinner}</strong>{" "}
          <span className="font-heading tabular-nums text-white">
            {last.player1Score}–{last.player2Score}
          </span>
        </span>
      ) : null}
      <span className="text-white/40">·</span>
      <span>
        {match.p1.name.split(" ")[0]}{" "}
        <strong className="font-heading text-[40px] tabular-nums text-white">
          {match.p1.frames} – {match.p2.frames}
        </strong>{" "}
        {match.p2.name.split(" ")[0]}
      </span>
      <span className="text-white/40">·</span>
      <span>Frame {match.p1.frames + match.p2.frames + 1} next</span>
    </StripShell>
  );
}

export function ResultStrip({ match, accent, table }: { match: TableMatch; accent: string; table: number }) {
  const winner = match.winner ?? (match.p1.frames > match.p2.frames ? 1 : 2);
  return (
    <StripShell accent={accent} table={table} label="FINAL">
      <span>
        <strong className="text-white">{winner === 1 ? match.p1.name : match.p2.name}</strong> wins{" "}
        <strong className="font-heading text-[40px] tabular-nums text-white">
          {Math.max(match.p1.frames, match.p2.frames)} – {Math.min(match.p1.frames, match.p2.frames)}
        </strong>
      </span>
      {match.highestBreak > 0 ? (
        <>
          <span className="text-white/40">·</span>
          <span>Highest break {match.highestBreak}</span>
        </>
      ) : null}
    </StripShell>
  );
}

function StripShell({
  accent,
  table,
  label,
  children,
}: {
  accent: string;
  table: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[120px] items-center gap-8 px-14 text-[32px] text-[#cdd1d8]" style={{ background: "rgba(11, 14, 18, 0.94)", borderTop: `4px solid ${accent}` }}>
      <span
        className="shrink-0 rounded-full px-6 py-2 text-[24px] font-extrabold tracking-[0.15em]"
        style={{ background: accent, color: "#14171c" }}
      >
        {label}
      </span>
      <div className="flex min-w-0 flex-1 items-center gap-6 whitespace-nowrap">{children}</div>
      <span className="shrink-0 font-heading text-[40px] font-extrabold" style={{ color: accent }}>
        TABLE {table}
      </span>
    </div>
  );
}
