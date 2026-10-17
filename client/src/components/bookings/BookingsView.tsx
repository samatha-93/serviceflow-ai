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
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Pending':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Completed':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'Cancelled':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      default:
        return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-[#0D1126] p-4 rounded-xl border border-white/10 shadow-soft">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Total Bookings</span>
            <Calendar className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.total}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Scheduled services</div>
        </div>

        <div className="bg-[#0D1126] p-4 rounded-xl border border-white/10 shadow-soft">
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{metrics.confirmed}</div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5">Ready for service</div>
        </div>

        <div className="bg-[#0D1126] p-4 rounded-xl border border-white/10 shadow-soft">
          <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Pending</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{metrics.pending}</div>
          <div className="text-[11px] text-amber-400/80 mt-0.5">Awaiting confirmation</div>
        </div>

        <div className="bg-[#0D1126] p-4 rounded-xl border border-white/10 shadow-soft">
          <div className="flex items-center justify-between text-xs text-blue-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{metrics.completed}</div>
          <div className="text-[11px] text-blue-400/80 mt-0.5">Jobs fulfilled</div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between shadow-xs border ${
            feedback.ok
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {feedback.ok ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span className="font-semibold">{feedback.text}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-semibold hover:underline text-slate-300 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Demo Notice */}
      {dataSource === 'demo' && (
        <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2.5">
          <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div>
            <span className="font-semibold text-white">Demo Mode: </span>
            <span>Displaying read-only demo bookings. Start the server and ensure MongoDB is reachable for persistent booking mutations.</span>
          </div>
        </div>
      )}

      {/* 2. Filter Toolbar */}
      <div className="bg-[#0D1126] p-3.5 sm:p-4 rounded-xl border border-white/10 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, service, location, or ID..."
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs sm:text-sm bg-[#070913] border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-violet-600/30 text-violet-300 border-violet-500/40 shadow-xs'
                    : 'bg-[#070913] text-slate-400 border-white/10 hover:border-violet-500/30 hover:text-white'
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Content State (Loading / Error / Empty / List) */}
      {loading ? (
        <div className="p-12 text-center bg-[#0D1126] rounded-2xl border border-white/10 space-y-3">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Loading field bookings...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-rose-500/15 rounded-2xl border border-rose-500/30 space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">Failed to load bookings</h4>
          <p className="text-xs text-rose-300 max-w-md mx-auto">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-500 transition-colors shadow-xs"
          >
            Retry
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-12 text-center bg-[#0D1126] rounded-2xl border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#070913] border border-white/10 flex items-center justify-center mx-auto text-slate-500">
            <Calendar className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white">No bookings found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
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
              className="text-xs font-semibold text-violet-400 hover:underline"
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
                className="bg-[#0D1126] p-4 sm:p-5 rounded-xl border border-white/10 hover:border-violet-500/40 transition-all shadow-card space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-xs font-bold text-violet-300 px-2 py-0.5 rounded-md bg-violet-500/15 border border-violet-500/30">
                      {booking.id}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                    {booking.enquiryId && (
                      <span className="inline-flex items-center space-x-1 text-[11px] text-slate-300 bg-[#070913] px-2 py-0.5 rounded border border-white/10">
                        <Tag className="w-3 h-3 text-violet-400" />
                        <span>Enquiry: {booking.enquiryId}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-300 font-medium">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-violet-400" />
                      <span>{booking.bookingDate}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-violet-400" />
                      <span>{booking.bookingTime}</span>
                    </span>
                    {booking.duration && (
                      <span className="text-[11px] text-slate-400">
                        ({booking.duration})
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                      Customer & Service
                    </span>
                    <div className="font-bold text-white text-sm">
                      {booking.customerName}
                    </div>
                    <div className="text-slate-300 mt-0.5">{booking.serviceTitle}</div>
                  </div>

                  <div>
                    <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                      Service Location
                    </span>
                    <div className="flex items-start space-x-1.5 text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                      <span>{booking.location}</span>
                    </div>
                    {booking.assignee && (
                      <div className="flex items-center space-x-1 text-slate-400 mt-1">
                        <User className="w-3 h-3 text-violet-400" />
                        <span>Assigned to: {booking.assignee}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                        Notes
                      </span>
                      <p className="text-slate-300 italic leading-relaxed">
                        {booking.notes ? `"${booking.notes}"` : 'No additional notes provided.'}
                      </p>
                    </div>

                    {/* Status Mutation Controls */}
                    <div className="pt-2.5 flex items-center justify-end space-x-1.5">
                      <span className="text-[11px] text-slate-400 mr-1">Update Status:</span>
                      {(['Pending', 'Confirmed', 'Completed', 'Cancelled'] as BookingStatus[]).map(
                        (statusOption) => {
                          const isCurrent = booking.status === statusOption;
                          return (
                            <button
                              key={statusOption}
                              type="button"
                              onClick={() => handleStatusChange(booking.id, statusOption)}
                              disabled={isCurrent || isUpdating}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                                isCurrent
                                  ? 'bg-[#070913] border-violet-500/40 text-violet-300 cursor-default font-semibold'
                                  : isUpdating
                                  ? 'opacity-40 cursor-not-allowed bg-[#070913] border-white/5 text-slate-500'
                                  : 'bg-[#121838] border-white/10 hover:border-violet-500/40 hover:bg-[#1A224E] text-slate-300 hover:text-white shadow-2xs'
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
