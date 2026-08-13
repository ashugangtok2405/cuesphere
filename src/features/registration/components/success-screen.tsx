"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, LayoutDashboard, Trophy } from "lucide-react";

import { LinkButton } from "@/components/shared/link-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useClub } from "@/components/shared/club-provider";

interface SuccessScreenProps {
  tournamentName: string;
  tournamentSlug: string;
  playerName: string;
  memberId: string;
  registrationNumber: string;
  paymentStatus: "paid" | "pending";
  tournamentStatusLabel: string;
  drawReleaseDate: string;
  tournamentStartDate: string;
}

const CONFETTI_COLORS = ["#D4AF37", "#00C853", "#E53935", "#3B9EFF", "#F5F5F5"];

function Confetti() {
  const pieces = React.useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.4,
        duration: 1.8 + Math.random() * 1.2,
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 block size-2 rounded-sm"
          style={{ left: `${p.left}%`, background: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: 420, opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function SuccessScreen(props: SuccessScreenProps) {
  const { basePath, club } = useClub();

  function handleDownloadReceipt() {
    const lines = [
      `${club.name.toUpperCase()} — REGISTRATION RECEIPT`,
      "----------------------------------------",
      `Tournament: ${props.tournamentName}`,
      `Player: ${props.playerName}`,
      `Player ID: ${props.memberId}`,
      `Registration Number: ${props.registrationNumber}`,
      `Payment Status: ${props.paymentStatus === "paid" ? "PAID" : "PENDING (Pay at Club)"}`,
      `Tournament Start: ${formatDate(props.tournamentStartDate)}`,
      "----------------------------------------",
      "Thank you for registering. We look forward to seeing you at the club.",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${props.registrationNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative mx-auto max-w-lg overflow-hidden px-4 py-16 text-center sm:px-6">
      <Confetti />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="relative z-10 mx-auto flex size-20 items-center justify-center rounded-full bg-success/15 text-success"
      >
        <CheckCircle2 className="size-10" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative z-10"
      >
        <h1 className="mt-6 text-3xl font-bold text-foreground">Registration Successful!</h1>
        <p className="mt-2 text-muted-foreground">
          You&apos;re officially registered for <span className="text-foreground">{props.tournamentName}</span>.
        </p>
      </motion.div>

      <Card className="relative z-10 mt-8 text-left">
        <CardContent className="space-y-3 pt-6">
          <Row label="Tournament" value={props.tournamentName} />
          <Row label="Player Name" value={props.playerName} />
          <Row label="Player ID" value={props.memberId} />
          <Row label="Registration Number" value={props.registrationNumber} />
          <Row
            label="Payment Status"
            value={props.paymentStatus === "paid" ? "Paid" : "Pending (Pay at Club)"}
            highlight={props.paymentStatus === "paid" ? "success" : "warning"}
          />
          <Row label="Tournament Status" value={props.tournamentStatusLabel} />
          <Row label="Draw Release Date" value={formatDate(props.drawReleaseDate)} />
          <Row label="Tournament Start Date" value={formatDate(props.tournamentStartDate)} />
        </CardContent>
      </Card>

      <div className="relative z-10 mt-8 flex flex-col gap-3 sm:flex-row">
        <LinkButton href={`${basePath}/tournaments/${props.tournamentSlug}`} variant="outline" className="flex-1">
          <Trophy className="size-4" /> View Tournament
        </LinkButton>
        <Button variant="outline" className="flex-1" onClick={handleDownloadReceipt}>
          <Download className="size-4" /> Download Receipt
        </Button>
        <LinkButton href={`${basePath}/dashboard`} className="flex-1">
          <LayoutDashboard className="size-4" /> Go To Dashboard
        </LinkButton>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "success" | "warning";
}) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={
          highlight === "success"
            ? "text-sm font-semibold text-success"
            : highlight === "warning"
              ? "text-sm font-semibold text-warning"
              : "text-sm font-semibold text-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}
