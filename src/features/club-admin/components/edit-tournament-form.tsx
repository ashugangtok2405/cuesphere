"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateClubTournamentAction } from "@/app/actions/club-tournament-actions";
import { uploadTournamentThumbnailAction } from "@/app/actions/tournament-thumbnail-actions";
import { PrizeBreakdownEditor } from "@/features/club-admin/components/prize-breakdown-editor";
import type { ClubTournament, PrizeBreakdownItem } from "@/types/club-tournament";

const schema = z.object({
  name: z.string().min(2, "Enter a tournament name."),
  description: z.string().optional(),
  status: z.enum(["upcoming", "live", "completed"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().optional(),
  prizePool: z.string().optional(),
  entryFee: z.string().optional(),
  format: z.string().optional(),
  bestOf: z.string().optional(),
  maxPlayers: z.string().optional(),
  registrationOpen: z.boolean(),
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

export function EditTournamentForm({
  clubSlug,
  tournament,
}: {
  clubSlug: string;
  tournament: ClubTournament;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [thumbnail, setThumbnail] = React.useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(
    tournament.imageUrl || null
  );
  const [prizeBreakdown, setPrizeBreakdown] = React.useState<PrizeBreakdownItem[]>(
    tournament.prizeBreakdown
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const preCompletedStatusRef = React.useRef<FormValues["status"]>(
    tournament.status === "completed" ? "upcoming" : tournament.status
  );

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: tournament.name,
      description: tournament.description,
      status: tournament.status,
      startDate: tournament.startDate ?? "",
      endDate: tournament.endDate ?? "",
      location: tournament.location,
      prizePool: tournament.prizePool,
      entryFee: tournament.entryFee,
      format: tournament.format,
      bestOf: String(tournament.bestOf),
      maxPlayers: String(tournament.maxPlayers),
      registrationOpen: tournament.registrationOpen,
    },
  });

  function handleThumbnailChange(file: File | undefined) {
    if (!file) return;
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const result = await updateClubTournamentAction(clubSlug, tournament.id, {
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
      const thumbResult = await uploadTournamentThumbnailAction(clubSlug, tournament.slug, dataUrl);
      if (!thumbResult.success) {
        toast.error(`Saved, but thumbnail upload failed: ${thumbResult.error}`);
      }
    }

    setIsSubmitting(false);
    toast.success("Tournament updated.");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
      </div>

      <div className="space-y-2">
        <Label>Thumbnail</Label>
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
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              {thumbnailPreview ? "Change Image" : "Upload Image"}
            </Button>
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
          <Input id="entryFee" {...register("entryFee")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prizePool">Prize Pool</Label>
          <Input id="prizePool" {...register("prizePool")} />
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={watch("status")} onValueChange={(v) => v && setValue("status", v as FormValues["status"])}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="registrationOpen"
          checked={watch("registrationOpen")}
          onCheckedChange={(checked) => setValue("registrationOpen", checked === true)}
        />
        <Label htmlFor="registrationOpen" className="cursor-pointer text-sm font-normal">
          Registration open
        </Label>
      </div>

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="endTournament"
          checked={watch("status") === "completed"}
          onCheckedChange={(checked) => {
            if (checked === true) {
              preCompletedStatusRef.current = watch("status") as FormValues["status"];
              setValue("status", "completed");
            } else {
              setValue("status", preCompletedStatusRef.current);
            }
          }}
        />
        <Label htmlFor="endTournament" className="cursor-pointer text-sm font-normal">
          End tournament (mark as Completed)
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={3} {...register("description")} />
      </div>

      <PrizeBreakdownEditor value={prizeBreakdown} onChange={setPrizeBreakdown} />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        Save Changes
      </Button>
    </form>
  );
}
