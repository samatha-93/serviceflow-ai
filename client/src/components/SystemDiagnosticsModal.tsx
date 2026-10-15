import { useEffect } from 'react';
import {
  X,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Clock,
  Layers,
} from 'lucide-react';
import { HealthResponse } from '../types';

interface SystemDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthData: HealthResponse | null;
  loading: boolean;
  error: string | null;
  latency: number | null;
  showRaw: boolean;
  setShowRaw: (show: boolean) => void;
  onRetest: () => void;
}

export function SystemDiagnosticsModal({
  isOpen,
  onClose,
  healthData,
  loading,
  error,
  latency,
  showRaw,
  setShowRaw,
  onRetest,
}: SystemDiagnosticsModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-content-primary/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diagnostics-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-surface-card rounded-2xl shadow-2xl border border-surface-muted overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-muted flex items-center justify-between bg-surface-bg/80">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-soft">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 id="diagnostics-modal-title" className="text-base font-bold text-content-primary">
                  Developer System Diagnostics
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    healthData
                      ? 'bg-emerald-100 text-emerald-800'
                      : error
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {loading ? 'Pinging...' : healthData ? 'Operational' : 'API Standby / Offline'}
                </span>
              </div>
              <p className="text-xs text-content-secondary mt-0.5">
                Live verification of Express API, environment parameters, and MongoDB status.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-content-secondary hover:text-content-primary rounded-lg hover:bg-surface-muted transition-colors"
            aria-label="Close Diagnostics Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-bg p-3 rounded-xl border border-surface-muted">
            <div className="text-xs text-content-secondary flex items-center space-x-2">
              <span className="font-mono bg-white px-2 py-1 rounded border border-surface-muted text-brand-teal font-semibold">
                GET /api/health
              </span>
              <span>Port: 5000 (Vite Proxy: 5173)</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowRaw(!showRaw)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-surface-muted hover:border-brand-teal bg-white text-content-secondary hover:text-brand-teal transition-all"
                id="modal-toggle-json-btn"
              >
                {showRaw ? 'Hide Raw JSON' : 'Inspect Raw JSON'}
              </button>

              <button
                type="button"
                onClick={onRetest}
                disabled={loading}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-teal text-white hover:bg-brand-teal-light shadow-sm transition-all disabled:opacity-50"
                id="modal-retest-health-btn"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Retest Endpoint</span>
              </button>
            </div>
          </div>

          {/* Diagnostic Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Status */}
            <div className="bg-surface-bg p-3.5 rounded-xl border border-surface-muted space-y-1">
              <span className="font-medium text-content-secondary uppercase tracking-wider text-[10px]">
                API Status
              </span>
              <div className="flex items-center space-x-1.5 pt-0.5">
                {healthData ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-bold text-emerald-700">Healthy (200 OK)</span>
                  </>
                ) : error ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                    <span className="font-bold text-rose-700">Offline / Error</span>
                  </>
                ) : (
                  <span className="text-content-muted">Pinging...</span>
                )}
              </div>
              <span className="text-content-muted block text-[11px]">
                {latency !== null ? `${latency} ms roundtrip` : 'Latency pending'}
              </span>
            </div>

            {/* Database Status */}
            <div className="bg-surface-bg p-3.5 rounded-xl border border-surface-muted space-y-1">
              <span className="font-medium text-content-secondary uppercase tracking-wider text-[10px]">
                Database Status
              </span>
              <div className="flex items-center space-x-1.5 pt-0.5">
                <Database className="h-4 w-4 text-brand-teal flex-shrink-0" />
                <span className="font-bold text-content-primary capitalize">
                  {healthData?.database.status || 'Standby Mode'}
                </span>
              </div>
              <span className="text-content-muted block text-[11px]">
                {healthData?.database.status === 'connected'
                  ? 'MongoDB active'
                  : 'Graceful fallback mode'}
              </span>
            </div>

            {/* Uptime */}
            <div className="bg-surface-bg p-3.5 rounded-xl border border-surface-muted space-y-1">
              <span className="font-medium text-content-secondary uppercase tracking-wider text-[10px]">
                Server Uptime
              </span>
              <div className="flex items-center space-x-1.5 pt-0.5">
                <Clock className="h-4 w-4 text-brand-teal flex-shrink-0" />
                <span className="font-bold text-content-primary">
                  {healthData ? `${healthData.uptime}s` : '—'}
                </span>
              </div>
              <span className="text-content-muted block text-[11px]">
                Env: {healthData?.environment || 'development'}
              </span>
            </div>

            {/* Architecture */}
            <div className="bg-surface-bg p-3.5 rounded-xl border border-surface-muted space-y-1">
              <span className="font-medium text-content-secondary uppercase tracking-wider text-[10px]">
                Architecture
              </span>
              <div className="flex items-center space-x-1.5 pt-0.5">
                <Layers className="h-4 w-4 text-brand-teal flex-shrink-0" />
                <span className="font-bold text-content-primary">Monorepo v0.1.0</span>
              </div>
              <span className="text-content-muted block text-[11px]">TS + Express + Vite</span>
            </div>
          </div>

          {/* Error Details If Offline */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm">Express API Not Reachable</p>
                <p className="leading-relaxed">
                  The client attempted to fetch <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">/api/health</code> but received: <span className="font-mono">{error}</span>.
                </p>
                <p className="text-rose-700 pt-1">
                  Tip: Ensure the Express server is running in a terminal with <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">npm run dev:server</code>. The frontend homepage remains fully interactive using demo data.
                </p>
              </div>
            </div>
          )}

          {/* Supported Categories Returned by Backend */}
          {healthData && healthData.supportedCategories && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-content-primary">
                API-Registered Business Verticals ({healthData.supportedCategories.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {healthData.supportedCategories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-surface-bg border border-surface-muted text-xs text-content-secondary"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON View */}
          {showRaw && (
            <div className="space-y-2 pt-2 border-t border-surface-muted">
              <div className="flex items-center justify-between text-xs text-content-secondary">
                <span className="font-mono">Payload: /api/health</span>
                <span className="font-mono text-content-muted">
                  {healthData?.timestamp || new Date().toISOString()}
                </span>
              </div>
              <pre className="bg-content-primary text-emerald-400 text-xs font-mono p-4 rounded-xl overflow-x-auto shadow-inner leading-relaxed">
                {healthData
                  ? JSON.stringify(healthData, null, 2)
                  : JSON.stringify({ error, note: 'Express server not running on port 5000' }, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-surface-muted bg-surface-bg flex items-center justify-between text-xs text-content-secondary">
          <span>Non-blocking diagnostics • Preserved from Phase 1 Foundation</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-surface-card border border-surface-muted hover:bg-surface-muted font-medium text-content-primary transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
