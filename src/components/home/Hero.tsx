'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { CTAButton } from '../ui/CTAButton';

export const Hero = () => {
  return (
    <section className="relative w-full pt-32 pb-24 overflow-hidden bg-bg">
      {/* Subtle background abstract shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-20" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-[100px] opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-sm font-medium text-text-secondary mb-8 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-primary" />
              Trusted Knowledge Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-extrabold text-text-primary tracking-tight leading-[1.1] mb-6"
            >
              Master AI & Crypto Knowledge
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg lg:text-xl text-text-secondary mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Hrilosopah is a premium platform designed to test, validate, and expand your
              understanding of the world’s most transformative technologies.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <CTAButton href="#quizzes" variant="primary" className="w-full sm:w-auto">
                Start Learning
              </CTAButton>
              <CTAButton href="#features" variant="secondary" className="w-full sm:w-auto">
                Explore Quizzes
              </CTAButton>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Premium Dashboard/Abstract Illustration representation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-surface to-white rounded-[40px] shadow-2xl border border-border/50 overflow-hidden p-8 flex flex-col gap-6">
                <div className="w-full h-1/2 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/10 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <span className="text-4xl">🧠</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 h-24 rounded-2xl bg-surface border border-border shadow-sm p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm">💎</span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full" />
                  </div>
                  <div className="flex-1 h-24 rounded-2xl bg-surface border border-border shadow-sm p-4 flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <span className="text-sm">✓</span>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
