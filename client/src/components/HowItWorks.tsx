import { Inbox, Eye, CalendarCheck, Check } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Capture an enquiry',
      icon: Inbox,
      description:
        'Customer enquiries from web forms, emails, and phone calls arrive in a single unified intake stream, with key request details extracted cleanly.',
      highlights: [
        'Centralised incoming message stream',
        'Service type and urgency detected',
        'Customer contact details logged',
      ],
    },
    {
      step: '02',
      title: 'Review and organise the details',
      icon: Eye,
      description:
        'Review the requested job, check customer history, and evaluate an AI-suggested draft response created from your service catalog and rates.',
      highlights: [
        'AI drafts proposals for your review',
        'Categorised into clear pipeline stages',
        'Total human control before any message sends',
      ],
    },
    {
      step: '03',
      title: 'Plan the next action',
      icon: CalendarCheck,
      description:
        'Confirm booking slots, assign the job to the right crew member, and send your approved response with clear expectations and zero double bookings.',
      highlights: [
        'Visual calendar with duration buffers',
        'Team member assignment and status',
        'Approved response delivered to client',
      ],
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#090D21] border-y border-white/10 scroll-mt-20 relative overflow-hidden" id="how-it-works">
      {/* Background ambient light */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none -z-0"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-950/60 border border-violet-500/40 text-violet-300 text-xs font-semibold shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <span>Simple 3-Step Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How It Works
          </h2>
          <p className="text-base text-slate-300 leading-relaxed font-normal">
            Eliminate chaotic inboxes and lost sticky notes. Move seamlessly from incoming inquiry to
            confirmed booking in three clear steps.
          </p>
        </div>

        {/* Steps Flow Container */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div
            className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-violet-500/30 -translate-y-8 z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-gradient-to-b from-[#121838]/90 to-[#0C1027]/90 rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-violet-500/40 transition-all flex flex-col justify-between shadow-xl hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] group backdrop-blur-xl"
                >
                  <div className="space-y-4">
                    {/* Step badge & Icon */}
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform border border-violet-400/30">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono font-extrabold text-2xl text-violet-400/40 group-hover:text-violet-400/80 transition-colors">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white pt-1">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                    {item.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flow Summary Note */}
        <div className="text-center">
          <span className="inline-flex items-center space-x-2 text-xs font-medium text-slate-300 bg-[#0C1026] px-4 py-2 rounded-full border border-white/10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Designed for solo operators, field crews, and office coordinators alike.</span>
          </span>
        </div>
      </div>
    </section>
  );
}
