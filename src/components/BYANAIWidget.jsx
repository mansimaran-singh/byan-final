"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Zap, User, Briefcase, AlertCircle, Upload, Loader2, FileText, ExternalLink } from 'lucide-react';
import { opportunitiesList } from '../data/opportunities';
import { extractKeywords } from '../utils/atsEngine';
import * as pdfjs from "pdfjs-dist";
import toast from 'react-hot-toast';

const PDFJS_VERSION = '5.4.624';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

export default function BYANAIWidget({ onOpenOpportunity }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi! I'm BYAN AI. Upload your resume (PDF) and I'll instantly match you with the best opportunities on our portal!" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const ROBOT_SRC = "/images/robot.png";
  const iconInputRef = useRef(null);
  const [aiIconUrl, setAiIconUrl] = useState(() => {
    try { return localStorage.getItem("byan:aiIcon") || ROBOT_SRC } catch { return ROBOT_SRC }
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("byan:user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!user || user.role !== 'student') return null;

  const calculateMatchScore = (userSkills, job) => {
    const jobText = (job.about + " " + job.title).toLowerCase();
    const jobKeywords = extractKeywords(jobText);
    
    if (jobKeywords.length === 0) return { score: 0, matchedSkills: [] };

    const matchedSkills = jobKeywords.filter(kw => userSkills.includes(kw));
    
    // Category matching to prevent "Go/Rust" matching "UI/UX"
    const categories = {
      design: ['ui', 'ux', 'figma', 'design', 'adobe', 'creative', 'sketch'],
      frontend: ['react', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'frontend'],
      backend: ['node', 'express', 'python', 'go', 'rust', 'java', 'backend', 'sql', 'mongodb'],
      data: ['data', 'python', 'machine learning', 'ai', 'statistics', 'sql']
    };

    let categoryBonus = 0;
    const jobTitleLower = job.title.toLowerCase();
    
    for (const [cat, keywords] of Object.entries(categories)) {
      const isJobInCat = keywords.some(kw => jobTitleLower.includes(kw));
      const hasUserSkillsInCat = keywords.some(kw => userSkills.includes(kw));
      if (isJobInCat && hasUserSkillsInCat) {
        categoryBonus = 30;
        break;
      }
    }

    const baseScore = (matchedSkills.length / jobKeywords.length) * 60;
    const finalScore = Math.min(98, Math.round(baseScore + categoryBonus + 10));

    return { score: finalScore, matchedSkills };
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      try { localStorage.setItem("byan:aiIcon", url); } catch {}
      setAiIconUrl(url);
      toast.success("AI icon updated");
    };
    reader.onerror = () => toast.error("Failed to read image");
    reader.readAsDataURL(file);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setMessages(prev => [...prev, { role: 'user', content: `Uploaded: ${file.name}` }]);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let extractedText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        extractedText += content.items.map(item => item.str).join(" ") + "\n";
      }

      runAnalysis(extractedText);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "❌ Sorry, I couldn't read that PDF. Please try another file." }]);
    } finally {
      setIsExtracting(false);
    }
  };

  const runAnalysis = (resumeText) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const userSkills = extractKeywords(resumeText);
      const expLevel = resumeText.length > 1200 ? "Experienced" : "Fresher";
      
      const matches = opportunitiesList.map(job => {
        const { score, matchedSkills } = calculateMatchScore(userSkills, job);
        return { ...job, score, matchedSkills };
      })
      .filter(job => job.score >= 50)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

      setMessages(prev => [
        ...prev, 
        { 
          role: 'ai', 
          type: 'analysis',
          content: `👤 Profile Analysis:\n- Skills: ${userSkills.slice(0, 5).join(", ")}\n- Stage: ${expLevel}`,
          matches: matches
        }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[420px] h-[550px] bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">BYAN AI</h3>
                  <p className="text-[10px] text-red-100">Intelligent Career Matcher</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-red-600 text-white rounded-tr-none' 
                    : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700'
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm">{msg.content}</pre>
                  </div>
                  
                  {msg.matches && (
                    <div className="mt-3 w-full space-y-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Top Matches Found</p>
                      {msg.matches.map(m => (
                        <div key={m.id} className="bg-gray-800/50 border border-gray-700 p-3 rounded-xl flex items-center justify-between group hover:border-red-500/50 transition-all">
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                            <p className="text-[10px] text-gray-400">{m.company} • {m.score}% Match</p>
                          </div>
                          <button 
                            onClick={() => {
                              if (onOpenOpportunity) onOpenOpportunity(m);
                              else toast.error("Please go to the Opportunities page to view details.");
                            }}
                            className="p-2 bg-red-600/10 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                          >
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {(isTyping || isExtracting) && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-red-500" />
                    <span className="text-xs text-gray-400">{isExtracting ? "Extracting text..." : "Analyzing matches..."}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-900/50">
              <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              <input type="file" accept="image/*" className="hidden" ref={iconInputRef} onChange={handleIconUpload} />
              <div className="flex gap-2 mb-4">
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-white text-black hover:bg-gray-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg">
                  <Upload size={14} /> Upload PDF
                </button>
                <button 
                  onClick={() => {
                    const draft = localStorage.getItem("byan:draft_resume");
                    if (draft) runAnalysis(draft);
                    else toast.error("No draft resume found.");
                  }}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                >
                  <Zap size={14} /> Use Draft
                </button>
                <button 
                  onClick={() => iconInputRef.current?.click()}
                  className="py-3 px-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-gray-700"
                >
                  <Sparkles size={14} /> Set Icon
                </button>
              </div>
              <div className="relative">
                <input 
                  className="w-full pl-4 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white outline-none focus:border-red-500 transition"
                  placeholder="Ask me anything..."
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"><Send size={18} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={isOpen ? {} : { y: [0, -4, 0, 3, 0] }}
        transition={isOpen ? { } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl bg-red-600 shadow-lg shadow-red-600/40 flex items-center justify-center text-white relative overflow-hidden group"
      >
        <motion.span 
          aria-hidden="true"
          className="absolute inset-0 -z-0"
          style={{ background: 'radial-gradient(closest-side, rgba(248,113,113,0.18), transparent 70%)' }}
          animate={isOpen ? {} : { scale: [1, 1.06, 1] , opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div 
              key="close" 
              initial={{ rotate: -90, opacity: 0 }} 
              animate={{ rotate: 0, opacity: 1 }} 
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={30} />
            </motion.div>
          ) : (
            <motion.div 
              key="open-msg" 
              initial={{ rotate: 90, opacity: 0 }} 
              animate={{ rotate: 0, opacity: 1, y: [0, -1, 0, 1, 0] }} 
              exit={{ rotate: -90, opacity: 0 }} 
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} 
              className="relative z-10"
            >
              <MessageSquare size={28} />
            </motion.div>
          )}
        </AnimatePresence>
        {aiIconUrl && (
          <motion.span 
            aria-hidden="true"
            className="absolute inset-0 mix-blend-screen"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: [0, 0.45, 0.2, 0.35, 0] }}
            transition={{ duration: 0.5 }}
            style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 4px)' }}
          />
        )}
        <motion.span 
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 bottom-2 w-10 h-2 rounded-full blur-[4px] bg-red-600/30"
          animate={isOpen ? {} : { scaleX: [1, 0.9, 1.05, 1], opacity: [0.5, 0.6, 0.45, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span 
          aria-hidden="true"
          className="absolute left-3 bottom-2 w-1 h-1 rounded-full bg-red-400/70"
          animate={isOpen ? {} : { y: [6, -10], opacity: [0.0, 0.8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.span 
          aria-hidden="true"
          className="absolute right-3 bottom-3 w-[3px] h-[3px] rounded-full bg-pink-400/70"
          animate={isOpen ? {} : { y: [8, -12], opacity: [0.0, 0.7, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
        />
        <motion.span 
          aria-hidden="true"
          className="absolute left-5 bottom-4 w-[3px] h-[3px] rounded-full bg-cyan-400/70"
          animate={isOpen ? {} : { y: [7, -11], opacity: [0.0, 0.75, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: 0.8 }}
        />
        
      </motion.button>
    </div>
  );
}
