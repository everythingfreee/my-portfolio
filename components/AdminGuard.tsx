"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Lock, Loader2 } from "lucide-react";

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isLoginRoute = pathname === "/admin/login";

      if (isLoginRoute) {
        // If already logged in as admin, redirect away from login page to dashboard
        if (user && isAdmin) {
          router.replace("/admin/dashboard");
        }
      } else {
        // If not logged in or not admin, redirect to login page
        if (!user || !isAdmin) {
          router.replace("/admin/login");
        }
      }
    }
  }, [user, isAdmin, loading, pathname, router]);

  // Loading indicator
  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[70vh] text-center space-y-3">
        <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={36} />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold tracking-wider uppercase">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  const isLoginRoute = pathname === "/admin/login";

  // If we are checking and need to redirect, show loading state
  if (!isLoginRoute && (!user || !isAdmin)) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[70vh] text-center space-y-4">
        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400">
          <Lock size={32} className="animate-pulse" />
        </div>
        <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">Access Restricted</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xs leading-relaxed">
          Redirecting to the administrator login console...
        </p>
      </div>
    );
  }

  // If already logged in and visiting login, show loading while redirecting
  if (isLoginRoute && user && isAdmin) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[70vh] text-center space-y-3">
        <Loader2 className="animate-spin text-indigo-600 dark:text-indigo-400" size={36} />
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold">
          Redirecting to Dashboard...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
