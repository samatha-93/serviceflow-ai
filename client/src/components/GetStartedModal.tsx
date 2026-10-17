import { useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="get-started-modal-title"
    >
      <div className="relative w-full max-w-lg bg-[#0D1126] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header with decorative badge */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-400">
              Early Access & Interactive Demo
            </span>
            <h3 id="get-started-modal-title" className="text-2xl font-extrabold text-white">
              Welcome to ServiceFlow AI
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed pt-1">
              ServiceFlow AI is currently in active early access preview. You can explore the complete
              interactive dashboard preview directly on this page.
            </p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-white/10">
            <div className="flex items-start space-x-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Interactive Triage:</strong> Review incoming customer enquiries and inspect AI-drafted replies.
              </span>
            </div>
            <div className="flex items-start space-x-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Schedule Coordination:</strong> View daily booking slots and field technician dispatches.
              </span>
            </div>
            <div className="flex items-start space-x-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Human-in-the-Loop:</strong> Experience how approvals work before any messages are sent.
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                onExploreDemo();
              }}
              className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl border border-white/10 bg-[#121838] hover:bg-[#1A224E] text-slate-200 font-semibold text-sm transition-colors"
            >
              <span>Close</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-3 bg-[#070913]/90 border-t border-white/10 text-center text-xs text-slate-400">
          No credit card or registration needed during the interactive preview.
        </div>
      </div>
    </div>
  );
}
