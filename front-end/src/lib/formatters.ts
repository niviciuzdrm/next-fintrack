export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: string): string {
  // Se receber "YYYY-MM-DD", constrói Date no fuso local para evitar o deslocamento UTC
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
  }

  // Caso geral (timestamps, ISO completo, etc.)
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("pt-BR");
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}
