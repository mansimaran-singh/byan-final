import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Bookmark, Briefcase, Clock, ShieldCheck, Star, ArrowUpRight, Sparkles } from 'lucide-react'
import OpportunityCard from '../../shared/OpportunityCard'
import { opportunitiesList } from '../../data/opportunities'

export default function MyOpportunitiesPage({ openPage, savedJobs = [], onToggleSave = () => {} }) {
  // We now strictly use the savedJobs passed from the parent state.
  // No more hardcoded 'defaultIds' that override the user's actual empty state.
  const savedList = opportunitiesList.filter(op => savedJobs.includes(op.id))
  
  const activeApplications = [
    { id: 'int-001', title: 'Product Management Intern', company: 'State Digital Office', status: 'Interviewing', date: 'Feb 20', trust: 96 },
    { id: 'int-002', title: 'Frontend Intern', company: 'CampusTech', status: 'Applied', date: 'Feb 18', trust: 92 },
    { id: 'appr-001', title: 'Data Analytics Apprentice', company: 'Analytics for Bharat', status: 'Assessment', date: 'Feb 15', trust: 88 },
    { id: 'int-004', title: 'Backend Developer Intern', company: 'CloudScale', status: 'Applied', date: 'Feb 12', trust: 91 },
  ]

  // Recommendations are now strictly filtered to exclude anything already in your saved list
  const recommendations = opportunitiesList
    .filter(op => op.trust > 90 && !savedJobs.includes(op.id))
    .slice(0, 3)
    .map((op, idx) => ({
      ...op,
      matchReason: idx === 0 ? "Top Skill Match" : idx === 1 ? "Verified Company" : "High Growth Potential"
    }));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => openPage('dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">My Opportunities</h1>
            <p className="text-gray-400 mt-1">Manage your saved roles and track active applications.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <ShieldCheck className="text-emerald-500" size={20} />
            <span className="text-sm font-medium text-emerald-400">All Verified</span>
          </div>
        </div>

        <div className="space-y-12">
          {/* Saved Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Bookmark className="text-red-500" size={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Saved Opportunities ({savedList.length})</h2>
              </div>
              <button 
                onClick={() => openPage('opportunities')}
                className="text-sm font-medium text-red-500 hover:text-red-400 transition"
              >
                Browse more →
              </button>
            </div>
            
            {savedList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedList.map(op => (
                  <OpportunityCard 
                    key={op.id} 
                    op={op} 
                    saved={true} 
                    onSave={() => onToggleSave(op)}
                    trustScore={op.trust}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-900/30 border border-dashed border-gray-800 rounded-2xl p-12 text-center">
                <p className="text-gray-500">You haven't saved any opportunities yet.</p>
                <button 
                  onClick={() => openPage('opportunities')}
                  className="mt-4 text-red-500 font-bold hover:underline"
                >
                  Explore Opportunities
                </button>
              </div>
            )}
          </section>

          {/* Active Applications Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Briefcase className="text-blue-500" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Active Applications ({activeApplications.length})</h2>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 bg-black/20">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Opportunity</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trust Score</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {activeApplications.map(app => (
                    <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{app.title}</div>
                        <div className="text-sm text-gray-500">{app.company}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${app.trust}%` }} />
                          </div>
                          <span className="text-xs font-bold text-emerald-400">{app.trust}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {app.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recommended Section */}
          <section className="pb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Star className="text-amber-500" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Recommended for You</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map(op => (
                <motion.div 
                  key={op.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => openPage('opportunities')}
                  className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl backdrop-blur-sm flex flex-col justify-between group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Sparkles className="text-red-500" size={40} />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 flex items-center gap-1">
                        <ShieldCheck size={10} /> {op.trust}% Trust
                      </span>
                      <ArrowUpRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-[9px] font-bold uppercase text-red-400 tracking-widest">{op.matchReason}</span>
                      <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors leading-tight">{op.title}</h3>
                    </div>
                    
                    <p className="text-xs text-gray-400 font-medium">{op.company} • {op.location}</p>
                    <p className="text-xs text-gray-500 mt-3 line-clamp-2 leading-relaxed">{op.about}</p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                    <div className="text-xs font-bold text-white">
                      {op.stipend ? `₹${op.stipend}` : 'Unpaid'}
                    </div>
                    <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      {op.type} • {op.mode}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}