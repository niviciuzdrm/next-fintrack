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
import type { Income } from "@/lib/types";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { DataTableActions } from "@/components/data-table-actions";
import { deleteIncome } from "@/lib/server-db";
import { EmptyState } from "@/components/empty-state";

export function IncomesListView({
  initialIncomes,
}: {
  initialIncomes: Income[];
}) {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes ?? []);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setIncomeToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!incomeToDelete) {
      setDeleteModalOpen(false);
      return;
    }

    setLoading(true);
    try {
      await deleteIncome(incomeToDelete);
      setIncomes((prev) => prev.filter((e) => e.id !== incomeToDelete));
    } finally {
      setIncomeToDelete(null);
      setDeleteModalOpen(false);
      setLoading(false);
    }
  };

  if (loading && incomes.length === 0) {
    return <EmptyState message="Carregando..." />;
  }

  if (incomes.length === 0) {
    return (
      <EmptyState message="Nenhuma receita encontrada. Adicione sua primeira receita para começar." />
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
              <TableHead className="min-w-[100px]">Criado em</TableHead>
              <TableHead className="text-right min-w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomes.map((income) => (
              <TableRow key={income.id}>
                <TableCell
                  className="font-medium max-w-[200px] truncate"
                  title={income.name}
                >
                  {income.name}
                </TableCell>
                <TableCell className="text-primary whitespace-nowrap">
                  {formatCurrency(income.value)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(income.date)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(income.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DataTableActions
                    editHref={`/dashboard/incomes/edit/${income.id}`}
                    onDelete={() => handleDelete(income.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {incomes.map((income) => (
          <Card key={income.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 pb-3 border-b">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium truncate" title={income.name}>
                      {income.name}
                    </p>
                  </div>
                  <DataTableActions
                    editHref={`/dashboard/incomes/edit/${income.id}`}
                    onDelete={() => handleDelete(income.id)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium text-primary">
                      {formatCurrency(income.value)}
                    </p>
                  </div>
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{formatDate(income.date)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Criado em</p>
                    <p className="font-medium">
                      {formatDate(income.createdAt)}
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
        title="Excluir Receita"
        description="Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita."
      />
    </>
  );
}
