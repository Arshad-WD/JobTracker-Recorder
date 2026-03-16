import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JobTracker — Smart Job Application Tracker",
  description:
    "Track every job application, interview, and follow-up in one beautiful dashboard. Stay organized in your job search.",
  keywords: ["job tracker", "application tracker", "job search", "career"],
};

import '@/styles/neon-monolith.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="monolith-container min-h-screen relative">
            <div className="monolith-scanlines" />
            <div className="relative z-10">
              {children}
            </div>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "black",
                color: "white",
                border: "3px solid white",
                borderRadius: "0px",
                fontFamily: "JetBrains Mono, monospace"
              },
            }}
          />
        </Providers>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4ZGNHKFMK8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4ZGNHKFMK8');
          `}
        </Script>
      </body>
    </html>
  );
}
