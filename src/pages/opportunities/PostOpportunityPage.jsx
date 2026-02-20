import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Send, Link as LinkIcon, IndianRupee, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PostOpportunityPage({ openPage }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "Internship",
    mode: "Remote",
    stipend: "",
    location: "",
    about: "",
    skills: "",
    linkedin: "",
    applyUrl: "",
    applyMode: "BYAN"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const now = Date.now();
      const id = `live-${now}`;
      const op = {
        id,
        title: form.title || "Untitled Role",
        company: "Your Company",
        location: form.location || "Remote",
        stipend: Number(form.stipend) || 0,
        type: form.type,
        about: form.about,
        mode: form.mode,
        trust: 90,
        skills: form.skills,
        linkedin: form.linkedin,
        applyUrl: form.applyUrl,
        applyMode: form.applyMode,
        isLive: true,
        createdAt: now
      };
      const existing = JSON.parse(localStorage.getItem("byan:liveOps") || "[]");
      localStorage.setItem("byan:liveOps", JSON.stringify([op, ...existing]));
      toast.success("Opportunity posted!");
      openPage('recruiter-dashboard');
    } catch (err) {
      toast.error("Failed to post opportunity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => openPage('recruiter-dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-gray-900/50 border border-red-500/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Post New Opportunity</h1>
            <p className="text-gray-400 mt-1">Fill in the details to find the best talent for your company.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Job Title</label>
                <input 
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                  placeholder="e.g. Frontend Developer Intern"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Opportunity Type</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                >
                  <option>Internship</option>
                  <option>Apprenticeship</option>
                  <option>Full-time</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mode</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                  value={form.mode}
                  onChange={(e) => setForm({...form, mode: e.target.value})}
                >
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stipend (Monthly)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="number"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                    placeholder="e.g. 15000"
                    value={form.stipend}
                    onChange={(e) => setForm({...form, stipend: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Location</label>
                <input 
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                  placeholder="e.g. Bengaluru"
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Job Description</label>
              <textarea 
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition min-h-[120px]"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                value={form.about}
                onChange={(e) => setForm({...form, about: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expected Skills (Comma separated)</label>
              <div className="relative">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                  placeholder="e.g. React, Node.js, Figma"
                  value={form.skills}
                  onChange={(e) => setForm({...form, skills: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">LinkedIn Job Link (Optional)</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                  placeholder="https://linkedin.com/jobs/..."
                  value={form.linkedin}
                  onChange={(e) => setForm({...form, linkedin: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Company Apply URL (Optional)</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                  placeholder="https://company.com/careers/apply"
                  value={form.applyUrl}
                  onChange={(e) => setForm({...form, applyUrl: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Application Mode</label>
                <select
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                  value={form.applyMode}
                  onChange={(e) => setForm({ ...form, applyMode: e.target.value })}
                >
                  <option value="BYAN">BYAN Form</option>
                  <option value="EXTERNAL">Recruiter Site</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
            >
              {loading ? "Posting..." : "Post Opportunity"}
              {!loading && <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
