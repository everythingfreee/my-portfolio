import React from "react";
import type { Metadata } from "next";
import { getAboutContent, getSkills } from "@/lib/db-queries";
import { User, Award, Layers, Terminal, Server } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAboutContent();
  return {
    applicationName: "Sanaullah Shaheer Portfolio",
    title: about?.title ? `${about.title} | About` : "About Me",
    description: about?.bio 
      ? about.bio.substring(0, 160) 
      : "Learn more about Sanaullah Shaheer's skills, qualifications, and biography.",
    openGraph: {
      title: about?.title ? `${about.title} | About` : "About Me",
      description: about?.bio ? about.bio.substring(0, 160) : "Learn more about Sanaullah Shaheer.",
      images: about?.avatarUrl ? [{ url: about.avatarUrl }] : [],
    },
  };
}

export default async function AboutPage() {
  const [about, skills] = await Promise.all([
    getAboutContent(),
    getSkills(),
  ]);

  // Group skills by category
  const categories = Array.from(new Set(skills.map((s) => s.category || "General")));

  const categoryIcons: { [key: string]: any } = {
    Frontend: Layers,
    Backend: Server,
    Database: Terminal,
    Tools: Award,
    General: User,
  };

  const getIcon = (catName: string) => {
    return categoryIcons[catName] || categoryIcons.General;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
          About Me
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mt-2">
          My biography, skills, and background.
        </p>
      </div>

      {/* Biography & Avatar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 items-start">
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="relative h-48 w-48 rounded-2xl overflow-hidden glass-card p-1">
            {about?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={about.avatarUrl}
                alt="Profile Avatar"
                className="h-full w-full object-cover rounded-xl"
              />
            ) : (
              <div className="h-full w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400">
                <User size={64} />
              </div>
            )}
          </div>
          <h2 className="mt-4 font-bold text-lg text-zinc-950 dark:text-zinc-50 text-center">
            Sanaullah Shaheer
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 text-center">
            {about?.title || "Full-Stack Developer"}
          </p>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
              <User size={18} className="text-indigo-600 dark:text-indigo-400" />
              My Biography
            </h3>
            {about?.bio ? (
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {about.bio}
              </p>
            ) : (
              <p className="text-zinc-400 dark:text-zinc-500 italic text-sm">
                Biography is currently empty. Use the admin panel to update this section.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 mb-6 flex items-center gap-2">
          <Layers size={22} className="text-indigo-600 dark:text-indigo-400" />
          Technical Skillset
        </h2>

        {skills.length === 0 ? (
          <div className="glass-card p-8 text-center text-zinc-500 dark:text-zinc-400">
            <p className="text-sm">No skills listed yet. Add them in the Admin Panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => {
              const categorySkills = skills.filter((s) => s.category === category);
              const IconComponent = getIcon(category);

              return (
                <div key={category} className="glass-card p-6 flex flex-col">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-2 text-sm uppercase tracking-wider">
                    <IconComponent size={16} className="text-indigo-600 dark:text-indigo-400" />
                    {category}
                  </h3>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex flex-col space-y-1">
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {skill.name}
                          </span>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {skill.proficiency}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
