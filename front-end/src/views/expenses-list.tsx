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
import { deleteExpense } from "@/lib/server-db";
import type { Expense } from "@/lib/types";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { EmptyState } from "@/components/empty-state";
import { DataTableActions } from "@/components/data-table-actions";

export function ExpensesListView({
  initialExpenses,
}: {
  initialExpenses: Expense[];
}) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses ?? []);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setExpenseToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) {
      setDeleteModalOpen(false);
      return;
    }

    setLoading(true);
    try {
      await deleteExpense(expenseToDelete);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete));
    } finally {
      setExpenseToDelete(null);
      setDeleteModalOpen(false);
      setLoading(false);
    }
  };

  if (loading && expenses.length === 0) {
    return <EmptyState message="Carregando..." />;
  }

  if (expenses.length === 0) {
    return (
      <EmptyState message="Nenhuma despesa encontrada. Adicione sua primeira despesa para começar." />
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
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell
                  className="font-medium max-w-[200px] truncate"
                  title={expense.name}
                >
                  {expense.name}
                </TableCell>
                <TableCell className="text-destructive whitespace-nowrap">
                  {formatCurrency(expense.value)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(expense.date)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(expense.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DataTableActions
                    editHref={`/dashboard/expenses/edit/${expense.id}`}
                    onDelete={() => handleDelete(expense.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 pb-3 border-b">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium truncate" title={expense.name}>
                      {expense.name}
                    </p>
                  </div>
                  <DataTableActions
                    editHref={`/dashboard/expenses/edit/${expense.id}`}
                    onDelete={() => handleDelete(expense.id)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium text-destructive">
                      {formatCurrency(expense.value)}
                    </p>
                  </div>
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{formatDate(expense.date)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Criado em</p>
                    <p className="font-medium">
                      {formatDate(expense.createdAt)}
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
        title="Excluir Despesa"
        description="Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita."
      />
    </>
  );
}
