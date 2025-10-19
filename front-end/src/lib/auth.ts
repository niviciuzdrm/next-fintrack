import type { User } from "./types";

const USERS_KEY = "financial_tracker_users";
const CURRENT_USER_KEY = "financial_tracker_current_user";

export function register(
  email: string,
  password: string,
  cpf: string,
  birthDate: string
): { success: boolean; error?: string } {
  const users = getUsers();

  if (users.find((u) => u.email === email)) {
    return { success: false, error: "Email already exists" };
  }

  const user: User = {
    id: crypto.randomUUID(),
    email,
    cpf,
    birthDate,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(`password_${user.id}`, password);

  return { success: true };
}

export function login(
  email: string,
  password: string
): { success: boolean; error?: string } {
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }

  const storedPassword = localStorage.getItem(`password_${user.id}`);
  if (storedPassword !== password) {
    return { success: false, error: "Invalid email or password" };
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return { success: true };
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function resetPassword(email: string): {
  success: boolean;
  error?: string;
} {
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return { success: false, error: "Email not found" };
  }

  // In a real app, this would send an email
  return { success: true };
}

function getUsers(): User[] {
  const usersStr = localStorage.getItem(USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
}
