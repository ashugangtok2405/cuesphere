"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { TOURNAMENTS } from "@/lib/mock/tournaments";
import { TournamentCard } from "@/features/tournaments/components/tournament-card";
import {
  TournamentsFilterSidebar,
  type ListingStatusFilter,
  type TournamentFilters,
} from "@/features/tournaments/components/tournaments-filter-sidebar";
import { TournamentsToolbar } from "@/features/tournaments/components/tournaments-toolbar";
import { SearchX } from "lucide-react";

function parseFee(fee: string) {
  if (fee.toLowerCase() === "free") return 0;
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

export function TournamentsPageClient({
  initialStatus = "upcoming",
}: {
  initialStatus?: ListingStatusFilter;
}) {
  const defaultFilters: TournamentFilters = {
    status: initialStatus,
    format: "All Types",
    entryFee: "All Fees",
  };
  const [filters, setFilters] = useState<TournamentFilters>(defaultFilters);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const filtered = useMemo(() => {
    return TOURNAMENTS.filter((t) => {
      if (filters.status === "registration-open") {
        if (!t.registrationOpen) return false;
      } else if (t.status !== filters.status) {
        return false;
      }
      if (filters.format !== "All Types" && t.format !== filters.format) return false;
      if (!matchesEntryFee(t.entryFee, filters.entryFee)) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [filters, search]);

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
    setSearch("");
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {paginated.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
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
