export interface OverlayToggles {
  photos: boolean;
  breakBalls: boolean;
  intro: boolean;
  bigBreakAlert: boolean;
  frameBanner: boolean;
  reds: boolean;
}

export interface StreamSettings {
  /** YouTube watch link per table number. */
  youtubeUrls: Record<string, string>;
  sponsorLogos: string[];
  accent: string;
  show: OverlayToggles;
}

export const ACCENT_OPTIONS = ["#d4af37", "#3fae7c", "#9b5cf6", "#e53935", "#f4f5f7"] as const;
export const MAX_SPONSOR_LOGOS = 3;

export const DEFAULT_STREAM_SETTINGS: StreamSettings = {
  youtubeUrls: {},
  sponsorLogos: [],
  accent: ACCENT_OPTIONS[0],
  show: { photos: true, breakBalls: true, intro: true, bigBreakAlert: true, frameBanner: true, reds: true },
};

/** Fills in anything missing from settings saved by an older version. */
export function normalizeStreamSettings(raw: unknown): StreamSettings {
  const value = (raw && typeof raw === "object" ? raw : {}) as Partial<StreamSettings>;
  const accent =
    typeof value.accent === "string" && /^#[0-9a-f]{6}$/i.test(value.accent)
      ? value.accent
      : DEFAULT_STREAM_SETTINGS.accent;
  return {
    youtubeUrls: value.youtubeUrls && typeof value.youtubeUrls === "object" ? value.youtubeUrls : {},
    sponsorLogos: Array.isArray(value.sponsorLogos)
      ? value.sponsorLogos.filter((u) => typeof u === "string").slice(0, MAX_SPONSOR_LOGOS)
      : [],
    accent,
    show: { ...DEFAULT_STREAM_SETTINGS.show, ...(value.show ?? {}) },
  };
}

/** Turns a YouTube watch / live / short link into an embeddable player URL. */
export function youtubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^(www|m)\./, "");
    let id: string | null = null;
    if (host === "youtu.be") id = u.pathname.slice(1);
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname === "/watch") id = u.searchParams.get("v");
      else id = /^\/(live|embed|shorts)\/([^/?#]+)/.exec(u.pathname)?.[2] ?? null;
    }
    if (!id || !/^[\w-]{6,20}$/.test(id)) return null;
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1`;
  } catch {
    return null;
  }
}
