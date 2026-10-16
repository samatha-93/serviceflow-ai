import { Inbox, Clock, Send, CheckCircle2 } from 'lucide-react';
import { CustomerEnquiry } from '../../types';

interface EnquiryMetricsProps {
  enquiries: CustomerEnquiry[];
}

export function EnquiryMetrics({ enquiries }: EnquiryMetricsProps) {
  const total = enquiries.length;
  const awaitingReview = enquiries.filter(
    (e) => e.status === 'Awaiting Review' || e.status === 'High Priority'
  ).length;
  const quoted = enquiries.filter((e) => e.status === 'Quoted').length;
  const booked = enquiries.filter((e) => e.status === 'Booked').length;

  const cards = [
    {
      label: 'Total Enquiries',
      value: total,
      subtext: 'All registered requests',
      icon: Inbox,
      accentColor: 'text-brand-teal',
      badgeBg: 'bg-brand-teal-50 border-brand-teal-100',
    },
    {
      label: 'Awaiting Review',
      value: awaitingReview,
      subtext: 'Needs triage or response',
      icon: Clock,
      accentColor: 'text-amber-600',
      badgeBg: 'bg-amber-50 border-amber-200',
    },
    {
      label: 'Quotes Sent',
      value: quoted,
      subtext: 'Awaiting client sign-off',
      icon: Send,
      accentColor: 'text-blue-600',
      badgeBg: 'bg-blue-50 border-blue-200',
    },
    {
      label: 'Confirmed Bookings',
      value: booked,
      subtext: 'Added to service schedule',
      icon: CheckCircle2,
      accentColor: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 border-emerald-200',
    },
  ];

  return (
    <section aria-label="Enquiry summary metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="p-5 rounded-2xl bg-surface-card border border-surface-muted shadow-soft flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-content-secondary">
                {card.label}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-content-primary">
                {card.value}
              </div>
              <p className="text-xs text-content-muted">
                {card.subtext}
              </p>
            </div>
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${card.badgeBg} ${card.accentColor}`}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>
          </div>
        );
      })}
    </section>
  );
}
