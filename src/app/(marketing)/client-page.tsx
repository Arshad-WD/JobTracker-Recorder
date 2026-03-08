"use client";

import React from 'react';
import '../../styles/neon-monolith.css';
import MonolithButton from '@/components/neon/MonolithButton';
import MonolithCard from '@/components/neon/MonolithCard';
import MonolithInput from '@/components/neon/MonolithInput';
import Link from 'next/link';

export default function ClientLandingPage() {
  return (
    <div className="px-6 py-12 md:px-24">
      
      {/* Header / Nav */}
      <nav className="flex justify-between items-center mb-24 border-b-[3px] border-white pb-4">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter">
          JOB<span className="text-[#8B5CF6]">TRACKER</span>
        </Link>
        <div className="hidden md:flex gap-8 font-mono text-xs uppercase tracking-widest">
          <Link href="#features" className="hover:text-[#8B5CF6]">FEATURES</Link>
          <Link href="#pricing" className="hover:text-[#8B5CF6]">PRICING</Link>
          <Link href="/login" className="hover:text-[#22C55E]">LOGIN</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-[#8B5CF6] text-black px-2 py-1 font-mono text-[10px] font-black uppercase mb-6 shadow-[2px_2px_0px_#22C55E]">
              STATUS: OPERATIONAL // AGENTIC_MODE_ENABLED
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              TRACK EVERY <span className="text-[#8B5CF6] glitch-hover inline-block">APPLICATION</span>. MISS NOTHING.
            </h1>
            <p className="font-mono text-sm text-white/60 max-w-md mb-12">
              The intelligent job tracking system built for serious candidates. Never lose track of where you applied again. High-contrast organization for the elite hunter.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link href="/register">
                <MonolithButton glitch>GET STARTED</MonolithButton>
              </Link>
              <Link href="/login">
                <MonolithButton variant="black">LOGIN</MonolithButton>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-[#111] border-[3px] border-white p-4 overflow-hidden relative group">
              <div className="absolute inset-0 bg-[#8B5CF6]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-full h-full border-[1px] border-dashed border-[#8B5CF6]/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-black uppercase tracking-widest mb-2">SCANNING...</div>
                  <div className="font-mono text-[10px] text-[#22C55E] uppercase animate-pulse">DETECTING_OPPORTUNITIES</div>
                </div>
              </div>
              <div className="absolute top-4 left-4 font-mono text-[8px] opacity-30">ENCRYPTED_JOBS</div>
              <div className="absolute bottom-4 right-4 font-mono text-[8px] opacity-30 text-[#8B5CF6]">RESUME_HACK_V3</div>
            </div>
            {/* Block floating around */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#22C55E] border-[3px] border-black shadow-[4px_4px_0px_#8B5CF6]" />
          </div>
        </div>
      </section>

      {/* Features bento grid */}
      <section id="features" className="mb-32">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 inline-block border-b-[6px] border-[#8B5CF6]">
          PLATFORM_FEATURES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MonolithCard 
            title="Real-time Tracking" 
            subtitle="Data // Synchronization"
            tag="F-1"
            className="md:col-span-2"
          >
            Track every stage of your application with military precision. From first contact to final offer, the monolith records everything.
          </MonolithCard>
          
          <MonolithCard 
            title="Smart Reminders" 
            subtitle="Notify // Action"
            tag="F-2"
          >
            Automated alerts when interviews are pending. High-voltage notifications to ensure you never miss a follow-up.
          </MonolithCard>

          <MonolithCard 
            title="Resume Analytics" 
            subtitle="Parser // Insight"
            tag="F-3"
          >
            Detailed insights into your application performance. Visualize your success rate with raw technical data.
          </MonolithCard>

          <MonolithCard 
            title="Secure Vault" 
            subtitle="Identity // Protection"
            tag="F-4"
            className="md:col-span-2"
          >
            Your resume and application history are encrypted. Digital sovereignty for the modern candidate.
          </MonolithCard>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="mb-32">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 inline-block border-b-[6px] border-[#22C55E]">
          PRICING_PLANS
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          <MonolithCard 
            title="Core Access" 
            subtitle="Free // Unlimited"
            tag="P-1"
          >
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-xl border-b border-white/10 pb-2">
                <span>Monthly Credit</span>
                <span>$0.00</span>
              </div>
              <ul className="text-xs space-y-2 opacity-60">
                <li>• Unlimited Applications</li>
                <li>• Basic Analytics</li>
                <li>• Secure Storage</li>
              </ul>
            </div>
            <MonolithButton className="w-full">GET STARTED</MonolithButton>
          </MonolithCard>

          <MonolithCard 
            title="Elite Access" 
            subtitle="PRO // Advanced"
            tag="P-2"
          >
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-xl border-b border-white/10 pb-2">
                <span>Monthly Credit</span>
                <span className="text-[#8B5CF6]">$19.99</span>
              </div>
              <ul className="text-xs space-y-2 opacity-60">
                <li>• AI Interview Preparation</li>
                <li>• Priority Support</li>
                <li>• Bulk Export/Import</li>
              </ul>
            </div>
            <MonolithButton variant="green" className="w-full">UPGRADE TO ELITE</MonolithButton>
          </MonolithCard>
        </div>
      </section>


      {/* Footer */}
      <footer className="pt-24 border-t-[3px] border-white flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
        <div className="text-xl font-black uppercase">
          JOB<span className="text-[#8B5CF6]">TRACKER</span>
        </div>
        <div className="font-mono text-[10px] text-white/40 uppercase">
          © 2024 SYSTEM_ARCHITECT // ALL_SYSTEMS_GO
        </div>
        <div className="flex gap-6">
          <div className="w-10 h-10 border-[2px] border-white flex items-center justify-center hover:bg-[#8B5CF6] hover:border-black transition-colors cursor-pointer font-black text-xs">
            GH
          </div>
          <div className="w-10 h-10 border-[2px] border-white flex items-center justify-center hover:bg-[#22C55E] hover:border-black transition-colors cursor-pointer font-black text-xs">
            TW
          </div>
        </div>
      </footer>
    </div>
  );
}
