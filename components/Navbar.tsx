"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, LayoutDashboard, LogOut, User, FolderKanban, BookOpen, Mail, Home } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Exclude admin pages from showing this default public navbar
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (isAdminRoute) return null;

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: User },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Blog", href: "/blog", icon: BookOpen },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[color:var(--card)]/96 backdrop-blur-md border-b border-[color:var(--card-border)] shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              {/* Use the icon.webp here with the same width and height and design */}
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-2)] flex items-center justify-center text-white font-bold text-lg shadow-md shadow-[color:var(--color-primary)]/20 group-hover:scale-105 transition-transform duration-200">
                <Image src="/favicon.ico" alt="Website main logo" width={36} height={36} priority />
              </div>
              <span className="font-sans font-bold text-xl tracking-tight text-[color:var(--foreground)] group-hover:text-[color:var(--color-primary)] transition-colors duration-200">
                Sanaullah Shaheer | ثناالله شهیر
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-[color:var(--accent-gradient)] shadow-sm"
                      : "text-[color:var(--foreground)] hover:text-white hover:bg-[color:var(--color-primary)]/8"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Admin Dashboard / Status Link */}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium accent-btn"
              >
                <LayoutDashboard size={14} />
                Admin
              </Link>
            )}

            {user && (
              <button
                onClick={() => logout()}
                className="ml-2 p-2 rounded-full text-[color:var(--foreground)] hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="p-2 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                title="Admin Dashboard"
              >
                <LayoutDashboard size={18} />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <div
        className={`md:hidden fixed inset-x-0 top-16 sm:top-20 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-lg transition-all duration-300 ease-in-out origin-top ${
          isOpen ? "opacity-100 scale-y-100 py-4" : "opacity-0 scale-y-0 pointer-events-none h-0"
        }`}
      >
        <div className="px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          {user && (
            <button
              onClick={() => logout()}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
