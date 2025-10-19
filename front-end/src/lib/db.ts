import type { Income, Expense, Investment, Report } from "./types";

const INCOMES_KEY = "financial_tracker_incomes";
const EXPENSES_KEY = "financial_tracker_expenses";
const INVESTMENTS_KEY = "financial_tracker_investments";
const REPORTS_KEY = "financial_tracker_reports";

// Income operations
export function getIncomes(userId: string): Income[] {
  const incomes = getAllIncomes();
  return incomes.filter((i) => i.userId === userId);
}

export function addIncome(
  userId: string,
  data: Omit<Income, "id" | "userId" | "createdAt" | "updatedAt">
): Income {
  const incomes = getAllIncomes();
  const income: Income = {
    ...data,
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  incomes.push(income);
  localStorage.setItem(INCOMES_KEY, JSON.stringify(incomes));
  return income;
}

export function updateIncome(
  id: string,
  data: Partial<Omit<Income, "id" | "userId" | "createdAt">>
): Income | null {
  const incomes = getAllIncomes();
  const index = incomes.findIndex((i) => i.id === id);
  if (index === -1) return null;

  incomes[index] = {
    ...incomes[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(INCOMES_KEY, JSON.stringify(incomes));
  return incomes[index];
}

export function deleteIncome(id: string): boolean {
  const incomes = getAllIncomes();
  const filtered = incomes.filter((i) => i.id !== id);
  if (filtered.length === incomes.length) return false;
  localStorage.setItem(INCOMES_KEY, JSON.stringify(filtered));
  return true;
}

function getAllIncomes(): Income[] {
  const str = localStorage.getItem(INCOMES_KEY);
  return str ? JSON.parse(str) : [];
}

// Expense operations
export function getExpenses(userId: string): Expense[] {
  const expenses = getAllExpenses();
  return expenses.filter((e) => e.userId === userId);
}

export function addExpense(
  userId: string,
  data: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">
): Expense {
  const expenses = getAllExpenses();
  const expense: Expense = {
    ...data,
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  expenses.push(expense);
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  return expense;
}

export function updateExpense(
  id: string,
  data: Partial<Omit<Expense, "id" | "userId" | "createdAt">>
): Expense | null {
  const expenses = getAllExpenses();
  const index = expenses.findIndex((e) => e.id === id);
  if (index === -1) return null;

  expenses[index] = {
    ...expenses[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  return expenses[index];
}

export function deleteExpense(id: string): boolean {
  const expenses = getAllExpenses();
  const filtered = expenses.filter((e) => e.id !== id);
  if (filtered.length === expenses.length) return false;
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(filtered));
  return true;
}

function getAllExpenses(): Expense[] {
  const str = localStorage.getItem(EXPENSES_KEY);
  return str ? JSON.parse(str) : [];
}

// Investment operations
export function getInvestments(userId: string): Investment[] {
  const investments = getAllInvestments();
  return investments.filter((i) => i.userId === userId);
}

export function addInvestment(
  userId: string,
  data: Omit<Investment, "id" | "userId" | "createdAt" | "updatedAt">
): Investment {
  const investments = getAllInvestments();
  const investment: Investment = {
    ...data,
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  investments.push(investment);
  localStorage.setItem(INVESTMENTS_KEY, JSON.stringify(investments));
  return investment;
}

export function updateInvestment(
  id: string,
  data: Partial<Omit<Investment, "id" | "userId" | "createdAt">>
): Investment | null {
  const investments = getAllInvestments();
  const index = investments.findIndex((i) => i.id === id);
  if (index === -1) return null;

  investments[index] = {
    ...investments[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(INVESTMENTS_KEY, JSON.stringify(investments));
  return investments[index];
}

export function deleteInvestment(id: string): boolean {
  const investments = getAllInvestments();
  const filtered = investments.filter((i) => i.id !== id);
  if (filtered.length === investments.length) return false;
  localStorage.setItem(INVESTMENTS_KEY, JSON.stringify(filtered));
  return true;
}

function getAllInvestments(): Investment[] {
  const str = localStorage.getItem(INVESTMENTS_KEY);
  return str ? JSON.parse(str) : [];
}

// Report operations
export function getReports(userId: string): Report[] {
  const reports = getAllReports();
  return reports.filter((r) => r.userId === userId);
}

export function addReport(
  userId: string,
  data: Omit<Report, "id" | "userId" | "createdAt">
): Report {
  const reports = getAllReports();
  const report: Report = {
    ...data,
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
  };
  reports.push(report);
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  return report;
}

export function deleteReport(id: string): boolean {
  const reports = getAllReports();
  const filtered = reports.filter((r) => r.id !== id);
  if (filtered.length === reports.length) return false;
  localStorage.setItem(REPORTS_KEY, JSON.stringify(filtered));
  return true;
}

export function getReport(id: string): Report | null {
  const reports = getAllReports();
  return reports.find((r) => r.id === id) || null;
}

function getAllReports(): Report[] {
  const str = localStorage.getItem(REPORTS_KEY);
  return str ? JSON.parse(str) : [];
}

export function calculateInvestmentIncome(
  userId: string,
  startDate: string,
  endDate: string
): number {
  const investments = getInvestments(userId);
  const start = new Date(startDate);
  const end = new Date(endDate);

  let totalProjectedIncome = 0;

  investments.forEach((investment) => {
    const investmentDate = new Date(investment.createdAt);

    // Only calculate returns for investments created before or during the report period
    if (investmentDate <= end) {
      // Determine the effective start date for this investment
      const effectiveStart = investmentDate > start ? investmentDate : start;

      // Calculate the number of months the investment was active during the report period
      const monthsDiff = Math.max(
        0,
        (end.getFullYear() - effectiveStart.getFullYear()) * 12 +
          (end.getMonth() - effectiveStart.getMonth()) +
          (end.getDate() >= effectiveStart.getDate() ? 1 : 0)
      );

      // Calculate projected income using monthly return percentage
      const monthlyReturn =
        (investment.value * investment.monthlyReturnPercentage) / 100;
      const projectedIncome = monthlyReturn * monthsDiff;

      totalProjectedIncome += projectedIncome;
    }
  });

  return totalProjectedIncome;
}

export function getInvestmentProjections(
  userId: string,
  startDate: string,
  endDate: string
) {
  const investments = getInvestments(userId);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return investments
    .filter((investment) => {
      const investmentDate = new Date(investment.createdAt);
      return investmentDate <= end;
    })
    .map((investment) => {
      const investmentDate = new Date(investment.createdAt);
      const effectiveStart = investmentDate > start ? investmentDate : start;

      const monthsDiff = Math.max(
        0,
        (end.getFullYear() - effectiveStart.getFullYear()) * 12 +
          (end.getMonth() - effectiveStart.getMonth()) +
          (end.getDate() >= effectiveStart.getDate() ? 1 : 0)
      );

      const monthlyReturn =
        (investment.value * investment.monthlyReturnPercentage) / 100;
      const projectedIncome = monthlyReturn * monthsDiff;

      return {
        ...investment,
        monthsActive: monthsDiff,
        projectedIncome,
      };
    })
    .filter((inv) => inv.projectedIncome > 0);
}
