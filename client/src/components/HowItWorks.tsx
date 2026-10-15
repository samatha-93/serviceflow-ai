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
    <section className="py-16 sm:py-24 bg-surface-card border-y border-surface-muted" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-teal-50 border border-brand-teal-100 text-brand-teal text-xs font-semibold">
            <span>Simple 3-Step Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-content-primary">
            How It Works
          </h2>
          <p className="text-base text-content-secondary leading-relaxed">
            Eliminate chaotic inboxes and lost sticky notes. Move seamlessly from incoming inquiry to
            confirmed booking in three clear steps.
          </p>
        </div>

        {/* Steps Flow Container */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div
            className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-brand-teal/20 -translate-y-8 z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface-bg/70 rounded-2xl p-6 sm:p-7 border border-surface-muted hover:border-brand-teal/40 transition-all flex flex-col justify-between shadow-soft hover:shadow-card group"
                >
                  <div className="space-y-4">
                    {/* Step badge & Icon */}
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-xl bg-brand-teal text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-mono font-extrabold text-2xl text-brand-teal/30 group-hover:text-brand-teal/60 transition-colors">
                        {item.step}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-content-primary pt-1">
                      {item.title}
                    </h3>

                    <p className="text-sm text-content-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Bullet Highlights */}
                  <div className="mt-6 pt-4 border-t border-surface-muted space-y-2">
                    {item.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start space-x-2 text-xs text-content-secondary">
                        <Check className="w-3.5 h-3.5 text-brand-teal flex-shrink-0 mt-0.5" />
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
          <span className="inline-flex items-center space-x-2 text-xs font-medium text-content-secondary bg-surface-bg px-4 py-2 rounded-full border border-surface-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Designed for solo operators, field crews, and office coordinators alike.</span>
          </span>
        </div>
      </div>
    </section>
  );
}
