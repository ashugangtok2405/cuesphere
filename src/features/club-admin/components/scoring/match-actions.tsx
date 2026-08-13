import { Loader2, RotateCcw, ShieldCheck, FlagTriangleRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MatchActions({
  onUndo,
  onEndFrame,
  onFinish,
  canUndo,
  isFinishing,
}: {
  onUndo: () => void;
  onEndFrame: () => void;
  onFinish: () => void;
  canUndo: boolean;
  isFinishing: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" disabled={!canUndo} onClick={onUndo}>
        <RotateCcw className="size-3.5" /> Undo Last
      </Button>
      <Button variant="outline" size="sm" onClick={onEndFrame}>
        <FlagTriangleRight className="size-3.5" /> End Frame
      </Button>
      <Button variant="destructive" size="sm" disabled={isFinishing} onClick={onFinish}>
        {isFinishing ? <Loader2 className="size-3.5 animate-spin" /> : <ShieldCheck className="size-3.5" />}
        Finish Match
      </Button>
    </div>
  );
}
