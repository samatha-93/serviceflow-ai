import { ArrowRight, Sparkles } from 'lucide-react';

interface FinalCtaProps {
  onCtaClick: () => void;
}

export function FinalCta({ onCtaClick }: FinalCtaProps) {
  return (
    <section className="py-20 sm:py-28 bg-[#070913] border-t border-white/10 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-r from-violet-600/20 to-indigo-600/20 blur-[130px] rounded-full -z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Less Admin. Better Business.</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Bring more clarity to your{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">
            day-to-day operations.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Organise incoming customer enquiries, coordinate bookings with confidence, and spend less
          time on routine admin. Experience an operating workflow built to keep your service
          business moving.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onCtaClick}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-violet-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            id="final-cta-btn"
          >
            <span>Explore ServiceFlow AI</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl border border-white/10 bg-[#121838] hover:bg-[#1A224E] text-slate-200 font-semibold text-base transition-all"
            id="final-how-it-works-btn"
          >
            <span>See How It Works</span>
          </a>
        </div>
      </div>
    </section>
  );
}
