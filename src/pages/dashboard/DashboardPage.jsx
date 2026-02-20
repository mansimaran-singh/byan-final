import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Bookmark, Zap, CheckCircle2, Clock, ArrowUpRight, Star } from 'lucide-react'
import { opportunitiesList } from '../../data/opportunities'

export default function DashboardPage({ openPage, savedJobs = [] }) {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedUser = localStorage.getItem("byan:user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || "User");
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  const recommendations = opportunitiesList
    .filter(op => op.trust > 90 && !savedJobs.includes(op.id))
    .slice(0, 3);

  // Map saved jobs to activity for a more dynamic feel
  const activities = opportunitiesList
    .filter(op => savedJobs.includes(op.id))
    .slice(0, 4)
    .map((op, idx) => ({
      id: op.id,
      role: op.title,
      company: op.company,
      status: idx === 0 ? "Interviewing" : idx === 1 ? "Applied" : "Saved",
      date: "Feb " + (20 - idx),
      color: idx === 0 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : 
             idx === 1 ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : 
             "text-gray-400 bg-gray-500/10 border-gray-500/20"
    }));

  return (
    <main className="min-h-screen py-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {userName}</h1>
            <p className="text-gray-400 mt-1">Here's what's happening with your career journey today.</p>
          </div>
          <button 
            onClick={() => openPage('ats')}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition shadow-lg shadow-red-600/20 flex items-center gap-2"
          >
            <Zap size={18} />
            Boost Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -4 }} onClick={() => openPage('my-opportunities')} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm cursor-pointer group hover-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors"><Bookmark className="text-red-500" size={20} /></div>
              <span className="text-xs font-medium text-red-400">Updated live</span>
            </div>
            <div className="text-2xl font-bold text-white">{savedJobs.length}</div>
            <div className="text-sm text-gray-400">Saved Opportunities</div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} onClick={() => openPage('my-opportunities')} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm cursor-pointer group hover-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors"><Briefcase className="text-blue-500" size={20} /></div>
              <span className="text-xs font-medium text-blue-400">Active tracking</span>
            </div>
            <div className="text-2xl font-bold text-white">{activities.filter(a => a.status !== 'Saved').length}</div>
            <div className="text-sm text-gray-400">Active Applications</div>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} onClick={() => openPage('resume-builder')} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm cursor-pointer group hover-glow transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors"><CheckCircle2 className="text-emerald-500" size={20} /></div>
              <span className="text-xs font-medium text-emerald-400">+5% from last week</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold text-white">85%</div>
                <div className="text-sm text-gray-400">Profile Strength</div>
              </div>
              <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Clock size={20} className="text-gray-400" /> Recent Activity</h2>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
              {activities.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Opportunity</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {activities.map((act) => (
                      <tr key={act.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{act.role}</div>
                          <div className="text-sm text-gray-500">{act.company}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${act.color}`}>{act.status}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{act.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center space-y-4">
                  <p className="text-gray-500">No recent activity. Save some opportunities to see them here!</p>
                  <button 
                    onClick={() => openPage('opportunities')}
                    className="px-6 py-2 bg-red-600/10 border border-red-500/20 text-red-500 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all animate-pulse-soft"
                  >
                    Explore Opportunities
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Star size={20} className="text-red-500" /> Recommended</h2>
            <div className="space-y-3">
              {recommendations.map((job) => (
                <motion.div key={job.id} whileHover={{ x: 4 }} onClick={() => openPage('opportunities')} className="p-4 bg-gray-900/50 border border-gray-800 rounded-2xl backdrop-blur-sm flex items-center justify-between group cursor-pointer hover-glow transition-all">
                  <div>
                    <div className="font-medium text-white group-hover:text-red-400 transition-colors">{job.title}</div>
                    <div className="text-xs text-gray-500">{job.location} • {job.trust}% Trust</div>
                  </div>
                  <ArrowUpRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}