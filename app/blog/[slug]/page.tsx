import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogBySlug } from "@/lib/db-queries";
import { marked } from "marked";
import { ArrowLeft, Calendar, BookOpen, Clock } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Article Not Found",
      description: "The requested blog article could not be found.",
    };
  }

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: `${blog.title} | Blog`,
      description: blog.description,
      images: blog.imageUrl ? [{ url: blog.imageUrl }] : [],
      url: `/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: blog.imageUrl ? [blog.imageUrl] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const htmlContent = await marked.parse(blog.content || "");

  // Simple reading time estimator (average 200 words per minute)
  const wordCount = blog.content ? blog.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Blog
        </Link>
      </div>

      {/* Header Info */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-3 font-semibold">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>
              {blog.createdAt
                ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Draft"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span>{readingTime} min read</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-tight mb-4">
          {blog.title}
        </h1>
        <p className="text-base sm:text-lg text-zinc-650 dark:text-zinc-400 leading-relaxed font-medium">
          {blog.description}
        </p>
      </header>

      {/* Cover Image */}
      {blog.imageUrl && (
        <div className="relative aspect-video w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden mb-10 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Body Content */}
      <div className="border-t border-zinc-200/50 dark:border-zinc-900/50 pt-8">
        <div
          className="prose max-w-none text-zinc-700 dark:text-zinc-300"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
      </div>
    </article>
  );
}
