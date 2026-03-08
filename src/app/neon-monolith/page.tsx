"use client";

import React from 'react';
import '../../styles/neon-monolith.css';
import MonolithButton from '@/components/neon/MonolithButton';
import MonolithCard from '@/components/neon/MonolithCard';
import MonolithInput from '@/components/neon/MonolithInput';

export default function NeonMonolithPage() {
  return (
    <div className="monolith-container px-6 py-12 md:px-24">
      <div className="monolith-scanlines" />
      
      {/* Header / Nav */}
      <nav className="flex justify-between items-center mb-24 border-b-[3px] border-white pb-4">
        <div className="text-2xl font-black uppercase tracking-tighter">
          NEON<span className="text-[#8B5CF6]">_MONOLITH</span>
        </div>
        <div className="hidden md:flex gap-8 font-mono text-xs uppercase tracking-widest">
          <a href="#" className="hover:text-[#8B5CF6]">System_Core</a>
          <a href="#" className="hover:text-[#8B5CF6]">Neural_Grid</a>
          <a href="#" className="hover:text-[#22C55E]">Archive_Log</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-[#8B5CF6] text-black px-2 py-1 font-mono text-[10px] font-black uppercase mb-6 shadow-[2px_2px_0px_#22C55E]">
              Status: Operational // Build 4.0.2
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              DIGITAL <span className="text-[#8B5CF6] glitch-hover inline-block">ARCHITECTURE</span> CARVED IN OBSIDIAN
            </h1>
            <p className="font-mono text-sm text-white/60 max-w-md mb-12">
              Aggressive aesthetic. Structural integrity. A design system built for the next generation of digital brutalism. Zero border-radius. high-contrast.
            </p>
            <div className="flex flex-wrap gap-6">
              <MonolithButton glitch>Initialize System</MonolithButton>
              <MonolithButton variant="black">View Documentation</MonolithButton>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-[#111] border-[3px] border-white p-4 overflow-hidden relative group">
              <div className="absolute inset-0 bg-[#8B5CF6]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-full h-full border-[1px] border-dashed border-[#8B5CF6]/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-black uppercase tracking-widest mb-2">4044-6806</div>
                  <div className="font-mono text-[10px] text-[#22C55E] uppercase animate-pulse">Scanning Grid_Vector...</div>
                </div>
              </div>
              <div className="absolute top-4 left-4 font-mono text-[8px] opacity-30">SYS_RECOVERY_MODE</div>
              <div className="absolute bottom-4 right-4 font-mono text-[8px] opacity-30 text-[#8B5CF6]">ENCRYPTION_LAYER_v2</div>
            </div>
            {/* Block floating around */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#22C55E] border-[3px] border-black shadow-[4px_4px_0px_#8B5CF6]" />
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="mb-32">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 inline-block border-b-[6px] border-[#8B5CF6]">
          System_Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MonolithCard 
            title="High Voltage" 
            subtitle="Power // Protocol"
            tag="A-1"
            className="md:col-span-2"
          >
            Extreme saturation for maximum engagement. Our violet and green palette is engineered to pierce through digital noise. Optimized for high-persistence displays.
          </MonolithCard>
          
          <MonolithCard 
            title="Kinetic" 
            subtitle="Motion // Physics"
            tag="B-4"
          >
            Stiff, mechanical movements that feel physical. No soft eases. Only raw, binary states.
          </MonolithCard>

          <MonolithCard 
            title="Structural" 
            subtitle="Layout // Grid"
            tag="C-2"
          >
            Everything is a block. Everything has a border. The web is a box, and we celebrate it.
          </MonolithCard>

          <MonolithCard 
            title="Encryption" 
            subtitle="Secure // Private"
            tag="D-9"
            className="md:col-span-2"
          >
            Advanced security layers integrated directly into the visual language. Cyber-brutalism isn't just a look; it's a statement of digital sovereignty.
          </MonolithCard>
        </div>
      </section>

      {/* Technical Data Section */}
      <section className="mb-32 bg-[#111] border-[3px] border-[#8B5CF6] p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/5 rotate-45 translate-x-32 -translate-y-32" />
        <div className="grid md:grid-cols-2 gap-12 relative z-10">
          <div>
            <h2 className="text-4xl font-black uppercase mb-8">Data_Acquisition</h2>
            <p className="font-mono text-sm text-white/50 mb-12">
              Subscribe to the monolith. Receive weekly protocols on digital architecture and high-contrast logic.
            </p>
            <div className="flex flex-col gap-6 max-w-xs">
              <MonolithInput label="Subject ID" placeholder="USER_8482" />
              <MonolithInput label="Encryption Key" placeholder="••••••••" type="password" />
              <MonolithButton variant="green">Authorize Access</MonolithButton>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-3 h-3 ${i === 2 ? 'bg-[#22C55E]' : 'bg-white'}`} />
                  <div className="flex-1 h-2 bg-white/10 relative">
                    <div className="absolute inset-0 bg-[#8B5CF6]" style={{ width: `${10 * i + 30}%` }} />
                  </div>
                  <div className="font-mono text-[10px] w-12">CH-{i*256}</div>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 font-mono text-[10px] text-white/30 flex justify-between">
              <span>LATENCY: 12ms</span>
              <span>BUFFER: CLEAR</span>
              <span>BITRATE: 4.8 GB/S</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 border-t-[3px] border-white flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
        <div className="text-xl font-black uppercase">
          NEON<span className="text-[#8B5CF6]">_MONOLITH</span>
        </div>
        <div className="font-mono text-[10px] text-white/40 uppercase">
          © 2024 ARCHITECTURAL_PROTOCOLS // ALL_RIGHTS_RESERVED
        </div>
        <div className="flex gap-6">
          <div className="w-10 h-10 border-[2px] border-white flex items-center justify-center hover:bg-[#8B5CF6] hover:border-black transition-colors cursor-pointer">
            G
          </div>
          <div className="w-10 h-10 border-[2px] border-white flex items-center justify-center hover:bg-[#22C55E] hover:border-black transition-colors cursor-pointer">
            X
          </div>
        </div>
      </footer>
    </div>
  );
}
