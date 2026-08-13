"use client";

import type { ElementType } from "react";
import { CalendarClock, CheckCircle2, Filter as FilterIcon, Radio, Search, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  TournamentsFilterSidebar,
  type ListingStatusFilter,
  type TournamentFilters,
} from "@/features/tournaments/components/tournaments-filter-sidebar";

const TABS: { value: ListingStatusFilter; label: string; icon: ElementType }[] = [
  { value: "registration-open", label: "Registration Open", icon: CheckCircle2 },
  { value: "upcoming", label: "Upcoming", icon: CalendarClock },
  { value: "live", label: "Live", icon: Radio },
  { value: "completed", label: "Completed", icon: Trophy },
];

export function TournamentsToolbar({
  activeStatus,
  onStatusChange,
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  onReset,
}: {
  activeStatus: ListingStatusFilter;
  onStatusChange: (status: ListingStatusFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  filters: TournamentFilters;
  onFiltersChange: (filters: TournamentFilters) => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = tab.value === activeStatus;
          return (
            <button
              key={tab.value}
              onClick={() => onStatusChange(tab.value)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground",
                isActive && "text-primary"
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
              {isActive ? (
                <span className="absolute inset-x-2 -bottom-[21px] h-0.5 bg-primary" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tournaments..."
            className="w-56 pl-9"
          />
        </div>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" className="lg:hidden" />}>
            <FilterIcon className="size-4" /> Filter
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm overflow-y-auto glass-strong">
            <SheetHeader>
              <SheetTitle>Filter Tournaments</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-4">
              <TournamentsFilterSidebar
                filters={filters}
                onChange={onFiltersChange}
                onReset={onReset}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
