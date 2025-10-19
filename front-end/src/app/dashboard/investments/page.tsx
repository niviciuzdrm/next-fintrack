import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInvestments } from "@/lib/server-db";
import { PageHeader } from "@/components/page-header";
import { InvestmentsListView } from "@/views/investments-list";

export default async function InvestmentsPage() {
  const investments = await getInvestments();
  return (
    <div className="space-y-8">
      <PageHeader
        title="Investimentos"
        description="Acompanhe seu portfólio de investimentos"
        actionLabel="Adicionar Investimento"
        actionHref="/dashboard/investments/add"
      />

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Todos os Investimentos</CardTitle>
          <CardDescription>
            Uma lista de todas as suas entradas de investimento
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <InvestmentsListView initialInvestments={investments} />
        </CardContent>
      </Card>
    </div>
  );
}
