import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  AlertCircle,
  Loader2,
  Plus,
  User,
  MapPin,
  Tag,
  Clock,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { CustomerEnquiry } from '../../types';
import { SERVICE_CATEGORIES, ENQUIRY_STATUSES, URGENCY_LEVELS } from '../../data/mockEnquiries';
import { CreateEnquiryPayload, ApiError } from '../../services/enquiry.api';

interface CreateEnquiryModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onCreate: (payload: CreateEnquiryPayload) => Promise<{ success: boolean; message: string }>;
  businessName?: string;
}

export function CreateEnquiryModal({
  isOpen = true,
  onClose,
  onCreate,
  businessName,
}: CreateEnquiryModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [serviceCategory, setServiceCategory] = useState<string>(SERVICE_CATEGORIES[0]);
  const [serviceTitle, setServiceTitle] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState<CustomerEnquiry['urgency']>('Standard');
  const [status, setStatus] = useState<CustomerEnquiry['status']>('Awaiting Review');
  const [message, setMessage] = useState('');
  const [suggestedReply, setSuggestedReply] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCustomerName('');
      setServiceCategory(SERVICE_CATEGORIES[0]);
      setServiceTitle('');
      setLocation('');
      setUrgency('Standard');
      setStatus('Awaiting Review');
      setMessage('');
      setSuggestedReply('');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, loading]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    setError(null);

    // Validate required fields
    if (!customerName.trim()) {
      setError('Customer name is required.');
      return;
    }
    if (!serviceCategory.trim()) {
      setError('Service category is required.');
      return;
    }
    if (!serviceTitle.trim()) {
      setError('Service title is required.');
      return;
    }
    if (!location.trim()) {
      setError('Location / address is required.');
      return;
    }
    if (!message.trim()) {
      setError('Customer message / job description is required.');
      return;
    }

    setLoading(true);

    try {
      const payload: CreateEnquiryPayload = {
        customerName: customerName.trim(),
        serviceCategory: serviceCategory.trim(),
        serviceTitle: serviceTitle.trim(),
        location: location.trim(),
        message: message.trim(),
        urgency,
        status,
        ...(suggestedReply.trim() ? { suggestedReply: suggestedReply.trim() } : {}),
      };

      const result = await onCreate(payload);
      if (result.success) {
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.serverMessage || `Request failed with status ${err.statusCode}`);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to create enquiry. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-enquiry-modal-title"
    >
      <div className="relative w-full max-w-xl max-h-[92vh] bg-[#0D1126] rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-start justify-between bg-[#070913]/90">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="create-enquiry-modal-title"
                className="text-lg font-bold text-white tracking-tight"
              >
                Create New Customer Enquiry
              </h2>
              <p className="text-xs text-slate-400">
                {businessName
                  ? `Register a new intake request for ${businessName}`
                  : 'Add a new intake request to your operating workspace'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-40"
            aria-label="Close dialog"
            id="create-enquiry-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 sm:space-y-5 text-sm flex-1">
          {/* Validation / Server Error Banner */}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2.5 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          {/* Row 1: Customer Name & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="create-enquiry-customer-name"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Customer Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="create-enquiry-customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  disabled={loading}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#070913] border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="create-enquiry-location"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Location / Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="create-enquiry-location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. 14 High Street, Suite 2A"
                  disabled={loading}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#070913] border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Service Category & Service Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="create-enquiry-service-category"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Service Category <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Tag className="w-4 h-4" />
                </div>
                <select
                  id="create-enquiry-service-category"
                  required
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-8 py-2.5 bg-[#070913] border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors appearance-none cursor-pointer disabled:opacity-50"
                >
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0D1126] text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="create-enquiry-service-title"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Service Title / Job <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <input
                  id="create-enquiry-service-title"
                  type="text"
                  required
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  placeholder="e.g. Lawn Aeration & Treatment"
                  disabled={loading}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#070913] border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Urgency & Initial Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="create-enquiry-urgency"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Urgency Level
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <select
                  id="create-enquiry-urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as CustomerEnquiry['urgency'])}
                  disabled={loading}
                  className="w-full pl-9 pr-8 py-2.5 bg-[#070913] border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors appearance-none cursor-pointer disabled:opacity-50"
                >
                  {URGENCY_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl} className="bg-[#0D1126] text-white">
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="create-enquiry-status"
                className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Initial Status
              </label>
              <select
                id="create-enquiry-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as CustomerEnquiry['status'])}
                disabled={loading}
                className="w-full px-3.5 py-2.5 bg-[#070913] border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors appearance-none cursor-pointer disabled:opacity-50"
              >
                {ENQUIRY_STATUSES.map((st) => (
                  <option key={st} value={st} className="bg-[#0D1126] text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Enquiry Message */}
          <div>
            <label
              htmlFor="create-enquiry-message"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Customer Message / Requirements <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <textarea
                id="create-enquiry-message"
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe the service request, customer notes, or specific instructions..."
                disabled={loading}
                className="w-full p-3.5 bg-[#070913] border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Row 5: Optional Suggested Reply / Proposal Draft */}
          <div>
            <label
              htmlFor="create-enquiry-suggested-reply"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Suggested Reply / Initial Proposal Notes <span className="text-slate-500 font-normal lowercase">(optional)</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-center pointer-events-none text-slate-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                id="create-enquiry-suggested-reply"
                rows={2}
                value={suggestedReply}
                onChange={(e) => setSuggestedReply(e.target.value)}
                placeholder="Draft preliminary reply or estimate notes to review before sending..."
                disabled={loading}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#070913] border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors resize-none disabled:opacity-50"
              />
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-white/10 bg-[#121838] hover:bg-[#1A224E] text-slate-300 hover:text-white font-semibold text-xs sm:text-sm transition-colors disabled:opacity-50"
              id="create-enquiry-cancel-btn"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              id="create-enquiry-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Enquiry…</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Enquiry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
