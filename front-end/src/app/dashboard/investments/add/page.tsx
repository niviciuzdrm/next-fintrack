import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addInvestment } from "@/lib/server-db";
import { FormHeader } from "@/components/form-header";
import { FormField } from "@/components/form-field";
import { FormActions } from "@/components/form-actions";
import { redirect } from "next/navigation";

async function addInvestmentAction(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "");
  const value = Number.parseFloat(String(formData.get("value") ?? "0"));
  const date = String(formData.get("date") ?? "");
  const annualReturnPercentage = Number(formData.get("annualReturn") ?? "0");
  const monthlyReturnPercentage = Number(formData.get("monthlyReturn") ?? "0");

  await addInvestment({
    name,
    value,
    date,
    annualReturnPercentage,
    monthlyReturnPercentage,
  });
  redirect("/dashboard/investments");
}

export default async function AddInvestmentPage() {
  return (
    <div className="space-y-6">
      <FormHeader
        title="Adicionar Investimento"
        description="Criar uma nova entrada de investimento"
        backHref="/dashboard/investments"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Detalhes do Investimento</CardTitle>
          <CardDescription>
            Digite as informações para seu novo investimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addInvestmentAction} className="space-y-4">
            <FormField
              id="name"
              name="name"
              label="Nome"
              placeholder="ex: Ações, Títulos, Imóveis"
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
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="annualReturn"
                name="annualReturn"
                label="Retorno Anual (%)"
                type="number"
                step="0.01"
                placeholder="0,00"
                required
              />
              <FormField
                id="monthlyReturn"
                name="monthlyReturn"
                label="Retorno Mensal (%)"
                type="number"
                step="0.01"
                placeholder="0,00"
                required
              />
            </div>
            <FormActions
              submitLabel="Adicionar Investimento"
              loadingLabel="Adicionando..."
              cancelHref="/dashboard/investments"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
