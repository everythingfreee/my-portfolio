import React from "react";
import Link from "next/link";
import { getPublishedProjects, getPublishedBlogs } from "@/lib/db-queries";
import { ArrowRight, Code2, FolderKanban, BookOpen, Star, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [allProjects, allBlogs] = await Promise.all([
    getPublishedProjects(),
    getPublishedBlogs(),
  ]);

  // Take latest 3 of each
  const projects = allProjects.slice(0, 3);
  const blogs = allBlogs.slice(0, 3);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: "2s" }}></div>

      {/* Hero Section */}
      <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6 animate-fade-in shadow-sm">
          <Sparkles size={12} className="animate-spin" style={{ animationDuration: "3s" }} />
          Available for new opportunities
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 max-w-3xl leading-[1.15] mb-6">
          Crafting High-Performance{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 dark:from-indigo-400 dark:via-indigo-300 dark:to-emerald-400">
            Full-Stack Solutions
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mb-8">
          Hi, I&apos;m <span className="font-semibold text-zinc-900 dark:text-zinc-100">Sanaullah Shaheer</span>. I build production-grade web applications with pixel-perfect design, scalable backend APIs, and modern SEO architectures.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link
            href="/projects"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 -translate-y-[1px] hover:-translate-y-[2px] active:translate-y-0 transition-all duration-200"
          >
            <FolderKanban size={18} />
            View Projects
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-100 font-semibold shadow-sm hover:-translate-y-[1px] transition-all duration-200"
          >
            Contact Me
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Core Expertise Summary */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 flex flex-col space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Code2 size={20} />
            </div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Frontend Excellence</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Highly responsive Next.js apps with custom CSS/Tailwind animations and clean, modular component state.
            </p>
          </div>
          <div className="glass-card p-6 flex flex-col space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Star size={20} />
            </div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Backend + Realtime</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Cloud-driven architecture using Firestore, Storage, dynamic API handlers, and secure access guard logic.
            </p>
          </div>
          <div className="glass-card p-6 flex flex-col space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <BookOpen size={20} />
            </div>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">SEO + Performance</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Strict metadata adherence, OpenGraph standards, semantic HTML structure, and optimized Core Web Vitals.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">
              Featured Work
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Some of my recent projects.
            </p>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline"
          >
            All projects
            <ArrowRight size={14} />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="glass-card p-12 text-center text-zinc-500 dark:text-zinc-400">
            <p className="mb-4 text-lg">No projects added yet.</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Log in to the Admin Panel to publish your work.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group flex flex-col glass-card overflow-hidden hover:scale-[1.01]"
              >
                <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-b border-zinc-200/50 dark:border-zinc-800/50">
                  {project.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                      <FolderKanban size={32} />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-600 dark:text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-lg text-zinc-950 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-4 group-hover:underline">
                    Read Details
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Blogs */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-200/50 dark:border-zinc-900/50">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">
              Articles & Logs
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Read my latest ideas, lessons, and technologies.
            </p>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline"
          >
            All articles
            <ArrowRight size={14} />
          </Link>
        </div>

        {blogs.length === 0 ? (
          <div className="glass-card p-12 text-center text-zinc-500 dark:text-zinc-400">
            <p className="mb-4 text-lg">No articles posted yet.</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-500">
              Log in to the Admin Panel to write blog posts.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="group flex flex-col glass-card overflow-hidden hover:scale-[1.01]"
              >
                <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-b border-zinc-200/50 dark:border-zinc-800/50">
                  {blog.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                      <BookOpen size={32} />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {blog.createdAt
                        ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Draft"}
                    </span>
                    <h3 className="font-bold text-lg text-zinc-950 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                      {blog.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-4 group-hover:underline">
                    Read Article
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
