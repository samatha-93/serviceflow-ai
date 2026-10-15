import { useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Github } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreDemo: () => void;
}

export function GetStartedModal({ isOpen, onClose, onExploreDemo }: GetStartedModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-content-primary/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="get-started-modal-title"
    >
      <div className="relative w-full max-w-lg bg-surface-card rounded-2xl shadow-2xl border border-surface-muted overflow-hidden">
        {/* Header with decorative badge */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-content-secondary hover:text-content-primary rounded-lg hover:bg-surface-muted transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
              Early Access & Interactive Demo
            </span>
            <h3 id="get-started-modal-title" className="text-2xl font-extrabold text-content-primary">
              Welcome to ServiceFlow AI
            </h3>
            <p className="text-sm text-content-secondary leading-relaxed pt-1">
              ServiceFlow AI is currently in active Phase 1 foundation development. Rather than
              requiring an account, you can explore the complete interactive dashboard preview
              directly on this page.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-surface-muted">
            <div className="flex items-start space-x-2.5 text-xs text-content-secondary">
              <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-content-primary">Interactive Triage:</strong> Review incoming customer enquiries and inspect AI-drafted replies.
              </span>
            </div>
            <div className="flex items-start space-x-2.5 text-xs text-content-secondary">
              <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-content-primary">Schedule Coordination:</strong> View daily booking slots and field technician dispatches.
              </span>
            </div>
            <div className="flex items-start space-x-2.5 text-xs text-content-secondary">
              <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-content-primary">Human-in-the-Loop:</strong> Experience how approvals work before any messages are sent.
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                onExploreDemo();
              }}
              className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-brand-teal text-white hover:bg-brand-teal-light font-semibold text-sm shadow-soft transition-all"
            >
              <span>Explore Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://github.com/samatha-93/serviceflow-ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-surface-muted bg-surface-bg hover:bg-surface-card text-content-primary font-semibold text-sm transition-colors"
            >
              <Github className="w-4 h-4 text-content-secondary" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="px-6 py-3 bg-surface-bg/80 border-t border-surface-muted text-center text-xs text-content-muted">
          No credit card or registration needed during Phase 1 Foundation preview.
        </div>
      </div>
    </div>
  );
}
