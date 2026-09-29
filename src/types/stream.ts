export interface OverlayToggles {
  photos: boolean;
  breakBalls: boolean;
  intro: boolean;
  bigBreakAlert: boolean;
  frameBanner: boolean;
  reds: boolean;
}

/** Ad images played on table screens during the break between frames. */
export interface AdSettings {
  enabled: boolean;
  images: string[];
  secondsPerImage: number;
  onTv: boolean;
  onOverlay: boolean;
  /** Keep rotating ads on the result screen after the match. */
  afterMatch: boolean;
}

export interface StreamSettings {
  /** YouTube watch link per table number. */
  youtubeUrls: Record<string, string>;
  sponsorLogos: string[];
  accent: string;
  show: OverlayToggles;
  ads: AdSettings;
}

export const ACCENT_OPTIONS = ["#d4af37", "#3fae7c", "#9b5cf6", "#e53935", "#f4f5f7"] as const;
export const MAX_SPONSOR_LOGOS = 3;
export const MAX_AD_IMAGES = 10;
export const AD_SECONDS_OPTIONS = [5, 8, 10, 15, 20, 30] as const;

export const DEFAULT_STREAM_SETTINGS: StreamSettings = {
  youtubeUrls: {},
  sponsorLogos: [],
  accent: ACCENT_OPTIONS[0],
  show: { photos: true, breakBalls: true, intro: true, bigBreakAlert: true, frameBanner: true, reds: true },
  ads: { enabled: true, images: [], secondsPerImage: 10, onTv: true, onOverlay: true, afterMatch: false },
};

function normalizeAds(raw: unknown): AdSettings {
  const value = (raw && typeof raw === "object" ? raw : {}) as Partial<AdSettings>;
  const d = DEFAULT_STREAM_SETTINGS.ads;
  const seconds = Number(value.secondsPerImage);
  return {
    enabled: typeof value.enabled === "boolean" ? value.enabled : d.enabled,
    images: Array.isArray(value.images)
      ? value.images.filter((u) => typeof u === "string").slice(0, MAX_AD_IMAGES)
      : [],
    secondsPerImage: (AD_SECONDS_OPTIONS as readonly number[]).includes(seconds) ? seconds : d.secondsPerImage,
    onTv: typeof value.onTv === "boolean" ? value.onTv : d.onTv,
    onOverlay: typeof value.onOverlay === "boolean" ? value.onOverlay : d.onOverlay,
    afterMatch: typeof value.afterMatch === "boolean" ? value.afterMatch : d.afterMatch,
  };
}

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
    ads: normalizeAds(value.ads),
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
