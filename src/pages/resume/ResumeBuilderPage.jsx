import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TemplateSelectPage from "./TemplateSelectPage";
import ResumeForm from "./ResumeForm";
import ResumePreview from "./ResumePreview";
import { ChevronLeft, FileText, Download, Save, Shield, Loader2, Upload, AlertCircle, FileOutput } from "lucide-react";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import mammoth from "mammoth";
import * as pdfjs from "pdfjs-dist";
import { extractResumeData } from "../../utils/resumeDataExtractor";
import { mapToResumeFormData } from "../../utils/dataMapper";
import { generateDOCX } from "./generators/docxGenerator";
import { getDefaultResumeDataForTemplate } from "./templateDefaults.ts";

// Updated to match package.json version for compatibility
const PDFJS_VERSION = '5.4.624';
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

export default function ResumeBuilderPage() {
  const [template, setTemplate] = useState(null);
  const [mode, setMode] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [rawText, setRawText] = useState("");
  const resumeRef = useRef(null);

  const [formData, setFormData] = useState(() => {
    const savedNew = localStorage.getItem("career-canvass:resume:formData");
    const savedLegacy = localStorage.getItem("byan:draft_resume");
    const payload = savedNew || savedLegacy;
    return payload ? JSON.parse(payload) : mapToResumeFormData({});
  });

  const STARTER_DATA = getDefaultResumeDataForTemplate(template);

  const persistForm = (data) => {
    localStorage.setItem("career-canvass:resume:formData", JSON.stringify(data));
  };

  useEffect(() => {
    localStorage.setItem("career-canvass:resume:formData", JSON.stringify(formData));
    if (mode === "new") localStorage.setItem("byan:draft_resume", JSON.stringify(formData));
  }, [formData, mode]);

  useEffect(() => {
    if (mode === "new" && !formData.hasData) {
      setFormData({ ...mapToResumeFormData(STARTER_DATA), hasData: true });
    }
  }, [mode]);

  useEffect(() => {
    if (template) {
      localStorage.setItem("career-canvass:resume:template", template);
      setMode(null);
    }
  }, [template]);

  useEffect(() => {}, []);

  const handleResumeUpload = async (file) => {
    if (!file) return;
    
    const loadingToast = toast.loading(`Analyzing ${file.name}...`);
    setUploading(true);

    try {
      let extractedText = "";
      
      if (file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map(item => item.str).join(" ") + "\n";
        }
        extractedText = fullText;
      } else if (file.name.endsWith(".docx")) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else {
        extractedText = await file.text();
      }

      if (!extractedText || extractedText.trim().length < 10) {
        throw new Error("Could not extract enough text from this file.");
      }

      setRawText(extractedText);
      const partialData = extractResumeData(extractedText);
      const mappedData = mapToResumeFormData(partialData);
      
      setFormData({
        ...mappedData,
        hasData: true
      });

      toast.success("Resume Intelligence applied!", { id: loadingToast });
      setMode("new");
    } catch (err) {
      console.error("Upload Error:", err);
      toast.error(err.message || "Failed to read file. Try a different format.", { id: loadingToast });
    } finally {
      setUploading(false);
    }
  };

  const exportPDF = async () => {
    if (!resumeRef.current) return;
    setIsExporting(true);
    const loadingToast = toast.loading("Generating PDF...");

    try {
      const canvas = await html2canvas(resumeRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${formData.personalInformation.fullName || "Resume"}.pdf`);
      toast.success("Downloaded PDF!", { id: loadingToast });
    } catch (err) {
      toast.error("Export failed", { id: loadingToast });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDocx = async () => {
    setIsExportingDocx(true);
    const loadingToast = toast.loading("Generating DOCX...");
    try {
      await generateDOCX(formData, formData.personalInformation.fullName || "Resume");
      toast.success("Downloaded DOCX!", { id: loadingToast });
    } catch (err) {
      toast.error("DOCX Export failed", { id: loadingToast });
    } finally {
      setIsExportingDocx(false);
    }
  };

  const resetToDefaults = () => {
    const preset = getDefaultResumeDataForTemplate(template);
    const mapped = { ...mapToResumeFormData(preset), hasData: true };
    setFormData(mapped);
    setRawText("");
    persistForm(mapped);
    toast.success("Loaded template defaults");
  };

  const clearAll = () => {
    const cleared = mapToResumeFormData({});
    setFormData(cleared);
    setRawText("");
    persistForm(cleared);
    toast.success("Cleared all fields");
  };

  if (!template) return <TemplateSelectPage setTemplate={setTemplate} />;

  return (
    <AnimatePresence mode="wait">
      {!mode ? (
        <motion.div
          key="mode-select"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="min-h-screen text-white p-6 flex flex-col bg-black"
        >
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <button onClick={() => setTemplate(null)} className="p-2 hover:bg-gray-800 rounded-full transition">
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-3xl font-bold">Resume Intelligence</h1>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="grid gap-8 md:grid-cols-2 w-full max-w-4xl">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-10 flex flex-col items-center text-center gap-6 cursor-pointer group hover-glow transition-all"
                onClick={() => {
                  const preset = getDefaultResumeDataForTemplate(template);
                  const mapped = { ...mapToResumeFormData(preset), hasData: true };
                  setFormData(mapped);
                  setRawText("");
                  setMode("new");
                  localStorage.setItem("career-canvass:resume:formData", JSON.stringify(mapped));
                }}
              >
                <div className="w-20 h-20 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  <FileText size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Create New</h2>
                  <p className="text-gray-400 mt-2">Start with a blank slate and build your profile step-by-step.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-10 flex flex-col items-center text-center gap-6 cursor-pointer group hover-glow transition-all"
              >
                <div className="w-20 h-20 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Upload size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Import Existing</h2>
                  <p className="text-gray-400 mt-2">Upload PDF, DOCX, or TXT. We'll extract your info automatically.</p>
                </div>
                <label className="mt-2 px-8 py-3 bg-white text-black rounded-xl font-bold cursor-pointer hover:bg-gray-200 transition">
                  <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => handleResumeUpload(e.target.files?.[0])} />
                  {uploading ? "Reading..." : "Choose File"}
                </label>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="builder-interface"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex flex-col h-screen bg-white text-gray-900"
        >
          <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setMode(null)} className="p-1 hover:bg-gray-100 rounded transition"><ChevronLeft size={20} /></button>
              <span className="font-bold text-lg text-red-600">BYAN Builder</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportDocx} 
                disabled={isExportingDocx} 
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition"
              >
                {isExportingDocx ? <Loader2 size={16} className="animate-spin" /> : <FileOutput size={16} />} DOCX
              </button>
              <button 
                onClick={exportPDF} 
                disabled={isExporting} 
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition"
              >
                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} PDF
              </button>
              <button onClick={() => { localStorage.setItem("byan:draft_resume", JSON.stringify(formData)); toast.success("Saved!"); }} className="px-4 py-2 border border-gray-300 text-sm font-bold rounded-lg hover:bg-gray-50 transition">Save Draft</button>
              <button onClick={resetToDefaults} className="px-4 py-2 border border-gray-300 text-sm font-bold rounded-lg hover:bg-gray-50 transition">Reset Defaults</button>
              <button onClick={clearAll} className="px-4 py-2 border border-gray-300 text-sm font-bold rounded-lg hover:bg-gray-50 transition">Clear All</button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-1/2 h-full overflow-y-auto p-8 border-r border-gray-200 bg-white">
              {rawText && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="text-amber-600 shrink-0" size={18} />
                  <p className="text-xs text-amber-800">
                    <b>Resume Intelligence:</b> We've extracted your info from the file. Please review and edit the fields below to ensure accuracy.
                  </p>
                </div>
              )}
              <ResumeForm formData={formData} setFormData={setFormData} />
            </div>
            <div className="w-1/2 h-full bg-gray-100 flex justify-center p-10 overflow-y-auto">
              <div className="w-full max-w-[800px] bg-white shadow-2xl min-h-[1122px]">
                <ResumePreview formData={formData} template={template} resumeRef={resumeRef} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
