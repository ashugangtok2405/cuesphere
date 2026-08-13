import { Flame, Target, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { TournamentDetail } from "@/types/tournament-detail";

export function StatsTab({ tournament }: { tournament: TournamentDetail }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard icon={<Flame className="size-5" />} label="Highest Break" value={119} accent="gold" />
      <StatCard icon={<Target className="size-5" />} label="Century Breaks" value={14} accent="success" />
      <StatCard icon={<TrendingUp className="size-5" />} label="Avg. Break" value={38} accent="info" />
      <StatCard
        icon={<Users className="size-5" />}
        label="Total Players"
        value={tournament.players}
        accent="danger"
      />
    </div>
  );
}
