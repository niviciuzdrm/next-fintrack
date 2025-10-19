import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addIncome } from "@/lib/server-db";
import { FormHeader } from "@/components/form-header";
import { FormField } from "@/components/form-field";
import { FormActions } from "@/components/form-actions";
import { redirect } from "next/navigation";

async function addIncomeAction(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "");
  const value = Number.parseFloat(String(formData.get("value") ?? "0"));
  const date = String(formData.get("date") ?? "");

  await addIncome({ name, value, date });
  redirect("/dashboard/incomes");
}

export default async function AddIncomePage() {
  return (
    <div className="space-y-6">
      <FormHeader
        title="Adicionar Receita"
        description="Criar uma nova entrada de receita"
        backHref="/dashboard/incomes"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Detalhes da Receita</CardTitle>
          <CardDescription>
            Digite as informações para sua nova receita
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addIncomeAction} className="space-y-4">
            <FormField
              id="name"
              name="name"
              label="Nome"
              placeholder="ex: Salário, Projeto Freelance"
              required
            />
            <FormField
              id="value"
              name="value"
              label="Valor (R$)"
              type="number"
              step="0.01"
              placeholder="0,00"
              required
            />
            <FormField
              id="date"
              name="date"
              label="Data"
              type="date"
              required
            />
            <FormActions
              submitLabel="Adicionar Receita"
              loadingLabel="Adicionando..."
              cancelHref="/dashboard/incomes"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
