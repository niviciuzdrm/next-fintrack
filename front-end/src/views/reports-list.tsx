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
import type { Report } from "@/lib/types";
import { DeleteConfirmModal } from "@/components/delete-confirm-modal";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { deleteReport } from "@/lib/server-db";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { LuEye, LuTrash2 } from "react-icons/lu";

export function ReportsListView({
  initialReports,
}: {
  initialReports: Report[];
}) {
  const [reports, setReports] = useState<Report[]>(initialReports ?? []);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setReportToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) {
      setDeleteModalOpen(false);
      return;
    }

    setLoading(true);
    try {
      await deleteReport(reportToDelete);
      setReports((prev) => prev.filter((r) => r.id !== reportToDelete));
    } finally {
      setReportToDelete(null);
      setDeleteModalOpen(false);
      setLoading(false);
    }
  };

  if (loading && reports.length === 0) {
    return <EmptyState message="Carregando..." />;
  }

  if (reports.length === 0) {
    return (
      <EmptyState message="Nenhum relatório encontrado. Gere seu primeiro relatório para começar." />
    );
  }

  return (
    <>
      <div className="hidden md:block overflow-x-auto -mx-6 px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">Período</TableHead>
              <TableHead className="min-w-[130px]">Total de Receitas</TableHead>
              <TableHead className="min-w-[140px]">Total de Despesas</TableHead>
              <TableHead className="min-w-[150px]">
                Total de Investimentos
              </TableHead>
              <TableHead className="min-w-[100px]">Criado em</TableHead>
              <TableHead className="text-right min-w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {formatDate(report.startDate)} - {formatDate(report.endDate)}
                </TableCell>
                <TableCell className="text-primary whitespace-nowrap">
                  {formatCurrency(report.totalIncomes)}
                </TableCell>
                <TableCell className="text-destructive whitespace-nowrap">
                  {formatCurrency(report.totalExpenses)}
                </TableCell>
                <TableCell className="text-primary whitespace-nowrap">
                  {formatCurrency(report.totalInvestments)}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {formatDate(report.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 shrink-0">
                    <Link href={`/dashboard/reports/view/${report.id}`}>
                      <Button variant="ghost" size="icon">
                        <LuEye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(report.id)}
                    >
                      <LuTrash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 pb-3 border-b">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Período</p>
                    <p className="font-medium text-sm">
                      {formatDate(report.startDate)} -{" "}
                      {formatDate(report.endDate)}
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Link href={`/dashboard/reports/view/${report.id}`}>
                      <Button variant="ghost" size="icon">
                        <LuEye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(report.id)}
                    >
                      <LuTrash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground">
                      Total de Receitas
                    </p>
                    <p className="font-medium text-primary">
                      {formatCurrency(report.totalIncomes)}
                    </p>
                  </div>
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground">
                      Total de Despesas
                    </p>
                    <p className="font-medium text-destructive">
                      {formatCurrency(report.totalExpenses)}
                    </p>
                  </div>
                  <div className="pb-3 border-b">
                    <p className="text-sm text-muted-foreground">
                      Total de Investimentos
                    </p>
                    <p className="font-medium text-primary">
                      {formatCurrency(report.totalInvestments)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Criado em</p>
                    <p className="font-medium">
                      {formatDate(report.createdAt)}
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
        title="Excluir Relatório"
        description="Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita."
      />
    </>
  );
}
