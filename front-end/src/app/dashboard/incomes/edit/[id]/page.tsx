import type React from "react";
import { FormHeader } from "@/components/form-header";
import { FormField } from "@/components/form-field";
import { FormActions } from "@/components/form-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getIncome, updateIncome } from "@/lib/server-db";
import { redirect } from "next/navigation";

async function updateIncomeAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  const value = Number.parseFloat(String(formData.get("value") ?? "0"));
  const date = String(formData.get("date") ?? "");

  await updateIncome(id, { name, value, date });
  redirect("/dashboard/incomes");
}

export default async function EditIncomePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const income = await getIncome(id);

  if (!income) {
    return (
      <div className="text-center text-muted-foreground">
        Receita não encontrada
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormHeader
        title="Editar Receita"
        description="Atualizar sua entrada de receita"
        backHref="/dashboard/incomes"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Detalhes da receita</CardTitle>
          <CardDescription>Edite os detalhes desta receita</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateIncomeAction} className="space-y-4">
            <FormField
              id="name"
              name="name"
              label="Nome"
              type="text"
              placeholder="ex: Salário, Projeto Freelance"
              initialValue={income.name}
              required
            />

            <FormField
              id="value"
              name="value"
              label="Valor (R$)"
              type="number"
              step="0.01"
              placeholder="0.00"
              initialValue={income.value.toString()}
              required
            />

            <FormField
              id="date"
              name="date"
              label="Data"
              type="date"
              initialValue={income.date}
              required
            />

            <FormActions
              submitLabel="Salvar"
              loadingLabel="Salvando..."
              cancelHref="/dashboard/incomes"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
