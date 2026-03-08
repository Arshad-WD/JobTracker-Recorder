import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientLandingPage from "./client-page";

export const metadata: Metadata = {
  title: "JobTracker — Track Every Application. Miss Nothing.",
  description:
    "The intelligent job tracking system built for serious candidates. Never lose track of where you applied again.",
  openGraph: {
    title: "JobTracker — Track Every Application. Miss Nothing.",
    description: "Smart job application tracking for serious candidates.",
    type: "website",
  },
};

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }

  return <ClientLandingPage />;
}
