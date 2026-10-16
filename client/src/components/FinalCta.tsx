import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCtaProps {
  onCtaClick: () => void;
}

export function FinalCta({ onCtaClick }: FinalCtaProps) {
  return (
    <section className="py-16 sm:py-24 bg-surface-card border-t border-surface-muted relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-teal/5 blur-3xl rounded-full -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-teal-50 border border-brand-teal-100 text-brand-teal text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Less Admin. Better Business.</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-content-primary leading-tight">
          Bring more clarity to your{' '}
          <span className="text-brand-teal">day-to-day operations.</span>
        </h2>

        <p className="text-base sm:text-lg text-content-secondary max-w-2xl mx-auto leading-relaxed">
          Organise incoming customer enquiries, coordinate bookings with confidence, and spend less
          time on routine admin. Experience an operating workflow built to keep your service
          business moving.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onCtaClick}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-brand-teal text-white hover:bg-brand-teal-light font-semibold text-base shadow-card hover:shadow-hover hover:scale-[1.01] active:scale-[0.99] transition-all"
            id="final-cta-btn"
          >
            <span>Explore ServiceFlow AI</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl border border-surface-muted bg-surface-bg hover:bg-surface-card text-content-primary font-semibold text-base shadow-soft transition-all"
            id="final-how-it-works-btn"
          >
            <span>See How It Works</span>
          </a>
        </div>
      </div>
    </section>
  );
}
