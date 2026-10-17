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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="diagnostics-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0D1126] rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#070913]/90">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 id="diagnostics-modal-title" className="text-base font-bold text-white">
                  Developer System Diagnostics
                </h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                    healthData
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : error
                      ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {loading ? 'Pinging...' : healthData ? 'Operational' : 'API Standby / Offline'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live verification of Express API, environment parameters, and MongoDB status.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close Diagnostics Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#070913] p-3 rounded-xl border border-white/10">
            <div className="text-xs text-slate-300 flex items-center space-x-2">
              <span className="font-mono bg-[#121838] px-2.5 py-1 rounded-md border border-violet-500/30 text-violet-300 font-semibold">
                GET /api/health
              </span>
              <span className="text-slate-400">Port: 5000 (Vite Proxy: 5173)</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowRaw(!showRaw)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 hover:border-violet-500/40 bg-[#121838] text-slate-300 hover:text-white transition-all"
                id="modal-toggle-json-btn"
              >
                {showRaw ? 'Hide Raw JSON' : 'Inspect Raw JSON'}
              </button>

              <button
                type="button"
                onClick={onRetest}
                disabled={loading}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-sm transition-all disabled:opacity-50"
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
            <div className="bg-[#0A0D1F] p-3.5 rounded-xl border border-white/10 space-y-1">
              <span className="font-medium text-slate-400 uppercase tracking-wider text-[10px]">
                API Status
              </span>
              <div className="flex items-center space-x-1.5 pt-0.5">
                {healthData ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span className="font-bold text-emerald-300">Healthy (200 OK)</span>
                  </>
                ) : error ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
                    <span className="font-bold text-rose-300">Offline / Error</span>
                  </>
                ) : (
                  <span className="text-slate-500">Pinging...</span>
                )}
              </div>
              <span className="text-slate-400 block text-[11px]">
                {latency !== null ? `${latency} ms roundtrip` : 'Latency pending'}
              </span>
            </div>

            {/* Database Status */}
            <div className="bg-[#0A0D1F] p-3.5 rounded-xl border border-white/10 space-y-1">
              <span className="font-medium text-slate-400 uppercase tracking-wider text-[10px]">
                Database Status
              </span>
              <div className="flex items-center space-x-1.5 pt-0.5">
                <Database className="h-4 w-4 text-violet-400 flex-shrink-0" />
                <span className="font-bold text-white capitalize">
                  {healthData?.database.status || 'Standby Mode'}
                </span>
              </div>
              <span className="text-slate-400 block text-[11px]">
                {healthData?.database.status === 'connected'
                  ? 'MongoDB active'
                  : 'Graceful fallback mode'}
              </span>
            </div>

            {/* Uptime */}
            <div className="bg-[#0A0D1F] p-3.5 rounded-xl border border-white/10 space-y-1">
              <span className="font-medium text-slate-400 uppercase tracking-wider text-[10px]">
                Server Uptime
              </span>
              <div className="flex items-center space-x-1.5 pt-0.5">
                <Clock className="h-4 w-4 text-violet-400 flex-shrink-0" />
                <span className="font-bold text-white">
                  {healthData ? `${healthData.uptime}s` : '—'}
                </span>
              </div>
              <span className="text-slate-400 block text-[11px]">
                Env: {healthData?.environment || 'development'}
              </span>
            </div>

            {/* Architecture */}
            <div className="bg-[#0A0D1F] p-3.5 rounded-xl border border-white/10 space-y-1">
              <span className="font-medium text-slate-400 uppercase tracking-wider text-[10px]">
                Architecture
              </span>
              <div className="flex items-center space-x-1.5 pt-0.5">
                <Layers className="h-4 w-4 text-violet-400 flex-shrink-0" />
                <span className="font-bold text-white">Monorepo v0.1.0</span>
              </div>
              <span className="text-slate-400 block text-[11px]">TS + Express + Vite</span>
            </div>
          </div>

          {/* Error Details If Offline */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-white">Express API Not Reachable</p>
                <p className="leading-relaxed">
                  The client attempted to fetch <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-rose-300">/api/health</code> but received: <span className="font-mono text-rose-300">{error}</span>.
                </p>
                <p className="text-slate-300 pt-1">
                  Tip: Ensure the Express server is running in a terminal with <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-violet-300">npm run dev:server</code>. The frontend homepage remains fully interactive using demo data.
                </p>
              </div>
            </div>
          )}

          {/* Supported Categories Returned by Backend */}
          {healthData && healthData.supportedCategories && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-white">
                API-Registered Business Verticals ({healthData.supportedCategories.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {healthData.supportedCategories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-[#070913] border border-white/10 text-xs text-slate-300"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Raw JSON View */}
          {showRaw && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">Payload: /api/health</span>
                <span className="font-mono text-slate-500">
                  {healthData?.timestamp || new Date().toISOString()}
                </span>
              </div>
              <pre className="bg-[#030614] text-cyan-400 text-xs font-mono p-4 rounded-xl overflow-x-auto border border-white/10 leading-relaxed">
                {healthData
                  ? JSON.stringify(healthData, null, 2)
                  : JSON.stringify({ error, note: 'Express server not running on port 5000' }, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#070913]/90 flex items-center justify-between text-xs text-slate-400">
          <span>Non-blocking diagnostics • Preserved from Phase 1 Foundation</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#121838] border border-white/10 hover:bg-[#1A224E] font-medium text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
