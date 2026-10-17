import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Inbox,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  Loader2,
  UserCheck,
  LogOut,
  Calendar as CalendarIcon,
  Settings2,
  Plus,
  CheckCircle2,
  X,
} from 'lucide-react';

import { CustomerEnquiry, Booking, BookingStatus, CreateBookingPayload, UserProfile } from '../../types';
import { DEMO_ENQUIRIES } from '../../data/mockEnquiries';
import { DEMO_BOOKINGS } from '../../data/mockBookings';
import { fetchEnquiries, patchEnquiryStatus, createEnquiry, ApiError, CreateEnquiryPayload } from '../../services/enquiry.api';
import { fetchBookings, patchBookingStatus, createBooking } from '../../services/booking.api';
import { EnquiryMetrics } from './EnquiryMetrics';
import { EnquiryFilters } from './EnquiryFilters';
import { EnquiryTable } from './EnquiryTable';
import { EnquiryDetailModal } from './EnquiryDetailModal';
import { BookingsView } from '../bookings/BookingsView';
import { BusinessProfileSettings } from '../business/BusinessProfileSettings';
import { CreateEnquiryModal } from './CreateEnquiryModal';

interface EnquiryWorkspaceProps {
  onBackToLanding: () => void;
  onOpenDiagnostics: () => void;
  backendStatus: 'healthy' | 'offline' | 'checking';
  databaseStatus?: string;
  currentUser?: UserProfile | null;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
  onLogout?: () => void;
}

type DataSource = 'api' | 'demo';

