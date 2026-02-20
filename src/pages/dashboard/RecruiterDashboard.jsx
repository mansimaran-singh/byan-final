import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Briefcase, Users, ShieldCheck, ArrowUpRight, Building2, MoreVertical, Eye, ChevronLeft, FileText, CheckCircle2, XCircle, Search, Filter, Download, Star, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import CandidateModal from '../../components/CandidateModal';

// --- DIVERSE DUMMY DATA ---
const ALL_JOBS = [
  { id: 'p1', title: 'Frontend Developer Intern', applicants: 32, status: 'Active', date: '2 days ago', type: 'Internship', department: 'Engineering' },
  { id: 'p2', title: 'UI/UX Design Apprentice', applicants: 30, status: 'Reviewing', date: '5 days ago', type: 'Apprenticeship', department: 'Design' },
  { id: 'p3', title: 'Backend Node.js Intern', applicants: 28, status: 'Active', date: '1 week ago', type: 'Internship', department: 'Engineering' },
  { id: 'p4', title: 'Data Science Research Intern', applicants: 29, status: 'Active', date: '3 days ago', type: 'Internship', department: 'Data' },
  { id: 'p5', title: 'Product Management Apprentice', applicants: 27, status: 'Closed', date: '2 weeks ago', type: 'Apprenticeship', department: 'Product' },
  { id: 'p6', title: 'Blockchain Developer Intern', applicants: 26, status: 'Active', date: '1 day ago', type: 'Internship', department: 'Web3' },
  { id: 'p7', title: 'Motion Graphics Intern', applicants: 28, status: 'Reviewing', date: '4 days ago', type: 'Internship', department: 'Design' },
  { id: 'p8', title: 'HR Operations Apprentice', applicants: 25, status: 'Active', date: '6 days ago', type: 'Apprenticeship', department: 'People' },
  { id: 'p9', title: 'Cybersecurity Intern', applicants: 27, status: 'Active', date: '12 hours ago', type: 'Internship', department: 'Security' },
  { id: 'p10', title: 'Growth Marketing Intern', applicants: 26, status: 'Active', date: '1 week ago', type: 'Internship', department: 'Marketing' },
  { id: 'p11', title: 'DevOps Engineer Intern', applicants: 25, status: 'Active', date: '3 days ago', type: 'Internship', department: 'Infrastructure' },
  { id: 'p12', title: 'Mobile App Developer (Flutter)', applicants: 28, status: 'Active', date: '5 days ago', type: 'Internship', department: 'Engineering' },
];

