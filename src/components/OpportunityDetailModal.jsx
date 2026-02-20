"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ShieldAlert, MapPin, IndianRupee, Briefcase, Clock, CheckCircle2, AlertTriangle, ExternalLink, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

const OpportunityDetailModal = ({ isOpen, onClose, op, onSave, isSaved }) => {
  if (!op) return null;

  const isScam = op.trust < 50;
  const isVerified = op.trust >= 75;

  const [applyOpen, setApplyOpen] = useState(false);
  const [applicant, setApplicant] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("byan:user") || "null");
      return {
        name: u?.name || "",
        email: u?.email || "",
        phone: u?.phone || "",
        cover: ""
      };
    } catch {
      return { name: "", email: "", phone: "", cover: "" };
    }
  });

  const handleApply = () => {
    if (op.applyMode === "EXTERNAL") {
      const target = op.applyUrl ? (/^https?:\/\//i.test(op.applyUrl) ? op.applyUrl : `https://${op.applyUrl}`) : null;
      if (target) {
        toast.success("Opening recruiter application portal...");
        window.open(target, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Recruiter site URL missing. Please apply via BYAN form.");
        setApplyOpen(true);
      }
    } else {
      setApplyOpen(true);
      toast.success("Fill the application form below.");
    }
  };

  const submitApplication = () => {
    try {
      const rec = {
        id: `${op.id}-${Date.now()}`,
        opportunityId: op.id,
        title: op.title,
        company: op.company,
        trust: op.trust,
        status: "Submitted",
        date: new Date().toISOString(),
        applicant,
        applyUrl: op.applyUrl || null
      };
      const existing = JSON.parse(localStorage.getItem("byan:applications") || "[]");
      localStorage.setItem("byan:applications", JSON.stringify([rec, ...existing]));
      toast.success("Application submitted on BYAN!");
      setApplyOpen(false);
    } catch {
      toast.error("Could not submit application.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header Banner */}
            <div className={`h-32 shrink-0 relative ${isScam ? 'bg-red-900/20' : 'bg-gradient-to-r from-red-600/10 to-blue-600/10'}`}>
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition z-10"
              >
                <X size={20} />
              </button>
              
              <div className="absolute -bottom-8 left-8">
                <div className="w-20 h-20 rounded-2xl bg-gray-800 border-4 border-gray-900 flex items-center justify-center text-2xl font-bold text-red-500 shadow-xl">
                  {op.company.charAt(0)}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-12">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{op.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={16} className="text-red-500" />
                      <span className="text-sm font-medium">{op.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} className="text-red-500" />
                      <span className="text-sm font-medium">{op.location} ({op.mode})</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${
                    isScam ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                    isVerified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                    'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {isScam ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                    <span className="font-bold">{op.trust}% Trust Score</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {isScam ? 'High Risk Detected' : isVerified ? 'Verified Opportunity' : 'Under Review'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Stipend</p>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <IndianRupee size={16} className="text-red-500" />
                    {op.stipend ? `₹${op.stipend}/mo` : 'Unpaid'}
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Duration</p>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Clock size={16} className="text-red-500" />
                    3 - 6 Months
                  </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Type</p>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Briefcase size={16} className="text-red-500" />
                    {op.type}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-white mb-3">About the Role</h3>
                  <p className="text-gray-400 leading-relaxed">{op.about}</p>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-white mb-3">Trust Analysis</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-gray-800">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                        <span className="text-sm text-gray-300">Company Registration Verified</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Verified</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-gray-800">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                        <span className="text-sm text-gray-300">Domain Authenticity Check</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Passed</span>
                    </div>
                    {isScam && (
                      <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                        <AlertTriangle size={18} className="text-red-500" />
                        <span className="text-sm text-red-400">Suspicious stipend-to-work ratio detected</span>
                      </div>
                    )}
                  </div>
                </section>
                
                {applyOpen && (
                  <section className="mt-6">
                    <h3 className="text-lg font-bold text-white mb-3">Apply on BYAN</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                        <input
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                          value={applicant.name}
                          onChange={(e)=>setApplicant({...applicant, name: e.target.value})}
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                        <input
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                          value={applicant.email}
                          onChange={(e)=>setApplicant({...applicant, email: e.target.value})}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
                        <input
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                          value={applicant.phone}
                          onChange={(e)=>setApplicant({...applicant, phone: e.target.value})}
                          placeholder="+91 ..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Cover Note</label>
                        <textarea
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition min-h-[100px]"
                          value={applicant.cover}
                          onChange={(e)=>setApplicant({...applicant, cover: e.target.value})}
                          placeholder="Briefly describe your fit for this role"
                        />
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>

            <div className="p-6 bg-gray-800/50 border-t border-gray-800 flex gap-4 shrink-0">
              <button 
                onClick={handleApply}
                disabled={isScam}
                className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isScam ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20'
                }`}
              >
                {op.applyMode === "EXTERNAL" ? "Apply on Recruiter Site" : "Apply on BYAN"} <ExternalLink size={18} />
              </button>
              {(op.applyMode === "BOTH" || op.applyMode === "EXTERNAL") && op.applyUrl && (
                <a
                  href={/^https?:\/\//i.test(op.applyUrl) ? op.applyUrl : `https://${op.applyUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-4 rounded-2xl font-bold border transition-all border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Open Company Site
                </a>
              )}
              <button 
                onClick={() => onSave(op)}
                className={`px-6 py-4 rounded-2xl font-bold border transition-all ${
                  isSaved ? 'bg-red-600/10 border-red-500/50 text-red-500' : 'border-gray-700 text-gray-400 hover:bg-gray-800'
                }`}
              >
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
            
            {applyOpen && (
              <div className="p-6 bg-gray-900 border-t border-gray-800 flex gap-3">
                <button 
                  onClick={submitApplication}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition"
                >
                  Submit Application on BYAN
                </button>
                <button 
                  onClick={()=>setApplyOpen(false)}
                  className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OpportunityDetailModal;
