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
  UserCheck,
} from 'lucide-react';
import { CustomerEnquiry, UpcomingBooking } from '../types';

const INITIAL_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: 'ENQ-1042',
    customerName: 'Emma Vance',
    serviceCategory: 'Home Maintenance',
    serviceTitle: 'Electrical Panel & Safety Inspection',
    location: '42 Elmwood Terrace',
    receivedTime: '24m ago',
    status: 'Awaiting Review',
    urgency: 'Standard',
    message:
      'Need a certified safety audit of our main electrical distribution board and surge protection before home office renovation starts.',
    suggestedReply:
      'Hi Emma, thanks for reaching out to BrightPath Home Services! We can conduct a full electrical distribution audit and surge inspection. Our standard diagnostic visit is $120 including a comprehensive safety certificate. Would Tuesday at 09:30 AM suit you for an initial assessment?',
  },
  {
    id: 'ENQ-1041',
    customerName: 'David Chen',
    serviceCategory: 'Cleaning Services',
    serviceTitle: 'Commercial Studio Deep Clean (2,400 sq ft)',
    location: 'Harbour Way, Suite 4B',
    receivedTime: '1h ago',
    status: 'Awaiting Review',
    urgency: 'Standard',
    message:
      'Looking for an end-of-quarter deep clean for our design studio before our new cohort joins next Monday.',
    suggestedReply:
      'Hello David, ClearSpace Cleaning provides evening commercial maintenance. We can dispatch our commercial crew this Sunday at 5:00 PM to ensure your studio is pristine before Monday morning. Our team handles desk sanitization, floor buffing, and restroom sterilization.',
  },
  {
    id: 'ENQ-1040',
    customerName: 'Sophia Martinez',
    serviceCategory: 'Independent Professionals',
    serviceTitle: 'Workplace Ergonomics & Acoustic Audit',
    location: 'Riverside Innovation Hub, Suite 12',
    receivedTime: '2h ago',
    status: 'High Priority',
    urgency: 'Urgent',
    message:
      'Rapid acoustic and sound transmission inspection needed between conference suites and private pods ahead of compliance review.',
    suggestedReply:
      'Hi Sophia, our acoustic consultant Dan K. has availability today at 4:30 PM with calibrated decibel loggers. Formal compliance report will be delivered within 24 hours. Would you like us to reserve this slot?',
  },
];

