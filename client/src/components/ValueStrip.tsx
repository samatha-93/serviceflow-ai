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
    <section className="py-12 border-y border-surface-muted bg-surface-card" aria-label="Core Value Propositions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start space-x-4 p-4 rounded-xl bg-surface-bg/50 border border-surface-muted/60 hover:border-brand-teal/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-brand-teal-50 text-brand-teal flex-shrink-0 flex items-center justify-center border border-brand-teal-100 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-content-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm text-content-secondary leading-relaxed">
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
