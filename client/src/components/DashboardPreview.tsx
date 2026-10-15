import { useState } from 'react';
import {
  Inbox,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Send,
  Edit3,
  Filter,
} from 'lucide-react';
import { CustomerEnquiry, UpcomingBooking } from '../types';

const INITIAL_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: 'ENQ-1042',
    customerName: 'Sarah Jenkins',
    serviceCategory: 'Outdoor & Property',
    serviceTitle: 'Lawn Mowing & Boundary Hedge Trimming',
    location: 'Westfield Crescent, Oakridge',
    receivedTime: '24m ago',
    status: 'Awaiting Review',
    urgency: 'Standard',
    message:
      'Looking for regular bi-weekly garden maintenance. Front lawn plus trimming overgrown laurel hedges along boundary fence.',
    suggestedReply:
      'Hi Sarah, thanks for contacting GreenThumb! We would be happy to take on your bi-weekly lawn and hedge maintenance. Based on typical garden sizes on Westfield Crescent, our rate is £65 per visit including green waste disposal. Would Tuesday at 09:30 AM suit you for an initial visit?',
  },
  {
    id: 'ENQ-1041',
    customerName: 'Marcus Vance',
    serviceCategory: 'Cleaning Services',
    serviceTitle: 'Commercial Studio Deep Clean (3,200 sq ft)',
    location: 'Harbour Way, Suite 4B',
    receivedTime: '1h ago',
    status: 'Awaiting Review',
    urgency: 'Standard',
    message:
      'Need an end-of-quarter deep clean for our design studio before new team members join next Monday.',
    suggestedReply:
      'Hello Marcus, we can schedule our commercial crew for Sunday evening to ensure your studio is pristine before Monday morning. Our commercial deep clean checklist includes floor buffing, desk sanitization, and restroom sterilization.',
  },
  {
    id: 'ENQ-1040',
    customerName: 'Elena Rostova',
    serviceCategory: 'Home Maintenance',
    serviceTitle: 'Water Pressure Loss & Valve Inspection',
    location: 'Pine Hill Road, Unit 12',
    receivedTime: '2h ago',
    status: 'High Priority',
    urgency: 'Urgent',
    message:
      'Sudden pressure drop in upstairs shower and knocking sounds in heating supply lines.',
    suggestedReply:
      'Hi Elena, sudden pressure drop with knocking sounds suggests a faulty pressure-reducing valve or airlock. We have technician Dan available today at 4:30 PM for an immediate diagnostics visit.',
  },
];

const UPCOMING_BOOKINGS: UpcomingBooking[] = [
  {
    id: 'BK-8901',
    time: '09:30 AM',
    customerName: 'Oakridge Estate',
    serviceType: 'Lawn Care & Edging',
    location: '14 Meadow Lane',
    duration: '2.0 hrs',
    status: 'Confirmed',
    assignee: 'Alex M.',
  },
  {
    id: 'BK-8902',
    time: '01:15 PM',
    customerName: 'Clara Oswald',
    serviceType: 'Residential Deep Clean',
    location: '72 Hilltop Rise',
    duration: '2.5 hrs',
    status: 'Confirmed',
    assignee: 'Sarah T.',
  },
  {
    id: 'BK-8903',
    time: '04:30 PM',
    customerName: 'Elena Rostova',
    serviceType: 'Valve Diagnostics',
    location: 'Pine Hill Road',
    duration: '1.5 hrs',
    status: 'Scheduled',
    assignee: 'Dan K.',
  },
];

