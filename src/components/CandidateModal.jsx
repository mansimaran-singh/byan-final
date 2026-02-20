"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin, ShieldCheck, GraduationCap, Briefcase, Award, Zap, Download, Loader2, UserCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const CandidateModal = ({ isOpen, onClose, candidate, onShortlist }) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!candidate) return null;

  const handleDownloadCV = () => {
    setIsDownloading(true);
    const loadingToast = toast.loading(`Generating CV for ${candidate.name}...`);

    try {
      const doc = new jsPDF();
      
      // Set font styles
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(33, 33, 33);
      doc.text(candidate.name, 20, 25);

      // Contact Info
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`${candidate.email}  |  +91 98765 43210  |  New Delhi, India`, 20, 33);
      
      // Horizontal Line
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 38, 190, 38);

      // Professional Summary
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38); // Red-600
      doc.text("PROFESSIONAL SUMMARY", 20, 50);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const summary = "Highly motivated student with a strong foundation in modern web technologies. Passionate about building scalable applications and solving complex problems through clean, efficient code. Proven ability to work in fast-paced environments and contribute to open-source projects.";
      const splitSummary = doc.splitTextToSize(summary, 170);
      doc.text(splitSummary, 20, 57);

      // Skills
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38);
      doc.text("TECHNICAL SKILLS", 20, 80);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.text("React, Node.js, Tailwind CSS, Python, JavaScript, Git, MongoDB, Express.js", 20, 87);

      // Education
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38);
      doc.text("EDUCATION", 20, 105);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(33, 33, 33);
      doc.text("B.Tech in Computer Science", 20, 112);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("GTBIT, New Delhi  |  2021 - 2025", 20, 117);

      // Experience
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38);
      doc.text("EXPERIENCE", 20, 135);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(33, 33, 33);
      doc.text("Open Source Contributor", 20, 142);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("GitHub  |  6 Months", 20, 147);
      
      doc.setTextColor(60, 60, 60);
      const expDesc = "• Contributed to various React-based open source projects.\n• Improved documentation and fixed critical UI bugs.\n• Collaborated with global developers via pull requests and code reviews.";
      doc.text(expDesc, 20, 154);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Generated via BYAN - Bharat Youth Authentic Network", 105, 285, { align: "center" });

      doc.save(`${candidate.name.replace(/\s+/g, '_')}_Resume.pdf`);
      toast.success("CV Downloaded!", { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate CV", { id: loadingToast });
    } finally {
      setIsDownloading(false);
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header / Banner */}
            <div className="h-32 bg-gradient-to-r from-red-600/20 to-blue-600/20 relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition z-10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8 -mt-12 relative">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div className="flex items-end gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-gray-800 border-4 border-gray-900 flex items-center justify-center text-3xl font-bold text-red-500 shadow-xl">
                    {candidate.name.charAt(0)}
                  </div>
                  <div className="pb-2">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      {candidate.name}
                      {candidate.trust === 'Verified' && <ShieldCheck className="text-emerald-500" size={20} />}
                    </h2>
                    <p className="text-gray-400 text-sm">{candidate.role} Applicant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                  <Zap size={16} className="text-emerald-500" />
                  <span className="text-sm font-bold text-emerald-400">{candidate.score}% Match</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Contact & Stats */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact Info</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Mail size={14} className="text-gray-500" /> {candidate.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Phone size={14} className="text-gray-500" /> +91 98765 43210
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <MapPin size={14} className="text-gray-500" /> New Delhi, India
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Top Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Node.js', 'Tailwind', 'Python'].map(skill => (
                        <span key={skill} className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-[10px] font-bold text-gray-400 uppercase">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Bio & Experience */}
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Professional Summary</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Highly motivated student with a strong foundation in modern web technologies. 
                      Passionate about building scalable applications and solving complex problems 
                      through clean, efficient code.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white">
                      <GraduationCap size={18} className="text-red-500" />
                      <h3 className="text-sm font-bold">Education</h3>
                    </div>
                    <div className="pl-6 border-l border-gray-800 space-y-1">
                      <p className="text-sm font-bold text-white">B.Tech in Computer Science</p>
                      <p className="text-xs text-gray-500">GTBIT, New Delhi • 2021 - 2025</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white">
                      <Briefcase size={18} className="text-blue-500" />
                      <h3 className="text-sm font-bold">Experience</h3>
                    </div>
                    <div className="pl-6 border-l border-gray-800 space-y-1">
                      <p className="text-sm font-bold text-white">Open Source Contributor</p>
                      <p className="text-xs text-gray-500">GitHub • 6 Months</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800 flex gap-3">
                <button 
                  onClick={() => onShortlist(candidate)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  <UserCheck size={18} />
                  Shortlist Candidate
                </button>
                <button 
                  onClick={handleDownloadCV}
                  disabled={isDownloading}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition flex items-center gap-2"
                >
                  {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                  Download CV
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CandidateModal;