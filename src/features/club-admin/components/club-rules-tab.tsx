import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { ClipboardList } from "lucide-react";

export function ClubRulesTab({ description }: { description: string }) {
  if (!description) {
    return (
      <EmptyState
        icon={<ClipboardList className="size-6" />}
        title="No rules added yet"
        description="The club admin hasn't published rules for this tournament."
      />
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <p className="whitespace-pre-line text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
