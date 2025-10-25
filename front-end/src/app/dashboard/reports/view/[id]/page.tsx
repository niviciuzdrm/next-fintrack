import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LuArrowLeft,
  LuTrendingUp,
  LuTrendingDown,
  LuWallet,
  LuPiggyBank,
} from "react-icons/lu";
import {
  getReport,
  calculateInvestmentIncome,
  getInvestmentProjections,
} from "@/lib/server-db";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { InvestmentProjection } from "@/lib/types";

type Props = {
  params: { id: string };
};

export default async function ViewReportPage({ params }: Props) {
  const { id } = params;
  const report = await getReport(id);

  if (!report) {
    return (
      <div className="text-center text-muted-foreground">
        Relatório não encontrado
      </div>
    );
  }

  // server-side calculations / projections
  const investmentIncome = await calculateInvestmentIncome(
    report.startDate,
    report.endDate
  );
  const investmentDetails = await getInvestmentProjections(
    report.startDate,
    report.endDate
  );

  const netBalance =
    report.totalIncomes + investmentIncome - report.totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/reports">
          <Button variant="ghost" size="icon" aria-label="Voltar">
            <LuArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-balance">
            Relatório Financeiro
          </h1>
          <p className="text-muted-foreground">
            {formatDate(report.startDate)} - {formatDate(report.endDate)}
          </p>
        </div>
      </div>

      <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
              Total de Receitas
            </CardTitle>
            <LuTrendingUp className="h-4 w-4 shrink-0 text-primary" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="text-xl font-bold text-primary line-clamp-2 min-h-[3.5rem] sm:text-2xl">
              {formatCurrency(report.totalIncomes)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Receita no período
            </p>
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
              Total de Despesas
            </CardTitle>
            <LuTrendingDown className="h-4 w-4 shrink-0 text-destructive" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="text-xl font-bold text-destructive line-clamp-2 min-h-[3.5rem] sm:text-2xl">
              {formatCurrency(report.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Gastos no período
            </p>
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
              Total de Investimentos
            </CardTitle>
            <LuWallet className="h-4 w-4 shrink-0 text-primary" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="text-xl font-bold text-primary line-clamp-2 min-h-[3.5rem] sm:text-2xl">
              {formatCurrency(report.totalInvestments)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor do portfólio
            </p>
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
              Renda de Investimentos
            </CardTitle>
            <LuPiggyBank className="h-4 w-4 shrink-0 text-primary" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="text-xl font-bold text-primary line-clamp-2 min-h-[3.5rem] sm:text-2xl">
              {formatCurrency(investmentIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Retornos projetados
            </p>
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">
              Saldo Líquido
            </CardTitle>
            <LuTrendingUp
              className={`h-4 w-4 shrink-0 ${
                netBalance >= 0 ? "text-primary" : "text-destructive"
              }`}
            />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div
              className={`text-xl font-bold line-clamp-2 min-h-[3.5rem] sm:text-2xl ${
                netBalance >= 0 ? "text-primary" : "text-destructive"
              }`}
            >
              {formatCurrency(netBalance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Incluindo investimentos
            </p>
          </CardContent>
        </Card>
      </div>

      {investmentDetails && investmentDetails.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Projeções de Renda de Investimentos</CardTitle>
            <CardDescription>
              Retornos projetados baseados nas taxas de retorno mensal durante o
              período do relatório
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {investmentDetails.map((inv: InvestmentProjection) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                >
                  <div className="space-y-1">
                    <div className="font-medium">{inv.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(inv.value)} ×{" "}
                      {inv.monthlyReturnPercentage}% × {inv.monthsActive}{" "}
                      {inv.monthsActive !== 1 ? "meses" : "mês"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">
                      {formatCurrency(inv.projectedIncome)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Renda projetada
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-border pt-3 font-semibold">
                <span>Total de Renda Projetada</span>
                <span className="text-primary">
                  {formatCurrency(investmentIncome)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Relatório</CardTitle>
          <CardDescription>Detalhamento das suas finanças</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Período do Relatório
              </div>
              <div className="text-lg font-semibold">
                {formatDate(report.startDate)} até {formatDate(report.endDate)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Gerado em
              </div>
              <div className="text-lg font-semibold">
                {formatDate(report.createdAt)}
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total de Receitas</span>
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(report.totalIncomes)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Renda de Investimentos (Projetada)
              </span>
              <span className="text-sm font-semibold text-primary">
                +{formatCurrency(investmentIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total de Despesas</span>
              <span className="text-sm font-semibold text-destructive">
                -{formatCurrency(report.totalExpenses)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="font-medium">Saldo Líquido</span>
              <span
                className={`font-bold ${
                  netBalance >= 0 ? "text-primary" : "text-destructive"
                }`}
              >
                {formatCurrency(netBalance)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="font-medium">Total de Investimentos</span>
              <span className="font-bold text-primary">
                {formatCurrency(report.totalInvestments)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
