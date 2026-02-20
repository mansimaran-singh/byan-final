import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Zap, Layout, Moon, Sun, Search } from "lucide-react";

const templates = [
  { 
    id: "modern", 
    name: "Modern", 
    category: "Professional",
    tag: "Most Popular",
    features: ["Clean Typography", "Single Column", "Tech-Focused"],
    preview: "/images/templates/modern-preview.png" 
  },
  { 
    id: "minimal", 
    name: "Minimal", 
    category: "Minimal",
    tag: "ATS-Friendly",
    features: ["High Readability", "No Distractions", "Classic Serif"],
    preview: "/images/templates/minimal-preview.png" 
  },
  { 
    id: "elegant", 
    name: "Elegant", 
    category: "Professional",
    tag: "Executive",
    features: ["Sophisticated Spacing", "Subtle Accents", "Leadership Focus"],
    preview: "/images/templates/elegant-preview.png" 
  },
  { 
    id: "professional", 
    name: "Professional", 
    category: "Professional",
    tag: "Corporate",
    features: ["Standard Layout", "Blue Accents", "Industry Standard"],
    preview: "/images/templates/professional-preview.png" 
  },
  { 
    id: "creative", 
    name: "Creative", 
    category: "Creative",
    tag: "Designer Choice",
    features: ["Bold Colors", "Two-Column", "Portfolio Links"],
    preview: "/images/templates/creative-preview.png" 
  },
  { 
    id: "compact-ats", 
    name: "Compact ATS", 
    category: "Minimal",
    tag: "High Score",
    features: ["Dense Information", "Keyword Optimized", "Fast Scanning"],
    preview: "/images/templates/compact-ats-preview.png" 
  },
  { 
    id: "classic-professional", 
    name: "Classic Professional", 
    category: "Professional",
    tag: "Traditional",
    features: ["Time-Tested", "Academic Friendly", "Formal"],
    preview: "/images/templates/classic-professional-preview.png" 
  },
  { 
    id: "modern-professional", 
    name: "Modern Professional", 
    category: "Professional",
    tag: "New",
    features: ["Hybrid Layout", "Skill Bars", "Project Focus"],
    preview: "/images/templates/modern-professional-preview.png" 
  }
];

const categories = ["All", "Professional", "Creative", "Minimal"];

export default function TemplateSelectPage({ setTemplate }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredTemplates = templates.filter(t => 
    activeCategory === "All" || t.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.2em] uppercase text-red-400 font-bold">Step 1: Choose Foundation</p>
            <h1 className="text-4xl font-bold">Select a Template</h1>
            <p className="text-gray-400 max-w-xl">Pick a layout that best represents your career stage. All templates are AI-optimized for ATS compatibility.</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition flex items-center gap-2 text-sm font-medium"
            >
              {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-blue-400" />}
              {isDarkMode ? "Light Mode Previews" : "Dark Mode Previews"}
            </button>
          </div>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeCategory === cat 
                ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:border-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="aspect-[3/4] bg-gray-900/50 rounded-2xl animate-pulse border border-gray-800" />
            ))}
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="perspective-1000 group"
                >
                  <div 
                    className={`relative aspect-[3/4] preserve-3d transition-transform duration-700 cursor-pointer ${
                      selectedId === t.id ? "ring-4 ring-red-500 ring-offset-4 ring-offset-black shadow-[0_0_30px_rgba(239,68,68,0.4)]" : ""
                    } rounded-2xl`}
                    onClick={() => {
                      setSelectedId(t.id);
                      setTimeout(() => setTemplate(t.id), 400);
                    }}
                  >
                    {/* Front Side */}
                    <div className={`absolute inset-0 backface-hidden rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 transition-all duration-500 group-hover:rotate-y-180`}>
                      <div className={`h-full w-full ${isDarkMode ? "invert brightness-90 hue-rotate-180" : ""}`}>
                        <img 
                          src={t.preview} 
                          alt={t.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x400?text=Template+Preview";
                          }}
                        />
                      </div>
                      
                      {/* Tags */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="px-2 py-1 bg-red-600 text-[10px] font-bold uppercase tracking-wider rounded shadow-lg">
                          {t.tag}
                        </span>
                        {t.category === "Minimal" && (
                          <span className="px-2 py-1 bg-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded shadow-lg flex items-center gap-1">
                            <Zap size={10} /> ATS Ready
                          </span>
                        )}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <p className="text-lg font-bold">{t.name}</p>
                      </div>
                    </div>

                    {/* Back Side (Features) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border-2 border-red-500/50 bg-gray-900 p-6 flex flex-col justify-between transition-all duration-500 group-hover:rotate-y-0">
                      <div>
                        <div className="flex items-center gap-2 text-red-500 mb-4">
                          <Layout size={20} />
                          <span className="font-bold uppercase text-xs tracking-widest">Key Features</span>
                        </div>
                        <ul className="space-y-3">
                          {t.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                              <Check size={14} className="text-emerald-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="h-px bg-gray-800 w-full" />
                        <p className="text-center text-xs font-bold text-red-400 uppercase tracking-widest">Click to Select</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h3 className="font-bold text-gray-200">{t.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{t.category}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}