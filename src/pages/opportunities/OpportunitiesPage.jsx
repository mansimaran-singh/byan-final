import React, { useEffect, useMemo, useState } from 'react'
import OpportunityCard from '../../shared/OpportunityCard'
import Fuse from 'fuse.js'
import SkeletonCard from '../../shared/SkeletonCard'
import { opportunitiesList as list } from '../../data/opportunities'
import { motion, AnimatePresence } from 'framer-motion'

export default function OpportunitiesPage({ openDetail, savedJobs=[], onToggleSave=()=>{} }){
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterMode, setFilterMode] = useState('all')
  const [loading, setLoading] = useState(false)
  const [liveOps, setLiveOps] = useState([])

  const combined = useMemo(() => {
    const stored = Array.isArray(liveOps) ? liveOps : []
    const normalized = stored.map(op => ({
      id: op.id,
      title: op.title,
      company: op.company || "Live Company",
      location: op.location || "Remote",
      stipend: op.stipend || 0,
      type: op.type || "Internship",
      about: op.about || "",
      mode: op.mode || "Remote",
      trust: op.trust || 85,
      isLive: true,
      applyUrl: op.applyUrl,
      applyMode: op.applyMode || "BYAN",
      createdAt: op.createdAt || Date.now()
    }))
    return [...normalized, ...list]
  }, [liveOps])

  const fuse = useMemo(() => new Fuse(combined, { keys: ['title','company','about'], threshold: 0.35 }), [combined])

  useEffect(()=> {
    setLoading(true)
    const t = setTimeout(()=> setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(()=> {
    try {
      const stored = JSON.parse(localStorage.getItem("byan:liveOps") || "[]")
      setLiveOps(stored)
    } catch {}
  }, [])

  const results = useMemo(() => {
    let filtered = combined;
    if(query) {
      filtered = fuse.search(query).map(x=>x.item)
    }
    return filtered.filter(it => (filterType==='all' || it.type === filterType) && (filterMode==='all' || it.mode === filterMode))
  }, [query, filterType, filterMode, fuse, combined])

  return (
    <main className="min-h-screen py-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Sticky Filter Header */}
        <div className="sticky top-20 z-40 bg-black/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex gap-3 flex-1">
              <div className="relative flex-1">
                <input 
                  value={query} 
                  onChange={(e)=>setQuery(e.target.value)} 
                  placeholder="Search roles, company, skills..." 
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-red-500/50 outline-none transition-all" 
                />
                {query && (
                  <button 
                    onClick={()=>setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs font-bold"
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <select value={filterType} onChange={(e)=>setFilterType(e.target.value)} className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl outline-none text-sm font-medium focus:border-red-500/50 transition-colors">
                <option value="all">All Types</option>
                <option value="Internship">Internship</option>
                <option value="Apprenticeship">Apprenticeship</option>
              </select>

              <select value={filterMode} onChange={(e)=>setFilterMode(e.target.value)} className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl outline-none text-sm font-medium focus:border-red-500/50 transition-colors">
                <option value="all">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Opportunities</h2>
            <p className="text-sm text-gray-500 mt-1">Showing {results.length} verified listings</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5 text-emerald-500"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> Verified</div>
            <div className="flex items-center gap-1.5 text-amber-500"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div> Unverified</div>
            <div className="flex items-center gap-1.5 text-red-500"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div> Scam</div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {results.map((op, index) => (
                <motion.div
                  key={op.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <OpportunityCard 
                    op={op}
                    onView={() => openDetail(op)}
                    onSave={() => onToggleSave(op)}
                    saved={savedJobs.includes(op.id)}
                    trustScore={op.trust}
                    isMatching={query !== '' && (op.title.toLowerCase().includes(query.toLowerCase()) || op.company.toLowerCase().includes(query.toLowerCase()))}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && results.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-gray-600 mb-4">No opportunities found matching your criteria.</div>
            <button onClick={() => {setQuery(''); setFilterType('all'); setFilterMode('all');}} className="text-red-500 font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </main>
  )
}
