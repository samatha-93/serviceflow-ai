import { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Inbox,
  ShieldCheck,
} from 'lucide-react';
import { CustomerEnquiry } from '../../types';
import { DEMO_ENQUIRIES } from '../../data/mockEnquiries';
import { EnquiryMetrics } from './EnquiryMetrics';
import { EnquiryFilters } from './EnquiryFilters';
import { EnquiryTable } from './EnquiryTable';
import { EnquiryDetailModal } from './EnquiryDetailModal';

interface EnquiryWorkspaceProps {
  onBackToLanding: () => void;
  onOpenDiagnostics: () => void;
  backendStatus: 'healthy' | 'offline' | 'checking';
}

export function EnquiryWorkspace({
  onBackToLanding,
  onOpenDiagnostics,
  backendStatus,
}: EnquiryWorkspaceProps) {
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(DEMO_ENQUIRIES);
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);

  // Status update handler: updates in-memory list and selected item
  const handleUpdateStatus = (enquiryId: string, newStatus: CustomerEnquiry['status']) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === enquiryId ? { ...item, status: newStatus } : item))
    );
    setSelectedEnquiry((prev) =>
      prev && prev.id === enquiryId ? { ...prev, status: newStatus } : prev
    );
  };

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // Search matching across multiple fields
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

      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'ALL' && item.serviceCategory !== categoryFilter) {
        return false;
      }

      // Urgency filter
      if (urgencyFilter !== 'ALL' && item.urgency !== urgencyFilter) {
        return false;
      }

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
              {/* Demo Mode Notice */}
              <span className="hidden md:inline-flex items-center space-x-1.5 text-xs text-content-muted bg-surface-bg px-2.5 py-1 rounded-lg border border-surface-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
                <span>UI Demo Mode</span>
              </span>

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
      </main>

      {/* Workspace Sub-Footer */}
      <footer className="border-t border-surface-muted bg-surface-card py-4 text-xs text-content-secondary mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span>© {new Date().getFullYear()} ServiceFlow AI.</span>
            <span>•</span>
            <span className="text-content-muted">Phase 3 Step 2: Enquiry Status Operations (In-Memory)</span>
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
        onUpdateStatus={(newStatus) => {
          if (selectedEnquiry) {
            handleUpdateStatus(selectedEnquiry.id, newStatus);
          }
        }}
      />
    </div>
  );
}
