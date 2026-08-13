"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PlayerProfile } from "@/types/player-profile";
import type { TournamentDetail } from "@/types/tournament-detail";
import { registerForTournamentAction } from "@/app/actions/registration-actions";

const schema = z.object({
  emergencyContact: z.string().min(8, "Enter a valid emergency contact number."),
  preferredCue: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["online", "offline"]),
  agreedToRules: z.boolean().refine((v) => v === true, {
    message: "You must agree to the tournament rules.",
  }),
});

type FormValues = z.infer<typeof schema>;

export function RegistrationForm({
  tournament,
  profile,
  clubSlug,
}: {
  tournament: TournamentDetail;
  profile: PlayerProfile;
  clubSlug: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      emergencyContact: profile.emergencyContact,
      preferredCue: profile.preferredCue,
      notes: "",
      paymentMethod: "online",
      agreedToRules: false,
    },
  });

  const agreed = watch("agreedToRules");

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const result = await registerForTournamentAction({
      clubSlug,
      slug: tournament.slug,
      emergencyContact: values.emergencyContact,
      preferredCue: values.preferredCue,
      notes: values.notes,
      paymentMethod: values.paymentMethod,
      agreedToRules: true,
    });
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    router.push(`/c/${clubSlug}/registration/${result.registrationId}/success`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide">Player Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Player Name</Label>
            <Input value={profile.fullName} disabled />
          </div>
          <div className="space-y-2">
            <Label>Member ID</Label>
            <Input value={profile.memberId} disabled />
          </div>
          <div className="space-y-2">
            <Label>Mobile</Label>
            <Input value={profile.mobile} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email} disabled />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input value={profile.city} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact</Label>
            <Input id="emergencyContact" {...register("emergencyContact")} />
            {errors.emergencyContact ? (
              <p className="text-xs text-destructive">{errors.emergencyContact.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferredCue">Preferred Cue (Optional)</Label>
            <Input id="preferredCue" {...register("preferredCue")} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" rows={3} {...register("notes")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wide">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-3">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background/40 p-4 hover:border-primary/40">
                  <RadioGroupItem value="online" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Online Payment</p>
                    <p className="text-xs text-muted-foreground">
                      Pay {tournament.entryFee} now via Razorpay. Instant confirmation.
                    </p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background/40 p-4 hover:border-primary/40">
                  <RadioGroupItem value="offline" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Offline Payment (Pay at Club)</p>
                    <p className="text-xs text-muted-foreground">
                      Reserve your slot now, pay {tournament.entryFee} at the club. Subject to admin
                      approval.
                    </p>
                  </div>
                </label>
              </RadioGroup>
            )}
          />
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
        <Controller
          control={control}
          name="agreedToRules"
          render={({ field }) => (
            <Checkbox id="agreedToRules" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="agreedToRules" className="cursor-pointer text-sm font-normal text-muted-foreground">
          I agree to the tournament rules, dress code and code of conduct of XYZ Snooker Club.
        </Label>
      </div>
      {errors.agreedToRules ? (
        <p className="text-xs text-destructive">{errors.agreedToRules.message}</p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={!agreed || isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
        Register &amp; Pay {tournament.entryFee}
      </Button>
    </form>
  );
}
