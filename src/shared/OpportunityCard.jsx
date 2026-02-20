import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, ShieldCheck, AlertTriangle, Check, Bookmark } from 'lucide-react'

export default function OpportunityCard({ op, onView=()=>{}, onSave=()=>{}, saved=false, trustScore=92, isMatching=false }){
  const isScam = trustScore < 50;
  const isUnverified = trustScore >= 50 && trustScore < 75;
  const isVerified = trustScore >= 75;

  const trustColor = isScam ? 'bg-red-500' : isUnverified ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <motion.article 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.7)' }} 
      className={`relative bg-gray-900 border rounded-2xl p-6 transition-all duration-300 overflow-hidden flex flex-col h-full ${
        isMatching ? 'ring-2 ring-red-500/50 bg-gray-800/80' : 'border-gray-800'
      } ${isScam ? 'caution-stripes border-red-500/30' : ''}`}
    >
      {/* Days Ago Tag */}
      <div className="absolute top-4 right-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
          {op.isLive || (op.id && op.id.startsWith('live-')) ? 'Live' : (op.id.includes('001') ? 'New' : '2d ago')}
        </span>
      </div>

      <div className="flex items-start gap-4 mb-4">
        {/* Company Logo Placeholder */}
        <div className="w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 overflow-hidden">
          <div className="text-lg font-bold text-gray-600">
            {op.company.charAt(0)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold truncate">{op.title}</h3>
            {isScam && (
              <span className="px-2 py-0.5 bg-red-600 text-[10px] font-bold uppercase rounded text-white flex items-center gap-1">
                <ShieldAlert size={10} /> SCAM
              </span>
            )}
          </div>
          <p className="text-sm text-muted truncate">{op.company} • <span className="text-gray-300">{op.location}</span></p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
            isScam ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 
            isUnverified ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 
            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          }`}>
            {isScam ? <AlertTriangle size={10} /> : isUnverified ? <AlertTriangle size={10} /> : <ShieldCheck size={10} />}
            {trustScore}% Trust
          </div>
          <div className="text-xs text-gray-400">{isScam ? 'High Risk' : isUnverified ? 'Unverified' : 'Verified'}</div>
        </div>

        <div className="text-right">
          <div className="font-bold text-white">{op.stipend ? `₹${op.stipend}` : 'Unpaid'}</div>
          <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">{op.type}</div>
        </div>
      </div>

      <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">{op.about}</p>

      <div className="mt-auto flex items-center gap-3">
        <button 
          onClick={()=>onView(op)} 
          className={`flex-1 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            isScam ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 
            isVerified ? 'bg-red-600 hover:bg-red-500 text-white animate-shimmer' : 
            'bg-red-600 hover:bg-red-500 text-white'
          }`}
          disabled={isScam}
        >
          {isScam ? 'Blocked' : 'View Details'}
        </button>
        
        <button 
          onClick={()=>onSave(op)} 
          className={`px-4 py-2.5 border rounded-xl transition-all duration-300 flex items-center gap-2 ${
            saved ? 'bg-red-600/10 border-red-500/50 text-red-500' : 'border-gray-700 text-gray-400 hover:bg-gray-800'
          }`}
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.div
                key="saved"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Check size={18} />
                <span className="text-sm font-bold">Saved</span>
              </motion.div>
            ) : (
              <motion.div
                key="save"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Bookmark size={18} />
                <span className="text-sm font-bold">Save</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Trust Score Underline */}
      <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${trustColor}`} style={{ width: `${trustScore}%` }} />
    </motion.article>
  )
}
