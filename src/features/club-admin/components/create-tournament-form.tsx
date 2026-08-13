"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClubTournamentAction } from "@/app/actions/club-tournament-actions";
import { uploadTournamentThumbnailAction } from "@/app/actions/tournament-thumbnail-actions";
import { PrizeBreakdownEditor } from "@/features/club-admin/components/prize-breakdown-editor";
import type { PrizeBreakdownItem } from "@/types/club-tournament";

const schema = z.object({
  name: z.string().min(2, "Enter a tournament name."),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  prizePool: z.string().optional(),
  entryFee: z.string().optional(),
  format: z.string().optional(),
  bestOf: z.string().optional(),
  maxPlayers: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function CreateTournamentForm({ clubSlug }: { clubSlug: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [thumbnail, setThumbnail] = React.useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(null);
  const [prizeBreakdown, setPrizeBreakdown] = React.useState<PrizeBreakdownItem[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", format: "Knockout", bestOf: "7", maxPlayers: "32" },
  });

  function handleThumbnailChange(file: File | undefined) {
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  function clearThumbnail() {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const result = await createClubTournamentAction(clubSlug, {
      ...values,
      bestOf: values.bestOf ? Number(values.bestOf) : undefined,
      maxPlayers: values.maxPlayers ? Number(values.maxPlayers) : undefined,
      prizeBreakdown: prizeBreakdown.filter((item) => item.label.trim() && item.amount.trim()),
    });

    if (!result.success) {
      setIsSubmitting(false);
      toast.error(result.error);
      return;
    }

    if (thumbnail) {
      const dataUrl = await readAsDataUrl(thumbnail);
      const thumbResult = await uploadTournamentThumbnailAction(clubSlug, result.slug, dataUrl);
      if (!thumbResult.success) {
        toast.error(`Tournament created, but thumbnail upload failed: ${thumbResult.error}`);
      }
    }

    setIsSubmitting(false);
    toast.success("Tournament created!");
    reset();
    clearThumbnail();
    setPrizeBreakdown([]);
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide">New Tournament</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label>Thumbnail (Optional)</Label>
            <div className="flex items-center gap-3">
              <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
                {thumbnailPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumbnailPreview} alt="Thumbnail preview" className="size-full object-cover" />
                ) : (
                  <ImagePlus className="size-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => handleThumbnailChange(e.target.files?.[0])}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {thumbnailPreview ? "Change Image" : "Upload Image"}
                </Button>
                {thumbnailPreview ? (
                  <Button type="button" variant="ghost" size="sm" className="ml-2" onClick={clearThumbnail}>
                    Remove
                  </Button>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or WEBP. Max 3MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="entryFee">Entry Fee</Label>
              <Input id="entryFee" placeholder="₹1,000" {...register("entryFee")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prizePool">Prize Pool</Label>
              <Input id="prizePool" placeholder="₹50,000" {...register("prizePool")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Input id="format" {...register("format")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Max Players</Label>
              <Input id="maxPlayers" type="number" {...register("maxPlayers")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bestOf">Best of (Frames)</Label>
            <Input id="bestOf" type="number" min={1} step={2} {...register("bestOf")} />
            <p className="text-xs text-muted-foreground">
              How many frames a match is played to, e.g. 3, 5 or 7.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>

          <PrizeBreakdownEditor value={prizeBreakdown} onChange={setPrizeBreakdown} />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Create Tournament
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
