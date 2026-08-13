"use client";

import * as React from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PrizeBreakdownItem } from "@/types/club-tournament";

const SUGGESTED_LABELS = ["Winner", "Runner-up", "Semi-Finalist", "Semi-Finalist"];

export function PrizeBreakdownEditor({
  value,
  onChange,
}: {
  value: PrizeBreakdownItem[];
  onChange: (next: PrizeBreakdownItem[]) => void;
}) {
  function addRow(label = "") {
    onChange([...value, { label, amount: "" }]);
  }

  function updateRow(index: number, patch: Partial<PrizeBreakdownItem>) {
    onChange(value.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function removeRow(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <Label>Prize Breakdown (Optional)</Label>
      <p className="text-xs text-muted-foreground">
        Add a row per position (e.g. Winner, Runner-up, Semi-Finalist). Once the tournament is
        completed, the winning players are shown automatically next to each row.
      </p>

      {value.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            placeholder="e.g. Winner"
            value={item.label}
            onChange={(e) => updateRow(i, { label: e.target.value })}
            className="flex-1"
          />
          <Input
            placeholder="₹30,000"
            value={item.amount}
            onChange={(e) => updateRow(i, { amount: e.target.value })}
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeRow(i)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => addRow()}>
          <Plus className="size-3.5" /> Add Row
        </Button>
        {value.length === 0
          ? SUGGESTED_LABELS.map((label, i) => (
              <Button key={i} type="button" variant="ghost" size="sm" onClick={() => addRow(label)}>
                + {label}
              </Button>
            ))
          : null}
      </div>
    </div>
  );
}
