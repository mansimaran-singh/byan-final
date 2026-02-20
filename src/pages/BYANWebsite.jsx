import React, { useEffect, useState } from 'react'
import Nav from '../shared/Nav'
import HomePage from './home/HomePage'
import OpportunitiesPage from './opportunities/OpportunitiesPage'
import ResumeBuilderPage from './resume/ResumeBuilderPage'
import DashboardPage from './dashboard/DashboardPage'
import MyOpportunitiesPage from './dashboard/MyOpportunitiesPage'
import ContactPage from './ContactPage'
import HowItWorksPage from './HowItWorksPage'
import AboutPage from './AboutPage'
import FAQPage from './FAQPage'
import TermsPage from './TermsPage'
import PrivacyPage from './PrivacyPage'
import SavedDrawer from '../shared/SavedDrawer'
import { motion } from 'framer-motion'
import ATSPage from "./ats/ATSPage";
import AuthPage from "./auth/AuthPage";
import RecruiterDashboard from "./dashboard/RecruiterDashboard";
import PostOpportunityPage from "./opportunities/PostOpportunityPage";
import BYANAIWidget from "../components/BYANAIWidget";
import OpportunityDetailModal from "../components/OpportunityDetailModal";
import toast from 'react-hot-toast';

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 }
}

const DEFAULT_SAVED = ['int-001', 'int-002', 'appr-001', 'int-003', 'int-004', 'appr-002', 'int-005', 'int-006', 'int-007', 'int-008', 'appr-003', 'int-009'];

export default function BYANWebsite({ initialPage = 'home' }){
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      return localStorage.getItem('byan:page') || initialPage
    } catch {
      return initialPage
    }
  })

  const [authMode, setAuthMode] = useState('login')

  const [savedJobs, setSavedJobs] = useState(() => {
    try { 
      const saved = localStorage.getItem('byan:savedJobs');
      if (!saved) return DEFAULT_SAVED;
      const parsed = JSON.parse(saved);
      return parsed.length === 0 ? [] : parsed;
    }
    catch { return DEFAULT_SAVED }
  })

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedOp, setSelectedOp] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Sync user state and handle access control
  useEffect(() => {
    const storedUser = localStorage.getItem("byan:user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);

    const studentOnlyPages = ['opportunities', 'resume-builder', 'ats', 'dashboard', 'my-opportunities'];
    
    if (studentOnlyPages.includes(currentPage)) {
      if (!parsedUser) {
        toast.error("Please login as a student to access this feature.");
        setAuthMode('login');
        setCurrentPage('auth');
      } else if (parsedUser.role !== 'student') {
        toast.error("This feature is reserved for students.");
        setCurrentPage('recruiter-dashboard');
      }
    }
  }, [currentPage]);

  useEffect(()=>{
    try{ localStorage.setItem('byan:page', currentPage) }catch{}
  }, [currentPage])

  useEffect(()=>{
    try{ localStorage.setItem('byan:savedJobs', JSON.stringify(savedJobs)) }catch{}
  }, [savedJobs])

  const toggleSave = (op) => {
    const id = typeof op === 'string' ? op : op.id
    setSavedJobs(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id])
  }

  const openDetailFromList = (op) => {
    setSelectedOp(op)
    setIsDetailOpen(true)
  }

  const render = () => {
    switch(currentPage){
      case 'home': return <HomePage openPage={setCurrentPage} />
      case 'opportunities': return <OpportunitiesPage openDetail={openDetailFromList} savedJobs={savedJobs} onToggleSave={toggleSave} />
      case 'resume-builder': return <ResumeBuilderPage />
      case 'ats': return <ATSPage />
      case 'dashboard': return <DashboardPage openPage={setCurrentPage} savedJobs={savedJobs} />
      case 'my-opportunities': return <MyOpportunitiesPage openPage={setCurrentPage} savedJobs={savedJobs} onToggleSave={toggleSave} />
      case 'contact': return <ContactPage />
      case 'how-it-works': return <HowItWorksPage />
      case 'about': return <AboutPage />
      case 'faq': return <FAQPage />
      case 'terms': return <TermsPage />
      case 'privacy': return <PrivacyPage />
      case 'auth': return <AuthPage openPage={setCurrentPage} initialMode={authMode} />
      
      // RECRUITER PAGES
      case 'recruiter-dashboard': return <RecruiterDashboard openPage={setCurrentPage} />
      case 'post-opportunity': return <PostOpportunityPage openPage={setCurrentPage} />

      default: return <HomePage openPage={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen text-white bg-black">
      <Nav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setAuthMode={setAuthMode}
        savedCount={savedJobs.length}
        onOpenSaved={() => setDrawerOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-3 pb-8">
        <motion.div
          key={currentPage}
          initial="initial"
          animate="enter"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {render()}
        </motion.div>
      </div>

      <SavedDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        savedJobIds={savedJobs}
        onToggleSave={toggleSave}
      />

      <OpportunityDetailModal 
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        op={selectedOp}
        onSave={toggleSave}
        isSaved={selectedOp ? savedJobs.includes(selectedOp.id) : false}
      />

      {/* Floating AI Widget - Only for students */}
      {user?.role === 'student' && (
        <BYANAIWidget onOpenOpportunity={openDetailFromList} />
      )}
    </div>
  )
}