import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import * as pdfjs from "pdfjs-dist";
import mammoth from "mammoth";
import { analyzeATSLocal } from "../../utils/atsEngine";

const PDFJS_VERSION = "5.4.624";
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

export default function ProfilePage({ openPage }) {
  const [user, setUser] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem("byan:user");
      setUser(u ? JSON.parse(u) : null);
      const r = localStorage.getItem("byan:resume:text") || "";
      setResumeText(r);
    } catch {}
  }, []);

  const handleSaveText = () => {
    try {
      localStorage.setItem("byan:resume:text", resumeText || "");
      toast.success("Resume updated");
      setEditing(false);
    } catch {
      toast.error("Unable to save resume");
    }
  };

  const importFile = async (file) => {
    if (!file) return;
    setBusy(true);
    const id = toast.loading(`Reading ${file.name}...`);
    try {
      let text = "";
      if (file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((it) => it.str).join(" ") + "\n";
        }
      } else if (file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        text = await file.text();
      }
      if (!text || text.trim().length < 10) throw new Error("Could not extract text");
      setResumeText(text);
      localStorage.setItem("byan:resume:text", text);
      toast.success("Resume imported", { id });
      setEditing(false);
    } catch (e) {
      toast.error("Import failed", { id });
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const summary = useMemo(() => {
    const snip = resumeText ? resumeText.trim().slice(0, 220) : "";
    const words = resumeText ? resumeText.trim().split(/\s+/).length : 0;
    return { snip, words };
  }, [resumeText]);

  const quickMatch = useMemo(() => {
    const sample = "cybersecurity react node backend frontend";
    const r = resumeText ? analyzeATSLocal(resumeText, sample) : null;
    return r?.score || null;
  }, [resumeText]);

  return (
    <main className="min-h-screen py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Profile</h1>
            <p className="text-sm text-gray-400 mt-1">{user?.name || "Student"} · {user?.email || "No email"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openPage && openPage("resume-builder")}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white"
            >
              Open Resume Builder
            </button>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-xl text-sm font-bold border border-gray-700 text-gray-200 hover:bg-gray-800"
              >
                Edit Text
              </button>
            ) : (
              <button
                onClick={handleSaveText}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Save
              </button>
            )}
            <label className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-800 hover:bg-gray-700 cursor-pointer">
              Import File
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => importFile(e.target.files?.[0])}
                disabled={busy}
              />
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-400 font-bold uppercase tracking-widest">Resume</div>
              <div className="text-xs text-gray-400">{summary.words} words</div>
            </div>
            {!editing ? (
              <div className="min-h-[240px] max-h-[520px] overflow-auto rounded-xl bg-black/40 p-4 text-gray-200 leading-relaxed whitespace-pre-wrap">
                {resumeText ? resumeText : "No resume found. Import a file or open Resume Builder."}
              </div>
            ) : (
              <textarea
                className="w-full min-h-[320px] rounded-xl bg-black/60 border border-gray-800 p-4 text-gray-100 outline-none focus:border-red-500"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here"
              />
            )}
          </div>
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
            <div className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-3">Quick Snapshot</div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-black/40 border border-gray-800">
                <div className="text-xs text-gray-400">First lines</div>
                <div className="text-sm text-gray-200 mt-1">{summary.snip || "—"}</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-gray-800">
                <div className="text-xs text-gray-400">Overall match hint</div>
                <div className="text-lg font-bold mt-1">
                  {quickMatch != null ? (
                    <span className={quickMatch >= 70 ? "text-emerald-400" : quickMatch >= 50 ? "text-amber-400" : "text-gray-400"}>
                      {quickMatch}%
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

