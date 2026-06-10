"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  FolderKanban,
  BookOpen,
  Mail,
  ArrowRight,
  Sparkles,
  Plus,
  FileText,
  UserCheck,
  Database,
  Loader2,
  Check,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    messages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch projects count
      const projectsSnap = await getDocs(collection(db, "projects"));
      const projectsCount = projectsSnap.size;

      // Fetch blogs count
      const blogsSnap = await getDocs(collection(db, "blogs"));
      const blogsCount = blogsSnap.size;

      // Fetch messages and compute unread count locally (handles missing `read` field)
      const messagesSnapAll = await getDocs(collection(db, "contacts"));
      const allMessages = messagesSnapAll.docs.map((d) => ({ id: d.id, ...d.data() } as any));
      const messagesCount = allMessages.filter((m) => !m.read).length;

      setStats({
        projects: projectsCount,
        blogs: blogsCount,
        messages: messagesCount,
      });

      // Fetch 3 most recent contact messages
      const recentMessagesQuery = query(
        collection(db, "contacts"),
        orderBy("createdAt", "desc"),
        limit(3)
      );
      const recentMessagesSnap = await getDocs(recentMessagesQuery);
      const fetchedMessages = recentMessagesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentMessages(fetchedMessages);
    } catch (error) {
      console.error("Error fetching dashboard statistics", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSeedDatabase = async () => {
    if (!window.confirm("This will seed your database with sample projects, blogs, biography details, and technical skills. Do you want to continue?")) {
      return;
    }

    setSeeding(true);
    try {
      // 1. Seed Biography (about/main)
      await setDoc(doc(db, "about", "main"), {
        title: "Senior Full-Stack Engineer & Architect",
        bio: "I am a dedicated software engineer with 6+ years of experience crafting modular, performance-driven web products.\n\nMy core specialties include Next.js App Router, React 19, TypeScript, Tailwind CSS, and Firebase integration. I love solving scaling challenges, optimizing build systems, and implementing beautiful designs that wow users at first glance.",
        avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
        updatedAt: serverTimestamp(),
      });

      // 2. Seed Skills
      const mockSkills = [
        { name: "Next.js (App Router)", category: "Frontend", proficiency: 95 },
        { name: "React 19 & Hooks", category: "Frontend", proficiency: 90 },
        { name: "Tailwind CSS v4", category: "Frontend", proficiency: 95 },
        { name: "TypeScript", category: "General", proficiency: 90 },
        { name: "Go / Golang", category: "Backend", proficiency: 85 },
        { name: "Firebase (Auth, Firestore, Storage)", category: "Backend", proficiency: 90 },
        { name: "Docker & Kubernetes", category: "Tools", proficiency: 80 },
        { name: "PostgreSQL & Redis", category: "Database", proficiency: 85 }
      ];

      for (const skill of mockSkills) {
        await addDoc(collection(db, "skills"), skill);
      }

      // 3. Seed Projects
      const mockProjects = [
        {
          title: "DevFlow: Developer Q&A Platform",
          description: "A comprehensive developer discussion portal built with Next.js App Router, featuring AI-powered auto-responses and Firestore realtime updates.",
          content: "# DevFlow Platform\n\nDevFlow is a full-featured QA community similar to StackOverflow, built using the latest Next.js 16 frameworks.\n\n## Technical Details\n- **Client**: Next.js (App Router) + React 19 + Tailwind v4\n- **Database**: Realtime Firestore sync with multi-indexes\n- **Authentication**: Firebase Authentication with OAuth\n- **Caching**: Local memory caching with React Suspense state hooks\n\n### Key Features\n- Realtime notifications for replies and edits.\n- Search filters for topics and tags.\n- Full markdown rendering support with code highlighting.",
          imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
          githubUrl: "https://github.com/TODO",
          liveUrl: "https://sanaullahshaheer-1.firebaseapp.com",
          tags: ["Next.js", "Firebase", "TypeScript", "Tailwind CSS"],
          published: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        {
          title: "Realtime Collaborative Canvas",
          description: "Interactive visual drawing and planning board with multi-user cursors, shape editing tools, and persistent file saving.",
          content: "# Collaborative Design Board\n\nThis application enables distributed product design teams to whiteboard in real-time.\n\n## Backend Infrastructure\n- Built on top of Node.js and Socket.io.\n- Coordinates cursor coordinates in under 20ms intervals.\n- Persists structural objects in Firestore.\n\n### Modern Features\n- Multi-client canvas state synchronization.\n- Dynamic element editing, resizing, and coloring.\n- SVG export options.",
          imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
          githubUrl: "https://github.com/TODO",
          liveUrl: "https://sanaullahshaheer-1.firebaseapp.com",
          tags: ["React", "Node.js", "WebSockets", "Firestore"],
          published: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      ];

      for (const project of mockProjects) {
        await addDoc(collection(db, "projects"), project);
      }

      // 4. Seed Blogs
      const mockBlogs = [
        {
          title: "React 19 Action Hooks & Optimistic Updates",
          slug: "react-19-action-hooks",
          description: "Dive deep into the new Action Hook APIs in React 19 (useActionState, useOptimistic, and useFormStatus) to optimize data mutability states.",
          content: "# Exploring React 19 Actions\n\nReact 19 changes how we manage asynchronous operations and mutations. The core addition is the concept of **Actions**.\n\n## New Hooks\n\n### `useActionState`\nSimplifies handling form submissions, loading states, and result payloads.\n\n### `useOptimistic`\nAllows updating UI state immediately during async actions, providing instant feedback while the database transaction runs in the background.\n\n### `useFormStatus`\nEnables nested components to retrieve parent form details, making modular design clean and straightforward.",
          imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
          published: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        {
          title: "Dynamic SEO and Metadata in Next.js App Router",
          slug: "nextjs-dynamic-seo-metadata",
          description: "A comprehensive developer guide detailing how to execute Server-side database calls inside Next.js generateMetadata() to boost crawl rankings.",
          content: "# Next.js SEO Mastery\n\nIn modern web apps, SEO is critical. Next.js App Router makes handling SEO meta tags straightforward using the built-in Metadata API.\n\n## How It Works\nExporting a `generateMetadata` function allows you to query external databases like Firestore dynamically:\n\n```tsx\nexport async function generateMetadata({ params }) {\n  const data = await fetchFromDB(params.id);\n  return {\n    title: data.title,\n    description: data.description,\n  };\n}\n```\n\nThis runs on the server side prior to rendering the page, ensuring full-compliance and fast crawl indexation.",
          imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800",
          published: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      ];

      for (const blog of mockBlogs) {
        await addDoc(collection(db, "blogs"), blog);
      }

      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
      await fetchDashboardData();
    } catch (error) {
      console.error("Database seeding failed", error);
      alert("Database seeding failed. Check console for details.");
    } finally {
      setSeeding(false);
    }
  };

  const isDatabaseEmpty = stats.projects === 0 && stats.blogs === 0;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
            Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Welcome to your portfolio CMS workspace. Here is a summary of your site content.
          </p>
        </div>

        <button
          onClick={handleSeedDatabase}
          disabled={seeding}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 shadow-sm cursor-pointer disabled:opacity-55"
        >
          {seeding ? (
            <Loader2 className="animate-spin" size={16} />
          ) : seedSuccess ? (
            <Check size={16} className="text-emerald-500" />
          ) : (
            <Database size={16} />
          )}
          <span>{seeding ? "Seeding..." : seedSuccess ? "Database Seeded" : "Seed Sample Data"}</span>
        </button>
      </div>

      {/* Database Empty Banner */}
      {isDatabaseEmpty && (
        <div className="p-6 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-150/40 dark:border-indigo-900/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="space-y-1">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 text-sm sm:text-base">
              <Sparkles size={16} className="text-indigo-650" />
              Empty Database Detected
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm max-w-xl">
              Get started instantly by seeding your Firestore database with sample biography details, tech stack skills, featured projects, and articles.
            </p>
          </div>
          <button
            onClick={handleSeedDatabase}
            className="flex-shrink-0 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            Seed Sample Data
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/projects"
          className="glass-card p-6 flex items-center justify-between hover:border-indigo-500/50"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Total Projects
            </span>
            <p className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">
              {stats.projects}
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-650 dark:text-indigo-400 shadow-sm border border-indigo-100/30 dark:border-indigo-900/20">
            <FolderKanban size={20} />
          </div>
        </Link>

        <Link
          href="/admin/blogs"
          className="glass-card p-6 flex items-center justify-between hover:border-indigo-500/50"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Blog Articles
            </span>
            <p className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">
              {stats.blogs}
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-650 dark:text-emerald-400 shadow-sm border border-emerald-100/30 dark:border-emerald-900/20">
            <BookOpen size={20} />
          </div>
        </Link>

        <Link
          href="/admin/contact-messages"
          className="glass-card p-6 flex items-center justify-between hover:border-indigo-500/50"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Unread Messages
            </span>
            <p className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">
              {stats.messages}
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-650 dark:text-purple-400 shadow-sm border border-purple-100/30 dark:border-purple-900/20">
            <Mail size={20} />
          </div>
        </Link>
      </div>

      {/* Grid of Actions and Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400" />
              Quick Actions
            </h2>
            <div className="flex flex-col gap-2.5">
              <Link
                href="/admin/projects?new=true"
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-sm font-semibold text-zinc-750 dark:text-zinc-250 transition-colors shadow-sm"
              >
                <Plus size={16} />
                Create New Project
              </Link>
              <Link
                href="/admin/blogs?new=true"
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-sm font-semibold text-zinc-750 dark:text-zinc-250 transition-colors shadow-sm"
              >
                <Plus size={16} />
                Write Blog Article
              </Link>
              <Link
                href="/admin/about"
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-sm font-semibold text-zinc-750 dark:text-zinc-250 transition-colors shadow-sm"
              >
                <UserCheck size={16} />
                Edit About & Skills
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Contact Submissions */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-4">
              <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Mail size={18} className="text-indigo-600 dark:text-indigo-400" />
                Recent Messages
              </h2>
              <Link
                href="/admin/contact-messages"
                className="flex items-center gap-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all
                <ArrowRight size={12} />
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 dark:text-zinc-500 italic text-sm">
                No contact form messages received yet.
              </div>
            ) : (
              <div className="space-y-3.5">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border text-sm transition-all duration-200 ${
                      msg.read
                        ? "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/50 text-zinc-650 dark:text-zinc-400"
                        : "bg-indigo-50/10 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/50 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <span className="font-bold">{msg.name}</span>
                        <span className="text-zinc-400 text-xs ml-2">({msg.email})</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        {msg.createdAt
                          ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </span>
                    </div>
                    <div className="font-bold text-xs uppercase tracking-wider text-zinc-400 mb-1">
                      {msg.subject}
                    </div>
                    <p className="line-clamp-2 text-xs sm:text-sm leading-relaxed text-zinc-500 dark:text-zinc-450 mt-1.5">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
