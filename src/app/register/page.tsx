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

export default function RegisterPage() {
  const { data: _session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
      });
    } catch {
      setError("System error. Re-try verification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
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
            Create_User_Profile
          </p>
        </div>

        <MonolithCard 
          title="Sign Up" 
          subtitle="Initialize New Account"
          tag="AUTH-02"
        >
          {error && (
            <div className="mb-6 p-4 border-[2px] border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444] font-mono text-[10px] uppercase">
              [ERROR]: {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <MonolithInput
              label="Full Name"
              placeholder="JOHN_DOE"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <MonolithInput
              label="Email"
              type="email"
              placeholder="USER@DOMAIN.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <MonolithInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <MonolithInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="space-y-4 pt-4">
              <MonolithButton type="submit" className="w-full" glitch disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  "Create Account"
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
                onClick={handleGoogleSignup}
              >
                Sign up with Google
              </MonolithButton>
            </div>
          </form>

          <p className="font-mono text-[10px] text-center mt-8 text-white/40 uppercase">
            Already registered?{" "}
            <Link href="/login" className="text-[#8B5CF6] hover:text-[#22C55E] transition-colors">
              Authorize_Login
            </Link>
          </p>
        </MonolithCard>

        {/* Technical details decoration */}
        <div className="mt-12 flex justify-between font-mono text-[8px] text-white/20 uppercase tracking-widest">
          <span>Encryption: AES-256</span>
          <span>Access: Public_Cloud</span>
          <span>Region: Global_Grid</span>
        </div>
      </div>
    </div>
  );
}
