import { useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
} from 'lucide-react';
import { CustomerEnquiry } from '../../types';

interface EnquiryDetailModalProps {
  enquiry: CustomerEnquiry | null;
  onClose: () => void;
}

export function EnquiryDetailModal({ enquiry, onClose }: EnquiryDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (enquiry) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enquiry, onClose]);

  if (!enquiry) return null;

  const getStatusBadge = (status: CustomerEnquiry['status']) => {
    switch (status) {
      case 'High Priority':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Awaiting Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Quoted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Booked':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-surface-bg text-content-secondary border-surface-muted';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-content-primary/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-detail-title"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-surface-card rounded-2xl shadow-2xl border border-surface-muted overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-surface-muted flex items-start justify-between bg-surface-bg/80">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-brand-teal px-2 py-0.5 rounded-md bg-brand-teal-50 border border-brand-teal-100">
                {enquiry.id}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                  enquiry.status
                )}`}
              >
                {enquiry.status}
              </span>
              <span className="text-xs text-content-muted">•</span>
              <span className="text-xs font-medium text-content-secondary">
                {enquiry.serviceCategory}
              </span>
            </div>
            <h3
              id="enquiry-detail-title"
              className="text-xl font-extrabold text-content-primary"
            >
              {enquiry.serviceTitle}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-content-secondary hover:text-content-primary rounded-lg hover:bg-surface-muted transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Customer & Location Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-surface-bg border border-surface-muted text-xs">
            <div className="space-y-1">
              <div className="text-content-muted flex items-center space-x-1 font-semibold uppercase tracking-wider text-[10px]">
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </div>
              <div className="font-bold text-content-primary text-sm">
                {enquiry.customerName}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-content-muted flex items-center space-x-1 font-semibold uppercase tracking-wider text-[10px]">
                <MapPin className="w-3.5 h-3.5" />
                <span>Service Location</span>
              </div>
              <div className="font-medium text-content-primary truncate" title={enquiry.location}>
                {enquiry.location}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-content-muted flex items-center space-x-1 font-semibold uppercase tracking-wider text-[10px]">
                <Clock className="w-3.5 h-3.5" />
                <span>Received</span>
              </div>
              <div className="font-medium text-content-primary">
                {enquiry.receivedTime} ({enquiry.urgency} Urgency)
              </div>
            </div>
          </div>

          {/* Customer Message Block */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-content-secondary flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-brand-teal" />
              <span>Customer Message</span>
            </h4>
            <div className="p-4 rounded-xl bg-surface-bg/50 border border-surface-muted text-sm text-content-primary leading-relaxed whitespace-pre-line font-normal">
              "{enquiry.message}"
            </div>
          </div>

          {/* AI Suggested Response */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-teal flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-brand-teal" />
                <span>AI-Assisted Draft Proposal</span>
              </h4>
              <span className="text-[11px] text-content-muted flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                <span>Human review required</span>
              </span>
            </div>
            <div className="p-4 rounded-xl bg-brand-teal-50/60 border border-brand-teal-100/80 text-sm text-content-primary leading-relaxed relative">
              <p className="whitespace-pre-line">
                {enquiry.suggestedReply}
              </p>
            </div>
          </div>

          {/* Non-persisted demo notice */}
          <div className="p-3 rounded-xl bg-surface-bg border border-surface-muted flex items-center space-x-2.5 text-xs text-content-secondary">
            <AlertCircle className="w-4 h-4 text-brand-teal flex-shrink-0" />
            <span>
              <strong>Demo View (Phase 3 Step 1):</strong> This view allows inspecting enquiry data.
              Updating statuses, drafting edits, and dispatching quotes will be connected in Step 2.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-surface-bg/80 border-t border-surface-muted flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-surface-muted bg-white hover:bg-surface-bg text-content-primary font-semibold text-xs transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
