"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Mail, MailOpen, Trash2, Check, Loader2, AlertCircle, Calendar } from "lucide-react";

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState<any | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(list);
    } catch (error) {
      console.error("Error fetching contact messages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = async (msg: any) => {
    setSelectedMsg(msg);

    // If message is unread, mark it as read in database
    if (!msg.read) {
      try {
        await updateDoc(doc(db, "contacts", msg.id), {
          read: true,
        });
        // Update local state
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
        );
      } catch (error) {
        console.error("Error updating message read status", error);
      }
    }
  };

  const handleToggleReadStatus = async (e: React.MouseEvent, msg: any) => {
    e.stopPropagation(); // Prevent opening the details pane
    const newStatus = !msg.read;
    try {
      await updateDoc(doc(db, "contacts", msg.id), {
        read: newStatus,
      });
      // Update local state
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: newStatus } : m))
      );
      if (selectedMsg && selectedMsg.id === msg.id) {
        setSelectedMsg((prev: any) => ({ ...prev, read: newStatus }));
      }
    } catch (error) {
      console.error("Error toggling message read status", error);
    }
  };

  const handleDeleteMessage = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent opening the details pane
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "contacts", id));
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg(null);
      }
    } catch (error) {
      console.error("Error deleting message", error);
      alert("Failed to delete message.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
          Contact Messages
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Review submissions sent through your portfolio contact form.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Messages List */}
        <div className="lg:col-span-3">
          <div className="glass-card overflow-hidden">
            <div className="h-14 flex items-center px-6 border-b border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
              <h2 className="font-bold text-sm text-zinc-850 dark:text-zinc-200 uppercase tracking-wider">
                Inbox
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center text-zinc-400 dark:text-zinc-500 italic text-sm">
                Your inbox is empty. No messages submitted.
              </div>
            ) : (
              <div className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                {messages.map((msg) => {
                  const isSelected = selectedMsg?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`p-5 flex items-start gap-4 cursor-pointer transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 relative ${
                        isSelected
                          ? "bg-indigo-50/20 dark:bg-indigo-950/20 border-l-4 border-indigo-600 pl-4"
                          : "border-l-4 border-transparent"
                      }`}
                    >
                      {/* Read/Unread Icon */}
                      <div className="mt-1 flex-shrink-0">
                        {msg.read ? (
                          <MailOpen size={16} className="text-zinc-400" />
                        ) : (
                          <Mail size={16} className="text-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className={`text-sm truncate ${msg.read ? "text-zinc-650" : "font-bold text-zinc-900 dark:text-zinc-100"}`}>
                            {msg.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap flex items-center gap-1">
                            <Calendar size={10} />
                            {msg.createdAt
                              ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : ""}
                          </span>
                        </div>
                        <div className={`text-xs font-semibold ${msg.read ? "text-zinc-400" : "text-indigo-600 dark:text-indigo-400"}`}>
                          {msg.subject}
                        </div>
                        <p className="text-zinc-500 text-xs sm:text-sm line-clamp-2 mt-1.5 leading-relaxed">
                          {msg.message}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-1 self-center ml-2">
                        <button
                          onClick={(e) => handleToggleReadStatus(e, msg)}
                          className={`p-1.5 rounded-lg border border-transparent transition-colors ${
                            msg.read
                              ? "text-zinc-400 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                              : "text-indigo-600 dark:text-indigo-400 hover:text-zinc-600 hover:bg-indigo-50 dark:hover:bg-zinc-850"
                          }`}
                          title={msg.read ? "Mark as Unread" : "Mark as Read"}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteMessage(e, msg.id)}
                          className="p-1.5 rounded-lg border border-transparent text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-955/20 transition-colors"
                          title="Delete Message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected Message details panel */}
        <div className="lg:col-span-2">
          {selectedMsg ? (
            <div className="glass-card p-6 animate-fade-in space-y-5">
              <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex justify-between items-center">
                <span>Message Details</span>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  selectedMsg.read 
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500" 
                    : "bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-400"
                }`}>
                  {selectedMsg.read ? "Read" : "Unread"}
                </span>
              </h2>

              <div className="space-y-3.5 text-sm">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    From
                  </span>
                  <div className="font-semibold text-zinc-850 dark:text-zinc-200">
                    {selectedMsg.name}
                  </div>
                  <a
                    href={`mailto:${selectedMsg.email}`}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline block mt-0.5"
                  >
                    {selectedMsg.email}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Date Received
                  </span>
                  <div className="text-zinc-700 dark:text-zinc-300 font-medium">
                    {selectedMsg.createdAt
                      ? new Date(selectedMsg.createdAt.seconds * 1000).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Subject
                  </span>
                  <div className="font-bold text-zinc-900 dark:text-zinc-50 mt-0.5">
                    {selectedMsg.subject}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Message
                  </span>
                  <p className="text-zinc-650 dark:text-zinc-350 leading-relaxed whitespace-pre-wrap bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-150/40 dark:border-zinc-800/40 p-4 rounded-xl text-xs sm:text-sm">
                    {selectedMsg.message}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-10 text-center text-zinc-400 dark:text-zinc-500 italic text-sm">
              Select a message from the inbox list to read the full content.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
