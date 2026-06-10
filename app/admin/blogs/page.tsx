"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  Loader2,
  BookOpen,
  Eye,
  AlertCircle,
  Link2,
} from "lucide-react";

export default function AdminBlogsCrudPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // Media upload fields
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSaving, setFormSaving] = useState(false);

  useEffect(() => {
    fetchBlogs();

    // Check if URL specifies writing a new post
    if (searchParams.get("new") === "true") {
      handleAddNew();
      // Remove query parameter
      router.replace("/admin/blogs");
    }
  }, [searchParams]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(list);
    } catch (error) {
      console.error("Error fetching blogs", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      // Auto-generate slug: convert to lowercase, replace non-alphanumeric characters with hyphens
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generatedSlug);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setContent("");
    setImageUrl("");
    setImageFile(null);
    setPublished(true);
    setFormError("");
    setFormOpen(true);
  };

  const handleEdit = (blog: any) => {
    setEditingId(blog.id);
    setTitle(blog.title || "");
    setSlug(blog.slug || "");
    setDescription(blog.description || "");
    setContent(blog.content || "");
    setImageUrl(blog.imageUrl || "");
    setImageFile(null);
    setPublished(blog.published ?? false);
    setFormError("");
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "blogs", id));
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting blog", error);
      alert("Failed to delete blog post");
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileRef = ref(storage, `blogs/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaving(true);
    setFormError("");

    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (!title.trim() || !cleanSlug || !description.trim() || !content.trim()) {
      setFormError("Title, Slug, Description, and Post Content are required.");
      setFormSaving(false);
      return;
    }

    try {
      let finalImageUrl = imageUrl;

      // Handle Image file upload if present
      if (imageFile) {
        setUploadingImage(true);
        try {
          finalImageUrl = await handleImageUpload(imageFile);
        } catch (uploadErr) {
          console.error("Image upload failed", uploadErr);
          setFormError("Cover image upload failed. Saving with remaining data.");
        } finally {
          setUploadingImage(false);
        }
      }

      const blogData: any = {
        title,
        slug: cleanSlug,
        description,
        content,
        published,
        imageUrl: finalImageUrl,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        // Update document
        await updateDoc(doc(db, "blogs", editingId), blogData);
      } else {
        // Create document
        blogData.createdAt = serverTimestamp();
        await addDoc(collection(db, "blogs"), blogData);
      }

      setFormOpen(false);
      fetchBlogs();
    } catch (error: any) {
      console.error("Error saving blog", error);
      setFormError(error.message || "An error occurred while saving the blog post.");
    } finally {
      setFormSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            Blogs CMS
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Write, edit, and publish technical articles or dev logs.
          </p>
        </div>

        {!formOpen && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            <Plus size={16} />
            Write Article
          </button>
        )}
      </div>

      {formOpen ? (
        /* Form Card */
        <div className="glass-card p-6 sm:p-8 animate-fade-in">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              {editingId ? "Edit Article Details" : "Write New Article"}
            </h2>
            <button
              onClick={() => setFormOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-650 hover:bg-zinc-100 dark:hover:bg-zinc-850"
            >
              <X size={20} />
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 rounded-xl text-red-650 dark:text-red-400 text-sm flex items-center gap-2 mb-6">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Article Title
                </label>
                <input
                  type="text"
                  placeholder="E.g., Getting Started with React 19 Server Components"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Slug */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                  <Link2 size={12} />
                  Slug (URL suffix)
                </label>
                <input
                  type="text"
                  placeholder="react-19-server-components"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Short Description / Card Excerpt
              </label>
              <input
                type="text"
                placeholder="A short summary of the article content."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-855 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              {/* Image Input */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  placeholder="External path or upload download link"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Upload cover image */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Upload Cover File (Overrides URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="blog-file-upload"
                  />
                  <label
                    htmlFor="blog-file-upload"
                    className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-zinc-350 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 text-sm text-zinc-500 cursor-pointer"
                  >
                    <Upload size={16} />
                    <span>{imageFile ? imageFile.name : "Choose file..."}</span>
                  </label>
                  {imageFile && (
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="px-3 rounded-xl border border-zinc-200 dark:border-zinc-850 text-red-500 hover:bg-red-50"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Markdown content */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Detailed Body Content (Markdown format supported)
              </label>
              <textarea
                rows={14}
                placeholder="# Heading 1\nType full article details here using Markdown syntax..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none font-mono resize-y"
                required
              ></textarea>
            </div>

            {/* Published and Submit */}
            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4.5 w-4.5 rounded border-zinc-350 text-indigo-650"
                />
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  Publish article publicly
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-semibold hover:bg-zinc-50 transition-colors cursor-pointer"
                  disabled={formSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSaving}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  {formSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                  Save Article
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        /* Blogs Table / List */
        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-12 text-center text-zinc-400 dark:text-zinc-500 italic text-sm">
              No blog posts added yet. Click &quot;Write Article&quot; above to create your first article entry.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-950 dark:text-zinc-50">
                          {blog.title}
                        </div>
                        <div className="text-zinc-400 text-xs truncate max-w-xs mt-0.5">
                          {blog.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">
                          {blog.slug}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        {blog.published ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <Check size={14} />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-zinc-400">
                            <X size={14} />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-zinc-500">
                        {blog.createdAt
                          ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-600 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                            title="Preview Public Page"
                          >
                            <Eye size={16} />
                          </Link>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-indigo-650 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
