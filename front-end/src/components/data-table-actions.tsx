"use client";

import { Button } from "@/components/ui/button";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import Link from "next/link";

interface DataTableActionsProps {
  editHref: string;
  onDelete: () => void;
}

export function DataTableActions({
  editHref,
  onDelete,
}: DataTableActionsProps) {
  return (
    <div className="flex justify-end gap-2 shrink-0">
      <Link href={editHref}>
        <Button variant="ghost" size="icon">
          <LuPencil className="h-4 w-4" />
        </Button>
      </Link>
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <LuTrash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
