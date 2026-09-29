import { registerTvScreen } from "@/services/tv-screen-service";

/** Called once by a new TV: returns its device token and a code to show on screen. */
export async function POST() {
  const result = await registerTvScreen();
  if ("error" in result) return Response.json({ error: result.error }, { status: 500 });
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
}