export function EnquiryWorkspace({
  onBackToLanding,
  onOpenDiagnostics,
  backendStatus,
  databaseStatus,
  currentUser,
  onOpenAuth,
  onLogout,
}: EnquiryWorkspaceProps) {
  // Active Tab: Enquiries or Bookings
  const [activeTab, setActiveTab] = useState<'enquiries' | 'bookings' | 'profile'>('enquiries');

  // ----------------------------------------------------------------
  // Enquiries Data state
  // ----------------------------------------------------------------
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [dataSource, setDataSource] = useState<DataSource>('api');
  const [loadState, setLoadState] = useState<'loading' | 'error' | 'empty' | 'ready'>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);

  // ----------------------------------------------------------------
  // Bookings Data state
  // ----------------------------------------------------------------
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoadState, setBookingsLoadState] = useState<'loading' | 'error' | 'ready'>('loading');
  const [bookingsLoadError, setBookingsLoadError] = useState<string | null>(null);
  const [bookingUpdatingId, setBookingUpdatingId] = useState<string | null>(null);

  // ----------------------------------------------------------------
  // Detail modal state
  // ----------------------------------------------------------------
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createSuccessMessage, setCreateSuccessMessage] = useState<string | null>(null);


  // ----------------------------------------------------------------
  // Status-update state
  // ----------------------------------------------------------------
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // ----------------------------------------------------------------
  // Filters
  // ----------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');

  // ----------------------------------------------------------------
  // Load enquiries from API (with demo fallback when truly offline)
  // ----------------------------------------------------------------
  const loadEnquiries = useCallback(async () => {
    setLoadState('loading');
    setLoadError(null);

    try {
      const data = await fetchEnquiries();
      setEnquiries(data);
      setDataSource('api');
      setLoadState(data.length === 0 ? 'empty' : 'ready');
    } catch (err) {
      // Only fall back to demo data when the server is verifiably offline
      // (network error / ECONNREFUSED). HTTP errors from the server are shown
      // as real errors rather than silently hidden behind demo data.
      const isNetworkError = !(err instanceof ApiError);

      if (isNetworkError && (backendStatus === 'offline' || backendStatus === 'checking')) {
        // Backend is confirmed offline or unreachable: show demo data with a clear notice
        setEnquiries(DEMO_ENQUIRIES);
        setDataSource('demo');
        setLoadState('ready');
      } else {
        setLoadState('error');
        const message =
          err instanceof ApiError
            ? `API error ${err.statusCode}: ${err.serverMessage}`
            : err instanceof Error
            ? err.message
            : 'Failed to load enquiries from the server.';
        setLoadError(message);
      }
    }
  }, [backendStatus, currentUser]);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);


  // When backend becomes healthy after having been offline, automatically upgrade to live data
  useEffect(() => {
    if (backendStatus === 'healthy' && dataSource === 'demo') {
      loadEnquiries();
    }
  }, [backendStatus, dataSource, loadEnquiries]);

  // ----------------------------------------------------------------
  // Status update — calls PATCH and updates UI from the API response
  // ----------------------------------------------------------------
  const handleUpdateStatus = useCallback(
    async (enquiryId: string, newStatus: CustomerEnquiry['status']) => {
      setStatusUpdating(true);
      setStatusError(null);

      try {
        if (dataSource === 'demo') {
          // Demo mode: apply optimistic local update only (no real API call)
          setEnquiries((prev) =>
            prev.map((item) => (item.id === enquiryId ? { ...item, status: newStatus } : item))
          );
          setSelectedEnquiry((prev) =>
            prev && prev.id === enquiryId ? { ...prev, status: newStatus } : prev
          );
          return { success: true, message: `Status updated to "${newStatus}" (demo mode).` };
        }

        // Live API call
        const updated = await patchEnquiryStatus(enquiryId, newStatus);

        // Update list from the server response
        setEnquiries((prev) =>
          prev.map((item) => (item.id === enquiryId ? updated : item))
        );
        // Update modal from the server response
        setSelectedEnquiry((prev) =>
          prev && prev.id === enquiryId ? updated : prev
        );

        return { success: true, message: `Status updated to "${updated.status}".` };
      } catch (err) {
        const message =
          err instanceof ApiError
            ? `Could not update status: ${err.serverMessage} (HTTP ${err.statusCode})`
            : err instanceof Error
            ? `Could not update status: ${err.message}`
            : 'Status update failed. Please try again.';
        setStatusError(message);
        return { success: false, message };
      } finally {
        setStatusUpdating(false);
      }
    },
    [dataSource]
  );

  // ----------------------------------------------------------------
  // Load Bookings from API (with demo fallback when offline)
  // ----------------------------------------------------------------
  const loadBookings = useCallback(async () => {
    setBookingsLoadState('loading');
    setBookingsLoadError(null);

    try {
      const data = await fetchBookings();
      setBookings(data);
      setBookingsLoadState('ready');
    } catch (err) {
      const isNetworkError = !(err instanceof ApiError);

      if (isNetworkError && (backendStatus === 'offline' || backendStatus === 'checking')) {
        setBookings(DEMO_BOOKINGS);
        setBookingsLoadState('ready');
      } else {
        setBookingsLoadState('error');
        const message =
          err instanceof ApiError
            ? `API error ${err.statusCode}: ${err.serverMessage}`
            : err instanceof Error
            ? err.message
            : 'Failed to load bookings from the server.';
        setBookingsLoadError(message);
      }
    }
  }, [backendStatus, currentUser]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Update booking status
  const handleUpdateBookingStatus = useCallback(
    async (id: string, newStatus: BookingStatus) => {
      setBookingUpdatingId(id);
      try {
        if (dataSource === 'demo') {
          setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
          );
          return { success: true, message: `Status updated to "${newStatus}" (demo mode).` };
        }

        const updated = await patchBookingStatus(id, newStatus);
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? updated : b))
        );
        return {
          success: true,
          message: `Booking ${updated.id} status updated to "${updated.status}".`,
        };
      } catch (err) {
        const message =
          err instanceof ApiError
            ? `Could not update booking: ${err.serverMessage} (HTTP ${err.statusCode})`
            : err instanceof Error
            ? err.message
            : 'Booking status update failed.';
        return { success: false, message };
      } finally {
        setBookingUpdatingId(null);
      }
    },
    [dataSource]
  );

  // Convert Enquiry to Booking
  const handleConvertToBooking = useCallback(
    async (payload: CreateBookingPayload) => {
      try {
        if (dataSource === 'demo') {
          const fakeId = `BK-${8900 + bookings.length + 1}`;
          const newB: Booking = {
            id: fakeId,
            businessId: 'demo-tenant-id',
            customerName: payload.customerName,
            serviceTitle: payload.serviceTitle,
            location: payload.location,
            bookingDate: payload.bookingDate,
            bookingTime: payload.bookingTime,
            duration: payload.duration || '1.5 hrs',
            status: payload.status || 'Confirmed',
            assignee: payload.assignee || '',
            notes: payload.notes || '',
            enquiryId: payload.enquiryId,
          };
          setBookings((prev) => [newB, ...prev]);
          if (payload.enquiryId) {
            setEnquiries((prev) =>
              prev.map((e) => (e.id === payload.enquiryId ? { ...e, status: 'Booked' } : e))
            );
          }
          return {
            success: true,
            message: `Booking ${fakeId} scheduled successfully (demo mode)!`,
            bookingId: fakeId,
          };
        }

        const created = await createBooking(payload);
        setBookings((prev) => [created, ...prev]);

        // Optimistically update enquiry in local state to 'Booked'
        if (payload.enquiryId) {
          setEnquiries((prev) =>
            prev.map((e) => (e.id === payload.enquiryId ? { ...e, status: 'Booked' } : e))
          );
          setSelectedEnquiry((prev) =>
            prev && prev.id === payload.enquiryId ? { ...prev, status: 'Booked' } : prev
          );
        }

        return {
          success: true,
          message: `Booking ${created.id} created successfully!`,
          bookingId: created.id,
        };
      } catch (err) {
        const message =
          err instanceof ApiError
            ? `${err.serverMessage} (HTTP ${err.statusCode})`
            : err instanceof Error
            ? err.message
            : 'Failed to create booking.';
        return { success: false, message };
      }
    },
    [dataSource, bookings.length]
  );


  // ----------------------------------------------------------------
  // Filtered enquiries (client-side)
  // ----------------------------------------------------------------
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          item.customerName.toLowerCase().includes(query) ||
          item.serviceTitle.toLowerCase().includes(query) ||
          item.serviceCategory.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.message.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && item.serviceCategory !== categoryFilter) return false;
      if (urgencyFilter !== 'ALL' && item.urgency !== urgencyFilter) return false;
      return true;
    });
  }, [enquiries, searchQuery, statusFilter, categoryFilter, urgencyFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setUrgencyFilter('ALL');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    urgencyFilter !== 'ALL';

  const handleCreateEnquiry = useCallback(async (payload: CreateEnquiryPayload) => {
    try {
      const created = await createEnquiry(payload);
      setEnquiries((current) => [created, ...current.filter((e) => e.id !== created.id)]);
      setDataSource('api');
      setLoadState('ready');
      setIsCreateOpen(false);
      setCreateSuccessMessage(`Enquiry ${created.id} ("${created.serviceTitle}") created successfully.`);
      // Refresh in background to sync summary metrics and counts with authoritative server state
      loadEnquiries().catch(() => {});
      return { success: true, message: `Enquiry ${created.id} created successfully.` };
    } catch (err) {
      const message = err instanceof ApiError
        ? `${err.serverMessage} (HTTP ${err.statusCode})`
        : err instanceof Error ? err.message : 'Could not create enquiry. Please try again.';
      return { success: false, message };
    }
  }, [loadEnquiries]);

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-surface-bg text-content-primary flex flex-col font-sans selection:bg-brand-teal selection:text-white">
      {/* Workspace Top Application Bar */}
      <header className="sticky top-0 z-40 border-b border-surface-muted bg-surface-card/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Context Badge */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onBackToLanding}
                className="flex items-center space-x-2.5 group text-left focus-visible:outline-brand-teal focus-visible:rounded"
                title="Return to ServiceFlow AI Homepage"
              >
                <div className="h-9 w-9 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base sm:text-lg tracking-tight text-content-primary leading-tight">
                    ServiceFlow <span className="text-brand-teal font-extrabold">AI</span>
                  </span>
                  <span className="text-[10px] text-content-secondary tracking-wider uppercase font-medium">
                    Operations Workspace
                  </span>
                </div>
              </button>

              <span className="hidden sm:inline-block w-px h-6 bg-surface-muted mx-1" />

              <span className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-teal-50 text-brand-teal border border-brand-teal-100">
                <Inbox className="w-3.5 h-3.5" />
                <span>Enquiry Management</span>
              </span>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Data source & database connection indicator */}
              {dataSource === 'demo' ? (
                <span className="hidden md:inline-flex items-center space-x-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                  <span>Demo Mode (Server Offline)</span>
                </span>
              ) : databaseStatus === 'connected' ? (
                <span className="hidden md:inline-flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                  <span>MongoDB Connected</span>
                </span>
              ) : loadState === 'ready' ? (
                <span className="hidden md:inline-flex items-center space-x-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Wifi className="w-3.5 h-3.5 text-amber-500" />
                  <span>API Live (DB Standby)</span>
                </span>
              ) : null}

              {/* Back to Website Button */}
              <button
                onClick={onBackToLanding}
                className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl border border-surface-muted bg-surface-card hover:bg-surface-bg text-content-primary shadow-xs transition-all hover:border-brand-teal/40 focus-visible:outline-brand-teal"
                id="workspace-back-btn"
              >
                <ArrowLeft className="w-4 h-4 text-brand-teal" />
                <span>Back to Website</span>
              </button>

              {/* User Account Controls */}
              {currentUser ? (
                <div className="flex items-center space-x-2 border-l border-surface-muted pl-3">
                  <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-surface-bg border border-surface-muted text-xs">
                    <UserCheck className="w-3.5 h-3.5 text-brand-teal" />
                    <span className="font-semibold text-content-primary max-w-[140px] truncate" title={currentUser.businessName}>
                      {currentUser.businessName}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-surface-muted text-content-secondary hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    id="workspace-logout-btn"
                    title="Sign out of your business account"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 border-l border-surface-muted pl-3">
                  <button
                    onClick={() => onOpenAuth?.('login')}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-teal text-white hover:bg-brand-teal-light shadow-soft transition-colors"
                    id="workspace-signin-btn"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4 sm:space-y-5" id="workspace-content">
        {/* Workspace Title & Introduction Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-content-primary">
                {currentUser ? `${currentUser.businessName} Operations` : 'Enquiry Management'}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-teal-50 text-brand-teal border border-brand-teal-100">
                {currentUser ? 'Private Tenant' : 'Public Demo'}
              </span>
            </div>
            <p className="text-xs text-content-secondary leading-normal max-w-2xl">
              {currentUser
                ? `Operating inbox for ${currentUser.businessName}. Data isolation enforced by business ownership.`
                : 'Triage customer enquiries, inspect job requests, and preview AI-assisted proposals across your service verticals.'}
            </p>
          </div>

          {/* Segmented Control for Enquiries vs Bookings */}
          <div className="flex items-center bg-[#0D1126] p-1 rounded-xl flex-shrink-0 self-start sm:self-auto border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('enquiries')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'enquiries'
                  ? 'bg-[#1A224E] text-white shadow-xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
              id="tab-enquiries"
            >
              <Inbox className="w-3.5 h-3.5 text-brand-teal" />
              <span>Enquiries</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'enquiries'
                    ? 'bg-white/10 text-violet-200'
                    : 'bg-white/10 text-slate-200'
                }`}
              >
                {enquiries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-[#1A224E] text-white shadow-xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
              id="tab-bookings"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-brand-teal" />
              <span>Bookings & Schedule</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'bookings'
                    ? 'bg-white/10 text-violet-200'
                    : 'bg-white/10 text-slate-200'
                }`}
              >
                {bookings.length}
              </span>
            </button>

            {currentUser?.role === 'owner' && (
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                aria-current={activeTab === 'profile' ? 'page' : undefined}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'profile'
                  ? 'bg-[#1A224E] text-white shadow-xs'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
                id="tab-business-profile"
              >
                <Settings2 className="w-3.5 h-3.5 text-violet-300" />
                <span>Business Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Compact Demo Notice Banner */}
        {!currentUser ? (
          <div className="py-2.5 px-3.5 rounded-xl bg-dark-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-content-secondary shadow-card">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-teal flex-shrink-0" />
              <span>
                <strong className="text-content-primary font-semibold">Demo Workspace:</strong> Viewing sample enquiries. Sign in or register to manage your own isolated service business.
              </span>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={() => onOpenAuth?.('login')}
                className="px-2.5 py-1 rounded-md text-xs font-semibold border border-white/10 bg-[#121833] text-slate-100 hover:bg-white/10 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth?.('register')}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-brand-teal text-white hover:bg-brand-teal-light transition-colors"
              >
                Register Business
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2 px-3.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-between text-xs text-emerald-200">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-emerald-300 flex-shrink-0" />
              <span>
                <strong>Authenticated:</strong> Logged in as <span className="font-semibold">{currentUser.name}</span> ({currentUser.email}). Enquiries are strictly isolated to <span className="font-semibold">{currentUser.businessName}</span>.
              </span>
            </div>
          </div>
        )}
        {/* Creation Success Notification Banner */}
        {createSuccessMessage && (
          <div
            role="status"
            aria-live="polite"
            className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-xs animate-fadeIn"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold">{createSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setCreateSuccessMessage(null)}
              className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-500/20 transition-colors"
              aria-label="Dismiss message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab 1: Enquiries View */}
        {activeTab === 'enquiries' && (
          <>
            {/* ── Loading state ── */}
            {loadState === 'loading' && (
              <div className="bg-dark-card rounded-xl border border-white/10 p-12 text-center flex flex-col items-center space-y-3 shadow-card">
                <Loader2 className="w-8 h-8 text-brand-teal animate-spin" />
                <p className="text-xs font-medium text-content-secondary">
                  Loading customer enquiries…
                </p>
              </div>
            )}

            {/* ── Error state ── */}
            {loadState === 'error' && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center space-y-3 shadow-xs" role="alert">
                <div className="flex justify-center">
                  <div className="h-10 w-10 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                  </div>
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-sm font-bold text-rose-800">Failed to load enquiries</h3>
                  <p className="text-xs text-rose-700 leading-relaxed font-mono break-words">
                    {loadError}
                  </p>
                </div>
                <button
                  onClick={loadEnquiries}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold shadow-xs transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* ── Loaded (ready or empty) ── */}
            {(loadState === 'ready' || loadState === 'empty') && (
              <>
                {/* Demo data notice — only shown when server is offline */}
                {dataSource === 'demo' && (
                  <div
                    role="status"
                    className="flex items-start space-x-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800"
                  >
                    <WifiOff className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-amber-900">Server offline — viewing sample data</span>
                      <p className="text-xs text-amber-700 leading-normal">
                        Could not reach API. Displaying read-only demo enquiries. Updates will apply locally only.
                      </p>
                    </div>
                  </div>
                )}

                {/* 1. Summary Metrics Cards */}
                <EnquiryMetrics enquiries={enquiries} />

                {currentUser && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(true)}
                      className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3.5 py-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-violet-500"
                      id="create-enquiry-btn"
                    >
                      <Plus className="h-4 w-4" /> Create Enquiry
                    </button>
                  </div>
                )}

                {/* 2. Filter Toolbar */}
                <EnquiryFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusChange={setStatusFilter}
                  categoryFilter={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                  urgencyFilter={urgencyFilter}
                  onUrgencyChange={setUrgencyFilter}
                  onResetFilters={handleResetFilters}
                  totalCount={enquiries.length}
                  filteredCount={filteredEnquiries.length}
                />

                {/* 3. Enquiry Table & Cards */}
                <EnquiryTable
                  enquiries={filteredEnquiries}
                  onSelectEnquiry={setSelectedEnquiry}
                  onResetFilters={handleResetFilters}
                  hasFilters={hasActiveFilters}
                  onCreateEnquiry={currentUser ? () => setIsCreateOpen(true) : undefined}
                />
              </>
            )}
          </>
        )}

        {/* Tab 2: Bookings & Schedule View */}
        {activeTab === 'bookings' && (
          <BookingsView
            bookings={bookings}
            loading={bookingsLoadState === 'loading'}
            error={bookingsLoadError}
            onRefresh={loadBookings}
            onUpdateStatus={handleUpdateBookingStatus}
            updatingId={bookingUpdatingId}
            dataSource={dataSource}
          />
        )}

        {activeTab === 'profile' && currentUser?.role === 'owner' && (
          <BusinessProfileSettings currentUser={currentUser} />
        )}
      </main>

      {/* Workspace Sub-Footer with Built by Samatha Reddy Credit */}
      <footer className="border-t border-white/10 bg-[#0D1126] py-3.5 text-xs text-slate-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-300">
            <span>© {new Date().getFullYear()} ServiceFlow AI</span>
            <span>•</span>
            <span>Less Admin. Better Business.</span>
            <span>•</span>
            <span className="font-medium text-slate-100">Built by Samatha Reddy</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenDiagnostics}
              className="inline-flex items-center space-x-1.5 text-content-secondary hover:text-brand-teal transition-colors"
              title="System Diagnostics"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  backendStatus === 'healthy'
                    ? 'bg-emerald-500'
                    : backendStatus === 'offline'
                    ? 'bg-rose-500'
                    : 'bg-amber-500'
                }`}
              />
              <span>System Status</span>
            </button>

            <button
              onClick={onBackToLanding}
              className="text-brand-teal hover:underline font-medium"
            >
              Exit to Homepage
            </button>
          </div>
        </div>
      </footer>

      {isCreateOpen && currentUser && (
        <CreateEnquiryModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onCreate={handleCreateEnquiry}
          businessName={currentUser.businessName}
        />
      )}

      {/* Detail Modal */}
      <EnquiryDetailModal
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onUpdateStatus={handleUpdateStatus}
        onConvertToBooking={handleConvertToBooking}
        statusUpdating={statusUpdating}
        statusError={statusError}
        dataSource={dataSource}
        databaseStatus={databaseStatus}
      />
    </div>
  );
}
