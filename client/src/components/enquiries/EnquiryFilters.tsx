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
    <div className="bg-surface-card rounded-2xl border border-surface-muted p-4 sm:p-5 shadow-soft space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <label htmlFor="enquiry-search-input" className="sr-only">
            Search enquiries by customer, service or location
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-content-muted">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="enquiry-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by customer, service, location, or notes..."
            className="w-full pl-10 pr-9 py-2.5 bg-surface-bg border border-surface-muted rounded-xl text-sm text-content-primary placeholder-content-muted focus:bg-white focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-content-muted hover:text-content-primary transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Status Select */}
          <div className="flex flex-col">
            <label htmlFor="status-filter-select" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter-select"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full py-2.5 px-3 bg-surface-bg border border-surface-muted rounded-xl text-sm text-content-primary font-medium focus:bg-white focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all cursor-pointer"
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
          <div className="flex flex-col">
            <label htmlFor="category-filter-select" className="sr-only">
              Filter by service category
            </label>
            <select
              id="category-filter-select"
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full py-2.5 px-3 bg-surface-bg border border-surface-muted rounded-xl text-sm text-content-primary font-medium focus:bg-white focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all cursor-pointer"
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
          <div className="flex flex-col">
            <label htmlFor="urgency-filter-select" className="sr-only">
              Filter by urgency
            </label>
            <select
              id="urgency-filter-select"
              value={urgencyFilter}
              onChange={(e) => onUrgencyChange(e.target.value)}
              className="w-full py-2.5 px-3 bg-surface-bg border border-surface-muted rounded-xl text-sm text-content-primary font-medium focus:bg-white focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all cursor-pointer"
            >
              <option value="ALL">All Urgencies</option>
              {URGENCY_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level} Urgency
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Status & Reset Strip */}
      <div className="flex flex-wrap items-center justify-between text-xs text-content-secondary pt-1 border-t border-surface-muted gap-2">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-brand-teal" aria-hidden="true" />
          <span>
            Showing <strong className="text-content-primary">{filteredCount}</strong> of{' '}
            <strong>{totalCount}</strong> enquiries
          </span>
          {hasActiveFilters && (
            <span className="text-brand-teal font-medium">(Filtered)</span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-bg transition-colors font-medium"
            id="reset-filters-btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
