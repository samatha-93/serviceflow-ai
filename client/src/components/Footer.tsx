import { Sparkles, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenDiagnostics: () => void;
  backendStatus: 'healthy' | 'offline' | 'checking';
  onOpenWorkspace?: () => void;
}

export function Footer({ onOpenDiagnostics, backendStatus, onOpenWorkspace }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#050711] text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          {/* Brand & Product Description */}
          <div className="space-y-3 max-w-md">
            <div className="flex items-center space-x-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-violet-500/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                ServiceFlow <span className="text-violet-400">AI</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-300">
              Less Admin. Better Business.
            </p>

            <p className="text-xs text-slate-400 leading-relaxed">
              The intelligent operating core for service businesses. Manage customer enquiries,
              coordinate bookings, and streamline administrative tasks with human-in-the-loop AI
              assistance.
            </p>
          </div>

          {/* Product Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Product
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="#features" className="hover:text-violet-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-violet-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-violet-400 transition-colors">
                  Services
                </a>
              </li>
              {onOpenWorkspace && (
                <li>
                  <button
                    onClick={onOpenWorkspace}
                    className="hover:text-violet-300 transition-colors text-left font-medium text-violet-400"
                  >
                    Enquiry Workspace
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span>© {new Date().getFullYear()} ServiceFlow AI.</span>
            <span>•</span>
            <span className="font-medium text-slate-200">Built by Samatha Reddy</span>
            <span>•</span>
            {/* Unobtrusive developer status / diagnostics trigger */}
            <button
              onClick={onOpenDiagnostics}
              className="inline-flex items-center space-x-1.5 text-slate-400 hover:text-violet-400 transition-colors focus-visible:outline-violet-400 rounded px-1"
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
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-violet-400 transition-colors"
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
