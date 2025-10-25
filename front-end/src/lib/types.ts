export interface User {
  id: string;
  email: string;
  cpf: string;
  birthDate: string;
  createdAt: string;
}

export interface Income {
  id: string;
  userId: string;
  name: string;
  value: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  name: string;
  value: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
  id: string;
  userId: string;
  name: string;
  value: number;
  date: string;
  annualReturnPercentage: number;
  monthlyReturnPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentProjection extends Investment {
  monthsActive: number;
  projectedIncome: number;
}

export interface Report {
  id: string;
  userId: string;
  totalIncomes: number;
  totalExpenses: number;
  totalInvestments: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}
