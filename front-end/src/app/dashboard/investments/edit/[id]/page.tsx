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
import { getInvestment, updateInvestment } from "@/lib/server-db";
import { redirect } from "next/navigation";

async function updateInvestmentAction(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "");
  const value = Number.parseFloat(String(formData.get("value") ?? "0"));
  const date = String(formData.get("date") ?? "");
  const annualReturnPercentage = Number(formData.get("annualReturn") ?? "0");
  const monthlyReturnPercentage = Number(formData.get("monthlyReturn") ?? "0");

  console.log(
    await updateInvestment(id, {
      name,
      value,
      date,
      annualReturnPercentage,
      monthlyReturnPercentage,
    })
  );
  redirect("/dashboard/investments");
}

export default async function EditInvestmentPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const investment = await getInvestment(id);

  if (!investment) {
    return (
      <div className="text-center text-muted-foreground">
        Investimento não econtrada
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FormHeader
        title="Editar Investimento"
        description="Atualizar sua entrada de investimento"
        backHref="/dashboard/investments"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Detalhes do investimento</CardTitle>
          <CardDescription>
            Edite os detalhes deste investimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateInvestmentAction} className="space-y-4">
            <input type="hidden" name="id" value={investment.id} />
            <FormField
              id="name"
              name="name"
              label="Name"
              type="text"
              placeholder="ex: Ações, Títulos, Imóveis"
              initialValue={investment.name}
              required
            />

            <FormField
              id="value"
              name="value"
              label="Valor (R$)"
              type="number"
              step="0.01"
              placeholder="0,00"
              initialValue={investment.value.toString()}
              required
            />

            <FormField
              id="date"
              name="date"
              label="Data"
              type="date"
              initialValue={investment.date}
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
                initialValue={investment.annualReturnPercentage.toString()}
                required
              />

              <FormField
                id="monthlyReturn"
                name="monthlyReturn"
                label="Retorno Mensal (%)"
                type="number"
                step="0.01"
                placeholder="0,00"
                initialValue={investment.monthlyReturnPercentage.toString()}
                required
              />
            </div>

            <FormActions
              submitLabel="Salvar"
              loadingLabel="Salvando..."
              cancelHref="/dashboard/investments"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