export function DashboardPreview() {
  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry>(INITIAL_ENQUIRIES[0]);
  const [approvedEnquiries, setApprovedEnquiries] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'enquiries' | 'schedule'>('enquiries');

  const isApproved = approvedEnquiries[selectedEnquiry.id] || false;

  const handleApprove = () => {
    setApprovedEnquiries((prev) => ({
      ...prev,
      [selectedEnquiry.id]: true,
    }));
  };

  return (
    <div className="w-full rounded-2xl bg-surface-card border border-surface-muted shadow-card overflow-hidden text-content-primary">
      {/* Top Application Bar */}
      <div className="bg-surface-bg/80 border-b border-surface-muted px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="text-content-muted font-mono pl-1">serviceflow.app/workspace</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-brand-teal-50 text-brand-teal font-semibold text-[11px] border border-brand-teal-100">
            Interactive Product Preview
          </span>
          <div className="flex items-center space-x-1.5 pl-2 border-l border-surface-muted">
            <div className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center text-[10px] font-bold">
              AM
            </div>
            <span className="font-medium text-content-secondary hidden sm:inline">Alex (Operator)</span>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-3 divide-x divide-surface-muted border-b border-surface-muted bg-surface-card text-left">
        <div className="p-3 sm:p-4">
          <div className="flex items-center space-x-1.5 text-xs text-content-secondary mb-1">
            <Inbox className="w-3.5 h-3.5 text-brand-teal" />
            <span className="font-medium truncate">Enquiries to Review</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-extrabold text-content-primary">3</span>
            <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded hidden sm:inline">
              Action required
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex items-center space-x-1.5 text-xs text-content-secondary mb-1">
            <Calendar className="w-3.5 h-3.5 text-brand-teal" />
            <span className="font-medium truncate">Upcoming Bookings</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-extrabold text-content-primary">4</span>
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded hidden sm:inline">
              Today
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex items-center space-x-1.5 text-xs text-content-secondary mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
            <span className="font-medium truncate">AI Suggestions</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-extrabold text-brand-teal">
              {Object.keys(approvedEnquiries).length > 0 ? 3 - Object.keys(approvedEnquiries).length : 2}
            </span>
            <span className="text-[11px] font-medium text-brand-teal bg-brand-teal-50 px-1.5 py-0.5 rounded hidden sm:inline border border-brand-teal-100">
              Needs sign-off
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs (Mobile & Quick-nav) */}
      <div className="flex border-b border-surface-muted bg-surface-bg/40 px-3 pt-2 text-xs">
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`flex items-center space-x-1.5 px-3 py-2 font-medium border-b-2 transition-all ${
            activeTab === 'enquiries'
              ? 'border-brand-teal text-brand-teal font-semibold bg-surface-card rounded-t-lg'
              : 'border-transparent text-content-secondary hover:text-content-primary'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Enquiries & AI Drafts</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center space-x-1.5 px-3 py-2 font-medium border-b-2 transition-all ${
            activeTab === 'schedule'
              ? 'border-brand-teal text-brand-teal font-semibold bg-surface-card rounded-t-lg'
              : 'border-transparent text-content-secondary hover:text-content-primary'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Today's Bookings ({UPCOMING_BOOKINGS.length})</span>
        </button>
      </div>

      {/* Main Workspace Body */}
      {activeTab === 'enquiries' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
          {/* Enquiry List (Left Panel) */}
          <div className="lg:col-span-5 border-r border-surface-muted p-3 space-y-2.5 bg-surface-bg/30">
            <div className="flex items-center justify-between px-1 text-xs text-content-secondary pb-1">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Incoming Pipeline ({INITIAL_ENQUIRIES.length})
              </span>
              <div className="flex items-center space-x-1 text-content-muted">
                <Filter className="w-3 h-3" />
                <span>Urgency</span>
              </div>
            </div>

            <div className="space-y-2">
              {INITIAL_ENQUIRIES.map((enq) => {
                const selected = selectedEnquiry.id === enq.id;
                const enqApproved = approvedEnquiries[enq.id];

                return (
                  <button
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                      selected
                        ? 'bg-surface-card border-brand-teal shadow-soft ring-1 ring-brand-teal/20'
                        : 'bg-surface-card/70 border-surface-muted hover:border-brand-teal/40 hover:bg-surface-card'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-semibold text-content-primary truncate">
                        {enq.customerName}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          enqApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : enq.status === 'High Priority'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {enqApproved ? 'Approved' : enq.status}
                      </span>
                    </div>

                    <p className="font-medium text-content-secondary line-clamp-1 mb-1.5 text-[11px]">
                      {enq.serviceTitle}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-content-muted pt-1 border-t border-surface-muted/50">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-2.5 h-2.5 text-brand-teal" />
                        <span className="truncate max-w-[130px]">{enq.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{enq.receivedTime}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Reply & Detail Panel (Right Panel) */}
          <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-surface-card">
            <div className="space-y-4">
              {/* Customer Enquiry Summary Header */}
              <div className="pb-3 border-b border-surface-muted">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-content-muted">{selectedEnquiry.id}</span>
                  <span className="text-[11px] font-medium text-brand-teal bg-brand-teal-50 px-2 py-0.5 rounded-md border border-brand-teal-100">
                    {selectedEnquiry.serviceCategory}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-content-primary">
                  {selectedEnquiry.serviceTitle}
                </h4>
                <div className="mt-2 text-xs text-content-secondary bg-surface-bg p-2.5 rounded-lg border border-surface-muted/60">
                  <span className="font-semibold text-content-primary block mb-0.5">
                    Customer Message:
                  </span>
                  "{selectedEnquiry.message}"
                </div>
              </div>

              {/* AI Draft Suggestion Box */}
              <div className="rounded-xl border border-brand-teal/30 bg-brand-teal-50/40 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-md bg-brand-teal text-white flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-content-primary">
                        AI Reply Draft
                      </span>
                      <span className="text-[10px] text-content-secondary block">
                        Prepared from message details & service catalog
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-medium text-brand-teal bg-white px-2 py-0.5 rounded border border-brand-teal-100 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-brand-teal" />
                    <span>Requires Human Sign-off</span>
                  </span>
                </div>

                <div className="bg-white rounded-lg p-3 border border-surface-muted text-xs leading-relaxed text-content-primary shadow-xs">
                  {selectedEnquiry.suggestedReply}
                </div>

                <div className="flex items-center justify-between text-[11px] text-content-secondary pt-1">
                  <span className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Tone: Professional & Warm</span>
                  </span>
                  <span className="text-content-muted">Draft generated in 180ms</span>
                </div>
              </div>
            </div>

            {/* Human Decision / Approval Controls */}
            <div className="pt-4 border-t border-surface-muted flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-surface-muted text-content-secondary hover:text-brand-teal hover:border-brand-teal text-xs font-medium transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Draft</span>
              </button>

              <button
                type="button"
                onClick={handleApprove}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-soft transition-all ${
                  isApproved
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-brand-teal hover:bg-brand-teal-light text-white hover:shadow-card'
                }`}
              >
                {isApproved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approved by Alex (Ready to Send)</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Approve & Send Response</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Schedule View */
        <div className="p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-content-secondary pb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Today's Field Schedule
            </span>
            <span className="text-content-muted">All team members confirmed</span>
          </div>

          <div className="space-y-2.5">
            {UPCOMING_BOOKINGS.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-surface-muted bg-surface-card hover:border-brand-teal/30 transition-all text-xs gap-2"
              >
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="px-2.5 py-1 rounded-md bg-surface-bg border border-surface-muted font-mono font-bold text-brand-teal text-[11px]">
                    {booking.time}
                  </div>
                  <div>
                    <h5 className="font-bold text-content-primary">{booking.customerName}</h5>
                    <p className="text-content-secondary text-[11px]">{booking.serviceType}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-[11px] text-content-secondary">
                  <span className="flex items-center space-x-1 text-content-muted">
                    <MapPin className="w-3 h-3 text-brand-teal" />
                    <span>{booking.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{booking.duration}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[10px]">
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-content-muted">
              Schedule updates sync automatically across customer records and internal calendar.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
