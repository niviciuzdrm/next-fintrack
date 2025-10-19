"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/lib/server-db";
import {
  LuLayoutDashboard,
  LuArrowDownRight,
  LuArrowUpRight,
  LuTrendingUp,
  LuFileText,
  LuLogOut,
  LuMenu,
  LuX,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

const navigation = [
  { name: "Painel", href: "/dashboard", icon: LuLayoutDashboard },
  { name: "Receitas", href: "/dashboard/incomes", icon: LuArrowUpRight },
  { name: "Despesas", href: "/dashboard/expenses", icon: LuArrowDownRight },
  { name: "Investimentos", href: "/dashboard/investments", icon: LuTrendingUp },
  { name: "Relatórios", href: "/dashboard/reports", icon: LuFileText },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden border-r border-border bg-card lg:block transition-all duration-300 ease-in-out",
          sidebarExpanded ? "w-68" : "w-20"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-6 flex items-center justify-between min-h-[73px]">
            <h2
              className={cn(
                "text-xl font-bold text-primary transition-all duration-300 overflow-hidden whitespace-nowrap",
                sidebarExpanded ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
              )}
            >
              FinTrack
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="shrink-0 ml-auto"
            >
              {sidebarExpanded ? (
                <LuChevronLeft className="h-5 w-5" />
              ) : (
                <LuChevronRight className="h-5 w-5" />
              )}
            </Button>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href ||
                    pathname?.startsWith(item.href + "/");
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full gap-3 transition-all duration-300",
                      sidebarExpanded ? "justify-start" : "justify-center px-0",
                      isActive && "bg-secondary"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span
                      className={cn(
                        "transition-all duration-300 overflow-hidden whitespace-nowrap",
                        sidebarExpanded
                          ? "opacity-100 max-w-full"
                          : "opacity-0 max-w-0"
                      )}
                    >
                      {item.name}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border p-4">
            <Button
              variant="ghost"
              className={cn(
                "w-full gap-3 text-destructive transition-all duration-300",
                sidebarExpanded ? "justify-start" : "justify-center px-0"
              )}
              onClick={handleLogout}
            >
              <LuLogOut className="h-5 w-5 shrink-0" />
              <span
                className={cn(
                  "transition-all duration-300 overflow-hidden whitespace-nowrap",
                  sidebarExpanded
                    ? "opacity-100 max-w-full"
                    : "opacity-0 max-w-0"
                )}
              >
                Sair
              </span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">FinTrack</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <LuX className="h-6 w-6" />
              ) : (
                <LuMenu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 top-[73px] z-40 bg-card p-4 transition-transform duration-300 ease-in-out",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href ||
                    pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive && "bg-secondary"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
            >
              <LuLogOut className="h-5 w-5" />
              Sair
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 pt-24 lg:p-8 lg:pt-8">{children}</main>
    </div>
  );
}
