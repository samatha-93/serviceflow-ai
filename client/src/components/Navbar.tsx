import { useState } from 'react';
import { Sparkles, Menu, X, ArrowRight, Inbox } from 'lucide-react';

interface NavbarProps {
  onOpenGetStarted: () => void;
  onOpenWorkspace: () => void;
}

export function Navbar({ onOpenGetStarted, onOpenWorkspace }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Services', href: '#services' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-surface-muted bg-surface-card/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Wordmark */}
          <div className="flex items-center space-x-3">
            <a
              href="#"
              className="flex items-center space-x-2.5 group focus-visible:rounded-lg focus-visible:outline-brand-teal"
              aria-label="ServiceFlow AI Homepage"
            >
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-content-primary leading-tight">
                  ServiceFlow <span className="text-brand-teal font-extrabold">AI</span>
                </span>
                <span className="text-[10px] text-content-secondary tracking-wider uppercase font-medium hidden sm:block">
                  Less Admin. Better Business.
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-content-secondary hover:text-brand-teal transition-colors focus-visible:outline-brand-teal focus-visible:rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Workspace Button */}
            <button
              onClick={onOpenWorkspace}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-brand-teal-50 text-brand-teal hover:bg-brand-teal-100 border border-brand-teal-100 transition-colors shadow-xs focus-visible:outline-brand-teal"
              id="nav-workspace-btn"
              title="Open Enquiry Management Workspace"
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </button>

            {/* Sign In Button (Informative modal, no fake auth) */}
            <button
              onClick={onOpenGetStarted}
              className="text-sm font-semibold text-content-primary hover:text-brand-teal px-3 py-2 transition-colors"
              id="nav-signin-btn"
            >
              Sign In
            </button>

            {/* Primary CTA */}
            <button
              onClick={onOpenGetStarted}
              className="inline-flex items-center space-x-2 text-sm font-semibold px-4 py-2 rounded-xl bg-brand-teal text-white hover:bg-brand-teal-light shadow-soft hover:shadow-card hover:scale-[1.02] active:scale-[0.98] transition-all"
              id="nav-get-started-btn"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-content-primary hover:bg-surface-muted transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-surface-muted bg-surface-card px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fadeIn"
          id="mobile-nav-menu"
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-base font-medium text-content-primary hover:bg-surface-bg hover:text-brand-teal transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-surface-muted flex flex-col space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWorkspace();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 text-sm font-semibold text-brand-teal bg-brand-teal-50 hover:bg-brand-teal-100 rounded-lg border border-brand-teal-100"
              id="mobile-nav-workspace-btn"
            >
              <Inbox className="w-4 h-4" />
              <span>Enquiry Workspace</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGetStarted();
              }}
              className="w-full text-center py-2.5 text-sm font-semibold text-content-primary hover:bg-surface-bg rounded-lg border border-surface-muted"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGetStarted();
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 text-sm font-semibold rounded-xl bg-brand-teal text-white hover:bg-brand-teal-light shadow-soft"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
