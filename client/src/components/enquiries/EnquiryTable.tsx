import { MapPin, Clock, Eye, AlertCircle, Inbox } from 'lucide-react';
import { CustomerEnquiry } from '../../types';

interface EnquiryTableProps {
  enquiries: CustomerEnquiry[];
  onSelectEnquiry: (enquiry: CustomerEnquiry) => void;
  onResetFilters: () => void;
  hasFilters: boolean;
}

export function EnquiryTable({
  enquiries,
  onSelectEnquiry,
  onResetFilters,
  hasFilters,
}: EnquiryTableProps) {
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

  const getUrgencyBadge = (urgency: CustomerEnquiry['urgency']) => {
    switch (urgency) {
      case 'Urgent':
        return 'bg-red-50 text-red-700 border-red-200 font-semibold';
      case 'Standard':
        return 'bg-surface-bg text-content-secondary border-surface-muted';
      case 'Flexible':
        return 'bg-brand-teal-50 text-brand-teal border-brand-teal-100';
      default:
        return 'bg-surface-bg text-content-secondary border-surface-muted';
    }
  };

  if (enquiries.length === 0) {
    return (
      <div className="bg-surface-card rounded-2xl border border-surface-muted p-12 text-center space-y-4 shadow-soft">
        <div className="h-14 w-14 rounded-2xl bg-surface-bg border border-surface-muted flex items-center justify-center mx-auto text-content-muted">
          <Inbox className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="space-y-1.5 max-w-sm mx-auto">
          <h3 className="text-base font-bold text-content-primary">
            No enquiries found
          </h3>
          <p className="text-sm text-content-secondary leading-relaxed">
            {hasFilters
              ? 'No customer enquiries match your search query or filter selection.'
              : 'There are currently no customer enquiries registered in the system.'}
          </p>
        </div>
        {hasFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-teal text-white hover:bg-brand-teal-light text-xs font-semibold shadow-soft transition-all"
          >
            <span>Reset Active Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-surface-card rounded-2xl border border-surface-muted shadow-soft overflow-hidden">
      {/* Desktop & Tablet Table (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <caption className="sr-only">Customer Enquiries List</caption>
          <thead>
            <tr className="border-b border-surface-muted bg-surface-bg/70 text-xs font-bold text-content-secondary uppercase tracking-wider">
              <th scope="col" className="py-3.5 px-5">Customer & Location</th>
              <th scope="col" className="py-3.5 px-4">Service Request</th>
              <th scope="col" className="py-3.5 px-4">Urgency</th>
              <th scope="col" className="py-3.5 px-4">Status</th>
              <th scope="col" className="py-3.5 px-4">Received</th>
              <th scope="col" className="py-3.5 px-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-muted text-sm">
            {enquiries.map((enquiry) => (
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
                <td className="py-4 px-5 align-top">
                  <div className="font-bold text-content-primary group-hover:text-brand-teal transition-colors flex items-center space-x-2">
                    <span>{enquiry.customerName}</span>
                    <span className="text-[11px] font-mono font-normal text-content-muted">
                      {enquiry.id}
                    </span>
                  </div>
                  <div className="text-xs text-content-secondary flex items-center space-x-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-content-muted flex-shrink-0" />
                    <span className="truncate max-w-[200px]">{enquiry.location}</span>
                  </div>
                </td>

                {/* Service Column */}
                <td className="py-4 px-4 align-top max-w-[260px]">
                  <div className="font-semibold text-content-primary line-clamp-1">
                    {enquiry.serviceTitle}
                  </div>
                  <div className="text-xs text-content-muted mt-0.5">
                    {enquiry.serviceCategory}
                  </div>
                </td>

                {/* Urgency Column */}
                <td className="py-4 px-4 align-top whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${getUrgencyBadge(
                      enquiry.urgency
                    )}`}
                  >
                    {enquiry.urgency === 'Urgent' && (
                      <AlertCircle className="w-3 h-3 mr-1 text-red-500" />
                    )}
                    {enquiry.urgency}
                  </span>
                </td>

                {/* Status Column */}
                <td className="py-4 px-4 align-top whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                      enquiry.status
                    )}`}
                  >
                    {enquiry.status}
                  </span>
                </td>

                {/* Received Time */}
                <td className="py-4 px-4 align-top whitespace-nowrap text-xs text-content-secondary">
                  <div className="flex items-center space-x-1.5 pt-0.5">
                    <Clock className="w-3.5 h-3.5 text-content-muted" />
                    <span>{enquiry.receivedTime}</span>
                  </div>
                </td>

                {/* Action Column */}
                <td className="py-4 px-5 align-top text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEnquiry(enquiry);
                    }}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-surface-muted bg-surface-bg hover:bg-surface-card hover:border-brand-teal/40 text-content-primary text-xs font-semibold shadow-xs transition-all group-hover:bg-white"
                  >
                    <Eye className="w-3.5 h-3.5 text-brand-teal" />
                    <span>View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (< md) */}
      <div className="block md:hidden divide-y divide-surface-muted">
        {enquiries.map((enquiry) => (
          <div
            key={enquiry.id}
            onClick={() => onSelectEnquiry(enquiry)}
            className="p-4 hover:bg-surface-bg/60 cursor-pointer space-y-3 transition-colors active:bg-brand-teal-50/50"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectEnquiry(enquiry);
              }
            }}
          >
            {/* Top row: Customer Name & Badges */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-bold text-content-primary text-base">
                  {enquiry.customerName}
                </div>
                <div className="text-xs font-mono text-content-muted">
                  {enquiry.id} • {enquiry.serviceCategory}
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
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border ${getUrgencyBadge(
                    enquiry.urgency
                  )}`}
                >
                  {enquiry.urgency}
                </span>
              </div>
            </div>

            {/* Service & Excerpt */}
            <div className="space-y-1">
              <div className="text-sm font-semibold text-content-primary">
                {enquiry.serviceTitle}
              </div>
              <p className="text-xs text-content-secondary line-clamp-2">
                {enquiry.message}
              </p>
            </div>

            {/* Footer row: Location, Received Time, and View button */}
            <div className="flex items-center justify-between pt-2 border-t border-surface-muted/60 text-xs text-content-muted">
              <div className="flex items-center space-x-1.5 truncate max-w-[180px]">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{enquiry.location}</span>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{enquiry.receivedTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
