import { Sparkles, Github, ExternalLink, Activity, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenDiagnostics: () => void;
  backendStatus: 'healthy' | 'offline' | 'checking';
}

export function Footer({ onOpenDiagnostics, backendStatus }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-surface-muted bg-surface-card text-content-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Mission Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="h-9 w-9 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-soft">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                ServiceFlow <span className="text-brand-teal">AI</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-content-secondary">
              Less Admin. Better Business.
            </p>

            <p className="text-xs text-content-secondary leading-relaxed max-w-sm">
              The intelligent operating core for service businesses. Manage customer enquiries,
              coordinate bookings, and streamline administrative tasks with human-in-the-loop AI
              assistance.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <a
                href="https://github.com/samatha-93/serviceflow-ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-content-secondary hover:text-brand-teal transition-colors"
                id="footer-github-link"
              >
                <Github className="w-4 h-4" />
                <span>samatha-93/serviceflow-ai</span>
                <ExternalLink className="w-3 h-3 ml-0.5 text-content-muted" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-content-primary">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-content-secondary">
              <li>
                <a href="#features" className="hover:text-brand-teal transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-brand-teal transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-brand-teal transition-colors">
                  Service Verticals
                </a>
              </li>
              <li>
                <a href="#hero-section" className="hover:text-brand-teal transition-colors">
                  Interactive Preview
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture & Engineering Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-content-primary">
              Engineering & Diagnostics
            </h4>
            <p className="text-xs text-content-secondary leading-relaxed">
              ServiceFlow AI is engineered as a clean TypeScript monorepo with an Express API and
              Vite React frontend.
            </p>

            <div className="pt-1">
              <button
                onClick={onOpenDiagnostics}
                className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-lg border border-surface-muted hover:border-brand-teal/40 bg-surface-bg text-content-primary hover:text-brand-teal transition-all"
                id="footer-diagnostics-btn"
              >
                <Activity className="w-3.5 h-3.5 text-brand-teal" />
                <span>Backend System Diagnostics</span>
                <span
                  className={`w-2 h-2 rounded-full ml-1 ${
                    backendStatus === 'healthy'
                      ? 'bg-emerald-500'
                      : backendStatus === 'offline'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 pt-6 border-t border-surface-muted flex flex-col sm:flex-row items-center justify-between text-xs text-content-secondary gap-4">
          <div className="flex items-center space-x-3">
            <span>© {new Date().getFullYear()} ServiceFlow AI.</span>
            <span>•</span>
            <span>MIT License</span>
            <span>•</span>
            <span className="text-content-muted">Phase 1 Foundation</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center space-x-1.5 text-xs text-content-secondary hover:text-brand-teal transition-colors"
            id="back-to-top-btn"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
