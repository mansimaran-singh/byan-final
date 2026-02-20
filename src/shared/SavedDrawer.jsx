// src/shared/SavedDrawer.jsx
import React from 'react'
import { motion } from 'framer-motion'

export default function SavedDrawer({ open=false, onClose=()=>{}, savedJobIds=[], onToggleSave=()=>{} }){
  return (
    <motion.aside
      initial={{ x: '100%' }}
      animate={{ x: open ? 0 : '100%' }}
      transition={{ type: 'tween', duration: 0.22 }}
      className="fixed top-0 right-0 h-full w-full md:w-96 bg-gray-900 border-l border-gray-800 z-50 p-6"
      style={{ boxShadow: '-20px 0 40px rgba(0,0,0,0.6)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Saved Opportunities</h3>
        <button onClick={onClose} className="text-gray-400">Close</button>
      </div>

      {savedJobIds.length === 0 ? (
        <div className="text-gray-400">You have no saved opportunities yet.</div>
      ) : (
        <ul className="space-y-3">
          {savedJobIds.map(id => (
            <li key={id} className="bg-gray-800 p-3 rounded flex items-center justify-between">
              <div>
                <div className="font-semibold">Opportunity {id}</div>
                <div className="text-sm text-gray-400">Saved ID</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>onToggleSave(id)} className="px-3 py-1 rounded border">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.aside>
  )
}
