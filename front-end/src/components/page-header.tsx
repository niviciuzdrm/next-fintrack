import { Button } from "@/components/ui/button";
import { LuPlus } from "react-icons/lu";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionHref,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-balance">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="gap-2 w-full sm:w-auto">
            <LuPlus className="h-4 w-4" />
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}
