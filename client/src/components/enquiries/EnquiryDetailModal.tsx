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
  Loader2,
  WifiOff,
  AlertTriangle,
  CalendarPlus,
  Check,
} from 'lucide-react';
import { CustomerEnquiry, CreateBookingPayload } from '../../types';
import { ENQUIRY_STATUSES } from '../../data/mockEnquiries';

interface EnquiryDetailModalProps {
  enquiry: CustomerEnquiry | null;
  onClose: () => void;
  /** Async handler — returns an object with success flag and user-visible message. */
  onUpdateStatus: (
    id: string,
    newStatus: CustomerEnquiry['status'],
  ) => Promise<{ success: boolean; message: string }>;
  /** Optional handler to convert this enquiry into a persistent Booking */
  onConvertToBooking?: (
    bookingPayload: CreateBookingPayload
  ) => Promise<{ success: boolean; message: string; bookingId?: string }>;
  /** True while a PATCH request is in flight. */
  statusUpdating: boolean;
  /** Non-null when the last status update failed. */
  statusError: string | null;
  /** 'api' when live data is loaded; 'demo' when server was offline. */
  dataSource: 'api' | 'demo';
  /** 'connected' | 'disconnected' | string indicating MongoDB state. */
  databaseStatus?: string;
}

export function EnquiryDetailModal({
  enquiry,
  onClose,
  onUpdateStatus,
  onConvertToBooking,
  statusUpdating,
  statusError,
  dataSource,
  databaseStatus,
}: EnquiryDetailModalProps) {
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);

  // Convert to Booking form state
  const [showConvertForm, setShowConvertForm] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertedId, setConvertedId] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('09:30 AM');
  const [duration, setDuration] = useState('1.5 hrs');
  const [assignee, setAssignee] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  // Clear feedback and reset conversion form when selected enquiry changes
  useEffect(() => {
    setFeedback(null);
    setShowConvertForm(false);
    setConverting(false);
    setConvertedId(null);
    if (enquiry) {
      setBookingNotes(enquiry.message || '');
      const today = new Date();
      setBookingDate(today.toISOString().split('T')[0]);
      setBookingTime('09:30 AM');
    }
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

  const handleStatusSelect = async (newStatus: CustomerEnquiry['status']) => {
    if (newStatus === enquiry.status || statusUpdating) return;
    setFeedback(null);
    const result = await onUpdateStatus(enquiry.id, newStatus);
    setFeedback({ text: result.message, ok: result.success });
  };

  const getStatusBadge = (status: CustomerEnquiry['status']) => {
    switch (status) {
      case 'High Priority':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Awaiting Review':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Quoted':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Booked':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  const getStatusActiveStyle = (status: CustomerEnquiry['status']) => {
    switch (status) {
      case 'High Priority':
        return 'bg-rose-500/25 text-rose-200 border-rose-400 ring-2 ring-rose-500/40';
      case 'Awaiting Review':
        return 'bg-amber-500/25 text-amber-200 border-amber-400 ring-2 ring-amber-500/40';
      case 'Quoted':
        return 'bg-sky-500/25 text-sky-200 border-sky-400 ring-2 ring-sky-500/40';
      case 'Booked':
        return 'bg-emerald-500/25 text-emerald-200 border-emerald-400 ring-2 ring-emerald-500/40';
      default:
        return 'bg-violet-500/25 text-violet-200 border-violet-400 ring-2 ring-violet-500/40';
    }
  };

  const handleConfirmConvert = async () => {
    if (!onConvertToBooking || converting) return;
    if (!bookingDate || !bookingTime) {
      setFeedback({ text: 'Please provide both booking date and time.', ok: false });
      return;
    }
    setConverting(true);
    setFeedback(null);
    try {
      const result = await onConvertToBooking({
        enquiryId: enquiry.id,
        customerName: enquiry.customerName,
        serviceTitle: enquiry.serviceTitle,
        location: enquiry.location,
        bookingDate,
        bookingTime,
        duration,
        assignee,
        notes: bookingNotes,
        status: 'Confirmed',
      });
      if (result.success) {
        setConvertedId(result.bookingId || 'Confirmed');
        setShowConvertForm(false);
        setFeedback({ text: result.message, ok: true });
      } else {
        setFeedback({ text: result.message, ok: false });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to convert enquiry to booking';
      setFeedback({ text: msg, ok: false });
    } finally {
      setConverting(false);
    }
  };

  const isBooked = enquiry.status === 'Booked' || !!convertedId;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-detail-title"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0D1126] rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-start justify-between bg-[#070913]/90">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-violet-300 px-2.5 py-0.5 rounded-md bg-violet-500/15 border border-violet-500/30">
                {enquiry.id}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                  enquiry.status
                )}`}
              >
                {enquiry.status}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-medium text-slate-400">
                {enquiry.serviceCategory}
              </span>
            </div>
            <h3
              id="enquiry-detail-title"
              className="text-xl font-extrabold text-white"
            >
              {enquiry.serviceTitle}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Feedback Banner */}
          {feedback && (
            <div
              role="status"
              aria-live="polite"
              className={`p-3.5 rounded-xl text-xs flex items-center justify-between shadow-xs animate-fadeIn border ${
                feedback.ok
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                {feedback.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
                <span className="font-semibold">{feedback.text}</span>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className={`p-1 rounded-lg transition-colors ${
                  feedback.ok
                    ? 'text-emerald-300 hover:text-white hover:bg-emerald-500/20'
                    : 'text-rose-300 hover:text-white hover:bg-rose-500/20'
                }`}
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Persistent status-update error (from parent) */}
          {statusError && !feedback && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span className="font-semibold">{statusError}</span>
            </div>
          )}

          {/* Customer & Location Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#070913] border border-white/10 text-xs">
            <div className="space-y-1">
              <div className="text-slate-400 flex items-center space-x-1 font-semibold uppercase tracking-wider text-[10px]">
                <User className="w-3.5 h-3.5 text-violet-400" />
                <span>Customer</span>
              </div>
              <div className="font-bold text-white text-sm">
                {enquiry.customerName}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-slate-400 flex items-center space-x-1 font-semibold uppercase tracking-wider text-[10px]">
                <MapPin className="w-3.5 h-3.5 text-violet-400" />
                <span>Service Location</span>
              </div>
              <div className="font-medium text-slate-300 truncate" title={enquiry.location}>
                {enquiry.location}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-slate-400 flex items-center space-x-1 font-semibold uppercase tracking-wider text-[10px]">
                <Clock className="w-3.5 h-3.5 text-violet-400" />
                <span>Received</span>
              </div>
              <div className="font-medium text-slate-300">
                {enquiry.receivedTime} ({enquiry.urgency} Urgency)
              </div>
            </div>
          </div>

          {/* Interactive Status Update Control Section */}
          <div className="p-4 rounded-xl bg-[#0A0D1F] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <label
                id="status-control-label"
                className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-violet-400" />
                <span>Change Enquiry Status</span>
              </label>
              <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                {statusUpdating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                    <span>Saving…</span>
                  </>
                ) : dataSource === 'demo' ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                    <span>Demo — local only</span>
                  </>
                ) : (
                  <span>Saved to server</span>
                )}
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
                    disabled={statusUpdating}
                    className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      isCurrent
                        ? `${getStatusActiveStyle(statusOption)} cursor-default`
                        : statusUpdating
                        ? 'opacity-50 cursor-not-allowed bg-[#070913] border-white/5 text-slate-500'
                        : 'bg-[#121838] border-white/10 text-slate-300 hover:text-white hover:border-violet-500/40 hover:bg-[#1A224E] shadow-xs active:scale-[0.98]'
                    } focus-visible:outline-violet-400`}
                    id={`status-btn-${statusOption.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {isCurrent && !statusUpdating && (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    {statusUpdating && isCurrent && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                    )}
                    <span>{statusOption}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Convert to Booking Panel (Collapsible or Active) */}
          {showConvertForm && (
            <div className="p-4 sm:p-5 rounded-xl bg-[#0B0F24] border border-violet-500/30 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center">
                    <CalendarPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Schedule Service Booking
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Convert this enquiry into a confirmed booking.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConvertForm(false)}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Booking Date *
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    id="booking-date-input"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Booking Time *
                  </label>
                  <input
                    type="text"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    placeholder="e.g. 09:30 AM or 14:00"
                    className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                    id="booking-time-input"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 1.5 hrs"
                    className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">
                    Assignee (Optional)
                  </label>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="e.g. Alex M. or Crew 1"
                    className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-300 block mb-1">
                    Internal Booking Notes
                  </label>
                  <textarea
                    rows={2}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Access codes, customer notes, parts required..."
                    className="w-full px-3 py-2 rounded-xl bg-[#070913] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConvertForm(false)}
                  className="px-3.5 py-2 rounded-xl border border-white/10 bg-[#121838] hover:bg-[#1A224E] text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmConvert}
                  disabled={converting}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
                  id="confirm-convert-btn"
                >
                  {converting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating Booking...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm & Create Booking</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Customer Message Block */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-violet-400" />
              <span>Customer Message</span>
            </h4>
            <div className="p-4 rounded-xl bg-[#070913] border border-white/10 text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
              "{enquiry.message}"
            </div>
          </div>

          {/* AI Suggested Response */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>AI-Assisted Draft Proposal</span>
              </h4>
              <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>Human review required</span>
              </span>
            </div>
            <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/30 text-sm text-violet-100 leading-relaxed relative">
              <p className="whitespace-pre-line">
                {enquiry.suggestedReply}
              </p>
            </div>
          </div>

          {/* Persistence notice — accurate per data source and database connection */}
          <div className="p-3.5 rounded-xl bg-[#070913] border border-white/10 flex items-start space-x-2.5 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              {dataSource === 'demo' ? (
                <>
                  <span className="font-semibold text-white">
                    Demo Mode (Server Offline):
                  </span>
                  <p className="leading-relaxed">
                    Status changes apply locally in React state only. Because the backend API could
                    not be reached, no changes are sent to or persisted on the server. Updates will
                    reset on page reload.
                  </p>
                </>
              ) : databaseStatus === 'connected' ? (
                <>
                  <span className="font-semibold text-white">
                    MongoDB Persistent Storage:
                  </span>
                  <p className="leading-relaxed">
                    Status changes and bookings are sent to and confirmed by the Express API. The updated
                    records are stored in MongoDB with strict tenant isolation and persist across server restarts.
                  </p>
                </>
              ) : (
                <>
                  <span className="font-semibold text-white">
                    Standby Mode (Database Offline):
                  </span>
                  <p className="leading-relaxed">
                    The Express API is running in standby mode without an active MongoDB connection.
                    Enquiries and bookings are displayed in read-only mode; status changes cannot be persisted
                    until MongoDB is connected.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#070913]/90 border-t border-white/10 flex items-center justify-between">
          <div>
            {isBooked ? (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{convertedId ? `Converted (${convertedId})` : 'Enquiry Booked & Scheduled'}</span>
              </span>
            ) : onConvertToBooking ? (
              <button
                type="button"
                onClick={() => setShowConvertForm(!showConvertForm)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                id="convert-to-booking-btn"
              >
                <CalendarPlus className="w-4 h-4" />
                <span>{showConvertForm ? 'Hide Scheduling Form' : 'Convert to Booking'}</span>
              </button>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-[#121838] hover:bg-[#1A224E] text-slate-200 font-semibold text-xs transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
