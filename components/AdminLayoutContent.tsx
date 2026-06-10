"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  UserCheck,
  Mail,
  LogOut,
  Globe,
  Menu,
  X,
  User,
} from "lucide-react";

export const AdminLayoutContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginRoute = pathname === "/admin/login";

  if (isLoginRoute) {
    return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">{children}</div>;
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Projects CRUD", href: "/admin/projects", icon: FolderKanban },
    { name: "Blogs CRUD", href: "/admin/blogs", icon: BookOpen },
    { name: "About & Skills", href: "/admin/about", icon: UserCheck },
    { name: "Contact Messages", href: "/admin/contact-messages", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-[color:var(--card)]/96 backdrop-blur-md border-b border-[color:var(--card-border)] h-16 px-4 flex items-center justify-between shadow-sm">
        <Link href="/admin/dashboard" className="flex items-center space-x-2">
          <span className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            A
          </span>
          <span className="font-sans font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
            Admin Console
          </span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[color:var(--card)] border-r border-[color:var(--card-border)] flex-shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-[color:var(--card-border)]">
          <Link href="/admin/dashboard" className="flex items-center space-x-2 group">
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-2)] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-200">
              A
            </span>
            <span className="font-sans font-bold text-lg tracking-tight text-[color:var(--foreground)]">
              Admin Console
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-white bg-[color:var(--accent-gradient)] shadow-sm"
                    : "text-[color:var(--foreground)] hover:text-white hover:bg-[color:var(--color-primary)]/8"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & Actions */}
        <div className="p-4 border-t border-[color:var(--card-border)] flex flex-col space-y-2">
          <div className="flex items-center space-x-3 px-2 py-1">
            <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center text-zinc-500 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
              {user?.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt="User photo" className="h-full w-full object-cover" />
              ) : (
                <User size={16} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[color:var(--foreground)] truncate">
                {user?.displayName || "Administrator"}
              </p>
              <p className="text-[10px] text-zinc-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-[color:var(--foreground)] hover:text-white hover:bg-[color:var(--color-primary)]/8 transition-colors"
          >
            <Globe size={14} />
            <span>Public Website</span>
          </Link>

          <button
            onClick={() => logout()}
            className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navigation Drawer */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-b border-zinc-200/80 dark:border-zinc-850/80 shadow-lg transition-all duration-300 ease-in-out origin-top ${
          mobileMenuOpen ? "opacity-100 scale-y-100 py-4" : "opacity-0 scale-y-0 pointer-events-none h-0"
        }`}
      >
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
          >
            <Globe size={18} />
            <span>Public Website</span>
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Workspace Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
        <div className="glass-card p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
export default AdminLayoutContent;