const UPCOMING_BOOKINGS: UpcomingBooking[] = [
  {
    id: 'BK-8901',
    time: '09:30 AM',
    customerName: 'Apex Commercial Plaza',
    serviceType: 'HVAC Ventilation & Filter Service',
    location: '100 Elmwood Blvd, Suite 4',
    duration: '2.0 hrs',
    status: 'Confirmed',
    assignee: 'Alex M.',
  },
  {
    id: 'BK-8902',
    time: '01:15 PM',
    customerName: 'Clara Oswald',
    serviceType: 'Residential Turnover Deep Clean',
    location: '72 Hilltop Rise',
    duration: '2.5 hrs',
    status: 'Confirmed',
    assignee: 'Sarah T.',
  },
  {
    id: 'BK-8903',
    time: '04:30 PM',
    customerName: 'Sophia Martinez',
    serviceType: 'Acoustic Compliance Audit',
    location: 'Riverside Innovation Hub',
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

  const pendingAiCount = INITIAL_ENQUIRIES.length - Object.keys(approvedEnquiries).length;

  return (
    <div className="w-full rounded-2xl bg-white border border-[#E5E5DE] shadow-card overflow-hidden text-content-primary">
      {/* Top Application Header / Browser Chrome */}
      <div className="bg-[#F7F7F2] border-b border-[#E5E5DE] px-4 py-2.5 flex items-center justify-between text-xs select-none">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E57373]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFB74D]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#81C784]" />
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white border border-[#E5E5DE] text-[11px] font-mono text-content-secondary shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>serviceflow.app/workspace</span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <span className="px-2 py-0.5 rounded-full bg-brand-teal-50 text-brand-teal font-medium text-[11px] border border-brand-teal-100">
            Live Interactive Preview
          </span>
          <div className="flex items-center space-x-1.5 pl-2 border-l border-[#E5E5DE] text-content-secondary">
            <div className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center text-[10px] font-bold">
              AM
            </div>
            <span className="font-medium text-xs hidden md:inline">Alex M.</span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Summary Strip */}
      <div className="grid grid-cols-3 divide-x divide-[#E5E5DE] border-b border-[#E5E5DE] bg-white text-left">
        <div className="p-3 sm:p-4">
          <div className="flex items-center space-x-1.5 text-xs text-content-secondary mb-1">
            <Inbox className="w-3.5 h-3.5 text-brand-teal" />
            <span className="font-medium">Enquiries to Review</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-bold text-content-primary">3</span>
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded hidden sm:inline">
              Action required
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex items-center space-x-1.5 text-xs text-content-secondary mb-1">
            <Calendar className="w-3.5 h-3.5 text-brand-teal" />
            <span className="font-medium">Today's Bookings</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-bold text-content-primary">3</span>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded hidden sm:inline">
              Confirmed
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4">
          <div className="flex items-center space-x-1.5 text-xs text-content-secondary mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
            <span className="font-medium">AI Suggestions</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl sm:text-2xl font-bold text-brand-teal">
              {pendingAiCount}
            </span>
            <span className="text-[11px] font-medium text-brand-teal bg-brand-teal-50 border border-brand-teal-100 px-1.5 py-0.5 rounded hidden sm:inline">
              Ready for sign-off
            </span>
          </div>
        </div>
      </div>

      {/* Segmented View Switcher */}
      <div className="flex items-center justify-between border-b border-[#E5E5DE] bg-[#F7F7F2]/60 px-3.5 pt-2 text-xs">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center space-x-1.5 px-3 py-2 font-medium border-b-2 transition-all ${
              activeTab === 'enquiries'
                ? 'border-brand-teal text-brand-teal font-semibold bg-white rounded-t-lg -mb-px'
                : 'border-transparent text-content-secondary hover:text-content-primary'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Enquiries & AI Drafts</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center space-x-1.5 px-3 py-2 font-medium border-b-2 transition-all ${
              activeTab === 'schedule'
                ? 'border-brand-teal text-brand-teal font-semibold bg-white rounded-t-lg -mb-px'
                : 'border-transparent text-content-secondary hover:text-content-primary'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Today's Schedule ({UPCOMING_BOOKINGS.length})</span>
          </button>
        </div>

        <span className="text-[11px] text-content-secondary hidden md:inline">
          Click any enquiry to inspect draft
        </span>
      </div>

      {/* Main Workspace Body */}
      {activeTab === 'enquiries' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
          {/* Enquiry List (Left Column) */}
          <div className="md:col-span-5 border-r border-[#E5E5DE] p-3 space-y-2 bg-[#F7F7F2]/40">
            <div className="flex items-center justify-between px-1 text-xs text-content-secondary pb-1">
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Incoming Pipeline ({INITIAL_ENQUIRIES.length})
              </span>
              <div className="flex items-center space-x-1 text-content-secondary text-[11px]">
                <Filter className="w-3 h-3 text-brand-teal" />
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
                    type="button"
                    onClick={() => setSelectedEnquiry(enq)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs ${
                      selected
                        ? 'bg-white border-brand-teal shadow-soft ring-1 ring-brand-teal/20'
                        : 'bg-white/80 border-[#E5E5DE] hover:border-brand-teal/40 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5 mb-1">
                      <span className="font-semibold text-content-primary text-xs truncate">
                        {enq.customerName}
                      </span>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
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

                    <p className="font-medium text-content-secondary truncate mb-1.5 text-xs">
                      {enq.serviceTitle}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-content-secondary pt-1.5 border-t border-[#E5E5DE]/60">
                      <span className="flex items-center space-x-1 truncate max-w-[140px]">
                        <MapPin className="w-3 h-3 text-brand-teal flex-shrink-0" />
                        <span className="truncate">{enq.location}</span>
                      </span>
                      <span className="flex items-center space-x-1 flex-shrink-0">
                        <Clock className="w-3 h-3 text-content-secondary" />
                        <span>{enq.receivedTime}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Reply & Detail Panel (Right Column) */}
          <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between bg-white">
            <div className="space-y-4">
              {/* Customer Enquiry Summary Header */}
              <div className="pb-3 border-b border-[#E5E5DE]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-medium text-content-secondary bg-[#F7F7F2] px-2 py-0.5 rounded border border-[#E5E5DE]">
                      {selectedEnquiry.id}
                    </span>
                    <span className="text-xs font-semibold text-content-primary">
                      {selectedEnquiry.customerName}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-brand-teal bg-brand-teal-50 px-2.5 py-0.5 rounded-full border border-brand-teal-100">
                    {selectedEnquiry.serviceCategory}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-content-primary">
                  {selectedEnquiry.serviceTitle}
                </h4>

                <div className="mt-2 text-xs text-content-secondary bg-[#F7F7F2] p-3 rounded-xl border border-[#E5E5DE] leading-relaxed">
                  <span className="font-semibold text-content-primary block mb-0.5 text-[11px] uppercase tracking-wider">
                    Customer Request
                  </span>
                  "{selectedEnquiry.message}"
                </div>
              </div>

              {/* AI Draft Suggestion Box */}
              <div className="rounded-xl border border-brand-teal/30 bg-brand-teal-50/30 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-lg bg-brand-teal text-white flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-content-primary">
                        AI Reply Draft
                      </span>
                      <span className="text-[11px] text-content-secondary block">
                        Formulated from service catalog & request details
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-brand-teal bg-white px-2 py-0.5 rounded border border-brand-teal-100 flex items-center space-x-1 shadow-2xs">
                    <ShieldCheck className="w-3 h-3 text-brand-teal" />
                    <span>Human Review Required</span>
                  </span>
                </div>

                <div className="bg-white rounded-lg p-3 border border-[#E5E5DE] text-xs leading-relaxed text-content-primary shadow-2xs">
                  {selectedEnquiry.suggestedReply}
                </div>

                <div className="flex items-center justify-between text-[11px] text-content-secondary pt-0.5">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Tone: Professional & Warm</span>
                  </span>
                  <span className="text-content-secondary">
                    Operator approval required before send
                  </span>
                </div>
              </div>
            </div>

            {/* Human Decision / Approval Controls */}
            <div className="pt-4 border-t border-[#E5E5DE] flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-[#E5E5DE] text-content-secondary hover:text-brand-teal hover:border-brand-teal text-xs font-medium transition-colors bg-white shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-teal" />
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
                    <span>Approved by Operator (Ready to Dispatch)</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Approve & Send Reply</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Schedule View */
        <div className="p-4 sm:p-5 space-y-3 bg-white">
          <div className="flex items-center justify-between text-xs text-content-secondary pb-1 border-b border-[#E5E5DE]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Today's Field Schedule ({UPCOMING_BOOKINGS.length} Jobs)
            </span>
            <span className="text-content-secondary">All team members confirmed</span>
          </div>

          <div className="space-y-2.5">
            {UPCOMING_BOOKINGS.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-[#E5E5DE] bg-white hover:border-brand-teal/40 transition-all text-xs gap-2.5 shadow-2xs"
              >
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="px-2.5 py-1.5 rounded-md bg-[#F7F7F2] border border-[#E5E5DE] font-mono font-bold text-brand-teal text-xs">
                    {booking.time}
                  </div>
                  <div>
                    <h5 className="font-bold text-content-primary text-xs">{booking.customerName}</h5>
                    <p className="text-content-secondary text-xs">{booking.serviceType}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-content-secondary">
                  <span className="flex items-center space-x-1">
                    <UserCheck className="w-3.5 h-3.5 text-brand-teal" />
                    <span>{booking.assignee}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-brand-teal" />
                    <span>{booking.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-content-secondary" />
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
            <span className="text-xs text-content-secondary">
              Schedule updates sync automatically with customer records and internal team calendars.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
