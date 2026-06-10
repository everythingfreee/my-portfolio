import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedBlogs } from "@/lib/db-queries";
import { BookOpen, ArrowRight, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read technical articles, code guides, development tutorials, and project logs written by Sanaullah Shaheer.",
  openGraph: {
    title: "Blog | Sanaullah Shaheer",
    description: "Read technical articles, code guides, and project logs written by Sanaullah Shaheer.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
          Developer Blog
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mt-2">
          Thoughts, guides, logs, and tutorials on modern web development.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="glass-card p-12 text-center text-zinc-500 dark:text-zinc-400">
          <p className="mb-4 text-lg">No articles posted yet.</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Check back soon or log in as administrator to publish a new post.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-2">
                    <Calendar size={12} />
                    <span>
                      {blog.createdAt
                        ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Draft"}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-zinc-950 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mt-2 leading-relaxed">
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
    </div>
  );
}
