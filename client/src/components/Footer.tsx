import { Sparkles, ArrowUp } from 'lucide-react';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Brand & Product Description */}
          <div className="space-y-3 max-w-md">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-soft">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                ServiceFlow <span className="text-brand-teal">AI</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-content-secondary">
              Less Admin. Better Business.
            </p>

            <p className="text-xs text-content-secondary leading-relaxed">
              The intelligent operating core for service businesses. Manage customer enquiries,
              coordinate bookings, and streamline administrative tasks with human-in-the-loop AI
              assistance.
            </p>
          </div>

          {/* Product Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-content-primary">
              Product
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
                  Services
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-10 pt-6 border-t border-surface-muted flex flex-col sm:flex-row items-center justify-between text-xs text-content-secondary gap-4">
          <div className="flex items-center space-x-3">
            <span>© {new Date().getFullYear()} ServiceFlow AI.</span>
            <span>•</span>
            {/* Unobtrusive developer status / diagnostics trigger */}
            <button
              onClick={onOpenDiagnostics}
              className="inline-flex items-center space-x-1.5 text-content-muted hover:text-brand-teal transition-colors focus-visible:outline-brand-teal rounded px-1"
              title="System Diagnostics (Dev)"
              id="footer-diagnostics-btn"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus === 'healthy'
                    ? 'bg-emerald-500'
                    : backendStatus === 'offline'
                    ? 'bg-rose-500'
                    : 'bg-amber-500'
                }`}
              />
              <span>System Status</span>
            </button>
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
