import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { DashboardPreview } from './DashboardPreview';

interface HeroProps {
  onExploreClick: () => void;
  onHowItWorksClick: () => void;
}

export function Hero({ onExploreClick, onHowItWorksClick }: HeroProps) {
  return (
    <section className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden" id="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-teal-50 border border-brand-teal-100 text-brand-teal text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
              <span>Smart Operating Core for Service Businesses</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-content-primary leading-[1.12]">
              Less Admin.{' '}
              <span className="text-brand-teal inline-block relative">
                Better Business.
                <svg
                  className="absolute left-0 -bottom-1.5 w-full text-brand-teal/20"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M1 5.5C50 2 150 2 199 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-content-secondary leading-relaxed max-w-xl mx-auto lg:mx-0">
              Manage customer enquiries, organise bookings, and keep your service business
              moving—with AI assistance that keeps you in control.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl bg-brand-teal text-white hover:bg-brand-teal-light font-semibold text-sm shadow-card hover:shadow-hover hover:scale-[1.01] active:scale-[0.99] transition-all"
                id="hero-explore-btn"
              >
                <span>Explore the Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onHowItWorksClick}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl border border-surface-muted bg-surface-card hover:bg-surface-bg text-content-primary font-semibold text-sm shadow-soft transition-all"
                id="hero-how-it-works-btn"
              >
                <span>See How It Works</span>
              </button>
            </div>

            {/* Honest Highlights / Guardrails */}
            <div className="pt-4 border-t border-surface-muted/80 grid grid-cols-2 gap-3 text-xs text-content-secondary text-left">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span>Human sign-off on all AI replies</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-brand-teal flex-shrink-0" />
                <span>Unified enquiry & booking view</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Dashboard Preview */}
          <div className="lg:col-span-7 w-full">
            <div className="relative">
              {/* Subtle background glow effect */}
              <div
                className="absolute -inset-2 bg-gradient-to-r from-brand-teal/10 via-brand-teal-light/5 to-transparent rounded-3xl blur-xl -z-10"
                aria-hidden="true"
              />
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
