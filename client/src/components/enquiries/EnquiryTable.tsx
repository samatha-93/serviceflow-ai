import { MapPin, Clock, ArrowRight, Inbox, Plus } from 'lucide-react';
import { CustomerEnquiry } from '../../types';

interface EnquiryTableProps {
  enquiries: CustomerEnquiry[];
  onSelectEnquiry: (enquiry: CustomerEnquiry) => void;
  onResetFilters: () => void;
  hasFilters: boolean;
  onCreateEnquiry?: () => void;
}

export function EnquiryTable({
  enquiries,
  onSelectEnquiry,
  onResetFilters,
  hasFilters,
  onCreateEnquiry,
}: EnquiryTableProps) {
  const getStatusBadge = (status: CustomerEnquiry['status']) => {
    switch (status) {
      case 'High Priority':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Awaiting Review':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Quoted':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Booked':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-[#121833] text-slate-300 border-white/10';
    }
  };

  const getUrgencyIndicator = (urgency: CustomerEnquiry['urgency']) => {
    switch (urgency) {
      case 'Urgent':
        return {
          dot: 'bg-rose-500',
          badge: 'bg-rose-50 text-rose-800 border-rose-200 font-semibold',
        };
      case 'Flexible':
        return {
          dot: 'bg-brand-teal',
          badge: 'bg-brand-teal-50 text-brand-teal border-brand-teal-100 font-medium',
        };
      case 'Standard':
      default:
        return {
          dot: 'bg-content-muted',
          badge: 'bg-white/5 text-slate-300 border-white/10 font-medium',
        };
    }
  };

  if (enquiries.length === 0) {
    return (
      <div className="bg-dark-card rounded-xl border border-white/10 p-10 text-center space-y-3.5 shadow-card">
        <div className="h-12 w-12 rounded-xl bg-surface-bg border border-[#E5E5DE] flex items-center justify-center mx-auto text-content-secondary">
          <Inbox className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1 max-w-sm mx-auto">
          <h3 className="text-sm font-bold text-white">
            No enquiries found
          </h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            {hasFilters
              ? 'No customer enquiries match your search query or filter selection.'
              : 'There are currently no customer enquiries registered in the system.'}
          </p>
        </div>
        {hasFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-brand-teal text-white hover:bg-brand-teal-light text-xs font-semibold shadow-xs transition-all"
          >
            <span>Reset Active Filters</span>
          </button>
        )}
        {!hasFilters && onCreateEnquiry && (
          <button
            type="button"
            onClick={onCreateEnquiry}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-brand-teal text-white hover:bg-brand-teal-light text-xs font-semibold shadow-soft transition-all focus-visible:outline-brand-teal"
            id="empty-state-create-enquiry-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Create Enquiry</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl border border-white/10 shadow-card overflow-hidden">
      {/* Desktop & Tablet Table (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <caption className="sr-only">Customer Enquiries List</caption>
          <thead>
            <tr className="border-b border-white/10 bg-[#121833] text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              <th scope="col" className="py-3 px-4 sm:px-5">Customer & ID</th>
              <th scope="col" className="py-3 px-4">Service & Location</th>
              <th scope="col" className="py-3 px-4">Urgency</th>
              <th scope="col" className="py-3 px-4">Status</th>
              <th scope="col" className="py-3 px-4">Received</th>
              <th scope="col" className="py-3 px-4 sm:px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm">
            {enquiries.map((enquiry) => {
              const urgencyStyle = getUrgencyIndicator(enquiry.urgency);
              return (
                <tr
                  key={enquiry.id}
                  onClick={() => onSelectEnquiry(enquiry)}
                  className="hover:bg-brand-teal-50/40 cursor-pointer transition-colors group"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectEnquiry(enquiry);
                    }
                  }}
                  role="button"
                  aria-label={`View details for enquiry ${enquiry.id} from ${enquiry.customerName}`}
                >
                  {/* Customer Column */}
                  <td className="py-3.5 px-4 sm:px-5 align-top">
                    <div className="font-semibold text-white group-hover:text-brand-teal transition-colors">
                      {enquiry.customerName}
                    </div>
                    <div className="mt-1">
                      <span className="text-[11px] font-mono font-normal text-slate-300 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                        {enquiry.id}
                      </span>
                    </div>
                  </td>

                  {/* Service Request & Location Column */}
                  <td className="py-3.5 px-4 align-top max-w-[280px]">
                    <span className="text-[10px] font-semibold text-brand-teal bg-brand-teal-50 px-1.5 py-0.5 rounded border border-brand-teal-100/70 inline-block mb-1">
                      {enquiry.serviceCategory}
                    </span>
                    <div className="font-medium text-slate-100 leading-snug line-clamp-2">
                      {enquiry.serviceTitle}
                    </div>
                    <div className="text-xs text-content-secondary flex items-center space-x-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-content-secondary/80 flex-shrink-0" />
                      <span className="truncate max-w-[220px]">{enquiry.location}</span>
                    </div>
                  </td>

                  {/* Urgency Column */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs border ${urgencyStyle.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${urgencyStyle.dot}`} />
                      <span>{enquiry.urgency}</span>
                    </span>
                  </td>

                  {/* Status Column */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                        enquiry.status
                      )}`}
                    >
                      {enquiry.status}
                    </span>
                  </td>

                  {/* Received Time */}
                  <td className="py-3.5 px-4 align-top whitespace-nowrap text-xs text-content-secondary">
                    <div className="flex items-center space-x-1.5 pt-0.5">
                      <Clock className="w-3.5 h-3.5 text-content-secondary/70" />
                      <span>{enquiry.receivedTime}</span>
                    </div>
                  </td>

                  {/* Action Column */}
                  <td className="py-3.5 px-4 sm:px-5 align-top text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEnquiry(enquiry);
                      }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#121833] hover:bg-brand-teal hover:border-brand-teal hover:text-white text-slate-100 text-xs font-semibold shadow-xs transition-all"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (< md) */}
      <div className="block md:hidden divide-y divide-white/10">
        {enquiries.map((enquiry) => {
          const urgencyStyle = getUrgencyIndicator(enquiry.urgency);
          return (
            <div
              key={enquiry.id}
              onClick={() => onSelectEnquiry(enquiry)}
              className="p-3.5 hover:bg-white/5 cursor-pointer space-y-2.5 transition-colors active:bg-white/10"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectEnquiry(enquiry);
                }
              }}
            >
              {/* Top row: Customer Name & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold text-content-primary text-sm">
                    {enquiry.customerName}
                  </div>
                  <div className="text-[11px] font-mono text-content-secondary flex items-center space-x-1.5 mt-0.5">
                    <span>{enquiry.id}</span>
                    <span>•</span>
                    <span className="text-brand-teal font-sans font-medium">{enquiry.serviceCategory}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                      enquiry.status
                    )}`}
                  >
                    {enquiry.status}
                  </span>
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] border ${urgencyStyle.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${urgencyStyle.dot}`} />
                    <span>{enquiry.urgency}</span>
                  </span>
                </div>
              </div>

              {/* Service & Message excerpt */}
              <div className="space-y-1">
                <div className="text-xs font-medium text-content-primary leading-snug">
                  {enquiry.serviceTitle}
                </div>
                <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                  {enquiry.message}
                </p>
              </div>

              {/* Footer row: Location, Received Time, and Action */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-content-secondary">
                <div className="flex items-center space-x-1 truncate max-w-[170px]">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-content-secondary/80" />
                  <span className="truncate">{enquiry.location}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-[11px]">{enquiry.receivedTime}</span>
                  <span className="text-brand-teal font-semibold inline-flex items-center space-x-0.5">
                    <span>Review</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
