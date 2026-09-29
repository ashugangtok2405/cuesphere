import Image from "next/image";
import type { TableSide } from "@/features/table-display/types";

/** Round player photo, or initials when there's no photo. */
export function PlayerPhoto({ side, size, ring }: { side: TableSide; size: number; ring: string }) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-card-elevated font-heading font-bold text-foreground"
      style={{ width: size, height: size, border: `${Math.max(3, Math.round(size / 36))}px solid ${ring}`, fontSize: size * 0.34 }}
    >
      {side.photoUrl ? (
        <Image src={side.photoUrl} alt="" fill unoptimized className="object-cover" />
      ) : (
        side.initials
      )}
    </div>
  );
}
