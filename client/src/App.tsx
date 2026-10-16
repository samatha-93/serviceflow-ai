import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ValueStrip } from './components/ValueStrip';
import { ServiceCategories } from './components/ServiceCategories';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { SystemDiagnosticsModal } from './components/SystemDiagnosticsModal';
import { GetStartedModal } from './components/GetStartedModal';
import { HealthResponse } from './types';

export default function App() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState<boolean>(false);
  const [getStartedOpen, setGetStartedOpen] = useState<boolean>(false);

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

  const backendStatus: 'healthy' | 'offline' | 'checking' = loading
    ? 'checking'
    : healthData
    ? 'healthy'
    : 'offline';

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg text-content-primary flex flex-col font-sans selection:bg-brand-teal selection:text-white">
      {/* 1. Navigation */}
      <Navbar onOpenGetStarted={() => setGetStartedOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 w-full" id="main-content">
        {/* 2. Hero with Product Dashboard Preview */}
        <Hero
          onExploreClick={() => scrollToSection('features')}
          onHowItWorksClick={() => scrollToSection('how-it-works')}
        />

        {/* 3. Trust / Value Strip */}
        <ValueStrip />

        {/* 4. Service Categories */}
        <ServiceCategories />

        {/* 5. How It Works */}
        <HowItWorks />

        {/* 6. Feature Section */}
        <Features />

        {/* 7. Final CTA */}
        <FinalCta onCtaClick={() => setGetStartedOpen(true)} />
      </main>

      {/* 8. Footer */}
      <Footer
        onOpenDiagnostics={() => setDiagnosticsOpen(true)}
        backendStatus={backendStatus}
      />

      {/* Developer Diagnostics Modal (Preserves full backend health verification) */}
      <SystemDiagnosticsModal
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
        healthData={healthData}
        loading={loading}
        error={error}
        latency={latency}
        showRaw={showRaw}
        setShowRaw={setShowRaw}
        onRetest={checkHealth}
      />

      {/* Get Started / Early Access Exploration Modal */}
      <GetStartedModal
        isOpen={getStartedOpen}
        onClose={() => setGetStartedOpen(false)}
        onExploreDemo={() => scrollToSection('hero-section')}
      />
    </div>
  );
}
