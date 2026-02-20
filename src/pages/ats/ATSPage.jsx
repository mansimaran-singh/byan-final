import React, { useState } from "react";
import { analyzeATSLocal } from "../../utils/atsEngine";
import toast from "react-hot-toast";
import mammoth from "mammoth";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function ATSPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const loadingToast = toast.loading(`Reading ${file.name}...`);
    try {
      let text = "";
      if (file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(" ") + "\n";
        }
      } else if (file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer });
        text = res.value;
      } else {
        text = await file.text();
      }
      setResume(text);
      toast.success("Resume loaded!", { id: loadingToast });
    } catch (err) {
      toast.error("Failed to read file", { id: loadingToast });
    }
  }

  function analyzeATS() {
    if (!resume || !jobDescription) {
      toast.error("Please provide both resume and job description.");
      return;
    }
    setLoading(true);
    const localResult = analyzeATSLocal(resume, jobDescription);
    setResult(localResult);
    setLoading(false);
    toast.success("Analysis complete!");
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.2em] uppercase text-red-400">ATS check</p>
            <h1 className="text-3xl md:text-4xl font-bold">ATS Resume Analyzer</h1>
            <p className="text-sm text-gray-400 max-w-2xl">Upload your resume or paste the text to see how well you match the job.</p>
          </div>
          {result && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-right">
              <span className="text-xs text-gray-400">Match Score</span>
              <div className="text-3xl font-bold text-red-500">{result.score}%</div>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-300 uppercase">Resume Content</label>
                <label className="text-xs font-bold text-red-500 cursor-pointer hover:underline">
                  Upload File (PDF/DOCX)
                  <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
              <textarea
                className="w-full h-64 p-4 bg-black/50 border border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition"
                placeholder="Paste resume text here or upload a file..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-4">
              <label className="text-sm font-bold text-gray-300 uppercase">Job Description</label>
              <textarea
                className="w-full h-64 p-4 bg-black/50 border border-gray-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/50 transition"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            <button
              onClick={analyzeATS}
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg shadow-red-600/20"
            >
              {loading ? "Analyzing..." : "Run ATS Analysis"}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Analysis Results</h3>
              {!result ? (
                <p className="text-sm text-gray-500 italic">Run analysis to see matched and missing skills.</p>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-bold text-emerald-500 uppercase mb-2">Matched Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {result.matched.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded uppercase">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-500 uppercase mb-2">Missing Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {result.missing.map((s, i) => (
                        <span key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold rounded uppercase">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">AI Suggestions</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{result.suggestions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}