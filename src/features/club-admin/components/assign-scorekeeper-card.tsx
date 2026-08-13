"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Copy, Loader2, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createTournamentScorekeeperAction,
  removeTournamentScorekeeperAction,
} from "@/app/actions/tournament-scorekeeper-actions";

const schema = z.object({
  fullName: z.string().min(2, "Enter their name."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "At least 8 characters."),
});

type FormValues = z.infer<typeof schema>;

export function AssignScorekeeperCard({
  clubSlug,
  tournamentId,
  existing,
}: {
  clubSlug: string;
  tournamentId: string;
  existing: { id: string; userId: string }[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [removingId, setRemovingId] = React.useState<string | null>(null);
  const [created, setCreated] = React.useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = React.useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const result = await createTournamentScorekeeperAction(clubSlug, tournamentId, values);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setCreated({ email: result.email, password: result.password });
    reset();
    toast.success("Scorekeeper assigned to this tournament.");
    router.refresh();
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    const result = await removeTournamentScorekeeperAction(clubSlug, tournamentId, id);
    setRemovingId(null);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Access removed.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wide">
          <ShieldCheck className="size-4 text-primary" /> Scorekeeper Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Give someone a login that only scores matches in this tournament — it stops working on its
          own once you mark the tournament completed.
        </p>

        {existing.length > 0 ? (
          <div className="space-y-1.5">
            {existing.map((sk) => (
              <div
                key={sk.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
              >
                <span className="text-muted-foreground">Scorekeeper assigned</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={removingId === sk.id}
                  onClick={() => handleRemove(sk.id)}
                >
                  {removingId === sk.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                </Button>
              </div>
            ))}
          </div>
        ) : null}

        {created ? (
          <div className="space-y-2 rounded-lg border border-success/30 bg-success/10 p-3">
            <p className="text-xs font-semibold text-foreground">Share these with them</p>
            <div className="rounded-md border border-border bg-card p-2 font-mono text-xs">
              <p>{created.email}</p>
              <p className="text-muted-foreground">{created.password}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`Email: ${created.email}\nPassword: ${created.password}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy credentials"}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="skName">Name</Label>
              <Input id="skName" placeholder="Who's scoring?" {...register("fullName")} />
              {errors.fullName ? <p className="text-xs text-destructive">{errors.fullName.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="skEmail">Email</Label>
              <Input id="skEmail" type="email" placeholder="their@email.com" {...register("email")} />
              {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="skPassword">Temporary Password</Label>
              <Input id="skPassword" placeholder="At least 8 characters" {...register("password")} />
              {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
              Assign Scorekeeper
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
