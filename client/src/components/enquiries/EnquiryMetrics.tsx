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
      subtext: 'All active leads',
      icon: Inbox,
      iconColor: 'text-brand-teal',
      iconBg: 'bg-brand-teal-50 border-brand-teal-100/80',
    },
    {
      label: 'Awaiting Review',
      value: awaitingReview,
      subtext: 'Needs response',
      icon: Clock,
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-50 border-amber-200/80',
    },
    {
      label: 'Quotes Sent',
      value: quoted,
      subtext: 'Pending sign-off',
      icon: Send,
      iconColor: 'text-blue-700',
      iconBg: 'bg-blue-50 border-blue-200/80',
    },
    {
      label: 'Confirmed Bookings',
      value: booked,
      subtext: 'Added to schedule',
      icon: CheckCircle2,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-50 border-emerald-200/80',
    },
  ];

  return (
    <section aria-label="Enquiry summary metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="p-3.5 sm:p-4 rounded-xl bg-dark-card border border-white/10 shadow-card hover:border-brand-teal/30 transition-all flex items-start justify-between gap-3"
          >
            <div className="space-y-0.5 min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-content-secondary truncate block">
                {card.label}
              </span>
              <div className="text-2xl font-bold tracking-tight text-content-primary">
                {card.value}
              </div>
              <p className="text-xs text-content-secondary truncate">
                {card.subtext}
              </p>
            </div>
            <div
              className={`h-9 w-9 rounded-lg flex items-center justify-center border flex-shrink-0 ${card.iconBg} ${card.iconColor}`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
        );
      })}
    </section>
  );
}
