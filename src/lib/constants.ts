export const SITE_NAME = "XYZ Snooker Club";
export const SITE_TAGLINE = "Home of Champions";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Tournaments", href: "/tournaments" },
  { label: "Live", href: "/live" },
  { label: "Gallery", href: "/gallery" },
  { label: "Hall of Fame", href: "/hall-of-fame" },
] as const;

export const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Tournaments", href: "/tournaments" },
  { label: "Live", href: "/live" },
  { label: "Gallery", href: "/gallery" },
] as const;

export const INFORMATION_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Rules", href: "/about#rules" },
  { label: "Membership", href: "/about#membership" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
] as const;

export const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Twitter", href: "https://twitter.com", icon: "twitter" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
] as const;

export const CONTACT_INFO = {
  address: "12C Snooker Street, Your City - 400001",
  phone: "+91 98765 43210",
  email: "info@xyzsnooker.com",
};

export const SPONSORS = [
  { name: "Aramith" },
  { name: "Strachan" },
  { name: "Rasson" },
  { name: "PERI" },
  { name: "Ultimate Pool" },
  { name: "LEONI" },
  { name: "West India Sports" },
] as const;
