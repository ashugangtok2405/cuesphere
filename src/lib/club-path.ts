/** Builds a club-scoped path, e.g. clubPath("xyz-snooker-club", "/tournaments") -> "/c/xyz-snooker-club/tournaments" */
export function clubPath(clubSlug: string, path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/c/${clubSlug}${cleanPath === "/" ? "" : cleanPath}`;
}
