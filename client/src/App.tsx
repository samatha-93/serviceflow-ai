import { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Server,
  Layers,
  Sparkles,
  TreePine,
  Sparkle,
  HeartHandshake,
  Wrench,
  Briefcase,
  ExternalLink,
  Code2,
  Database,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface HealthResponse {
  status: string;
  service: string;
  tagline: string;
  version: string;
  uptime: number;
  timestamp: string;
  environment: string;
  database: {
    status: string;
  };
  supportedCategories: string[];
}

export default function App() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [showRaw, setShowRaw] = useState<boolean>(false);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
      }
      const data: HealthResponse = await res.json();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setHealthData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reach API';
      setError(message);
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const businessCategories = [
    {
      id: 'outdoor',
      name: 'Outdoor & Property Services',
      description: 'Lawn care, landscaping, tree surgery, pressure washing, and snow removal.',
      icon: TreePine,
      badge: 'Field Ops',
    },
    {
      id: 'cleaning',
      name: 'Cleaning Services',
      description: 'Residential, commercial, post-construction, and specialized deep cleaning.',
      icon: Sparkle,
      badge: 'High Frequency',
    },
    {
      id: 'beauty',
      name: 'Beauty & Wellness',
      description: 'Mobile stylists, massage therapists, estheticians, and personal wellness coaches.',
      icon: HeartHandshake,
      badge: 'Client Loyalty',
    },
    {
      id: 'maintenance',
      name: 'Home Maintenance',
      description: 'Plumbing, electrical, HVAC, handyman repairs, and appliance maintenance.',
      icon: Wrench,
      badge: 'On-Demand',
    },
    {
      id: 'professionals',
      name: 'Independent Professionals',
      description: 'Consultants, mobile notaries, home inspectors, and specialized freelancers.',
      icon: Briefcase,
      badge: 'Solo & Boutique',
    },
  ];

  return (
    <div className="min-h-screen bg-surface-bg text-content-primary flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-surface-muted bg-surface-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-soft">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-content-primary">
                ServiceFlow <span className="text-brand-teal">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-3 px-2 py-0.5 text-xs font-medium rounded-full bg-brand-teal-50 text-brand-teal border border-brand-teal-100">
                Phase 1 Foundation
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/samatha-93/serviceflow-ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 text-sm font-medium text-content-secondary hover:text-brand-teal transition-colors"
              id="github-repo-link"
            >
              <span>GitHub</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              onClick={checkHealth}
              disabled={loading}
              className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-surface-muted hover:bg-brand-teal-50 text-content-primary hover:text-brand-teal transition-all disabled:opacity-50"
              id="refresh-health-btn"
              title="Ping Backend Health"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Ping API</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-5 pt-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-teal-50 border border-brand-teal-100 text-brand-teal text-xs font-semibold">
            <Activity className="h-3.5 w-3.5 animate-pulse text-brand-teal" />
            <span>Less Admin. Better Business.</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-content-primary leading-tight">
            The Intelligent Operating Core for{' '}
            <span className="text-brand-teal underline decoration-brand-teal-100 decoration-wavy decoration-2">
              Service Businesses
            </span>
          </h1>

          <p className="text-lg text-content-secondary leading-relaxed">
            Eliminate administrative overload. ServiceFlow AI streamlines client inquiries,
            intelligent job scheduling, CRM records, and automated operations for modern service
            providers.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <div className="flex items-center space-x-2 text-xs text-content-secondary bg-surface-card px-3.5 py-1.5 rounded-full border border-surface-muted shadow-soft">
              <ShieldCheck className="h-4 w-4 text-brand-teal" />
              <span>Monorepo Architecture</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-content-secondary bg-surface-card px-3.5 py-1.5 rounded-full border border-surface-muted shadow-soft">
              <Code2 className="h-4 w-4 text-brand-teal" />
              <span>React 18 + Vite + TypeScript</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-content-secondary bg-surface-card px-3.5 py-1.5 rounded-full border border-surface-muted shadow-soft">
              <Server className="h-4 w-4 text-brand-teal" />
              <span>Express + Node + Mongoose</span>
            </div>
          </div>
        </section>

        {/* Backend Health Check Card */}
        <section className="bg-surface-card border border-surface-muted rounded-2xl p-6 sm:p-8 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-surface-muted gap-4">
            <div className="flex items-center space-x-4">
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                  healthData
                    ? 'bg-emerald-50 text-emerald-600'
                    : error
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-surface-muted text-content-secondary'
                }`}
              >
                <Server className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg font-bold text-content-primary">Backend System Health</h2>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      healthData
                        ? 'bg-emerald-100 text-emerald-800'
                        : error
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {loading ? 'Pinging...' : healthData ? 'Operational' : 'Unavailable'}
                  </span>
                </div>
                <p className="text-sm text-content-secondary mt-0.5">
                  Live verification of Express API, environment variables, and database readiness.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowRaw(!showRaw)}
                className="text-xs font-medium px-3 py-2 rounded-lg border border-surface-muted hover:border-brand-teal text-content-secondary hover:text-brand-teal transition-all"
                id="toggle-raw-json-btn"
              >
                {showRaw ? 'Hide JSON' : 'Inspect Response'}
              </button>

              <button
                onClick={checkHealth}
                disabled={loading}
                className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-lg bg-brand-teal text-white hover:bg-brand-teal-light shadow-sm transition-all disabled:opacity-50"
                id="retest-health-btn"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Test Health</span>
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-surface-bg p-4 rounded-xl border border-surface-muted">
              <span className="text-xs font-medium text-content-secondary uppercase tracking-wider">
                API Endpoint
              </span>
              <p className="text-sm font-semibold text-content-primary mt-1 flex items-center space-x-1.5 font-mono">
                <span className="text-brand-teal">GET</span>
                <span>/api/health</span>
              </p>
              <span className="text-xs text-content-muted mt-1 block">Vite proxy active</span>
            </div>

            <div className="bg-surface-bg p-4 rounded-xl border border-surface-muted">
              <span className="text-xs font-medium text-content-secondary uppercase tracking-wider">
                API Status
              </span>
              <div className="flex items-center space-x-2 mt-1">
                {healthData ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Healthy (200 OK)</span>
                  </>
                ) : error ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <span className="text-sm font-semibold text-rose-700">Offline / Error</span>
                  </>
                ) : (
                  <span className="text-sm text-content-muted">Checking...</span>
                )}
              </div>
              <span className="text-xs text-content-muted mt-1 block">
                {latency !== null ? `${latency} ms roundtrip` : 'Latency pending'}
              </span>
            </div>

            <div className="bg-surface-bg p-4 rounded-xl border border-surface-muted">
              <span className="text-xs font-medium text-content-secondary uppercase tracking-wider">
                Database Status
              </span>
              <div className="flex items-center space-x-2 mt-1">
                <Database className="h-4 w-4 text-brand-teal" />
                <span className="text-sm font-semibold text-content-primary capitalize">
                  {healthData?.database.status || 'Standby Mode'}
                </span>
              </div>
              <span className="text-xs text-content-muted mt-1 block">
                {healthData?.database.status === 'connected'
                  ? 'MongoDB active'
                  : 'Phase 1 non-blocking fallback'}
              </span>
            </div>

            <div className="bg-surface-bg p-4 rounded-xl border border-surface-muted">
              <span className="text-xs font-medium text-content-secondary uppercase tracking-wider">
                Backend Uptime
              </span>
              <p className="text-sm font-semibold text-content-primary mt-1">
                {healthData ? `${healthData.uptime} seconds` : '—'}
              </p>
              <span className="text-xs text-content-muted mt-1 block">
                Env: {healthData?.environment || 'development'}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Backend Unreachable</p>
                <p className="text-xs mt-1 text-rose-700">
                  Ensure the Express server is running on port 5000 (
                  <code className="font-mono bg-rose-100 px-1 py-0.5 rounded">npm run dev:server</code>
                  ). Error details: {error}
                </p>
              </div>
            </div>
          )}

          {showRaw && healthData && (
            <div className="mt-6 pt-4 border-t border-surface-muted">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-content-secondary">
                  JSON Response Payload
                </span>
                <span className="text-xs text-content-muted font-mono">
                  {healthData.timestamp}
                </span>
              </div>
              <pre className="bg-content-primary text-gray-100 text-xs font-mono p-4 rounded-xl overflow-x-auto shadow-inner">
                {JSON.stringify(healthData, null, 2)}
              </pre>
            </div>
          )}
        </section>

        {/* Supported Business Verticals */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                Target Verticals
              </span>
              <h2 className="text-2xl font-bold text-content-primary mt-1">
                Designed for Service-Based Businesses
              </h2>
            </div>
            <p className="text-sm text-content-secondary max-w-md">
              Configurable workflows adapted to quote-based, appointment-based, and dispatch-based
              service companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {businessCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="bg-surface-card border border-surface-muted rounded-2xl p-6 shadow-soft hover:shadow-hover hover:border-brand-teal/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-brand-teal-50 text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-muted text-content-secondary">
                      {cat.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-content-primary group-hover:text-brand-teal transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-content-secondary mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              );
            })}

            {/* Platform Feature Highlight Card */}
            <div className="bg-gradient-to-br from-brand-teal to-brand-teal-dark text-white rounded-2xl p-6 shadow-card flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white inline-block mb-3">
                  AI Assist Vision
                </span>
                <h3 className="text-lg font-bold">Autonomous Routine Admin</h3>
                <p className="text-sm text-teal-100 mt-2 leading-relaxed">
                  Automatic enquiry intake parsing, quote estimation drafting, customer follow-up
                  nudges, and schedule optimization.
                </p>
              </div>
              <div className="pt-6 flex items-center text-xs font-semibold text-white/90">
                <span>Phase 2-4 Roadmap</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </div>
            </div>
          </div>
        </section>

        {/* Monorepo Architecture Overview */}
        <section className="bg-surface-card border border-surface-muted rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-brand-teal-50 text-brand-teal flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-content-primary">Foundation Architecture</h2>
              <p className="text-sm text-content-secondary">
                Clean separation of concerns with TypeScript, modular packaging, and robust safety.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-xl border border-surface-muted bg-surface-bg/50 space-y-2">
              <div className="flex items-center space-x-2 text-brand-teal font-semibold text-sm">
                <Code2 className="h-4 w-4" />
                <span>client/ (Vite + React)</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                React 18 with TypeScript and Tailwind CSS. Modern component-driven UI with customized
                design system tokens and Inter typography.
              </p>
              <div className="pt-2 text-xs font-mono text-content-muted">
                Port: 5173 • Proxy: /api
              </div>
            </div>

            <div className="p-5 rounded-xl border border-surface-muted bg-surface-bg/50 space-y-2">
              <div className="flex items-center space-x-2 text-brand-teal font-semibold text-sm">
                <Server className="h-4 w-4" />
                <span>server/ (Express + TS)</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Layered backend with Helmet security, CORS management, centralized configuration,
                and health check controllers.
              </p>
              <div className="pt-2 text-xs font-mono text-content-muted">
                Port: 5000 • TSX Hot-Reload
              </div>
            </div>

            <div className="p-5 rounded-xl border border-surface-muted bg-surface-bg/50 space-y-2">
              <div className="flex items-center space-x-2 text-brand-teal font-semibold text-sm">
                <Database className="h-4 w-4" />
                <span>docs/ & Data Layer</span>
              </div>
              <p className="text-xs text-content-secondary leading-relaxed">
                Mongoose ready with non-blocking graceful fallback. Comprehensive architecture and
                functional requirements documentation.
              </p>
              <div className="pt-2 text-xs font-mono text-content-muted">
                requirements.md • architecture.md
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-muted bg-surface-card mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-content-secondary gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-content-primary">ServiceFlow AI</span>
            <span>—</span>
            <span>Less Admin. Better Business.</span>
          </div>
          <div>
            <span>Repository: </span>
            <a
              href="https://github.com/samatha-93/serviceflow-ai"
              target="_blank"
              rel="noreferrer"
              className="text-brand-teal hover:underline font-medium"
            >
              samatha-93/serviceflow-ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
