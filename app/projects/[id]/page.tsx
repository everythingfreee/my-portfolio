import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/lib/db-queries";
import { marked } from "marked";
import { ArrowLeft, Globe, Calendar, FolderKanban } from "lucide-react";
import { GithubIcon } from "@/components/brandIcons";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project details could not be found.",
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} | Projects`,
      description: project.description,
      images: project.imageUrl ? [{ url: project.imageUrl }] : [],
      url: `/projects/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.imageUrl ? [project.imageUrl] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);

  // If the project doesn't exist or isn't published, throw a 404
  if (!project) {
    notFound();
  }

  const htmlContent = await marked.parse(project.content || "");

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm font-semibold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </div>

      {/* Cover Image */}
      <div className="relative aspect-video w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden mb-8 shadow-sm">
        {project.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400 dark:text-zinc-600">
            <FolderKanban size={64} />
          </div>
        )}
      </div>

      {/* Project Meta Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 items-start">
        <div className="md:col-span-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 mb-4">
            {project.title}
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Info panel */}
        <div className="glass-card p-6 flex flex-col space-y-4">
          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Date Published
            </span>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <Calendar size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span>
                {project.createdAt
                  ? new Date(project.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Draft"}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
              Tech Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2 pt-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-sm font-semibold text-zinc-800 dark:text-zinc-100 transition-colors shadow-sm"
              >
                <GithubIcon size={16} />
                Source Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/10 transition-all duration-200"
              >
                <Globe size={16} />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Details (Markdown) */}
      <div className="border-t border-zinc-200/50 dark:border-zinc-900/50 pt-8">
        <div
          className="prose max-w-none text-zinc-700 dark:text-zinc-300"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
      </div>
    </article>
  );
}
