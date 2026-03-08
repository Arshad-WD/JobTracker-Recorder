"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import MonolithButton from "@/components/neon/MonolithButton";
import MonolithCard from "@/components/neon/MonolithCard";
import MonolithInput from "@/components/neon/MonolithInput";
import '../../styles/neon-monolith.css';

export default function LoginPage() {
  const { data: _session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[#8B5CF6]" />
      </div>
    );
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-md relative z-10">
        <div className="mb-12 text-center">
          <Link href="/" className="text-4xl font-black uppercase tracking-tighter">
            JOB<span className="text-[#8B5CF6]">TRACKER</span>
          </Link>
          <p className="font-mono text-[10px] text-[#8B5CF6] uppercase tracking-[0.3em] mt-2">
            Secure_Access_Portal
          </p>
        </div>

        <MonolithCard 
          title="Login" 
          subtitle="Identity Verification Required"
          tag="AUTH-01"
        >
          <form onSubmit={handleEmailLogin} className="space-y-8">
            <div className="space-y-6">
              <MonolithInput
                label="Email Address"
                type="email"
                placeholder="USER@DOMAIN.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <MonolithInput
                label="Security Key"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <MonolithButton type="submit" className="w-full" glitch disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  "Authorize Access"
                )}
              </MonolithButton>

              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 font-mono text-[8px] text-white/30 uppercase">Alternative_Verification</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <MonolithButton 
                type="button" 
                variant="black" 
                className="w-full border-white/20 hover:border-[#8B5CF6]"
                onClick={handleGoogleLogin}
              >
                Continue with Google
              </MonolithButton>
            </div>
          </form>

          <p className="font-mono text-[10px] text-center mt-8 text-white/40 uppercase">
            New Subject?{" "}
            <Link href="/register" className="text-[#8B5CF6] hover:text-[#22C55E] transition-colors">
              Create_Profile
            </Link>
          </p>
        </MonolithCard>

        {/* Technical details decoration */}
        <div className="mt-12 flex justify-between font-mono text-[8px] text-white/20 uppercase tracking-widest">
          <span>Encrypted_Link: Stable</span>
          <span>Buffer: Optimized</span>
          <span>Node: 0x8F2</span>
        </div>
      </div>
    </div>
  );
}
