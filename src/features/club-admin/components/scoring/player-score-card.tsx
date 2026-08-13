import { AvatarInitials } from "@/components/shared/avatar-initials";
import { cn } from "@/lib/utils";

export function PlayerScoreCard({
  name,
  photoUrl,
  score,
  align = "left",
  highlight,
}: {
  name: string;
  photoUrl?: string | null;
  score?: number | string;
  align?: "left" | "right";
  highlight?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", align === "right" && "flex-row-reverse text-right")}>
      <AvatarInitials name={name} photoUrl={photoUrl} size="lg" />
      <div>
        <p className={cn("font-heading text-base font-bold text-foreground", highlight && "text-primary")}>
          {name}
        </p>
        {score !== undefined ? (
          <p className="font-tabular text-2xl font-bold text-foreground">{score}</p>
        ) : null}
      </div>
    </div>
  );
}
