import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReports } from "@/lib/server-db";
import { PageHeader } from "@/components/page-header";
import { ReportsListView } from "@/views/reports-list";

export default async function ReportsPage() {
  const reports = await getReports();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Relatórios"
        description="Gere e visualize relatórios financeiros"
        actionLabel="Gerar Relatório"
        actionHref="/dashboard/reports/generate"
      />

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Todos os Relatórios</CardTitle>
          <CardDescription>
            Uma lista de todos os seus relatórios gerados
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ReportsListView initialReports={reports} />
        </CardContent>
      </Card>
    </div>
  );
}
