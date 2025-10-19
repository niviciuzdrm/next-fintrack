import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getIncomes } from "@/lib/server-db";
import { IncomesListView } from "@/views/incomes-list";
import { PageHeader } from "@/components/page-header";

export default async function IncomesPage() {
  const incomes = await getIncomes();
  return (
    <div className="space-y-8">
      <PageHeader
        title="Receitas"
        description="Gerencie suas fontes de renda"
        actionLabel="Adicionar Receita"
        actionHref="/dashboard/incomes/add"
      />

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Todas as Receitas</CardTitle>
          <CardDescription>
            Uma lista de todas as suas entradas de receita
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <IncomesListView initialIncomes={incomes} />
        </CardContent>
      </Card>
    </div>
  );
}
