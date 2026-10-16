import { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
  User,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CustomerEnquiry } from '../../types';
import { ENQUIRY_STATUSES } from '../../data/mockEnquiries';

interface EnquiryDetailModalProps {
  enquiry: CustomerEnquiry | null;
  onClose: () => void;
  onUpdateStatus: (newStatus: CustomerEnquiry['status']) => void;
}

export function EnquiryDetailModal({ enquiry, onClose, onUpdateStatus }: EnquiryDetailModalProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  // Clear feedback when selected enquiry changes or modal closes
  useEffect(() => {
    setFeedback(null);
  }, [enquiry?.id]);

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

  const handleStatusSelect = (newStatus: CustomerEnquiry['status']) => {
    if (newStatus === enquiry.status) return;
    onUpdateStatus(newStatus);
    setFeedback(`Status updated to "${newStatus}". Stored in session memory.`);
  };

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

  const getStatusActiveStyle = (status: CustomerEnquiry['status']) => {
    switch (status) {
      case 'High Priority':
        return 'bg-rose-100 text-rose-800 border-rose-300 ring-2 ring-rose-400/30';
      case 'Awaiting Review':
        return 'bg-amber-100 text-amber-800 border-amber-300 ring-2 ring-amber-400/30';
      case 'Quoted':
        return 'bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-400/30';
      case 'Booked':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-400/30';
      default:
        return 'bg-brand-teal-50 text-brand-teal border-brand-teal-200 ring-2 ring-brand-teal/30';
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
          {/* Status Feedback Confirmation Banner */}
          {feedback && (
            <div
              role="status"
              aria-live="polite"
              className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs animate-fadeIn"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold">{feedback}</span>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg hover:bg-emerald-100 transition-colors"
                aria-label="Dismiss status notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

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

          {/* Interactive Status Update Control Section */}
          <div className="p-4 rounded-xl bg-surface-bg/70 border border-surface-muted space-y-3">
            <div className="flex items-center justify-between">
              <label
                id="status-control-label"
                className="text-xs font-bold uppercase tracking-wider text-content-secondary flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                <span>Change Enquiry Status</span>
              </label>
              <span className="text-[11px] text-content-muted">
                Immediate in-memory update
              </span>
            </div>

            <div
              role="group"
              aria-labelledby="status-control-label"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
            >
              {ENQUIRY_STATUSES.map((statusOption) => {
                const isCurrent = enquiry.status === statusOption;
                return (
                  <button
                    key={statusOption}
                    type="button"
                    onClick={() => handleStatusSelect(statusOption)}
                    aria-pressed={isCurrent}
                    className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      isCurrent
                        ? `${getStatusActiveStyle(statusOption)} cursor-default`
                        : 'bg-white border-surface-muted text-content-secondary hover:text-content-primary hover:border-brand-teal/40 hover:bg-surface-bg shadow-xs active:scale-[0.98]'
                    } focus-visible:outline-brand-teal`}
                    id={`status-btn-${statusOption.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />}
                    <span>{statusOption}</span>
                  </button>
                );
              })}
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

          {/* In-memory demo notice */}
          <div className="p-3.5 rounded-xl bg-surface-bg border border-surface-muted flex items-start space-x-2.5 text-xs text-content-secondary">
            <AlertCircle className="w-4 h-4 text-brand-teal flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold text-content-primary">
                Demo Mode Notice (In-Memory Session Only):
              </span>
              <p className="leading-relaxed">
                Status changes update workspace metrics, list order, and filters immediately in React state.
                Because backend database persistence is scheduled for future increments, any updates exist only in browser memory and will reset upon page reload.
              </p>
            </div>
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
