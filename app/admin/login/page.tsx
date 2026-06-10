"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, Key, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const { loginWithGoogle, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to log in with Google.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error(err);
      // Friendly messages for common Firebase Auth issues
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Try again later.");
      } else {
        setError(err.message || "Authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isBtnDisabled = loading || authLoading;

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
      {/* Decorative Blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-8 shadow-md">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-650 dark:text-indigo-400 mb-4 shadow-sm border border-indigo-100/55 dark:border-indigo-900/30">
            <Lock size={22} />
          </div>
          <h1 className="font-extrabold text-2xl text-zinc-950 dark:text-zinc-50">
            Admin Portal
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Sign in to access the Content Management System.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 rounded-xl text-red-650 dark:text-red-400 text-sm flex items-center gap-2 mb-6">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Primary Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isBtnDisabled}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-sm font-semibold text-zinc-800 dark:text-zinc-100 transition-colors shadow-sm disabled:opacity-60 cursor-pointer"
          >
            {/* Google SVG logo */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.477 0-6.3-2.823-6.3-6.3s2.823-6.3 6.3-6.3c1.606 0 3.056.607 4.167 1.6l3.243-3.243C19.308 2.24 15.98 1 12.24 1 6.046 1 1 6.046 1 12.24s5.046 11.24 11.24 11.24c5.897 0 10.867-4.22 10.867-11.24 0-.768-.068-1.503-.195-2.215H12.24z"
              />
            </svg>
            <span>Sign In with Google</span>
          </button>

          {/* Separator */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              Or fallback login
            </span>
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>

          {/* Email / Password fallback */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-zinc-400"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-zinc-400" />
                <input
                  type="email"
                  id="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none"
                  disabled={isBtnDisabled}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-wider text-zinc-400"
              >
                Password
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-3 text-zinc-400" />
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none"
                  disabled={isBtnDisabled}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isBtnDisabled}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-650 hover:bg-indigo-550 text-white font-semibold shadow-md shadow-indigo-650/10 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {isBtnDisabled ? (
                <Loader2 size={16} className="animate-spin" />
              ) : null}
              <span>Sign In with Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
