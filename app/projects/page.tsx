import React from "react";
import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/db-queries";
import ProjectsList from "@/components/ProjectsList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  applicationName: "Sanaullah Shaheer Portfolio",
  title: "Projects",

  description: "Explore the development portfolio of Sanaullah Shaheer, including Next.js web applications, mobile platforms, and backend services.",
  openGraph: {
    title: "Projects | Sanaullah Shaheer",
    description: "Explore the development portfolio of Sanaullah Shaheer.",
    url: "/projects",
  },
};


export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
          Projects Portfolio
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mt-2">
          An archive of software projects, web systems, and mobile solutions.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center text-zinc-500 dark:text-zinc-400">
          <p className="mb-4 text-lg">No projects added to the portfolio yet.</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            Check back later or log in as administrator to populate this section.
          </p>
        </div>
      ) : (
        <ProjectsList initialProjects={projects} />
      )}
    </div>
  );
}
