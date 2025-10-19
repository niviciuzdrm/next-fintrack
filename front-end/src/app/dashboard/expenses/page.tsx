import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getExpenses } from "@/lib/server-db";
import { PageHeader } from "@/components/page-header";
import { ExpensesListView } from "@/views/expenses-list";

export default async function ExpensesPage() {
  const expenses = await getExpenses();
  return (
    <div className="space-y-8">
      <PageHeader
        title="Despesas"
        description="Acompanhe seus gastos"
        actionLabel="Adicionar Despesa"
        actionHref="/dashboard/expenses/add"
      />

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Todas as Despesas</CardTitle>
          <CardDescription>
            Uma lista de todas as suas entradas de despesa
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ExpensesListView initialExpenses={expenses} />
        </CardContent>
      </Card>
    </div>
  );
}
