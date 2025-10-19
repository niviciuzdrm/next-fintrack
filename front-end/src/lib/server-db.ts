"use server";

import { cookies } from "next/headers";
import type { Income, Expense, Investment, Report, User } from "./types";

type GlobalData = {
  users: User[];
  passwords: Map<string, string>;
  incomes: Income[];
  expenses: Expense[];
  investments: Investment[];
  reports: Report[];
};

const globalForData = globalThis as unknown as {
  data: GlobalData | undefined;
};

// Initialize data storage once
if (!globalForData.data) {
  console.log("[LOGGER] Initializing global data store");
  globalForData.data = {
    users: [],
    passwords: new Map(),
    incomes: [],
    expenses: [],
    investments: [],
    reports: [],
  };
}

function getData(): GlobalData {
  if (!globalForData.data) {
    console.log("[LOGGER] Data was undefined, reinitializing");
    globalForData.data = {
      users: [],
      passwords: new Map(),
      incomes: [],
      expenses: [],
      investments: [],
      reports: [],
    };
  }
  return globalForData.data;
}

// Session management
export async function getCurrentUserId(): Promise<string | null> {
  console.log("[LOGGER] getCurrentUserId called");
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("userId");
  console.log("[LOGGER] Cookie value:", userIdCookie?.value || "NOT FOUND");
  console.log(
    "[LOGGER] All cookies:",
    cookieStore.getAll().map((c) => c.name)
  );
  return userIdCookie?.value || null;
}

export async function setCurrentUserId(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("userId", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearCurrentUserId() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
}

// Auth operations
export async function registerUser(
  email: string,
  password: string,
  cpf: string,
  birthDate: string
): Promise<{ success: boolean; error?: string }> {
  const data = getData();

  if (data.users.find((u) => u.email === email)) {
    return { success: false, error: "E-mail já existe" };
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    cpf,
    birthDate,
    createdAt: new Date().toISOString(),
  };

  data.users.push(user);
  data.passwords.set(user.id, password);

  console.log("[LOGGER] User registered. Total users:", data.users.length);

  return { success: true };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const data = getData();

  console.log("[LOGGER] Login attempt for email:", email);
  console.log("[LOGGER] Total users in database:", data.users.length);

  const user = data.users.find((u) => u.email === email);

  if (!user) {
    console.log("[LOGGER] User not found");
    return { success: false, error: "E-mail ou senha inválidos" };
  }

  console.log("[LOGGER] User found:", user.id);

  const storedPassword = data.passwords.get(user.id);
  console.log(
    "[LOGGER] Password check - stored exists:",
    !!storedPassword,
    "matches:",
    storedPassword === password
  );

  if (storedPassword !== password) {
    console.log("[LOGGER] Password mismatch");
    return { success: false, error: "E-mail ou senha inválidos" };
  }

  console.log("[LOGGER] Setting user session for userId:", user.id);
  await setCurrentUserId(user.id);
  console.log("[LOGGER] Session set successfully");

  return { success: true };
}

export async function logoutUser() {
  await clearCurrentUserId();
}

export async function getCurrentUser(): Promise<User | null> {
  console.log("[LOGGER] getCurrentUser called");
  const userId = await getCurrentUserId();
  console.log("[LOGGER] Retrieved userId from cookie:", userId);

  if (!userId) {
    console.log("[LOGGER] No userId found, returning null");
    return null;
  }

  const data = getData();
  const user = data.users.find((u) => u.id === userId);
  console.log(
    "[LOGGER] User lookup result:",
    user ? `Found user ${user.email}` : "User not found in database"
  );
  console.log("[LOGGER] Total users in database:", data.users.length);

  return user || null;
}

export async function resetPasswordRequest(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const data = getData();
  const user = data.users.find((u) => u.email === email);

  if (!user) {
    return { success: false, error: "E-mail não encontrado" };
  }

  return { success: true };
}

// Income operations
export async function getIncomes(): Promise<Income[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const data = getData();
  return data.incomes.filter((i) => i.userId === userId);
}

export async function getIncome(id: string): Promise<Income | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const data = getData();
  return data.incomes.find((i) => i.id === id && i.userId === userId) || null;
}

export async function addIncome(
  data_param: Omit<Income, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<Income> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Não autenticado");

  const data = getData();
  const income: Income = {
    ...data_param,
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.incomes.push(income);
  return income;
}

export async function updateIncome(
  id: string,
  data_param: Partial<Omit<Income, "id" | "userId" | "createdAt">>
): Promise<Income | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const data = getData();
  const index = data.incomes.findIndex(
    (i) => i.id === id && i.userId === userId
  );
  if (index === -1) return null;

  data.incomes[index] = {
    ...data.incomes[index],
    ...data_param,
    updatedAt: new Date().toISOString(),
  };
  return data.incomes[index];
}

