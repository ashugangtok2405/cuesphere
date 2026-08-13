"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TournamentStatus } from "@/types/tournament";

export type ListingStatusFilter = TournamentStatus | "registration-open";

export interface TournamentFilters {
  status: ListingStatusFilter;
  format: string;
  entryFee: string;
}

const STATUS_OPTIONS: { value: ListingStatusFilter; label: string }[] = [
  { value: "registration-open", label: "Registration Open" },
  { value: "upcoming", label: "Upcoming" },
  { value: "live", label: "Live" },
  { value: "completed", label: "Completed" },
];

export const FORMAT_OPTIONS = ["All Types", "Knockout", "Round Robin", "League + Playoffs"];
export const ENTRY_FEE_OPTIONS = ["All Fees", "Under ₹1,000", "₹1,000 – ₹2,000", "Above ₹2,000"];

export function TournamentsFilterSidebar({
  filters,
  onChange,
  onReset,
}: {
  filters: TournamentFilters;
  onChange: (filters: TournamentFilters) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-5">
      <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
        Filter Tournaments
      </h3>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Status
        </p>
        {STATUS_OPTIONS.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2.5">
            <Checkbox
              id={`status-${opt.value}`}
              checked={filters.status === opt.value}
              onCheckedChange={() => onChange({ ...filters, status: opt.value })}
            />
            <Label htmlFor={`status-${opt.value}`} className="cursor-pointer text-sm font-normal">
              {opt.label}
            </Label>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Tournament Type
        </Label>
        <Select
          value={filters.format}
          onValueChange={(value) => value && onChange({ ...filters, format: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FORMAT_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Entry Fee
        </Label>
        <Select
          value={filters.entryFee}
          onValueChange={(value) => value && onChange({ ...filters, entryFee: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ENTRY_FEE_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onReset} className="w-full">
        <RotateCcw className="size-3.5" /> Reset Filters
      </Button>
    </div>
  );
}
