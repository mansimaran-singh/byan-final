"use client";

import React from "react";
import BYANWebsite from "./pages/BYANWebsite";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { AIProviderWrapper } from "./pages/resume/AIProviderContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "178560840780-hsekaesa12roal73kmp6ttssun0g27ri.apps.googleusercontent.com";

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AIProviderWrapper>
        <Toaster position="bottom-right" />

        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<BYANWebsite />} />
              <Route path="/resume-builder" element={<BYANWebsite initialPage="resume-builder" />} />
              <Route path="/ats-check" element={<BYANWebsite initialPage="ats" />} />
              <Route path="/dashboard" element={<BYANWebsite initialPage="dashboard" />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </AnimatePresence>
        </Router>
      </AIProviderWrapper>
    </GoogleOAuthProvider>
  );
}
