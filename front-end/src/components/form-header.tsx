import { Button } from "@/components/ui/button";
import { LuArrowLeft } from "react-icons/lu";
import Link from "next/link";

interface FormHeaderProps {
  title: string;
  description: string;
  backHref: string;
}

export function FormHeader({ title, description, backHref }: FormHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Link href={backHref}>
        <Button variant="ghost" size="icon">
          <LuArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-balance">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
