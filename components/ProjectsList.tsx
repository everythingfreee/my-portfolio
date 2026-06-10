"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FolderKanban, ArrowRight, Layers } from "lucide-react";
import { Project } from "@/lib/db-queries";

interface ProjectsListProps {
  initialProjects: Project[];
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ initialProjects }) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");

  // Get all unique tags
  const allTags = ["All", ...Array.from(new Set(initialProjects.flatMap((p) => p.tags || [])))];

  // Filter projects based on selected tag
  const filteredProjects =
    selectedTag === "All"
      ? initialProjects
      : initialProjects.filter((p) => p.tags && p.tags.includes(selectedTag));

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      {allTags.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-card p-12 text-center text-zinc-500 dark:text-zinc-400">
          <p className="text-lg">No projects match this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
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
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mt-2 leading-relaxed">
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
    </div>
  );
};
export default ProjectsList;
