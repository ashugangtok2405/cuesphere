import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type LinkButtonProps = ComponentProps<typeof Button> & {
  href: string;
};

export function LinkButton({ href, ...props }: LinkButtonProps) {
  return <Button {...props} nativeButton={false} render={<Link href={href} />} />;
}
