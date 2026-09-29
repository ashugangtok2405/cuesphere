import { Loader2, RotateCcw, ShieldCheck, FlagTriangleRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MatchActions({
  onUndo,
  onEndFrame,
  onFinish,
  canUndo,
  canEndFrame,
  isFinishing,
}: {
  onUndo: () => void;
  onEndFrame: () => void;
  onFinish: () => void;
  canUndo: boolean;
  canEndFrame: boolean;
  isFinishing: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" className="h-12" disabled={!canUndo} onClick={onUndo}>
        <RotateCcw className="size-4" /> Undo Last
      </Button>
      <Button
        variant="outline"
        className="h-12 border-primary/40 text-primary"
        disabled={!canEndFrame}
        onClick={onEndFrame}
      >
        <FlagTriangleRight className="size-4" /> End Frame
      </Button>
      <Button className="col-span-2 h-12" disabled={isFinishing} onClick={onFinish}>
        {isFinishing ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
        Finish Match
      </Button>
    </div>
  );
}
