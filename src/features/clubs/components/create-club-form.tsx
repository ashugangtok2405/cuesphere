"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClubAction } from "@/app/actions/club-actions";

const schema = z.object({
  name: z.string().min(2, "Enter your club's name."),
  tagline: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CreateClubForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", tagline: "", email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    if (!isLoggedIn) {
      if (!values.email || !/^\S+@\S+\.\S+$/.test(values.email)) {
        setError("email", { message: "Enter a valid email address." });
        return;
      }
      if (!values.password || values.password.length < 8) {
        setError("password", { message: "Password must be at least 8 characters." });
        return;
      }
    }

    setIsSubmitting(true);
    const result = await createClubAction(values);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Club created!");
    router.push(`/c/${result.slug}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Club Name</Label>
        <Input id="name" placeholder="e.g. Metro Snooker Club" {...register("name")} />
        {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline (Optional)</Label>
        <Input id="tagline" placeholder="e.g. Where Every Frame Counts" {...register("tagline")} />
      </div>

      {!isLoggedIn ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Your Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Create a Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            ) : null}
          </div>
        </>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Trophy className="size-4" />}
        Create Club
      </Button>
    </form>
  );
}
