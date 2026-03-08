"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  Search, 
  Cpu, 
  AlertCircle, 
  CheckCircle2, 
  Zap,
  ArrowRight,
  ShieldAlert,
  Terminal,
  BarChart3
} from "lucide-react";
import MonolithButton from "@/components/neon/MonolithButton";
import MonolithCard from "@/components/neon/MonolithCard";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ResumeMatcherPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      toast.success("RESUME_DATA_LOADED");
    } else {
      toast.error("INVALID_FILE_FORMAT // PDF_REQUIRED");
    }
  };

  const startAnalysis = async () => {
    if (!file || !jobDescription) {
      toast.error("INCOMPLETE_PARAMETERS // PROVIDE_RESUME_AND_JD");
      return;
    }

    setIsScanning(true);
    setResult(null);

    // Simulated Analysis Logic (System Scanning Effect)
    setTimeout(() => {
      setResult({
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        matches: ["React.js", "TypeScript", "Next.js", "Tailwind CSS", "Prisma"],
        missing: ["Docker", "Kubernetes", "AWS Lambda"],
        recommendation: "OPTIMIZE_TECHNICAL_SECTION_FOR_CLOUD_NATIVE_INFRASTRUCTURE",
        analysis_code: "0x" + Math.random().toString(16).slice(2, 6).toUpperCase()
      });
      setIsScanning(false);
      toast.success("SYSTEM_ANALYSIS_COMPLETE");
    }, 4000);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Header */}
      <div className="relative p-8 bg-black border-[3px] border-white overflow-hidden">
        <div className="monolith-scanlines" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 bg-[#22C55E] animate-pulse" />
              <span className="font-mono text-[10px] text-[#8B5CF6] uppercase tracking-[0.3em]">
                NEURAL_MATCH_v1.0
              </span>
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-white">
              RESUME_MATCHER
            </h1>
            <p className="text-white/40 font-mono text-xs mt-2 uppercase tracking-widest">
              AI_POWERED_SYSTEM_ANALYSIS // COMPUTE_MATCH_PERCENTAGE
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1 font-mono text-[8px] text-white/20 uppercase">
            <span>Core_Stability: 99.8%</span>
            <span>Uptime: 432:12:08</span>
            <span>Thread_Count: 128</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!result && !isScanning ? (
          <motion.div
            key="input-stage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Resume Upload Area */}
            <div className="space-y-6">
              <MonolithCard 
                title="RESUME_UPLOADER" 
                subtitle="DATA_SOURCE_ENTRY_POINT"
                tag="TARGET_PDF"
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed border-white/10 p-12 text-center cursor-pointer transition-colors group",
                    file ? "border-[#22C55E]/50 bg-[#22C55E]/5" : "hover:border-white/30 hover:bg-white/5"
                  )}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf"
                  />
                  {file ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-[#22C55E] mx-auto flex items-center justify-center">
                        <FileText className="h-8 w-8 text-black" />
                      </div>
                      <p className="font-mono text-sm text-[#22C55E] font-black uppercase tracking-widest">
                        {file.name}
                      </p>
                      <span className="text-[10px] text-white/20 uppercase underline decoration-dotted underline-offset-4 pointer-events-none">
                        CHANGE_FILE
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-white/10 mx-auto flex items-center justify-center group-hover:bg-[#8B5CF6] transition-colors">
                        <Upload className="h-8 w-8 text-white group-hover:text-black transition-colors" />
                      </div>
                      <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
                        DRAG_AND_DROP_PDF_OR_CLICK_TO_SCAN
                      </p>
                    </div>
                  )}
                </div>
              </MonolithCard>

              <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 p-4 flex gap-4">
                <ShieldAlert className="h-6 w-6 text-[#EF4444] shrink-0" />
                <div className="font-mono text-[10px] uppercase text-[#EF4444] leading-relaxed tracking-widest">
                  [WARNING]: SYSTEM_ONLY_ACCEPTS_CLEAN_PDF_DATA.<br/>
                  ENCRYPTED_FILES_WILL_BE_REJECTED.
                </div>
              </div>
            </div>

            {/* Job Description Area */}
            <div className="space-y-6">
              <MonolithCard 
                title="JOB_DESCRIPTION" 
                subtitle="TARGET_SPECIFICATIONS_CONFIG"
                tag="REQ_DATA"
              >
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="PASTE_JOB_DESCRIPTION_OR_LINK_SPECIFICATIONS_HERE..."
                  className="w-full h-64 bg-black border-2 border-white/10 p-4 font-mono text-xs text-white outline-none focus:border-[#8B5CF6] focus:bg-[#8B5CF6]/5 transition-all placeholder:text-white/10 resize-none underline-offset-8"
                />
                
                <div className="mt-8">
                  <MonolithButton 
                    variant="primary" 
                    glitch 
                    className="w-full py-6"
                    onClick={startAnalysis}
                  >
                    INITIATE_SYSTEM_SCAN [MATCH]
                  </MonolithButton>
                </div>
              </MonolithCard>
            </div>
          </motion.div>
        ) : isScanning ? (
          <motion.div
            key="scanning-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-40 space-y-12"
          >
            <div className="relative">
              <div className="w-32 h-32 border-[4px] border-white/10 relative">
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-[#22C55E] shadow-[0_0_15px_#22C55E] z-10"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="h-12 w-12 text-[#8B5CF6] animate-pulse" />
                </div>
              </div>
              <div className="absolute -top-4 -left-4 w-4 h-4 border-t-4 border-l-4 border-[#8B5CF6]" />
              <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-4 border-r-4 border-[#8B5CF6]" />
            </div>

            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-white">
                ANALYZING_RESUME_VECTORS...
              </h2>
              <div className="flex gap-2 justify-center font-mono text-[10px] text-[#22C55E] uppercase tracking-widest">
                <span className="animate-pulse">[MAPPING_KEYWORDS]</span>
                <span className="animate-pulse delay-75">[SCRUBBING_DATA]</span>
                <span className="animate-pulse delay-150">[COMPUTING_OVERLAP]</span>
              </div>
              <div className="w-64 h-2 bg-white/10 mx-auto mt-8 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-[#8B5CF6]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[1,2,3,4].map(i => (
                 <div key={i} className="font-mono text-[8px] text-white/20 uppercase overflow-hidden w-24">
                    {Array.from({length: 5}).map((_, j) => (
                      <div key={j} className="animate-pulse" style={{ animationDelay: `${(i*5+j)*100}ms` }}>
                         {Math.random().toString(16).slice(2, 10)}
                      </div>
                    ))}
                 </div>
               ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result-stage"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Score Card */}
              <div className="lg:col-span-1">
                <MonolithCard 
                  title="SCAN_RESULTS" 
                  subtitle="SYSTEM_RELIABILITY_HIGH"
                  tag={result.analysis_code}
                >
                  <div className="flex flex-col items-center justify-center py-8">
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
                       MATCH_PERCENTAGE
                    </span>
                    <div className="text-8xl font-black text-[#22C55E] tracking-tighter mb-4">
                      {result.score}%
                    </div>
                    <div className="flex gap-1">
                       {Array.from({length: 10}).map((_, i) => (
                         <div 
                           key={i} 
                           className={cn(
                             "w-2 h-6 border",
                             i < result.score / 10 ? "bg-[#22C55E] border-[#22C55E]" : "bg-transparent border-white/10"
                           )} 
                         />
                       ))}
                    </div>
                  </div>
                  
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                       <span className="font-mono text-[10px] uppercase text-white/60">INTEGRITY_CHECK</span>
                       <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
                       <span className="font-mono text-[10px] uppercase text-white/60">LATENCY_SYNC</span>
                       <span className="font-mono text-[10px] uppercase text-[#8B5CF6]">0.42MS</span>
                    </div>
                  </div>
                </MonolithCard>
              </div>

              {/* Matches & Missing */}
              <div className="lg:col-span-2 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <MonolithCard title="TAGS_DETECTED" tag="FOUND" className="border-[#22C55E]">
                    <div className="flex flex-wrap gap-2">
                      {result.matches.map((item: string) => (
                        <div key={item} className="bg-[#22C55E]/10 border border-[#22C55E]/30 px-3 py-1.5 flex items-center gap-2">
                           <Zap className="h-3 w-3 text-[#22C55E]" />
                           <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#22C55E]">
                             {item}
                           </span>
                        </div>
                      ))}
                    </div>
                  </MonolithCard>

                  <MonolithCard title="GAP_ANALYSIS" tag="MISSING" className="border-[#EF4444]">
                    <div className="flex flex-wrap gap-2">
                      {result.missing.map((item: string) => (
                        <div key={item} className="bg-[#EF4444]/10 border border-[#EF4444]/30 px-3 py-1.5 flex items-center gap-2">
                           <AlertCircle className="h-3 w-3 text-[#EF4444]" />
                           <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#EF4444]">
                             {item}
                           </span>
                        </div>
                      ))}
                    </div>
                  </MonolithCard>
                </div>

                <MonolithCard title="SYSTEM_RECOMMENDATION" subtitle="STRATEGY_OVERRIDE" tag="DIRECTIVE">
                   <div className="p-4 bg-[#8B5CF6]/10 border-l-[4px] border-[#8B5CF6] flex gap-4 items-start">
                      <Terminal className="h-5 w-5 text-[#8B5CF6] shrink-0 mt-1" />
                      <p className="font-black italic uppercase tracking-widest text-[#8B5CF6] text-xl leading-relaxed">
                         "{result.recommendation}"
                      </p>
                   </div>
                   
                   <div className="mt-8 flex gap-4">
                      <MonolithButton 
                        variant="secondary" 
                        className="flex-1"
                        onClick={() => {
                          setResult(null);
                          setFile(null);
                          setJobDescription("");
                        }}
                      >
                        RESET_ANALYZER
                      </MonolithButton>
                      <MonolithButton 
                        variant="primary" 
                        glitch 
                        className="flex-1"
                        onClick={() => window.print()}
                      >
                        EXPORT_READOUT_V2
                      </MonolithButton>
                   </div>
                </MonolithCard>
              </div>
            </div>
            
            <div className="p-4 border-2 border-white/5 flex gap-4 items-center">
               <div className="flex-1 h-[2px] bg-white/5" />
               <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.5em]">EOF_SYSTEM_LOG</span>
               <div className="flex-1 h-[2px] bg-white/5" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
