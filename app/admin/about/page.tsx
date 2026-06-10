"use client";

import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import {
  User,
  Layers,
  Upload,
  Plus,
  Trash2,
  Check,
  Loader2,
  AlertCircle,
  Edit2,
  Save,
  X,
} from "lucide-react";

export default function AdminAboutCrudPage() {
  // Bio state
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Skills state
  const [skills, setSkills] = useState<any[]>([]);
  const [loadingBio, setLoadingBio] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [savingBio, setSavingBio] = useState(false);
  const [bioError, setBioError] = useState("");
  const [bioSuccess, setBioSuccess] = useState(false);

  // Skill form state
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("Frontend");
  const [skillProficiency, setSkillProficiency] = useState(80);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [savingSkill, setSavingSkill] = useState(false);
  const [skillError, setSkillError] = useState("");

  const skillCategories = ["Frontend", "Backend", "Database", "Tools", "General"];

  useEffect(() => {
    fetchBio();
    fetchSkills();
  }, []);

  const fetchBio = async () => {
    setLoadingBio(true);
    try {
      const docRef = doc(db, "about", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBio(data.bio || "");
        setTitle(data.title || "");
        setAvatarUrl(data.avatarUrl || "");
      }
    } catch (error) {
      console.error("Error fetching biography details", error);
    } finally {
      setLoadingBio(false);
    }
  };

  const fetchSkills = async () => {
    setLoadingSkills(true);
    try {
      const snapshot = await getDocs(collection(db, "skills"));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSkills(list);
    } catch (error) {
      console.error("Error fetching skills", error);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleAvatarUpload = async (file: File): Promise<string> => {
    const fileRef = ref(storage, `about/avatar_${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSaveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBio(true);
    setBioError("");
    setBioSuccess(false);

    try {
      let finalAvatarUrl = avatarUrl;

      if (avatarFile) {
        finalAvatarUrl = await handleAvatarUpload(avatarFile);
        setAvatarUrl(finalAvatarUrl);
        setAvatarFile(null);
      }

      await setDoc(doc(db, "about", "main"), {
        bio,
        title,
        avatarUrl: finalAvatarUrl,
        updatedAt: serverTimestamp(),
      });

      setBioSuccess(true);
      setTimeout(() => setBioSuccess(false), 3000);
    } catch (error: any) {
      console.error("Error saving biography details", error);
      setBioError(error.message || "Failed to save biography.");
    } finally {
      setSavingBio(false);
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSkill(true);
    setSkillError("");

    if (!skillName.trim()) {
      setSkillError("Skill name is required.");
      setSavingSkill(false);
      return;
    }

    try {
      const skillData = {
        name: skillName.trim(),
        category: skillCategory,
        proficiency: Number(skillProficiency),
      };

      if (editingSkillId) {
        await updateDoc(doc(db, "skills", editingSkillId), skillData);
        setSkills((prev) =>
          prev.map((s) => (s.id === editingSkillId ? { id: editingSkillId, ...skillData } : s))
        );
        setEditingSkillId(null);
      } else {
        const docRef = await addDoc(collection(db, "skills"), skillData);
        setSkills((prev) => [...prev, { id: docRef.id, ...skillData }]);
      }

      setSkillName("");
      setSkillProficiency(80);
    } catch (error: any) {
      console.error("Error saving skill", error);
      setSkillError(error.message || "Failed to save skill.");
    } finally {
      setSavingSkill(false);
    }
  };

  const handleEditSkill = (skill: any) => {
    setEditingSkillId(skill.id);
    setSkillName(skill.name || "");
    setSkillCategory(skill.category || "Frontend");
    setSkillProficiency(skill.proficiency || 80);
    setSkillError("");
  };

  const handleCancelSkillEdit = () => {
    setEditingSkillId(null);
    setSkillName("");
    setSkillProficiency(80);
    setSkillError("");
  };

  const handleDeleteSkill = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }
    try {
      await deleteDoc(doc(db, "skills", id));
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting skill", error);
      alert("Failed to delete skill.");
    }
  };

  return (
    <div className="space-y-10">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
          About & Skills CMS
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Manage your biographic details, contact summary, and technical skill ratings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Biography Editor Form */}
        <div className="lg:col-span-3">
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <User size={18} className="text-indigo-600" />
              Biography & Profile Info
            </h2>

            {loadingBio ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-indigo-600" size={24} />
              </div>
            ) : (
              <form onSubmit={handleSaveBio} className="space-y-5">
                {bioError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 rounded-xl text-red-650 dark:text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>{bioError}</span>
                  </div>
                )}

                {bioSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2">
                    <Check size={16} />
                    <span>Biography saved successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  {/* Job Title */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., Senior Full-Stack Engineer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Avatar URL */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Avatar URL
                    </label>
                    <input
                      type="text"
                      placeholder="Image address URL"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Avatar File Upload */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Upload Avatar Picture (Overrides URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setAvatarFile(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-zinc-350 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 text-sm text-zinc-500 cursor-pointer"
                    >
                      <Upload size={16} />
                      <span>{avatarFile ? avatarFile.name : "Select file..."}</span>
                    </label>
                    {avatarFile && (
                      <button
                        type="button"
                        onClick={() => setAvatarFile(null)}
                        className="px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-red-500 hover:bg-red-50"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Bio Text Area */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Biography Bio Paragraphs
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Write details about your career path, technical background, passion, and objectives..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 dark:focus:border-indigo-500 focus:outline-none resize-y"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    disabled={savingBio}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    {savingBio ? <Loader2 size={16} className="animate-spin" /> : null}
                    Save Biography
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Skills Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill creation form */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <Layers size={18} className="text-indigo-600" />
              {editingSkillId ? "Edit Skill" : "Add New Skill"}
            </h2>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              {skillError && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/50 rounded-xl text-red-650 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{skillError}</span>
                </div>
              )}

              {/* Skill Name */}
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="E.g., React, Go, Docker"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Category */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Category
                  </label>
                  <select
                    value={skillCategory}
                    onChange={(e) => setSkillCategory(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    {skillCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Proficiency */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Proficiency: {skillProficiency}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={skillProficiency}
                    onChange={(e) => setSkillProficiency(Number(e.target.value))}
                    className="h-9 cursor-pointer accent-indigo-650"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                {editingSkillId && (
                  <button
                    type="button"
                    onClick={handleCancelSkillEdit}
                    className="px-3 py-2 rounded-xl border border-zinc-205 dark:border-zinc-800 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={savingSkill}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  {editingSkillId ? <Save size={12} /> : <Plus size={12} />}
                  <span>{editingSkillId ? "Save Change" : "Add Skill"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Skills List */}
          <div className="glass-card p-6">
            <h2 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mb-4">
              Registered Skills
            </h2>

            {loadingSkills ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-indigo-600" size={20} />
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center text-zinc-400 italic text-xs py-4">
                No skills added yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/30 text-xs sm:text-sm"
                  >
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <span>{skill.name}</span>
                        <span className="text-[10px] text-zinc-400 font-semibold px-1 rounded bg-zinc-100 dark:bg-zinc-800">
                          {skill.category}
                        </span>
                      </div>
                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                        Proficiency: {skill.proficiency}%
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditSkill(skill)}
                        className="p-1 text-zinc-400 hover:text-indigo-650 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="p-1 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
