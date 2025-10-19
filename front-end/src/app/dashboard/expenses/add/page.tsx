import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addExpense } from "@/lib/server-db";
import { FormHeader } from "@/components/form-header";
import { FormField } from "@/components/form-field";
import { FormActions } from "@/components/form-actions";
import { redirect } from "next/navigation";

async function addExpenseAction(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "");
  const value = Number.parseFloat(String(formData.get("value") ?? "0"));
  const date = String(formData.get("date") ?? "");

  await addExpense({ name, value, date });
  redirect("/dashboard/expenses");
}

export default async function AddExpensePage() {
  return (
    <div className="space-y-6">
      <FormHeader
        title="Adicionar Despesa"
        description="Criar uma nova entrada de despesa"
        backHref="/dashboard/expenses"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Detalhes da Despesa</CardTitle>
          <CardDescription>
            Digite as informações para sua nova despesa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addExpenseAction} className="space-y-4">
            <FormField
              id="name"
              name="name"
              label="Nome"
              placeholder="ex: Aluguel, Mercado, Contas"
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
              submitLabel="Adicionar Despesa"
              loadingLabel="Adicionando..."
              cancelHref="/dashboard/expenses"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
