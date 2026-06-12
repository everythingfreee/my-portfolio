"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GithubIcon, TwitterIcon, FacebookIcon, InstagramIcon, LinkedinIcon, TiktokIcon } from "./brandIcons";
import { AtSign, MessageSquare, Phone, Mail, Award } from "lucide-react";

export const Footer = () => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) return null;

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/Everythingfreee", icon: GithubIcon, color: "hover:text-zinc-900 dark:hover:text-zinc-100" },
    { name: "X (Twitter)", href: "https://x.com/ShaheerDev48010", icon: TwitterIcon, color: "hover:text-sky-500" },
    { name: "Facebook", href: "https://facebook.com/sanullah.amarkhel", icon: FacebookIcon, color: "hover:text-blue-600" },
    { name: "LinkedIn", href: "https://linkedin.com/in/sanaullah-shaheer-a43795367", icon: LinkedinIcon, color: "hover:text-blue-500" },
    { name: "Instagram", href: "https://instagram.com/shaheerdev6727", icon: InstagramIcon, color: "hover:text-pink-500" },
    { name: "TikTok", href: "https://tiktok.com/@shaheer.dev27", icon: TiktokIcon, color: "hover:text-cyan-400" },
  ];

  return (
    <footer className="bg-[color:var(--card)] border-t border-[color:var(--card-border)] mt-auto py-12 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-2)] flex items-center justify-center text-white font-bold text-base shadow-sm">
                S
              </span>
              <span className="font-sans font-bold text-lg tracking-tight text-[color:var(--foreground)]">
                Shaheer
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
              Full-Stack Developer, Mobile App Developer, and Creative Designer from Afghanistan. I build modern web and mobile applications, UI/UX designs, and creative digital experiences.
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col space-y-3">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="flex flex-col space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <a
                href="tel:+93777386727"
                className="flex items-center space-x-2.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Phone size={15} />
                <span>+93 777 386 727</span>
              </a>
              <a
                href="mailto:contact@sanaullahshaheer.work.gd"
                className="flex items-center space-x-2.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <Mail size={15} />
                <span>contact@sanaullahshaheer.work.gd</span>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
              Social Channels
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-xl bg-[color:var(--card)] border border-[color:var(--card-border)] text-[color:var(--foreground)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${social.color}`}
                    title={`${social.name} (Placeholder)`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-900 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400">
          <p>© {currentYear} Sanaullah Shaheer. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/admin/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              CMS Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
