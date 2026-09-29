import { getProfileById } from "@/services/profile-service";

/** Serves a player's photo as an image so screens that poll often (table TV,
 * stream overlay) can cache it instead of receiving it inline every time. */
export async function GET(_request: Request, ctx: { params: Promise<{ playerId: string }> }) {
  const { playerId } = await ctx.params;
  const photo = (await getProfileById(playerId))?.profilePhotoUrl;
  if (!photo) return new Response(null, { status: 404 });

  if (/^https?:\/\//.test(photo)) return Response.redirect(photo, 302);

  const match = /^data:([^;,]+);base64,(.*)$/.exec(photo);
  if (!match) return new Response(null, { status: 404 });

  return new Response(Buffer.from(match[2], "base64"), {
    headers: { "Content-Type": match[1], "Cache-Control": "public, max-age=300" },
  });
}
