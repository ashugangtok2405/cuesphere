"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { SocialIcons } from "@/components/layout/social-icons";
import { useClub } from "@/components/shared/club-provider";
import { CONTACT_INFO, INFORMATION_LINKS, QUICK_LINKS } from "@/lib/constants";

export function Footer() {
  const { club, basePath } = useClub();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              {club.description || "The premium snooker club where passion meets precision. Every frame tells a story."}
            </p>
            <SocialIcons links={club.socialLinks} />
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`${basePath}${link.href === "/" ? "" : link.href}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              Information
            </h3>
            <ul className="mt-4 space-y-2.5">
              {INFORMATION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`${basePath}${link.href}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                {club.address || CONTACT_INFO.address}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="size-4 shrink-0 text-primary" />
                {club.phone || CONTACT_INFO.phone}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="size-4 shrink-0 text-primary" />
                {club.email || CONTACT_INFO.email}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          &copy; {year} {club.name}. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
