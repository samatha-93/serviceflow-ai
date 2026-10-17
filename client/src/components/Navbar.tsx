import { useState } from 'react';
import { Sparkles, Menu, X, ArrowRight, Inbox, LogOut, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  onOpenGetStarted: () => void;
  onOpenWorkspace: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export function Navbar({
  onOpenGetStarted,
  onOpenWorkspace,
  currentUser,
  onOpenAuth,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#hero-section' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Services', href: '#services' },
  ];

  const handleReturnToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash !== '') {
      window.history.pushState(null, '', '#');
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070913]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Wordmark with Accessible Return-to-Top */}
          <div className="flex items-center space-x-3">
            <a
              href="#hero-section"
              onClick={handleReturnToTop}
              className="flex items-center space-x-2.5 group focus-visible:rounded-lg focus-visible:outline-violet-500"
              aria-label="ServiceFlow AI - Return to top"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-violet-600 text-white flex items-center justify-center border border-violet-400/30 group-hover:bg-violet-500 transition-colors">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white leading-tight">
                  ServiceFlow <span className="text-violet-400 font-extrabold">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium hidden sm:block">
                  Less Admin. Better Business.
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={link.label === 'Home' ? handleReturnToTop : undefined}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors focus-visible:outline-violet-500 focus-visible:rounded"
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
              className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/[0.05] text-slate-200 hover:bg-white/[0.1] hover:text-white border border-white/10 transition-colors focus-visible:outline-violet-500"
              id="nav-workspace-btn"
              title="Open Enquiry Management Workspace"
            >
              <Inbox className="w-3.5 h-3.5 text-violet-400" />
              <span>Workspace</span>
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-2 border-l border-white/10 pl-3">
                <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#0F142D] border border-white/10 text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-violet-400" />
                  <span className="font-semibold text-slate-200 max-w-[120px] truncate" title={currentUser.businessName}>
                    {currentUser.businessName}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                  id="nav-logout-btn"
                  title="Sign out of your business account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-2.5 py-1.5 transition-colors"
                  id="nav-signin-btn"
                >
                  Sign In
                </button>

                {/* Refined Get Started Button — Clean, balanced, no excessive neon */}
                <button
                  onClick={onOpenGetStarted}
                  className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium px-4 py-1.5 sm:py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white border border-violet-400/30 transition-colors shadow-sm focus-visible:outline-violet-500"
                  id="nav-get-started-btn"
                  title="Explore early access and platform preview"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-white/10 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle Navigation Menu"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-t border-white/10 bg-[#0B0F24]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn"
          id="mobile-nav-menu"
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.label === 'Home') handleReturnToTop(e);
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWorkspace();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] rounded-lg border border-white/10"
              id="mobile-nav-workspace-btn"
            >
              <Inbox className="w-4 h-4 text-violet-400" />
              <span>Enquiry Workspace</span>
            </button>
            {currentUser ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#0F142D] border border-white/10 text-xs">
                  <UserCheck className="w-4 h-4 text-violet-400" />
                  <span className="font-semibold text-white">
                    {currentUser.businessName} ({currentUser.name})
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium text-rose-400 bg-rose-950/40 hover:bg-rose-900/40 rounded-lg border border-rose-800/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full text-center py-2 text-sm font-medium text-slate-200 hover:bg-white/[0.06] rounded-lg border border-white/10"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGetStarted();
                  }}
                  className="w-full flex items-center justify-center space-x-1.5 py-2 text-sm font-medium rounded-lg bg-violet-600 hover:bg-violet-500 text-white border border-violet-400/30"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
