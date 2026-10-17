import { Inbox, Calendar, ShieldCheck } from 'lucide-react';

export function ValueStrip() {
  const benefits = [
    {
      icon: Inbox,
      title: 'Keep enquiries organised',
      description:
        'Centralise customer requests from your website, email, and phone into one clean triage inbox with status tracking and urgency indicators.',
    },
    {
      icon: Calendar,
      title: 'Coordinate bookings clearly',
      description:
        'Schedule service visits with clear job durations, buffer windows, and technician assignments so your team always knows what is next.',
    },
    {
      icon: ShieldCheck,
      title: 'Review AI suggestions before sending',
      description:
        'Let AI draft contextual summaries and polite customer replies, while you retain total control to review, edit, or approve every message.',
    },
  ];

  return (
    <section className="py-12 border-y border-white/10 bg-[#070913]/90 relative overflow-hidden" aria-label="Core Value Propositions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start space-x-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0F142E]/80 to-[#0A0D1F]/90 border border-white/10 hover:border-violet-500/40 transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(139,92,246,0.15)] group backdrop-blur-xl"
              >
                <div className="h-11 w-11 rounded-xl bg-violet-950/70 text-violet-400 flex-shrink-0 flex items-center justify-center border border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.25)] group-hover:scale-105 group-hover:text-white transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
