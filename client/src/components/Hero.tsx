import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { WorkflowVisual } from './WorkflowVisual';

interface HeroProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
}

export function Hero({ onExploreClick, onHowItWorksClick }: HeroProps) {
  return (
    <section
      className="relative pt-8 sm:pt-12 lg:pt-16 pb-14 sm:pb-18 lg:pb-24 scroll-mt-24 overflow-hidden"
      id="hero-section"
      aria-label="ServiceFlow AI Overview"
    >
      {/* Layered Technical & Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        {/* Deep navy vignette */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#0D122E_0%,#070913_75%)]"
        />

        {/* Restrained technical grid with radial mask */}
        <div
          className="absolute inset-0 bg-grid-pattern opacity-15 [mask-image:radial-gradient(ellipse_75%_55%_at_50%_30%,#000_60%,transparent_100%)]"
        />

        {/* Cinematic 3D Workflow Backdrop Image (Generated) */}
        <div
          className="absolute top-1/2 -right-10 lg:right-0 -translate-y-1/2 w-[650px] lg:w-[780px] h-[520px] pointer-events-none opacity-30 mix-blend-screen [mask-image:radial-gradient(ellipse_65%_65%_at_55%_50%,#000_35%,transparent_100%)]"
        >
          <img
            src="/hero-backdrop.jpg"
            alt=""
            className="w-full h-full object-cover object-center"
            aria-hidden="true"
          />
        </div>

        {/* Lightweight SVG Connection Paths (Connecting Enquiries ➔ Replies ➔ Bookings) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 600"
        >
          <defs>
            <linearGradient id="heroPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M 80 280 C 320 280, 420 180, 720 200 S 1020 320, 1150 260"
            fill="none"
            stroke="url(#heroPathGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <path
            d="M 120 350 C 380 350, 520 420, 780 360 S 980 240, 1150 380"
            fill="none"
            stroke="url(#heroPathGrad)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <circle cx="420" cy="180" r="2.5" fill="#8B5CF6" opacity="0.6" />
          <circle cx="720" cy="200" r="2.5" fill="#38BDF8" opacity="0.6" />
          <circle cx="780" cy="360" r="2.5" fill="#8B5CF6" opacity="0.6" />
        </svg>

        {/* Soft Ambient Light Cones */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-24 right-1/4 w-[400px] h-[300px] bg-indigo-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-[350px] h-[250px] bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Hero Value Proposition (Balanced 6 columns) */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            {/* Pill Tag */}
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/25 text-violet-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Smart Operating Core for Service Businesses</span>
              </div>
            </div>

            {/* Refined Headline: Perfectly sized so lines fit comfortably without clipping */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] xl:text-[2.5rem] font-bold tracking-tight text-white leading-tight">
              Your Business. Connected.{' '}
              <span className="block mt-1 pb-2 bg-gradient-to-r from-violet-300 via-indigo-200 to-slate-200 bg-clip-text text-transparent font-extrabold">
                Your Operations. Intelligent.
              </span>
            </h1>

            {/* Approved Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              Connect customer enquiries, bookings, and daily business workflows in one organised
              workspace—with AI-assisted support that keeps you in control.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              <button
                type="button"
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 sm:py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors shadow-sm focus-visible:outline-violet-500"
                id="hero-explore-btn"
              >
                <span>Explore the Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onHowItWorksClick}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 sm:py-3 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-medium text-sm transition-colors focus-visible:outline-violet-500"
                id="hero-how-it-works-btn"
              >
                <span>See How It Works</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-400 text-left">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>Human sign-off on all AI replies</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Unified enquiry & booking view</span>
              </div>
            </div>
          </div>

          {/* Right Column: 5-Stage 3D Floating Workflow Visualization */}
          <div className="lg:col-span-6 w-full pt-4 sm:pt-6 pb-4">
            <WorkflowVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
