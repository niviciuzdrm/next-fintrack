import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormHeader } from "@/components/form-header";
import { FormField } from "@/components/form-field";
import { FormActions } from "@/components/form-actions";
import {
  generateReport,
  getIncomes,
  getExpenses,
  getInvestments,
} from "@/lib/server-db";
import { redirect } from "next/navigation";

async function generateReportAction(formData: FormData) {
  "use server";
  const startDate = String(formData.get("startDate") ?? "");
  const endDate = String(formData.get("endDate") ?? "");

  await generateReport(startDate, endDate);

  redirect("/dashboard/reports");
}

export default async function GenerateReportPage() {
  return (
    <div className="space-y-6">
      <FormHeader
        title="Gerar Relatório"
        description="Criar um novo relatório financeiro"
        backHref="/dashboard/reports"
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Período do Relatório</CardTitle>
          <CardDescription>
            Selecione o intervalo de datas para seu relatório financeiro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={generateReportAction} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                id="startDate"
                name="startDate"
                label="Data Inicial"
                type="date"
                required
              />
              <FormField
                id="endDate"
                name="endDate"
                label="Data Final"
                type="date"
                required
              />
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                Este relatório calculará o total de receitas, despesas e
                investimentos dentro do intervalo de datas selecionado.
              </p>
            </div>

            <FormActions
              submitLabel="Gerar Relatório"
              loadingLabel="Gerando..."
              cancelHref="/dashboard/reports"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
