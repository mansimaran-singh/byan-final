"use client";

import React, { useEffect, useState } from 'react'
import { Shield, Menu, X, LogOut, User, PlusCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Nav({ currentPage, setCurrentPage, setAuthMode, savedCount = 0, onOpenSaved = ()=>{} }){
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("byan:user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setUser(null)
    }
  }, [currentPage])

  const handleLogout = () => {
    localStorage.removeItem("byan:token")
    localStorage.removeItem("byan:user")
    setUser(null)
    toast.success("Logged out successfully")
    setCurrentPage("home")
  }

  const isRecruiter = user?.role === "recruiter";

  // Define navigation items based on auth status
  let navItems = [{ id: 'home', label: 'Home' }];
  
  if (user) {
    if (isRecruiter) {
      navItems = [
        ...navItems,
        { id: 'recruiter-dashboard', label: 'Dashboard' },
        { id: 'post-opportunity', label: 'Post Job' },
      ];
    } else {
      navItems = [
        ...navItems,
        { id: 'opportunities', label: 'Opportunities' },
        { id: 'resume-builder', label: 'Resume Builder' },
        { id: 'ats', label: 'ATS Check' },
        { id: 'dashboard', label: 'Dashboard' },
      ];
    }
  }

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="border-b border-red-900/60 bg-black/80 backdrop-blur-md sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div onClick={() => { setCurrentPage('home'); setOpen(false) }} className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-500/20 group-hover:bg-red-600/20 transition">
            <Shield className="text-red-500" size={24} />
          </div>
          <div className="font-bold text-xl tracking-tight text-white">BYAN</div>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${currentPage === item.id ? 'text-red-500 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {/* Only show saved drawer for logged in students */}
          {user && !isRecruiter && (
            <button onClick={onOpenSaved} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition relative">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M5 3v18l7-5 7 5V3H5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {savedCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">{savedCount}</span>}
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2 ml-2 pl-4 border-l border-gray-800">
              <button onClick={() => setCurrentPage(isRecruiter ? 'recruiter-dashboard' : 'dashboard')} className="w-9 h-9 bg-gray-800 rounded-full overflow-hidden flex items-center justify-center text-gray-400 hover:text-white transition">
                <User size={20} />
              </button>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition" title="Logout"><LogOut size={20} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setAuthMode('login'); setCurrentPage('auth'); }} 
                className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white transition"
              >
                Login
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setCurrentPage('auth'); }} 
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-red-600/20"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        <button className="md:hidden p-2 text-gray-400" onClick={() => setOpen(o => !o)}>{open ? <X /> : <Menu />}</button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-6 space-y-1 bg-black border-t border-gray-900">
          {navItems.map(item => (
            <button key={item.id} className={`block w-full text-left px-4 py-3 rounded-xl text-base font-medium ${currentPage === item.id ? 'text-red-500 bg-red-500/10' : 'text-gray-400'}`} onClick={() => { setCurrentPage(item.id); setOpen(false) }}>{item.label}</button>
          ))}
          <div className="pt-4 mt-4 border-t border-gray-900">
            {user ? (
              <button className="flex items-center gap-3 w-full px-4 py-3 text-red-500 font-bold" onClick={handleLogout}>
                <LogOut size={20} /> Logout
              </button>
            ) : (
              <div className="space-y-2 px-4">
                <button 
                  className="w-full py-3 text-gray-400 font-bold" 
                  onClick={() => { setAuthMode('login'); setCurrentPage('auth'); setOpen(false) }}
                >
                  Login
                </button>
                <button 
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-xl" 
                  onClick={() => { setAuthMode('signup'); setCurrentPage('auth'); setOpen(false) }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  )
}