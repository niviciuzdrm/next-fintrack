import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LuArrowUpRight,
  LuArrowDownRight,
  LuTrendingUp,
  LuFileText,
} from "react-icons/lu";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-balance">Painel</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas finanças em um só lugar
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <LuArrowUpRight className="h-4 w-4 text-primary shrink-0" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-2xl font-bold">Gerenciar</div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 min-h-[2rem]">
                Acompanhe suas fontes de renda
              </p>
            </div>
            <Link href="/dashboard/incomes">
              <Button variant="link" className="h-auto p-0">
                Ver todas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <LuArrowDownRight className="h-4 w-4 text-destructive shrink-0" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-2xl font-bold">Gerenciar</div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 min-h-[2rem]">
                Acompanhe seus gastos
              </p>
            </div>
            <Link href="/dashboard/expenses">
              <Button variant="link" className="h-auto p-0">
                Ver todas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
            <LuTrendingUp className="h-4 w-4 text-primary shrink-0" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-2xl font-bold">Gerenciar</div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 min-h-[2rem]">
                Acompanhe seu portfólio
              </p>
            </div>
            <Link href="/dashboard/investments">
              <Button variant="link" className="h-auto p-0">
                Ver todas
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">Relatórios</CardTitle>
            <LuFileText className="h-4 w-4 text-primary shrink-0" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-2xl font-bold">Gerar</div>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 min-h-[2rem]">
                Insights financeiros
              </p>
            </div>
            <Link href="/dashboard/reports">
              <Button variant="link" className="h-auto p-0">
                Ver todas
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
