"use client";

import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClubTournamentCard, type ClubTournamentCardData } from "@/features/club-admin/components/club-tournament-card";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import {
  TournamentsFilterSidebar,
  type ListingStatusFilter,
  type TournamentFilters,
} from "@/features/tournaments/components/tournaments-filter-sidebar";
import { TournamentsToolbar } from "@/features/tournaments/components/tournaments-toolbar";

function parseFee(fee: string) {
  if (!fee || fee.toLowerCase() === "free") return 0;
  return Number(fee.replace(/[^0-9]/g, ""));
}

function matchesEntryFee(fee: string, bucket: string) {
  if (bucket === "All Fees") return true;
  const amount = parseFee(fee);
  if (bucket === "Under ₹1,000") return amount < 1000;
  if (bucket === "₹1,000 – ₹2,000") return amount >= 1000 && amount <= 2000;
  if (bucket === "Above ₹2,000") return amount > 2000;
  return true;
}

export function ClubTournamentsPageClient({
  tournaments,
  clubs,
  initialStatus = "upcoming",
  allClubsLabel = "All My Clubs",
}: {
  tournaments: ClubTournamentCardData[];
  clubs: { slug: string; name: string }[];
  initialStatus?: ListingStatusFilter;
  allClubsLabel?: string;
}) {
  const defaultFilters: TournamentFilters = {
    status: initialStatus,
    format: "All Types",
    entryFee: "All Fees",
  };
  const [filters, setFilters] = useState<TournamentFilters>(defaultFilters);
  const [clubFilter, setClubFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const showClubName = clubs.length > 1;

  const filtered = useMemo(() => {
    return tournaments.filter((t) => {
      if (clubFilter !== "all" && t.clubSlug !== clubFilter) return false;
      if (filters.status === "registration-open") {
        if (!t.registrationOpen || t.status === "completed") return false;
      } else if (t.status !== filters.status) {
        return false;
      }
      if (filters.format !== "All Types" && t.format !== filters.format) return false;
      if (!matchesEntryFee(t.entryFee, filters.entryFee)) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tournaments, filters, clubFilter, search]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  function handleStatusChange(status: ListingStatusFilter) {
    setFilters((prev) => ({ ...prev, status }));
    setPage(1);
  }

  function handleFiltersChange(next: TournamentFilters) {
    setFilters(next);
    setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleReset() {
    setFilters(defaultFilters);
    setClubFilter("all");
    setSearch("");
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {showClubName ? (
        <div className="mb-5 flex items-center gap-3">
          <Label htmlFor="clubFilter" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Club
          </Label>
          <Select
            value={clubFilter}
            onValueChange={(v) => {
              if (!v) return;
              setClubFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger id="clubFilter" className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{allClubsLabel}</SelectItem>
              {clubs.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <TournamentsToolbar
        activeStatus={filters.status}
        onStatusChange={handleStatusChange}
        search={search}
        onSearchChange={handleSearchChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleReset}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <TournamentsFilterSidebar
            filters={filters}
            onChange={handleFiltersChange}
            onReset={handleReset}
          />
        </aside>

        <div className="space-y-6">
          {paginated.length > 0 ? (
            <RevealGroup
              key={`${clubFilter}:${filters.status}:${filters.format}:${filters.entryFee}:${search}:${page}`}
              className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {paginated.map((tournament) => (
                <RevealItem key={tournament.id}>
                  <ClubTournamentCard
                    tournament={tournament}
                    showClubName={showClubName}
                  />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <EmptyState
              icon={<SearchX className="size-6" />}
              title="No tournaments found"
              description="Try adjusting your filters or search terms."
            />
          )}

          {filtered.length > 0 ? (
            <Pagination
              page={page}
              pageSize={pageSize}
              total={filtered.length}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
