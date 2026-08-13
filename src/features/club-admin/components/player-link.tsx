import Link from "next/link";
import { clubPath } from "@/lib/club-path";

export function PlayerLink({
  clubSlug,
  playerId,
  children,
  className,
}: {
  clubSlug: string;
  playerId: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={clubPath(clubSlug, `/players/${playerId}`)} className={className}>
      {children}
    </Link>
  );
}