export async function deleteIncome(id: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const data = getData();
  const index = data.incomes.findIndex(
    (i) => i.id === id && i.userId === userId
  );
  if (index === -1) return false;

  data.incomes.splice(index, 1);
  return true;
}

// Expense operations
export async function getExpenses(): Promise<Expense[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const data = getData();
  return data.expenses.filter((e) => e.userId === userId);
}

export async function getExpense(id: string): Promise<Expense | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const data = getData();
  return data.expenses.find((e) => e.id === id && e.userId === userId) || null;
}

export async function addExpense(
  data_param: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<Expense> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Não autenticado");

  const data = getData();
  const expense: Expense = {
    ...data_param,
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.expenses.push(expense);
  return expense;
}

export async function updateExpense(
  id: string,
  data_param: Partial<Omit<Expense, "id" | "userId" | "createdAt">>
): Promise<Expense | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const data = getData();
  const index = data.expenses.findIndex(
    (e) => e.id === id && e.userId === userId
  );
  if (index === -1) return null;

  data.expenses[index] = {
    ...data.expenses[index],
    ...data_param,
    updatedAt: new Date().toISOString(),
  };
  return data.expenses[index];
}

export async function deleteExpense(id: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const data = getData();
  const index = data.expenses.findIndex(
    (e) => e.id === id && e.userId === userId
  );
  if (index === -1) return false;

  data.expenses.splice(index, 1);
  return true;
}

// Investment operations
export async function getInvestments(): Promise<Investment[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const data = getData();
  return data.investments.filter((i) => i.userId === userId);
}

export async function getInvestment(id: string): Promise<Investment | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const data = getData();
  return (
    data.investments.find((i) => i.id === id && i.userId === userId) || null
  );
}

export async function addInvestment(
  data_param: Omit<Investment, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<Investment> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Não autenticado");

  const data = getData();
  const investment: Investment = {
    ...data_param,
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.investments.push(investment);
  return investment;
}

export async function updateInvestment(
  id: string,
  data_param: Partial<Omit<Investment, "id" | "userId" | "createdAt">>
): Promise<Investment | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const data = getData();
  const index = data.investments.findIndex(
    (i) => i.id === id && i.userId === userId
  );
  if (index === -1) return null;

  data.investments[index] = {
    ...data.investments[index],
    ...data_param,
    updatedAt: new Date().toISOString(),
  };
  return data.investments[index];
}

export async function deleteInvestment(id: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const data = getData();
  const index = data.investments.findIndex(
    (i) => i.id === id && i.userId === userId
  );
  if (index === -1) return false;

  data.investments.splice(index, 1);
  return true;
}

// Report operations
export async function getReports(): Promise<Report[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const data = getData();
  return data.reports.filter((r) => r.userId === userId);
}

export async function getReport(id: string): Promise<Report | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;
  const data = getData();
  return data.reports.find((r) => r.id === id && r.userId === userId) || null;
}

export async function addReport(
  data_param: Omit<Report, "id" | "userId" | "createdAt">
): Promise<Report> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Não autenticado");

  const data = getData();
  const report: Report = {
    ...data_param,
    id: crypto.randomUUID(),
    userId,
    createdAt: new Date().toISOString(),
  };
  data.reports.push(report);
  return report;
}

export async function deleteReport(id: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const data = getData();
  const index = data.reports.findIndex(
    (r) => r.id === id && r.userId === userId
  );
  if (index === -1) return false;

  data.reports.splice(index, 1);
  return true;
}

// Investment calculations
export async function calculateInvestmentIncome(
  startDate: string,
  endDate: string
): Promise<number> {
  const userInvestments = await getInvestments();
  const start = new Date(startDate);
  const end = new Date(endDate);

  let totalProjectedIncome = 0;

  userInvestments.forEach((investment) => {
    const investmentDate = new Date(investment.createdAt);

    if (investmentDate <= end) {
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

      totalProjectedIncome += projectedIncome;
    }
  });

  return totalProjectedIncome;
}

export async function getInvestmentProjections(
  startDate: string,
  endDate: string
) {
  const userInvestments = await getInvestments();
  const start = new Date(startDate);
  const end = new Date(endDate);

  return userInvestments
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