// Helper to generate unique applicants for each job
const generateApplicants = () => {
  const firstNames = [
    "Aarav", "Vihaan", "Vivaan", "Ananya", "Diya", "Advait", "Sai", "Ishani", "Myra", "Krishna", "Saanvi", "Ihaan", "Atharv", "Reyansh", "Aaryan", "Ishaan", "Arjun", "Kabir", "Aryan", "Kyra", "Pari", "Riya", "Shreya", "Tanisha", "Zara", "Aavya", "Abeer", "Adah", "Aditi", "Advika", "Ahana", "Alisha", "Amara", "Amaya", "Anika", "Anvi", "Aradhya", "Arya", "Avni", "Bhavya", "Chahat", "Drishti", "Esha", "Falguni", "Gia", "Hana", "Idhika", "Jiya", "Kaira", "Lekha", "Mahi", "Navya", "Ojaswi", "Prisha", "Rachit", "Sarthak", "Tushar", "Utkarsh", "Vaibhav", "Yash", "Zayan", "Abhay", "Bhuvan", "Chetan", "Daksh", "Eklavya", "Farhan", "Gautam", "Omkar", "Parth", "Ranbir", "Siddharth", "Tanmay", "Uday", "Varun", "Waseem", "Yuvraj", "Zeeshan", "Aditya", "Brijesh", "Chirag", "Darshan", "Ehsaan", "Girish", "Harish", "Inderjeet", "Jatin", "Kunal", "Manish", "Nitin", "Pankaj", "Qadir", "Ritesh", "Suresh", "Tarun", "Umesh", "Vikas", "Waman", "Yogesh", "Zuber"
  ];
  
  const lastNames = [
    "Sharma", "Gupta", "Mehra", "Iyer", "Kapoor", "Nair", "Reddy", "Verma", "Singh", "Patel", "Malhotra", "Joshi", "Bhat", "Das", "Khan", "Bose", "Saxena", "Mishra", "Pandey", "Gill", "Shah", "Sen", "Ghoshal", "Mukherjee", "Sheikh", "Rao", "Chawla", "Chopra", "Roy", "Bansal", "Kulkarni", "Bajaj", "Sethi", "Thakur", "Chauhan", "Deshmukh", "Grewal", "Hegde", "Jain", "Khanna", "Luthra", "Mahajan", "Narang", "Oberoi", "Puri", "Qureshi", "Rastogi", "Sahni", "Talwar", "Uppal", "Varma", "Wadhwa", "Yadav", "Zaveri", "Agarwal", "Batra", "Chandra", "Dwivedi", "Elangovan", "Fotedar", "Gada", "Handa", "Inamdar", "Jha", "Kalra", "Lal", "Mani", "Negi", "Phadke", "Rawat", "Suri", "Tyagi", "Unnikrishnan", "Vats", "Xavier", "Yagnik", "Zaidi", "Acharya", "Barot", "Chitra", "Deol", "Farooqui", "Gokhale", "Hirani", "Jaggi", "Kapadia", "Lodha", "Modi", "Nanda", "Oswal", "Parvez", "Pillai", "Raina", "Saini", "Tandon", "Udhas", "Vaidya", "Walia", "Yousuf"
  ];

  const applicants = [];
  const usedNames = new Set();
  let nameIndex = 0;

  ALL_JOBS.forEach(job => {
    for (let i = 0; i < job.applicants; i++) {
      let fullName = "";
      // Ensure unique name generation
      do {
        const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
        fullName = `${fName} ${lName}`;
      } while (usedNames.has(fullName));
      
      usedNames.add(fullName);

      applicants.push({
        id: `a-${nameIndex}`,
        jobId: job.id,
        name: fullName,
        email: `${fullName.toLowerCase().replace(/\s/g, '.')}@example.com`,
        score: Math.floor(Math.random() * (99 - 45 + 1)) + 45,
        status: i % 6 === 0 ? 'Shortlisted' : i % 4 === 0 ? 'Interviewing' : 'Applied',
        trust: Math.random() > 0.15 ? 'Verified' : 'Unverified',
        role: job.title
      });
      nameIndex++;
    }
  });

  return applicants;
};

const ALL_APPLICANTS = generateApplicants();

