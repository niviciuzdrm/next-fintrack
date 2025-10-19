"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Investment } from "@/lib/types";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { formatCurrency, formatDate, formatPercentage } from "@/lib/formatters";
import { DataTableActions } from "@/components/data-table-actions";
import { deleteInvestment } from "@/lib/server-db";
import { EmptyState } from "@/components/empty-state";

export function InvestmentsListView({
  initialInvestments,
}: {
  initialInvestments: Investment[];
}) {
  const [investments, setInvestments] = useState<Investment[]>(
    initialInvestments ?? []
  );
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<string | null>(
    null
  );

  const handleDelete = (id: string) => {
    setInvestmentToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!investmentToDelete) {
      setDeleteModalOpen(false);
      return;
    }

    setLoading(true);
    try {
      await deleteInvestment(investmentToDelete);
      setInvestments((prev) => prev.filter((e) => e.id !== investmentToDelete));
    } finally {
      setInvestmentToDelete(null);
      setDeleteModalOpen(false);
      setLoading(false);
    }
  };

  if (loading && investments.length === 0) {
    return <EmptyState message="Carregando..." />;
  }

  if (investments.length === 0) {
    return (
      <EmptyState message="Nenhum investimento encontrado. Adicione seu primeiro investimento para começar." />
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto -mx-6 px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Nome</TableHead>
              <TableHead className="min-w-[120px]">Valor</TableHead>
              <TableHead className="min-w-[100px]">Data</TableHead>
              <TableHead className="min-w-[110px]">Retorno Anual</TableHead>
              <TableHead className="min-w-[120px]">Retorno Mensal</TableHead>
              <TableHead className="text-right min-w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell
                  className="font-medium max-w-[200px] truncate"
                  title={investment.name}
                >
                  {investment.name}
                </TableCell>
                <TableCell className="text-primary whitespace-nowrap">
                  {formatCurrency(investment.value)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(investment.date)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatPercentage(investment.annualReturnPercentage)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatPercentage(investment.monthlyReturnPercentage)}
                </TableCell>
                <TableCell className="text-right">
                  <DataTableActions
                    editHref={`/dashboard/investments/edit/${investment.id}`}
                    onDelete={() => handleDelete(investment.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {investments.map((investment) => (
          <Card key={investment.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 pb-3 border-b">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium truncate" title={investment.name}>
                      {investment.name}
                    </p>
                  </div>
                  <DataTableActions
                    editHref={`/dashboard/incomes/edit/${investment.id}`}
                    onDelete={() => handleDelete(investment.id)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium text-primary">
                      {formatCurrency(investment.value)}
                    </p>
                  </div>
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{formatDate(investment.date)}</p>
                  </div>
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground">
                      Retorno Anual
                    </p>
                    <p className="font-medium">
                      {formatPercentage(investment.annualReturnPercentage)}
                    </p>
                  </div>
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground">
                      Retorno Mensal
                    </p>
                    <p className="font-medium">
                      {formatPercentage(investment.monthlyReturnPercentage)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Excluir Investimento"
        description="Tem certeza que deseja excluir este investimento? Esta ação não pode ser desfeita."
      />
    </>
  );
}
