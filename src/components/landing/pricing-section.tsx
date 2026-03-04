"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Up to 25 applications",
      "Basic search",
      "Table & list views",
      "Email reminders",
      "CSV export",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "Everything you need to land the job",
    features: [
      "Unlimited applications",
      "Smart search + incoming call mode",
      "Kanban board + all views",
      "AI insights & scoring",
      "Auto-reminders (3-level)",
      "Analytics dashboard",
      "Resume version tracking",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Team",
    price: "$19",
    period: "/user/mo",
    description: "For career coaches & bootcamps",
    features: [
      "Everything in Pro",
      "Team dashboard",
      "Shared analytics",
      "Bulk student import",
      "Admin controls",
      "API access",
      "Custom branding",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative py-24 md:py-36 px-4 sm:px-6 lg:px-8"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/[0.03] rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 glass-bubble-sm text-[11px] font-semibold text-violet-400 uppercase tracking-[0.15em] mb-4">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
            Simple, transparent pricing
          </h2>
          <p className="mt-5 text-base md:text-lg text-white/30 max-w-lg mx-auto font-light">
            Start free and upgrade when you need more power.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col p-6 md:p-7 transition-all duration-300 ${
                plan.popular
                  ? "glass-bubble-lg"
                  : "glass-bubble"
              }`}
              style={
                plan.popular
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(99, 102, 241, 0.03))",
                      borderColor: "rgba(139, 92, 246, 0.15)",
                    }
                  : undefined
              }
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 glass-cta px-4 py-1.5 text-[11px] font-semibold text-white flex items-center gap-1.5 !rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              {/* Glow for popular */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-violet-500/[0.06] rounded-full blur-[60px] pointer-events-none" />
              )}

              <div className="relative mb-6">
                <h3 className="text-lg font-semibold text-white/70">
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-sm text-white/30">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-white/30">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-white/40"
                  >
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.popular ? "text-violet-400" : "text-cyan-400/60"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`relative w-full py-3 text-center rounded-2xl text-sm font-medium transition-all duration-300 ${
                  plan.popular
                    ? "glass-cta text-white"
                    : "glass-btn text-white/60 hover:text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
