// src/pages/home/HomePage.jsx
import React from 'react'
import { motion } from 'framer-motion'
import OpportunityCard from '../../shared/OpportunityCard'
import { Bot } from 'lucide-react'

const sample = [
  { id:'int-001', title:'Product Management Intern', company:'State Digital Office', location:'Bengaluru', stipend:15000, type:'Internship', about:'Work on youth outreach.' },
  { id:'int-002', title:'Frontend Intern', company:'CampusTech', location:'Remote', stipend:10000, type:'Internship', about:'Build UI components.' }
]

export default function HomePage({ openPage }){
  return (
    <main className="min-h-screen">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="py-16"
      >
        <div className="max-w-6xl mx-auto px-4 grid gap-10 lg:grid-cols-[3fr,2fr] items-center">
          <div className="space-y-5 text-left">
            <p className="text-sm md:text-lg font-semibold tracking-[0.25em] uppercase text-red-300">
              BYAN – Bharat Youth Authentic Network
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold gradient-text leading-tight">
              Bharat’s Youth Deserves
              <span className="block">Trusted Opportunities.</span>
            </h1>
            <p className="text-sm md:text-base text-muted max-w-xl">
              BYAN is India’s AI-powered Digital Trust Layer that verifies internships, detects scams, and improves resume success.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openPage('opportunities')}
                className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-500 font-semibold shadow-[0_0_20px_rgba(248,113,113,0.7)] transition"
              >
                Check Internship Safety
              </button>
              <button
                onClick={() => openPage('ats')}
                className="px-6 py-3 rounded-lg border border-red-500/60 bg-black/40 hover:bg-red-600/10 text-sm font-medium transition"
              >
                Analyze My Resume
              </button>
            </div>

            <div className="flex flex-wrap gap-4 pt-3 text-xs text-gray-400">
              <div>
                <p className="font-semibold text-red-400 text-sm">No Fake</p>
                <p>Scam-aware opportunity scanning</p>
              </div>
              <div>
                <p className="font-semibold text-red-400 text-sm">Only Future</p>
                <p>ATS-ready resume intelligence</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-black/70 border border-red-500/40 rounded-2xl p-5 shadow-[0_0_40px_rgba(248,113,113,0.45)]">
              <p className="text-xs uppercase tracking-wide text-red-300 mb-2">
                Live trust snapshot
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-black/60 rounded-xl p-4 border border-red-500/40">
                  <p className="text-xs text-gray-400">Targeted Students</p>
                  <p className="text-2xl font-bold text-red-400">10M+</p>
                </div>
                <div className="bg-black/60 rounded-xl p-4 border border-red-500/40">
                  <p className="text-xs text-gray-400">Scam Prevention Vision</p>
                  <p className="text-2xl font-bold text-red-400">₹100Cr+</p>
                </div>
                <div className="bg-black/60 rounded-xl p-4 border border-red-500/40">
                  <p className="text-xs text-gray-400">Verified Companies</p>
                  <p className="text-2xl font-bold text-red-400">10K+</p>
                </div>
                <div className="bg-black/60 rounded-xl p-4 border border-red-500/40">
                  <p className="text-xs text-gray-400">Trusted Matches</p>
                  <p className="text-2xl font-bold text-red-400">5L+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="py-10 border-t border-red-900/40 bg-black/40">
        <div className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-2 items-start">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-red-400">
              The Problem
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              India’s Youth Trust Crisis
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li>Fake internships and job scams rising rapidly</li>
              <li>₹500Cr+ lost annually in employment fraud</li>
              <li>60% resumes rejected due to ATS mismatch</li>
              <li>No centralized verified opportunity platform</li>
            </ul>
          </div>
          <div className="flex flex-col justify-center">
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-5 text-center shadow-[0_0_30px_rgba(248,113,113,0.35)]">
              <p className="text-sm font-semibold text-red-300">
                Talent exists. Trust does not.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid gap-10 md:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-red-400">
              Our Solution
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              BYAN – No Fake. Only Future.
            </h2>
            <p className="text-sm text-gray-300">
              We combine AI, verification rails, and risk modeling to turn every opportunity into a trust-scored experience for students.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-gray-200">
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
              <p>✔ Verify companies (CIN, GST, Domain, LinkedIn)</p>
            </div>
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
              <p>✔ Detect internship scams before damage</p>
            </div>
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
              <p>✔ Provide ATS Resume Score</p>
            </div>
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
              <p>✔ Match students with trusted opportunities</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-red-900/40 bg-black/40">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs uppercase tracking-[0.25em] text-red-400">
            How it works
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-6">
            From resume to verified opportunity in 5 steps
          </h2>
          <div className="grid gap-4 md:grid-cols-5 text-sm text-gray-200">
            {[
              "Student uploads resume",
              "AI extracts skills",
              "System verifies company data",
              "Dual score generated (ATS + Risk Score)",
              "Only verified opportunities shown"
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-black/70 border border-red-500/40 rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs uppercase tracking-[0.25em] text-red-400">
            Key Features
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-6">
            Built for India’s students, by India’s internet.
          </h2>
          <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-200">
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
              <p className="font-semibold mb-1">AI Scam Detection Engine</p>
              <p className="text-gray-400">Flags suspicious stipends, domains, and patterns before students apply.</p>
            </div>
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
              <p className="font-semibold mb-1">Company Authenticity Verification</p>
              <p className="text-gray-400">Cross-checks CIN, GST, website, and LinkedIn footprint.</p>
            </div>
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
              <p className="font-semibold mb-1">ATS Resume Analyzer</p>
              <p className="text-gray-400">Checks keyword fit and structure for better recruiter visibility.</p>
            </div>
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
              <p className="font-semibold mb-1">Smart Resume Builder</p>
              <p className="text-gray-400">AI-assisted templates tuned for campus hiring and ATS.</p>
            </div>
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
              <p className="font-semibold mb-1">AI Job Match Score</p>
              <p className="text-gray-400">Quantifies how well a resume maps to each opportunity.</p>
            </div>
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
              <p className="font-semibold mb-1">Verified Digital Youth Badge</p>
              <p className="text-gray-400">Badge for students engaging only with verified opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-red-900/40 bg-black/40">
        <div className="max-w-6xl mx-auto px-4 grid gap-10 lg:grid-cols-[3fr,2fr] items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-red-400">
              Impact
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
              Building India’s Youth Trust Infrastructure
            </h2>
            <p className="text-sm text-gray-300 max-w-xl">
              BYAN is designed as a long-term trust layer between students, universities, and employers. Every interaction moves youth closer to verified, scam-free careers.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
                <p className="text-xs text-gray-400">Students Targeted</p>
                <p className="text-2xl font-bold text-red-400">10M+</p>
              </div>
              <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
                <p className="text-xs text-gray-400">Scam Prevention Vision</p>
                <p className="text-2xl font-bold text-red-400">₹100Cr+</p>
              </div>
              <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
                <p className="text-xs text-gray-400">Verified Companies</p>
                <p className="text-2xl font-bold text-red-400">10K+</p>
              </div>
              <div className="bg-black/70 border border-red-500/40 rounded-xl p-4">
                <p className="text-xs text-gray-400">Trusted Matches</p>
                <p className="text-2xl font-bold text-red-400">5L+</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <h3 className="text-lg font-semibold mb-3">Featured opportunities</h3>
            <div className="grid gap-4">
              {sample.map(op => (
                <OpportunityCard
                  key={op.id}
                  op={op}
                  onView={() => openPage('opportunities')}
                  onSave={() => {}}
                  saved={false}
                />
              ))}
            </div>
            <div className="mt-4">
              <motion.button
                aria-label="View more opportunities"
                onClick={() => openPage('opportunities')}
                whileHover={{ 
                  x: [0, -1, 2, -2, 0], 
                  y: [0, -1, 1, -1, 0], 
                  filter: ['none','contrast(1.2)','contrast(0.9)','contrast(1.1)','none'] 
                }}
                transition={{ duration: 0.5 }}
                className="relative w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 shadow-[0_0_24px_rgba(248,113,113,0.55)] flex items-center justify-center overflow-hidden"
              >
                <Bot size={40} className="text-white relative z-10" />
                <span className="sr-only">View more opportunities</span>
                <motion.span 
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none mix-blend-screen"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: [0, 0.35, 0.15, 0.3, 0] }}
                  transition={{ duration: 0.5 }}
                  style={{ background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 4px)' }}
                />
                <motion.span 
                  aria-hidden="true"
                  className="absolute"
                  style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
                  whileHover={{ x: [-2, 2, -1, 1, 0], y: [0, -1, 1, 0, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Bot size={40} className="text-cyan-300 opacity-40" />
                </motion.span>
                <motion.span 
                  aria-hidden="true"
                  className="absolute"
                  style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
                  whileHover={{ x: [2, -2, 1, -1, 0], y: [0, 1, -1, 0, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Bot size={40} className="text-pink-300 opacity-40" />
                </motion.span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid gap-8 md:grid-cols-[3fr,2fr] items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-red-400">
              Vision
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              India’s official youth opportunity gateway.
            </h2>
            <p className="text-sm text-gray-300 max-w-xl">
              BYAN aims to work with universities, government schemes, and verified employers to become the single, trusted entry point for internships, apprenticeships, and early-career roles.
            </p>
          </div>
          <div className="flex md:justify-end">
            <div className="bg-black/70 border border-red-500/40 rounded-xl p-5 text-sm text-gray-300 max-w-md">
              <p className="font-semibold text-red-300 mb-2">Ready to build trust-first careers?</p>
              <p className="mb-4">
                Start by checking your next internship for safety or optimizing your resume for ATS.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => openPage('opportunities')}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-medium"
                >
                  Check Internship Safety
                </button>
                <button
                  onClick={() => openPage('ats')}
                  className="px-5 py-2 rounded-lg border border-red-500/60 bg-black/40 hover:bg-red-600/10 text-sm font-medium"
                >
                  Analyze My Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-red-900/60 bg-black/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
            <span>Team AURA</span>
            <span className="hidden md:inline">•</span>
            <span>Built at GTBIT</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => openPage('contact')} className="hover:text-red-300">
              Contact
            </button>
            <button onClick={() => openPage('privacy')} className="hover:text-red-300">
              Privacy Policy
            </button>
            <button onClick={() => openPage('terms')} className="hover:text-red-300">
              Terms
            </button>
          </div>
        </div>
      </footer>
    </main>
  )
}
