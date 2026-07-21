import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className="inline-block text-2xl font-black text-primary tracking-tight mb-4"
            >
              Hrilosopah
            </Link>
            <p className="text-text-secondary max-w-sm">
              A premium knowledge platform where you can test, validate, and expand your
              understanding of the world&apos;s most transformative technologies.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-text-primary mb-4 uppercase tracking-wider text-sm">
              Platform
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#quizzes"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Quizzes
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-text-primary mb-4 uppercase tracking-wider text-sm">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-text-secondary text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Hrilosopah. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs font-semibold text-silver uppercase tracking-widest">
              Powered by Stripe
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
