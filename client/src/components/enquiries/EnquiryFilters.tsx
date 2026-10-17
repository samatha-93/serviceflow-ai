import { Search, X, RotateCcw, Filter } from 'lucide-react';
import { SERVICE_CATEGORIES, ENQUIRY_STATUSES, URGENCY_LEVELS } from '../../data/mockEnquiries';

interface EnquiryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  urgencyFilter: string;
  onUrgencyChange: (urgency: string) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export function EnquiryFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  urgencyFilter,
  onUrgencyChange,
  onResetFilters,
  totalCount,
  filteredCount,
}: EnquiryFiltersProps) {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    urgencyFilter !== 'ALL';

  return (
    <div className="bg-dark-card rounded-xl border border-white/10 p-3 shadow-card space-y-2.5">
      {/* Primary Integrated Toolbar */}
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
        {/* Search Input Field */}
        <div className="relative flex-1 min-w-[220px]">
          <label htmlFor="enquiry-search-input" className="sr-only">
            Search enquiries by customer, service, or location
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-content-secondary">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="enquiry-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by customer, service, location..."
            className="w-full pl-9 pr-8 py-2 bg-[#070913] border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-400 focus:bg-[#0D1126] focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-content-secondary hover:text-content-primary transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Status Select */}
          <div className="flex-1 sm:flex-initial">
            <label htmlFor="status-filter-select" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full sm:w-auto py-2 px-2.5 bg-[#070913] border border-white/10 rounded-lg text-xs font-medium text-slate-100 focus:bg-[#0D1126] focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              {ENQUIRY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Service Category Select */}
          <div className="flex-1 sm:flex-initial">
            <label htmlFor="category-filter-select" className="sr-only">
              Filter by service category
            </label>
            <select
              id="category-filter-select"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full sm:w-auto py-2 px-2.5 bg-[#070913] border border-white/10 rounded-lg text-xs font-medium text-slate-100 focus:bg-[#0D1126] focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Select */}
          <div className="flex-1 sm:flex-initial">
            <label htmlFor="urgency-filter-select" className="sr-only">
              Filter by urgency
            </label>
            <select
              id="urgency-filter-select"
              value={urgencyFilter}
              onChange={(e) => onUrgencyChange(e.target.value)}
              className="w-full sm:w-auto py-2 px-2.5 bg-[#070913] border border-white/10 rounded-lg text-xs font-medium text-slate-100 focus:bg-[#0D1126] focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal transition-all cursor-pointer"
            >
              <option value="ALL">All Urgencies</option>
              {URGENCY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level} Urgency
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Action button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center space-x-1 px-2.5 py-2 rounded-lg text-xs font-semibold text-content-secondary hover:text-brand-teal hover:bg-brand-teal-50 border border-transparent hover:border-brand-teal-100 transition-colors whitespace-nowrap"
              id="reset-filters-btn"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Counts & Active Filter Context Strip */}
      <div className="flex items-center justify-between text-xs text-content-secondary px-0.5 pt-1 border-t border-white/10">
        <div className="flex items-center space-x-1.5">
          <Filter className="w-3 h-3 text-brand-teal" aria-hidden="true" />
          <span>
            Showing <strong className="text-content-primary font-semibold">{filteredCount}</strong> of{' '}
            <strong className="text-content-primary font-semibold">{totalCount}</strong> enquiries
          </span>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-brand-teal-50 text-brand-teal border border-brand-teal-100">
              Filtered
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-brand-teal hover:underline font-medium sm:hidden"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
