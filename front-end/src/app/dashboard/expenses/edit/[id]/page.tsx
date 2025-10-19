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
import { getExpense, updateExpense } from "@/lib/server-db";
import { redirect } from "next/navigation";

async function updateExpenseAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  const value = Number.parseFloat(String(formData.get("value") ?? "0"));
  const date = String(formData.get("date") ?? "");

  await updateExpense(id, { name, value, date });
  redirect("/dashboard/expenses");
}

export default async function EditExpensePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const expense = await getExpense(id);

  if (!expense) {
    return (
      <div className="text-center text-muted-foreground">
        Despesa não econtrada
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormHeader
        title="Editar despesa"
        description="Atualizar sua entrada de investimento"
        backHref="/dashboard/expenses"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Detalhes da despesa</CardTitle>
          <CardDescription>Edite os detalhes desta despesa</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateExpenseAction} className="space-y-4">
            <input type="hidden" name="id" value={expense.id} />
            <FormField
              id="name"
              name="name"
              label="Nome"
              type="text"
              placeholder="ex: Aluguel, Mercado, Contas"
              initialValue={expense.name}
              required
            />

            <FormField
              id="value"
              name="value"
              label="Valor (R$)"
              type="number"
              step="0.01"
              placeholder="0.00"
              initialValue={expense.value.toString()}
              required
            />

            <FormField
              id="date"
              name="date"
              label="Data"
              type="date"
              initialValue={expense.date}
              required
            />

            <FormActions
              submitLabel="Salvar"
              loadingLabel="Salvando..."
              cancelHref="/dashboard/expenses"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
