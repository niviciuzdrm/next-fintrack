"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  step?: string;
  name?: string;
  initialValue?: string;
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  required = false,
  step,
  name,
  initialValue,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        step={step}
        name={name}
        defaultValue={initialValue}
      />
    </div>
  );
}
