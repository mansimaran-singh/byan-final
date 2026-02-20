"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Loader2, Building2, User as UserIcon, ChevronLeft, Mail, Lock, ArrowRight, Github, Sparkles, FileText, CheckCircle2, X } from "lucide-react";
import toast from "react-hot-toast";
import { signup, login, requestOtp, verifyOtp, uploadVerificationDoc } from "../../api/auth";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LinkedInIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export default function AuthPage({ openPage, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [role, setRole] = useState(null); // null | 'student' | 'recruiter'
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    companyDescription: "",
    cin: "",
    gst: "",
    pan: ""
  });
  const [otp, setOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpExpires, setOtpExpires] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);
  const [rocUploading, setRocUploading] = useState(false);
  const [gstUploading, setGstUploading] = useState(false);
  const rocInputRef = React.useRef(null);
  const gstInputRef = React.useRef(null);
  const [rocDoc, setRocDoc] = useState(null);
  const [gstDoc, setGstDoc] = useState(null);

  useEffect(() => {
    setIsLogin(initialMode === 'login');
    if (initialMode === 'login') setRole('student');
  }, [initialMode]);

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: role || "student",
        picture: decoded.picture
      };
      
      localStorage.setItem("byan:token", credentialResponse.credential);
      localStorage.setItem("byan:user", JSON.stringify(userData));
      
      toast.success(`Welcome, ${decoded.name}!`);
      openPage(userData.role === "recruiter" ? "recruiter-dashboard" : "dashboard");
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (role === "recruiter") {
        if (!otpVerified) {
          toast.error("Please verify email via OTP");
          setLoading(false);
          return;
        }
      }
      const payload = isLogin ? { email: form.email, password: form.password } : { ...form, role };
      
      // Try real API first
      try {
        const data = isLogin ? await login(payload) : await signup(payload);
        if (data && data.token) {
          localStorage.setItem("byan:token", data.token);
          const resolvedUser = { ...data.user, role: data.user?.role || role || "student" };
          localStorage.setItem("byan:user", JSON.stringify(resolvedUser));
          toast.success(isLogin ? "Welcome back!" : "Account created!");
          openPage(resolvedUser.role === "recruiter" ? "recruiter-dashboard" : "dashboard");
          return;
        }
      } catch (apiErr) {
        console.warn("API unavailable, using local fallback for demo");
      }

      // Fallback for demo/prototype (Showcase Mode)
      const mockUser = {
        id: "mock_" + Date.now(),
        name: form.name || (form.email ? form.email.split('@')[0] : "Demo User"),
        email: form.email || "demo@byan.in",
        role: role || "student", // Default to student for login showcase
        companyName: form.companyName || "Demo Corp"
      };
      
      localStorage.setItem("byan:token", "mock_token_" + Date.now());
      localStorage.setItem("byan:user", JSON.stringify(mockUser));
      
      toast.success(isLogin ? "Logged in (Showcase Mode)" : "Account created (Showcase Mode)");
      
      // Small delay for better UX
      setTimeout(() => {
        openPage(mockUser.role === "recruiter" ? "recruiter-dashboard" : "dashboard");
      }, 500);

    } catch (err) {
      toast.error("Authentication failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (!isLogin && role) {
      setRole(null);
    } else if (!isLogin && !role) {
      setIsLogin(true);
    } else {
      openPage('home');
    }
  };

  const containerVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        {!isLogin && !role ? (
          <motion.div 
            key="role-selection"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-2xl text-center"
          >
            <div className="mb-12">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20"
              >
                <Shield className="text-red-500" size={40} />
              </motion.div>
              <h1 className="text-4xl font-bold text-white mb-3">Join the Network</h1>
              <p className="text-gray-400">Select your account type to get started with BYAN.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole("student")}
                className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl cursor-pointer group hover:border-red-500/50 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <UserIcon size={80} />
                </div>
                <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <UserIcon size={32} className="text-red-500 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">I'm a Student</h3>
                <p className="text-sm text-gray-500">Find verified internships, build your resume, and boost your career.</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole("recruiter")}
                className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl cursor-pointer group hover:border-blue-500/50 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Building2 size={80} />
                </div>
                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Building2 size={32} className="text-blue-500 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">I'm a Recruiter</h3>
                <p className="text-sm text-gray-500">Post opportunities, verify your company, and hire trusted talent.</p>
              </motion.div>
            </div>

            <div className="mt-10">
              <button 
                onClick={() => setIsLogin(true)}
                className="text-gray-400 hover:text-white transition text-sm font-medium flex items-center justify-center gap-2 mx-auto"
              >
                Already have an account? <span className="text-red-500 font-bold">Sign In</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="auth-form"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md"
          >
            <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 blur-3xl rounded-full" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <button 
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-800 rounded-full transition text-gray-400 group"
                >
                  <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div className="text-right">
                  <h1 className="text-2xl font-bold text-white">
                    {isLogin ? "Welcome Back" : `Join as ${role === 'student' ? 'Student' : 'Recruiter'}`}
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">Enter your details below</p>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center gap-2 justify-center mb-6">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border ${role === 'student' ? 'bg-red-600 text-white border-red-500' : 'bg-gray-900 text-gray-300 border-gray-700'}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border ${role === 'recruiter' ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-900 text-gray-300 border-gray-700'}`}
                  >
                    Recruiter
                  </button>
                </div>
              )}

              {(isLogin || role === 'student') && (
                <div className="space-y-3 mb-8 relative z-10">
                  <div className="flex justify-center">
                    <GoogleLogin 
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error("Google Login Failed")}
                      theme="filled_black"
                      shape="pill"
                      width="100%"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => toast.success("GitHub login coming soon!")}
                      className="py-3 bg-gray-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-700 transition"
                    >
                      <Github size={18} /> GitHub
                    </button>
                    <button 
                      type="button"
                      onClick={() => toast.success("LinkedIn login coming soon!")}
                      className="py-3 bg-[#0077b5] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
                    >
                      <LinkedInIcon /> LinkedIn
                    </button>
                  </div>
                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px bg-gray-800 flex-1" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">OR</span>
                    <div className="h-px bg-gray-800 flex-1" />
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                {!isLogin && (
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                    />
                  </div>
                )}
                
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    required
                    type="email"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                  />
                </div>
                
                {role === "recruiter" && (
                  <div className="grid grid-cols-[1fr,auto] gap-2">
                    <input
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:border-blue-500 transition"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    />
                    <button
                      type="button"
                      onClick={()=>{
                        if(!form.email || !/^\S+@\S+\.\S+$/.test(form.email)){
                          toast.error("Enter a valid email first");
                          return;
                        }
                        requestOtp(form.email)
                          .then(res=>{
                            if(res?.ok){
                              setOtpVerified(false);
                              setOtpExpires(res.expires || (Date.now()+3*60*1000));
                              toast.success(res.sent ? "OTP sent to email" : "OTP sent (demo)");
                            } else {
                              toast.error("Failed to send OTP");
                            }
                          })
                          .catch(()=> toast.error("Server error sending OTP"));
                      }}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition"
                    >
                      Send OTP
                    </button>
                    <div className="col-span-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={()=>{
                          if(!form.email){ toast.error("Enter email first"); return; }
                          if(Date.now() > otpExpires){ toast.error("OTP expired"); return; }
                          verifyOtp(form.email, otpInput)
                            .then(res=>{
                              if(res?.ok){
                                setOtpVerified(true);
                                toast.success("Email verified");
                              } else {
                                toast.error(res?.reason === "expired" ? "OTP expired" : "Incorrect OTP");
                              }
                            })
                            .catch(()=> toast.error("Server error verifying OTP"));
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold ${otpVerified ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'}`}
                      >
                        {otpVerified ? "Verified" : "Verify"}
                      </button>
                      <span className="text-[10px] text-gray-500">{otpExpires ? `Expires in ${(Math.max(0, otpExpires - Date.now())/1000|0)}s` : ""}</span>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    required
                    type="password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                  />
                </div>

                {!isLogin && role === "recruiter" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="space-y-4 pt-4 border-t border-gray-800"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-red-500" />
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Company Verification</p>
                    </div>
                    <input 
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                      placeholder="Company Name"
                      value={form.companyName}
                      onChange={(e) => setForm({...form, companyName: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                        placeholder="CIN Number"
                        value={form.cin}
                        onChange={(e) => setForm({...form, cin: e.target.value})}
                      />
                      <input 
                        required
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                        placeholder="GST Number"
                        value={form.gst}
                        onChange={(e) => setForm({...form, gst: e.target.value})}
                      />
                    </div>
                    <input 
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition"
                      placeholder="PAN Number"
                      value={form.pan}
                      onChange={(e) => setForm({...form, pan: e.target.value.toUpperCase()})}
                    />
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Verification Uploads</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 items-start">
                      <input type="file" accept=".pdf,.png,.jpg,.jpeg" ref={rocInputRef} className="hidden" onChange={async (e)=>{
                        const f = e.target.files?.[0]; if(!f) return;
                        setRocUploading(true);
                        try{
                          const res = await uploadVerificationDoc("roc", f, form.email);
                          if(res?.ok){ toast.success("ROC certificate uploaded"); setRocDoc({ name: f.name, size: f.size }); }
                          else toast.error("ROC upload failed");
                        }catch{ toast.error("Server error uploading ROC") }finally{ setRocUploading(false); e.target.value=""; }
                      }} />
                      <input type="file" accept=".pdf,.png,.jpg,.jpeg" ref={gstInputRef} className="hidden" onChange={async (e)=>{
                        const f = e.target.files?.[0]; if(!f) return;
                        setGstUploading(true);
                        try{
                          const res = await uploadVerificationDoc("gst", f, form.email);
                          if(res?.ok){ toast.success("GST certificate uploaded"); setGstDoc({ name: f.name, size: f.size }); }
                          else toast.error("GST upload failed");
                        }catch{ toast.error("Server error uploading GST") }finally{ setGstUploading(false); e.target.value=""; }
                      }} />
                      <button type="button" onClick={()=>rocInputRef.current?.click()} className="py-3 bg-black/40 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600/10 transition border border-red-500/40">
                        {rocUploading ? <Loader2 className="animate-spin" size={16} /> : <><FileText size={16} /> Upload ROC</>}
                      </button>
                      <button type="button" onClick={()=>gstInputRef.current?.click()} className="py-3 bg-black/40 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-600/10 transition border border-red-500/40">
                        {gstUploading ? <Loader2 className="animate-spin" size={16} /> : <><FileText size={16} /> Upload GST</>}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div className="min-h-[40px] bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-300 flex items-center justify-between">
                        {rocDoc ? (
                          <>
                            <span className="truncate flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> {rocDoc.name}</span>
                            <button type="button" onClick={()=>setRocDoc(null)} className="text-gray-400 hover:text-white"><X size={14} /></button>
                          </>
                        ) : <span className="text-gray-500">ROC not uploaded</span>}
                      </div>
                      <div className="min-h-[40px] bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-2 text-xs text-gray-300 flex items-center justify-between">
                        {gstDoc ? (
                          <>
                            <span className="truncate flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> {gstDoc.name}</span>
                            <button type="button" onClick={()=>setGstDoc(null)} className="text-gray-400 hover:text-white"><X size={14} /></button>
                          </>
                        ) : <span className="text-gray-500">GST not uploaded</span>}
                      </div>
                    </div>
                    <textarea 
                      required
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white outline-none focus:border-red-500 transition min-h-[80px] text-sm"
                      placeholder="Company Description"
                      value={form.companyDescription}
                      onChange={(e) => setForm({...form, companyDescription: e.target.value})}
                    />
                  </motion.div>
                )}

                <button 
                  disabled={loading}
                  className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 group mt-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? "Sign In" : "Create Account")}
                  {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>

              <div className="mt-6 text-center relative z-10">
                <button 
                  onClick={() => {
                    if (isLogin) {
                      setIsLogin(false);
                      setRole(null);
                    } else {
                      setIsLogin(true);
                    }
                  }}
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
