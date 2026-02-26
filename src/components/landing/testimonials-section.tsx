"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content:
      "JobTracker completely transformed my job search. The incoming call mode saved me during an unexpected recruiter call — I had every detail at my fingertips in seconds.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Full Stack Developer",
    content:
      "I applied to 50+ companies and JobTracker kept me sane. The Kanban board and auto-reminders ensured I never missed a follow-up. Landed my dream job!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Product Designer",
    content:
      "The analytics helped me understand where I was losing candidates in the pipeline. Adjusted my strategy and doubled my interview-to-offer rate.",
    rating: 5,
  },
  {
    name: "Alex Kim",
    role: "DevOps Engineer at Stripe",
    content:
      "Smart tags and duplicate detection saved so much time. Plus the dark mode is gorgeous! Best job tracking tool hands down.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  };

  return (
    <section id="testimonials" className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="text-xs sm:text-sm font-medium text-violet-400 uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Loved by job seekers
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 50 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-6 md:p-10"
          >
            <Quote className="w-8 h-8 text-violet-500/30 mb-4" />
            <p className="text-base md:text-lg text-white/60 leading-relaxed mb-6">
              &ldquo;{testimonials[current].content}&rdquo;
            </p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-sm font-semibold text-white/80">
                  {testimonials[current].name}
                </div>
                <div className="text-xs text-white/40 mt-0.5">
                  {testimonials[current].role}
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Nav buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-violet-400 w-6" : "bg-white/20"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
