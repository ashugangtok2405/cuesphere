import Image from "next/image";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const sizeStyles = {
  sm: "size-9 text-xs",
  md: "size-12 text-sm",
  lg: "size-16 text-lg",
  xl: "size-24 text-2xl",
};

const sizePx = { sm: 36, md: 48, lg: 64, xl: 96 };

export function AvatarInitials({
  name,
  photoUrl,
  size = "md",
  className,
}: {
  name: string;
  photoUrl?: string | null;
  size?: keyof typeof sizeStyles;
  className?: string;
}) {
  if (photoUrl) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-primary/30",
          sizeStyles[size],
          className
        )}
      >
        <Image src={photoUrl} alt={name} fill sizes={`${sizePx[size]}px`} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent font-heading font-bold text-primary",
        sizeStyles[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
