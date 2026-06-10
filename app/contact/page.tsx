"use client";

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Phone, Mail, Send, CheckCircle2, AlertCircle, MessageSquare, AtSign, Award } from "lucide-react";
import { GithubIcon, TwitterIcon, FacebookIcon, InstagramIcon, LinkedinIcon, TiktokIcon } from "@/components/brandIcons";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Please fill in all form fields.");
      setLoading(false);
      return;
    }

    try {
      // Save message in Firestore contacts collection
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        read: false,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError("An error occurred while sending your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/TODO", icon: GithubIcon, color: "hover:text-zinc-900 dark:hover:text-zinc-100" },
    { name: "X (Twitter)", href: "https://x.com/TODO", icon: TwitterIcon, color: "hover:text-sky-500" },
    { name: "Facebook", href: "https://facebook.com/TODO", icon: FacebookIcon, color: "hover:text-blue-600" },
    { name: "LinkedIn", href: "https://linkedin.com/TODO", icon: LinkedinIcon, color: "hover:text-blue-500" },
    { name: "Instagram", href: "https://instagram.com/TODO", icon: InstagramIcon, color: "hover:text-pink-500" },
    { name: "TikTok", href: "https://tiktok.com/TODO", icon: TiktokIcon, color: "hover:text-cyan-400" },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
          Contact Me
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mt-2">
          Let&apos;s build something together. Feel free to reach out!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Contact Info Panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 flex flex-col space-y-6">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 border-b border-zinc-100 dark:border-zinc-900 pb-2">
              Contact Information
            </h2>
            <div className="space-y-4">
              <a
                href="tel:+93777386727"
                className="flex items-center space-x-3.5 text-zinc-650 dark:text-zinc-350 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
              >
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 transition-colors">
                  <Phone size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Phone
                  </span>
                  <span className="font-semibold text-sm sm:text-base">+93 777 386 727</span>
                </div>
              </a>

              <a
                href="mailto:shaheershaheer3867@gmail.com"
                className="flex items-center space-x-3.5 text-zinc-650 dark:text-zinc-355 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
              >
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 transition-colors">
                  <Mail size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Email
                  </span>
                  <span className="font-semibold text-sm sm:text-base">shaheershaheer3867@gmail.com</span>
                </div>
              </a>
            </div>
          </div>

          {/* Socials card */}
          <div className="glass-card p-6">
            <h2 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-4">
              Social Profiles
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center justify-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-500 dark:text-zinc-400 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${social.color}`}
                    title={`${social.name} (Placeholder)`}
                  >
                    <Icon size={20} />
                    <span className="text-[10px] font-bold mt-1 text-center">{social.name.split(" ")[0]}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-3">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-6">
              Send a Message
            </h2>

            {success ? (
              <div className="text-center py-10 flex flex-col items-center space-y-4">
                <CheckCircle2 size={48} className="text-emerald-500 animate-bounce" />
                <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
                  Thank you for reaching out. I have received your message and will get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-xs font-bold uppercase tracking-wider text-zinc-400"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label
                      htmlFor="email"
                      className="text-xs font-bold uppercase tracking-wider text-zinc-400"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="johndoe@example.com"
                      className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="subject"
                    className="text-xs font-bold uppercase tracking-wider text-zinc-400"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Job Opportunity"
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <label
                    htmlFor="message"
                    className="text-xs font-bold uppercase tracking-wider text-zinc-400"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hi Shaheer, I would like to build..."
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none resize-none"
                    disabled={loading}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/10 transition-colors disabled:opacity-55 cursor-pointer"
                >
                  <Send size={16} />
                  {loading ? "Sending..." : "Submit Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
