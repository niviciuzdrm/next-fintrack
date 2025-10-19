"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FormActionsProps {
  submitLabel: string;
  cancelHref: string;
  loadingLabel?: string;
}

export function FormActions({
  submitLabel,
  cancelHref,
  loadingLabel,
}: FormActionsProps) {
  const { pending } = useFormStatus();

  return (
    <div className="flex gap-3 pt-4">
      <Button type="submit" disabled={pending}>
        {pending ? loadingLabel || "Processando..." : submitLabel}
      </Button>
      <Link href={cancelHref}>
        <Button type="button" variant="outline">
          Cancelar
        </Button>
      </Link>
    </div>
  );
}
