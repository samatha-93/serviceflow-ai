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
import { AuthModal } from './components/auth/AuthModal';
import { EnquiryWorkspace } from './components/enquiries/EnquiryWorkspace';
import { HealthResponse, UserProfile } from './types';
import { fetchCurrentUser, logoutUser } from './services/auth.api';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState<boolean>(false);
  const [getStartedOpen, setGetStartedOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

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

  // Restore active user session on app load
  useEffect(() => {
    checkHealth();
    fetchCurrentUser()
      .then((user) => {
        if (user) setCurrentUser(user);
      })
      .catch((_err) => {
        // Session not present or expired
      });
  }, []);

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };


  // Listen to hash changes for direct workspace access (e.g. #workspace or #enquiries)
  useEffect(() => {
    const syncViewWithHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#workspace' || hash === '#enquiries') {
        setCurrentView('workspace');
      } else if (hash === '' || hash === '#home') {
        setCurrentView('landing');
      }
    };

    syncViewWithHash();
    window.addEventListener('hashchange', syncViewWithHash);
    return () => window.removeEventListener('hashchange', syncViewWithHash);
  }, []);

  const openWorkspace = () => {
    window.location.hash = '#workspace';
    setCurrentView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeWorkspace = () => {
    window.location.hash = '';
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // If viewing the Enquiry Management Workspace
  if (currentView === 'workspace') {
    return (
      <>
        <EnquiryWorkspace
          onBackToLanding={closeWorkspace}
          onOpenDiagnostics={() => setDiagnosticsOpen(true)}
          backendStatus={backendStatus}
          databaseStatus={healthData?.database.status}
          currentUser={currentUser}
          onOpenAuth={openAuth}
          onLogout={handleLogout}
        />

        {/* Developer Diagnostics Modal preserved in workspace */}
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

        {/* Auth Modal (Sign In / Register) */}
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authModalMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
          }}
        />
      </>
    );
  }

  // Public Landing Page (Preserved completely intact)
  return (
    <div className="min-h-screen bg-surface-bg text-content-primary flex flex-col font-sans selection:bg-brand-teal selection:text-white">
      {/* 1. Navigation */}
      <Navbar
        onOpenGetStarted={() => setGetStartedOpen(true)}
        onOpenWorkspace={openWorkspace}
        currentUser={currentUser}
        onOpenAuth={openAuth}
        onLogout={handleLogout}
      />

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
        <FinalCta onCtaClick={() => openAuth('register')} />
      </main>

      {/* 8. Footer */}
      <Footer
        onOpenDiagnostics={() => setDiagnosticsOpen(true)}
        backendStatus={backendStatus}
        onOpenWorkspace={openWorkspace}
      />

      {/* Developer Diagnostics Modal */}
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

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