export default function RecruiterDashboard({ openPage }) {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('main'); // 'main' | 'all-jobs' | 'all-applicants' | 'job-applicants' | 'shortlisted-talent'
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [liveOps, setLiveOps] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("byan:user");
    if (storedUser) setUser(JSON.parse(storedUser));
    
    const storedShortlist = localStorage.getItem("byan:shortlisted");
    if (storedShortlist) setShortlistedCandidates(JSON.parse(storedShortlist));
    
    try {
      const storedOps = JSON.parse(localStorage.getItem("byan:liveOps") || "[]");
      setLiveOps(storedOps);
    } catch {}
    
    try {
      const storedApps = JSON.parse(localStorage.getItem("byan:applications") || "[]");
      setMyApplications(storedApps);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("byan:shortlisted", JSON.stringify(shortlistedCandidates));
  }, [shortlistedCandidates]);

  const handleBack = () => setView('main');

  const openCandidateProfile = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleShortlist = (candidate) => {
    if (!shortlistedCandidates.find(c => c.id === candidate.id)) {
      setShortlistedCandidates(prev => [candidate, ...prev]);
      toast.success(`${candidate.name} added to shortlist!`);
    } else {
      toast.error("Candidate already shortlisted");
    }
    setIsModalOpen(false);
  };

  const fromBYAN = (Array.isArray(myApplications) ? myApplications : []).map(app => ({
    id: app.id,
    jobId: app.opportunityId,
    name: app.applicant?.name || "Candidate",
    email: app.applicant?.email || "",
    score: 80,
    status: app.status || 'Submitted',
    trust: 'Verified',
    role: app.title
  }));

  const mappedLive = (Array.isArray(liveOps) ? liveOps : []).map(op => ({
    id: op.id,
    title: op.title,
    applicants: fromBYAN.filter(a => a.jobId === op.id).length,
    status: 'Active',
    date: 'Just now',
    type: op.type || 'Internship',
    department: 'Live'
  }));
  const COMBINED_JOBS = [...mappedLive, ...ALL_JOBS];

  const filteredJobs = COMBINED_JOBS.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ALL_AND_BYAN_APPLICANTS = [...ALL_APPLICANTS, ...fromBYAN];
  const filteredApplicants = ALL_AND_BYAN_APPLICANTS.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- SUB-VIEWS ---

  const renderAllJobs = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        <h1 className="text-2xl font-bold">All Active Postings</h1>
        <div className="w-10" />
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-red-500 transition"
          placeholder="Search postings by title or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid gap-4">
        {filteredJobs.map(job => (
          <div key={job.id} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl flex items-center justify-between hover:border-red-500/30 transition-all group">
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.department} • {job.type}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm font-bold text-white">{job.applicants} Applicants</div>
                <div className="text-[10px] text-gray-500 uppercase">{job.date}</div>
              </div>
              <button 
                onClick={() => { setSelectedJob(job); setView('job-applicants'); }}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition"
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderAllApplicants = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        <h1 className="text-2xl font-bold">Global Applicant Pool</h1>
        <div className="w-10" />
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white outline-none focus:border-red-500 transition"
          placeholder="Search candidates by name or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/20 border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Candidate</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Applied For</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ATS Score</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredApplicants.map(app => (
              <tr key={app.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div 
                    className="font-bold text-white cursor-pointer hover:text-red-400 transition"
                    onClick={() => openCandidateProfile(app)}
                  >
                    {app.name}
                  </div>
                  <div className="text-xs text-gray-500">{app.email}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{app.role}</td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${app.score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{app.score}%</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => openCandidateProfile(app)}
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderShortlistedTalent = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex items-center justify-between">
        <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        <h1 className="text-2xl font-bold">Shortlisted Talent</h1>
        <div className="w-10" />
      </div>
      
      {shortlistedCandidates.length > 0 ? (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/20 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Candidate</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ATS Score</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {shortlistedCandidates.map(app => (
                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div 
                      className="font-bold text-white cursor-pointer hover:text-red-400 transition"
                      onClick={() => openCandidateProfile(app)}
                    >
                      {app.name}
                    </div>
                    <div className="text-xs text-gray-500">{app.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{app.role}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${app.score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{app.score}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openCandidateProfile(app)}
                      className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-20 text-center border border-dashed border-gray-800 rounded-3xl">
          <UserCheck className="mx-auto text-gray-700 mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No Shortlisted Talent</h3>
          <p className="text-gray-500 max-w-md mx-auto">Start reviewing applicants and shortlist the best candidates to see them here.</p>
          <button 
            onClick={() => setView('all-applicants')}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 transition"
          >
            Browse Applicants
          </button>
        </div>
      )}
    </motion.div>
  );

  const renderJobApplicants = () => {
    const jobApplicants = ALL_AND_BYAN_APPLICANTS.filter(app => app.jobId === selectedJob?.id);
    
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        <button onClick={() => setView('all-jobs')} className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Postings
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Applicants for {selectedJob?.title}</h1>
            <p className="text-gray-400 mt-1">Reviewing {jobApplicants.length} candidates sorted by ATS Match Score.</p>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-500 transition flex items-center gap-2">
            <Download size={16} /> Export List
          </button>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-black/20 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Candidate</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ATS Score</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Trust</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {jobApplicants.map(app => (
                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div 
                      className="font-bold text-white cursor-pointer hover:text-red-400 transition"
                      onClick={() => openCandidateProfile(app)}
                    >
                      {app.name}
                    </div>
                    <div className="text-xs text-gray-500">{app.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${app.score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-emerald-400">{app.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1 text-[10px] font-bold uppercase ${app.trust === 'Verified' ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {app.trust === 'Verified' && <ShieldCheck size={12} />} {app.trust}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">{app.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openCandidateProfile(app)}
                        className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition"
                      >
                        <FileText size={16} />
                      </button>
                      <button className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-500 transition"><CheckCircle2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  // --- MAIN DASHBOARD VIEW ---

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        {view === 'main' ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Recruiter Console</h1>
                <p className="text-gray-400 mt-1">Managing talent for <span className="text-red-400 font-bold">{user?.companyName || "AURA Tech"}</span></p>
              </div>
              <button 
                onClick={() => openPage('post-opportunity')}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Post Opportunity
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                whileHover={{ y: -4 }} 
                onClick={() => setView('all-jobs')}
                className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm hover-glow transition-all cursor-pointer group"
              >
                <div className="p-2 bg-red-500/10 rounded-lg w-fit mb-4 group-hover:bg-red-500/20 transition-colors"><Briefcase className="text-red-500" size={20} /></div>
                <div className="text-3xl font-bold text-white">{COMBINED_JOBS.length}</div>
                <div className="text-sm text-gray-400">Active Postings</div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }} 
                onClick={() => setView('all-applicants')}
                className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm hover-glow transition-all cursor-pointer group"
              >
                <div className="p-2 bg-blue-500/10 rounded-lg w-fit mb-4 group-hover:bg-blue-500/20 transition-colors"><Users className="text-blue-500" size={20} /></div>
                <div className="text-3xl font-bold text-white">{ALL_APPLICANTS.length}</div>
                <div className="text-sm text-gray-400">Total Applicants</div>
              </motion.div>
              
              <motion.div whileHover={{ y: -4 }} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm hover-glow transition-all">
                <div className="p-2 bg-emerald-500/10 rounded-lg w-fit mb-4"><ShieldCheck className="text-emerald-500" size={20} /></div>
                <div className="text-3xl font-bold text-emerald-400">Verified</div>
                <div className="text-sm text-gray-400">Company Status</div>
              </motion.div>

              <motion.div 
                whileHover={{ y: -4 }} 
                onClick={() => setView('shortlisted-talent')}
                className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm hover-glow transition-all cursor-pointer group"
              >
                <div className="p-2 bg-amber-500/10 rounded-lg w-fit mb-4 group-hover:bg-amber-500/20 transition-colors"><Star className="text-amber-500" size={20} /></div>
                <div className="text-3xl font-bold text-white">{shortlistedCandidates.length}</div>
                <div className="text-sm text-gray-400">Shortlisted Talent</div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Recent Opportunities</h2>
                <button onClick={() => setView('all-jobs')} className="text-sm text-gray-400 hover:text-white transition">View All</button>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 bg-black/20">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role Title</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicants</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {COMBINED_JOBS.slice(0, 4).map((post) => (
                      <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white group-hover:text-red-400 transition-colors">{post.title}</div>
                          <div className="text-[10px] text-gray-500 uppercase">{post.department}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{post.applicants}</span>
                            <span className="text-[10px] text-gray-500 uppercase">New</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            post.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => { setSelectedJob(post); setView('job-applicants'); }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition"
                          >
                            <Eye size={14} /> View Applicants
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : view === 'all-jobs' ? (
          renderAllJobs()
        ) : view === 'all-applicants' ? (
          renderAllApplicants()
        ) : view === 'shortlisted-talent' ? (
          renderShortlistedTalent()
        ) : (
          renderJobApplicants()
        )}
      </div>

      {/* Candidate Profile Modal */}
      <CandidateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        candidate={selectedCandidate} 
        onShortlist={handleShortlist}
      />
    </main>
  );
}
