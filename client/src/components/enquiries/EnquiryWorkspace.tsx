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
} from 'lucide-react';
import { CustomerEnquiry } from '../../types';
import { DEMO_ENQUIRIES } from '../../data/mockEnquiries';
import { fetchEnquiries, patchEnquiryStatus, ApiError } from '../../services/enquiry.api';
import { EnquiryMetrics } from './EnquiryMetrics';
import { EnquiryFilters } from './EnquiryFilters';
import { EnquiryTable } from './EnquiryTable';
import { EnquiryDetailModal } from './EnquiryDetailModal';

interface EnquiryWorkspaceProps {
  onBackToLanding: () => void;
  onOpenDiagnostics: () => void;
  backendStatus: 'healthy' | 'offline' | 'checking';
  databaseStatus?: string;
}

type DataSource = 'api' | 'demo';

export function EnquiryWorkspace({
  onBackToLanding,
  onOpenDiagnostics,
  backendStatus,
  databaseStatus,
}: EnquiryWorkspaceProps) {
  // ----------------------------------------------------------------
  // Data state
  // ----------------------------------------------------------------
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [dataSource, setDataSource] = useState<DataSource>('api');
  const [loadState, setLoadState] = useState<'loading' | 'error' | 'empty' | 'ready'>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);

  // ----------------------------------------------------------------
  // Detail modal state
  // ----------------------------------------------------------------
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);

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
  }, [backendStatus]);

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
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" id="workspace-content">
        {/* Workspace Title & Introduction */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-surface-muted/60">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
                Enquiry Management
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-teal-50 text-brand-teal border border-brand-teal-100">
                Phase 3
              </span>
            </div>
            <p className="text-sm text-content-secondary max-w-2xl leading-relaxed">
              Triage customer enquiries, inspect job requests, and preview AI-assisted proposals across your service verticals.
            </p>
          </div>

          <div className="text-xs text-content-muted">
            ServiceFlow AI • Standalone Workspace View
          </div>
        </div>

        {/* ── Loading state ── */}
        {loadState === 'loading' && (
          <div className="bg-surface-card rounded-2xl border border-surface-muted p-16 text-center flex flex-col items-center space-y-4 shadow-soft">
            <Loader2 className="w-10 h-10 text-brand-teal animate-spin" />
            <p className="text-sm font-medium text-content-secondary">
              Loading enquiries from API…
            </p>
          </div>
        )}

        {/* ── Error state ── */}
        {loadState === 'error' && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-4 shadow-soft" role="alert">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-rose-500" />
              </div>
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base font-bold text-rose-800">Failed to load enquiries</h3>
              <p className="text-sm text-rose-700 leading-relaxed font-mono break-words">
                {loadError}
              </p>
            </div>
            <button
              onClick={loadEnquiries}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-sm font-semibold shadow-soft transition-all"
            >
              <RefreshCw className="w-4 h-4" />
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
                className="flex items-start space-x-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800"
              >
                <WifiOff className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-semibold text-amber-900">Server offline — showing demo data</span>
                  <p className="text-xs leading-relaxed text-amber-700">
                    The backend API could not be reached. Displaying read-only sample enquiries for
                    demonstration purposes. Status updates will apply locally only and will not
                    persist. Start the server and{' '}
                    <button
                      onClick={loadEnquiries}
                      className="underline font-semibold hover:text-amber-900"
                    >
                      reload
                    </button>{' '}
                    to connect to live data.
                  </p>
                </div>
              </div>
            )}

            {/* 1. Summary Metrics Cards */}
            <EnquiryMetrics enquiries={enquiries} />

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
            />
          </>
        )}
      </main>

      {/* Workspace Sub-Footer */}
      <footer className="border-t border-surface-muted bg-surface-card py-4 text-xs text-content-secondary mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span>© {new Date().getFullYear()} ServiceFlow AI.</span>
            <span>•</span>
            <span className="text-content-muted">
              Phase 3 Step 3D: Frontend-Backend API Integration
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenDiagnostics}
              className="inline-flex items-center space-x-1.5 text-content-muted hover:text-brand-teal transition-colors"
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

      {/* Detail Modal */}
      <EnquiryDetailModal
        enquiry={selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        onUpdateStatus={handleUpdateStatus}
        statusUpdating={statusUpdating}
        statusError={statusError}
        dataSource={dataSource}
        databaseStatus={databaseStatus}
      />
    </div>
  );
}
