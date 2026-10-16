import { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Search,
  RotateCcw,
  Loader2,
  User,
  Tag,
  WifiOff,
} from 'lucide-react';
import { Booking, BookingStatus } from '../../types';


interface BookingsViewProps {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onUpdateStatus: (id: string, status: BookingStatus) => Promise<{ success: boolean; message: string }>;
  updatingId: string | null;
  dataSource: 'api' | 'demo';
}

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All Bookings', value: 'ALL' },
  { label: 'Confirmed', value: 'Confirmed' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
];

export function BookingsView({
  bookings,
  loading,
  error,
  onRefresh,
  onUpdateStatus,
  updatingId,
  dataSource,
}: BookingsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);

  // Metrics
  const metrics = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === 'Confirmed').length;
    const pending = bookings.filter((b) => b.status === 'Pending').length;
    const completed = bookings.filter((b) => b.status === 'Completed').length;
    return { total, confirmed, pending, completed };
  }, [bookings]);

  // Filtering
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (statusFilter !== 'ALL' && b.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matches =
          b.customerName.toLowerCase().includes(query) ||
          b.serviceTitle.toLowerCase().includes(query) ||
          b.location.toLowerCase().includes(query) ||
          b.id.toLowerCase().includes(query) ||
          (b.assignee && b.assignee.toLowerCase().includes(query)) ||
          (b.enquiryId && b.enquiryId.toLowerCase().includes(query));
        if (!matches) return false;
      }
      return true;
    });
  }, [bookings, statusFilter, searchQuery]);

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setFeedback(null);
    const result = await onUpdateStatus(id, newStatus);
    setFeedback({ text: result.message, ok: result.success });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-surface-bg text-content-secondary border-surface-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-surface-card p-4 rounded-2xl border border-surface-muted shadow-soft">
          <div className="flex items-center justify-between text-xs text-content-secondary mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Bookings</span>
            <Calendar className="w-4 h-4 text-brand-teal" />
          </div>
          <div className="text-2xl font-black text-content-primary">{metrics.total}</div>
          <div className="text-[11px] text-content-muted mt-0.5">Scheduled services</div>
        </div>

        <div className="bg-surface-card p-4 rounded-2xl border border-surface-muted shadow-soft">
          <div className="flex items-center justify-between text-xs text-emerald-700 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800">{metrics.confirmed}</div>
          <div className="text-[11px] text-emerald-700 mt-0.5">Ready for service</div>
        </div>

        <div className="bg-surface-card p-4 rounded-2xl border border-surface-muted shadow-soft">
          <div className="flex items-center justify-between text-xs text-amber-700 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-800">{metrics.pending}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Awaiting confirmation</div>
        </div>

        <div className="bg-surface-card p-4 rounded-2xl border border-surface-muted shadow-soft">
          <div className="flex items-center justify-between text-xs text-blue-700 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-800">{metrics.completed}</div>
          <div className="text-[11px] text-blue-700 mt-0.5">Jobs fulfilled</div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between shadow-xs border ${
            feedback.ok
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.ok ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span className="font-semibold">{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Demo Notice */}
      {dataSource === 'demo' && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2.5">
          <WifiOff className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-semibold">Demo Mode: </span>
            <span>Displaying read-only demo bookings. Start the server and ensure MongoDB is reachable for persistent booking mutations.</span>
          </div>
        </div>
      )}

      {/* 2. Filter Toolbar */}
      <div className="bg-surface-card p-4 rounded-2xl border border-surface-muted shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, service, location, or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-surface-bg border border-surface-muted text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
            id="bookings-search-input"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_FILTERS.map((filter) => {
            const isSelected = statusFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-brand-teal text-white border-brand-teal shadow-xs'
                    : 'bg-surface-bg text-content-secondary border-surface-muted hover:border-brand-teal/30 hover:text-content-primary'
                }`}
              >
                {filter.label}
              </button>
            );
          })}

          {(searchQuery || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="p-1.5 rounded-xl text-content-muted hover:text-brand-teal hover:bg-surface-bg border border-transparent hover:border-surface-muted transition-all"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Content State (Loading / Error / Empty / List) */}
      {loading ? (
        <div className="p-12 text-center bg-surface-card rounded-2xl border border-surface-muted space-y-3">
          <Loader2 className="w-8 h-8 text-brand-teal animate-spin mx-auto" />
          <p className="text-xs text-content-secondary font-medium">Loading field bookings...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h4 className="text-sm font-bold text-rose-900">Failed to load bookings</h4>
          <p className="text-xs text-rose-700 max-w-md mx-auto">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors shadow-xs"
          >
            Retry
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-surface-card rounded-2xl border border-surface-muted space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-bg border border-surface-muted flex items-center justify-center mx-auto text-content-muted">
            <Calendar className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-content-primary">No bookings found</h4>
          <p className="text-xs text-content-secondary max-w-sm mx-auto">
            {bookings.length === 0
              ? 'No bookings currently scheduled. Open any customer enquiry and click "Convert to Booking" to schedule your first service job!'
              : 'No bookings match your selected filter criteria. Try resetting your search filters.'}
          </p>
          {bookings.length > 0 && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
              }}
              className="text-xs font-semibold text-brand-teal hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => {
            const isUpdating = updatingId === booking.id;
            return (
              <div
                key={booking.id}
                className="bg-surface-card p-4 sm:p-5 rounded-2xl border border-surface-muted hover:border-brand-teal/40 transition-all shadow-card space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-surface-muted/60">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold text-brand-teal px-2 py-0.5 rounded-md bg-brand-teal-50 border border-brand-teal-100">
                      {booking.id}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                    {booking.enquiryId && (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-content-muted bg-surface-bg px-2 py-0.5 rounded border border-surface-muted">
                        <Tag className="w-3 h-3 text-brand-teal" />
                        <span>Enquiry: {booking.enquiryId}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-content-secondary font-medium">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-teal" />
                      <span>{booking.bookingDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-brand-teal" />
                      <span>{booking.bookingTime}</span>
                    </span>
                    {booking.duration && (
                      <span className="text-[11px] text-content-muted">
                        ({booking.duration})
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-content-muted block mb-0.5">
                      Customer & Service
                    </span>
                    <div className="font-bold text-content-primary text-sm">
                      {booking.customerName}
                    </div>
                    <div className="text-content-secondary">{booking.serviceTitle}</div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-content-muted block mb-0.5">
                      Service Location
                    </span>
                    <div className="flex items-start space-x-1 text-content-primary">
                      <MapPin className="w-3.5 h-3.5 text-brand-teal flex-shrink-0 mt-0.5" />
                      <span>{booking.location}</span>
                    </div>
                    {booking.assignee && (
                      <div className="flex items-center space-x-1 text-content-muted mt-1">
                        <User className="w-3 h-3" />
                        <span>Assigned to: {booking.assignee}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-content-muted block mb-0.5">
                        Notes
                      </span>
                      <p className="text-content-secondary line-clamp-2 italic">
                        {booking.notes ? `"${booking.notes}"` : 'No additional notes provided.'}
                      </p>
                    </div>

                    {/* Status Mutation Controls */}
                    <div className="pt-2 flex items-center justify-end space-x-1.5">
                      <span className="text-[10px] text-content-muted mr-1">Update Status:</span>
                      {(['Pending', 'Confirmed', 'Completed', 'Cancelled'] as BookingStatus[]).map(
                        (statusOption) => {
                          const isCurrent = booking.status === statusOption;
                          return (
                            <button
                              key={statusOption}
                              type="button"
                              onClick={() => handleStatusChange(booking.id, statusOption)}
                              disabled={isCurrent || isUpdating}
                              className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                                isCurrent
                                  ? 'bg-surface-bg border-surface-muted text-content-muted cursor-default'
                                  : isUpdating
                                  ? 'opacity-40 cursor-not-allowed bg-surface-bg border-surface-muted'
                                  : 'bg-white border-surface-muted hover:border-brand-teal/40 hover:bg-surface-bg text-content-secondary hover:text-content-primary shadow-xs'
                              }`}
                            >
                              {statusOption}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
