import type React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/server-db";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("[LOGGER] Dashboard layout rendering");
  const user = await getCurrentUser();
  console.log(
    "[LOGGER] Dashboard layout - user check result:",
    user ? `User found: ${user.email}` : "No user found"
  );

  if (!user) {
    console.log("[LOGGER] Dashboard layout - redirecting to login");
    redirect("/login");
  }

  console.log("[LOGGER] Dashboard layout - rendering with user:", user.email);
  return <DashboardLayout>{children}</DashboardLayout>;
}
