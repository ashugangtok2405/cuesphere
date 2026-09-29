"use client";

import Image from "next/image";
import { Trophy } from "lucide-react";

import { ScaledStage } from "@/features/table-display/components/scaled-stage";
import { AdBreak, FrameBreakStrip, ResultStrip } from "@/features/table-display/components/ad-break";
import { TableBall } from "@/features/table-display/components/table-ball";
import { PlayerPhoto } from "@/features/table-display/components/player-photo";
import { useTableBoard, type FrameBanner } from "@/features/table-display/use-table-board";
import type { TableBoard, TableMatch } from "@/features/table-display/types";
import type { OverlayToggles } from "@/types/stream";

/** The club's chosen accent, set as a CSS variable on the overlay root. */
const GOLD = "var(--overlay-accent)";
const BLUE = "#3b9eff";
const GLASS = "rgba(11, 14, 18, 0.92)";
const EDGE = "2px solid rgba(255, 255, 255, 0.14)";

function Corners({ board }: { board: TableBoard }) {
  return (
    <>
      <div
        className="absolute left-12 top-10 flex items-center gap-4 rounded-full py-2.5 pl-2.5 pr-7"
        style={{ background: GLASS, border: EDGE }}
      >
        <div className="relative flex size-[76px] items-center justify-center overflow-hidden rounded-full bg-white">
          {board.club.logoUrl ? (
            <Image src={board.club.logoUrl} alt="" fill unoptimized className="object-contain p-1.5" />
          ) : (
            <span className="font-heading text-2xl font-extrabold text-felt">
              {board.club.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="font-heading text-[26px] font-bold leading-tight text-white">{board.club.name}</p>
          <p className="text-[18px] text-muted-foreground">
            Cue<span className="text-primary">Sphere</span> live
          </p>
        </div>
      </div>
      <div className="absolute right-12 top-10 flex items-center gap-3.5">
        <p
          className="flex h-16 items-center rounded-full px-7 font-heading text-[30px] font-extrabold"
          style={{ background: GOLD, color: "#14171c" }}
        >
          TABLE {board.table}
        </p>
        {board.stream.sponsorLogos.map((url) => (
          <div key={url} className="relative size-[84px] overflow-hidden rounded-full bg-white">
            <Image src={url} alt="Sponsor" fill unoptimized className="object-contain p-2" />
          </div>
        ))}
      </div>
    </>
  );
}

function ScoreBar({ match, show }: { match: TableMatch; show: OverlayToggles }) {
  const title = [match.tournamentName, match.round, match.bestOf ? `Best of ${match.bestOf}` : ""]
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();
  const cell = "flex items-center justify-center font-heading font-bold tabular-nums";

  return (
    <div className="absolute inset-x-20 bottom-9 flex flex-col items-center">
      {title ? (
        <p
          className="rounded-t-[14px] px-7 py-2 text-[22px] font-extrabold tracking-[0.1em]"
          style={{ background: GOLD, color: "#14171c" }}
        >
          {title}
        </p>
      ) : null}
      <div className="flex h-[108px] w-full overflow-hidden rounded-3xl text-white" style={{ background: GLASS, border: EDGE }}>
        <div className="flex min-w-0 flex-1 items-center gap-5 pr-6">
          <span className="w-2.5 self-stretch" style={{ background: match.onStrike === 1 ? GOLD : "transparent" }} />
          {show.photos ? <PlayerPhoto side={match.p1} size={76} ring={GOLD} /> : null}
          <span className="truncate font-heading text-[38px] font-extrabold uppercase tracking-wide">{match.p1.name}</span>
        </div>
        <div className="flex shrink-0">
          <span className={`${cell} w-[150px] text-[72px]`} style={{ background: GOLD, color: "#14171c" }}>
            {match.p1.score}
          </span>
          <span className={`${cell} w-[92px] bg-[#22262f] text-[60px]`}>{match.p1.frames}</span>
          <span className="flex w-[110px] flex-col items-center justify-center bg-card leading-none">
            {match.bestOf ? (
              <span className="font-heading text-[40px] font-bold text-[#cdd1d8]">({match.bestOf})</span>
            ) : null}
            <span className="mt-1 text-[14px] tracking-wider text-muted-foreground">
              FRAME {match.p1.frames + match.p2.frames + 1}
            </span>
          </span>
          <span className={`${cell} w-[92px] bg-[#22262f] text-[60px]`}>{match.p2.frames}</span>
          <span className={`${cell} w-[150px] text-[72px]`} style={{ background: BLUE, color: "#0b0e12" }}>
            {match.p2.score}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-5 pl-6">
          <span className="truncate font-heading text-[38px] font-extrabold uppercase tracking-wide">{match.p2.name}</span>
          {show.photos ? <PlayerPhoto side={match.p2} size={76} ring={BLUE} /> : null}
          <span className="w-2.5 self-stretch" style={{ background: match.onStrike === 2 ? BLUE : "transparent" }} />
        </div>
      </div>
      {show.reds ? (
        <p
          className="mt-2 rounded-[14px] px-5 py-1.5 text-[20px] font-bold tracking-[0.1em] text-[#cdd1d8]"
          style={{ background: GLASS, border: EDGE }}
        >
          REDS {match.redsRemaining}
          {match.pointsRemaining !== null ? ` · ${match.pointsRemaining} LEFT` : ""}
        </p>
      ) : null}
    </div>
  );
}

function BreakPill({ match, showBalls }: { match: TableMatch; showBalls: boolean }) {
  if (match.currentBreak <= 0) return null;
  const side = match.onStrike;
  const color = side === 2 ? BLUE : GOLD;
  const position = side === 2 ? { right: 100 } : side === 1 ? { left: 100 } : { left: "50%", transform: "translateX(-50%)" };
  return (
    <div
      className="absolute flex items-center gap-4 rounded-[22px] px-6 py-3"
      style={{ bottom: 244, background: GLASS, border: `2px solid ${color}`, ...position }}
    >
      <span className="text-[22px] font-extrabold tracking-[0.12em]" style={{ color }}>
        BREAK
      </span>
      <span className="font-heading text-[52px] font-bold leading-none text-white tabular-nums">{match.currentBreak}</span>
      {showBalls ? (
        <span className="flex max-w-[460px] flex-wrap gap-2">
          {match.breakBalls.map((ball, i) => (
            <TableBall key={i} color={ball} size={28} />
          ))}
        </span>
      ) : null}
    </div>
  );
}

function BigBreakAlert({ match }: { match: TableMatch }) {
  if (match.currentBreak < 50) return null;
  const name = match.onStrike === 1 ? match.p1.name : match.onStrike === 2 ? match.p2.name : "";
  return (
    <div
      className="absolute left-1/2 top-[170px] flex -translate-x-1/2 items-center gap-7 rounded-[30px] px-12 py-5"
      style={{ background: GOLD, color: "#14171c" }}
    >
      <span className="text-[30px] font-extrabold tracking-[0.2em]">
        {match.currentBreak >= 100 ? "CENTURY BREAK" : "HALF-CENTURY"}
      </span>
      <span className="font-heading text-[96px] font-bold leading-none tabular-nums">{match.currentBreak}</span>
      {name ? <span className="font-heading text-[34px] font-extrabold">{name}</span> : null}
    </div>
  );
}

function Card({ children, border }: { children: React.ReactNode; border: string }) {
  return (
    <div
      className="absolute left-1/2 top-[250px] flex w-[1260px] -translate-x-1/2 flex-col items-center gap-7 rounded-[36px] px-14 py-11 text-white"
      style={{ background: GLASS, border: `2px solid ${border}` }}
    >
      {children}
    </div>
  );
}

function IntroCard({ match, label, showPhotos }: { match: TableMatch; label: string; showPhotos: boolean }) {
  return (
    <Card border="rgba(255, 255, 255, 0.14)">
      <p className="text-[26px] font-extrabold tracking-[0.25em] text-primary">{label}</p>
      <div className="flex items-center gap-14">
        {[match.p1, match.p2].map((p, i) => (
          <div key={i} className="flex w-[440px] flex-col items-center gap-3.5 text-center">
            {showPhotos ? <PlayerPhoto side={p} size={170} ring={i === 0 ? GOLD : BLUE} /> : null}
            <span className="font-heading text-[46px] font-extrabold leading-tight">{p.name}</span>
          </div>
        ))}
      </div>
      <p className="text-[26px] text-[#cdd1d8]">
        {[match.tournamentName, match.round, match.bestOf ? `Best of ${match.bestOf}` : "", match.startTime]
          .filter(Boolean)
          .join(" · ")}
      </p>
    </Card>
  );
}

function FrameCard({ banner }: { banner: FrameBanner }) {
  const { frame, winner, match } = banner;
  const color = winner === 1 ? GOLD : BLUE;
  return (
    <Card border={color}>
      <p className="text-[26px] font-extrabold tracking-[0.25em]" style={{ color }}>
        FRAME {frame.frame} TO
      </p>
      <p className="font-heading text-[84px] font-extrabold leading-none">{winner === 1 ? match.p1.name : match.p2.name}</p>
      <p className="font-heading text-[96px] font-bold leading-none tabular-nums">
        <span style={{ color: winner === 1 ? GOLD : "#5e646e" }}>{frame.player1Score}</span>
        <span className="px-6 text-[#5e646e]">–</span>
        <span style={{ color: winner === 2 ? BLUE : "#5e646e" }}>{frame.player2Score}</span>
      </p>
      <p className="text-[28px] text-[#cdd1d8]">
        Frames {match.p1.frames} – {match.p2.frames}
      </p>
    </Card>
  );
}

function ResultCard({ match }: { match: TableMatch }) {
  const winner = match.winner ?? (match.p1.frames > match.p2.frames ? 1 : 2);
  return (
    <Card border={GOLD}>
      <p className="flex items-center gap-3.5 text-[26px] font-extrabold tracking-[0.25em] text-primary">
        <Trophy className="size-9" /> MATCH WINNER
      </p>
      <p className="font-heading text-[100px] font-extrabold leading-none">{winner === 1 ? match.p1.name : match.p2.name}</p>
      <p className="font-heading text-[120px] font-bold leading-none tabular-nums">
        <span style={{ color: winner === 1 ? GOLD : "#a0a6b0" }}>{match.p1.frames}</span>
        <span className="px-6 text-[#5e646e]">–</span>
        <span style={{ color: winner === 2 ? BLUE : "#a0a6b0" }}>{match.p2.frames}</span>
      </p>
      {match.frames.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3.5">
          {match.frames.map((f) => (
            <span key={f.frame} className="rounded-[18px] bg-[#1c2029] px-5 py-2.5 font-heading text-[34px] font-bold tabular-nums">
              <span className="pr-2.5 font-sans text-[18px] text-muted-foreground">F{f.frame}</span>
              <span style={{ color: f.player1Score > f.player2Score ? GOLD : "#5e646e" }}>{f.player1Score}</span>–
              <span style={{ color: f.player2Score > f.player1Score ? BLUE : "#5e646e" }}>{f.player2Score}</span>
            </span>
          ))}
        </div>
      ) : null}
      {match.highestBreak > 0 ? (
        <p className="text-[26px] text-[#cdd1d8]">
          Highest break <strong className="text-primary">{match.highestBreak}</strong>
          {match.highestBreakBy ? ` · ${match.highestBreakBy === 1 ? match.p1.name : match.p2.name}` : ""}
        </p>
      ) : null}
    </Card>
  );
}

/** Transparent 1920×1080 score overlay for a table's live stream. Add the page
 * as a Browser source in OBS above the camera; it follows the referee's scoring. */
export function StreamOverlay({ initial, clubSlug, table }: { initial: TableBoard; clubSlug: string; table: number }) {
  const { board, screen, banner, showIntro } = useTableBoard(initial, clubSlug, table);
  const { show, accent, ads } = board.stream;
  const adsReady = ads.enabled && ads.onOverlay && ads.images.length > 0;

  // During a frame break (after the "frame won" card) the ad covers the camera
  // for stream viewers; optionally also after the match.
  let adStrip: React.ReactNode = null;
  if (adsReady && screen.kind === "live" && screen.match.inFrameBreak && !(banner && show.frameBanner)) {
    adStrip = <FrameBreakStrip match={screen.match} accent={accent} table={board.table} />;
  } else if (adsReady && ads.afterMatch && screen.kind === "result") {
    adStrip = <ResultStrip match={screen.match} accent={accent} table={board.table} />;
  }
  if (adStrip) {
    return (
      <ScaledStage background="transparent">
        <AdBreak images={ads.images} secondsPerImage={ads.secondsPerImage} strip={adStrip} />
      </ScaledStage>
    );
  }

  let centre: React.ReactNode = null;
  if (screen.kind === "live") {
    if (banner && show.frameBanner) centre = <FrameCard banner={banner} />;
    else if (showIntro && show.intro) centre = <IntroCard match={screen.match} label="STARTING NOW" showPhotos={show.photos} />;
    else if (show.bigBreakAlert) centre = <BigBreakAlert match={screen.match} />;
  } else if (screen.kind === "result") {
    centre = <ResultCard match={screen.match} />;
  } else if (screen.kind === "next" && show.intro) {
    centre = <IntroCard match={screen.match} label={`UP NEXT ON TABLE ${board.table}`} showPhotos={show.photos} />;
  }

  return (
    <ScaledStage background="transparent">
      <div className="relative size-full font-sans" style={{ "--overlay-accent": accent } as React.CSSProperties}>
        <Corners board={board} />
        {screen.kind === "live" ? <BreakPill match={screen.match} showBalls={show.breakBalls} /> : null}
        {centre}
        {screen.kind === "live" ? <ScoreBar match={screen.match} show={show} /> : null}
      </div>
    </ScaledStage>
  );
}
