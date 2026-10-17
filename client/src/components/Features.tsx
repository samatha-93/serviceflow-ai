import {
  Inbox,
  Calendar,
  Users,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function Features() {

  const features = [
    {
      id: 'enquiry-mgmt',
      icon: Inbox,
      title: 'Enquiry Management',
      subtitle: 'Never lose a potential job in a messy inbox',
      description:
        'Capture and triage incoming customer requests in one clean, unified pipeline. Track each inquiry from initial contact through quote formulation and booking confirmation, with clear urgency flags and service tags.',
      points: [
        'Structured pipeline: New, Contacted, Quoted, Booked',
        'Automatic extraction of service type and job location',
        'Urgency indicators to prioritise emergency calls',
      ],
      previewContent: {
        badge: 'Enquiry Triage',
        title: 'Electrical Panel & Safety Inspection',
        client: 'Emma Vance',
        urgency: 'Standard',
        status: 'Awaiting Review',
        time: '12m ago',
        notes: 'Requested panel audit and surge protection review before home office setup.',
      },
    },
    {
      id: 'booking-org',
      icon: Calendar,
      title: 'Booking Organisation',
      subtitle: 'Realistic schedules with zero double bookings',
      description:
        'Organise daily and weekly job appointments on a visual schedule designed specifically for service businesses. Configure service durations, allow buffer times between job sites, and assign jobs to specific team members.',
      points: [
        'Configurable service duration & travel buffers',
        'Team member assignment and status visibility',
        'Clean day and week views for clear dispatching',
      ],
      previewContent: {
        badge: 'Schedule Slot',
        title: 'Commercial Deep Clean (Suite 4B)',
        client: 'Harbour Design Co.',
        urgency: 'Scheduled',
        status: '09:00 - 11:30 AM',
        time: 'Confirmed',
        notes: 'Assigned to Crew A (Dan & Maya). Cleaning equipment loaded.',
      },
    },
    {
      id: 'customer-info',
      icon: Users,
      title: 'Customer Information',
      subtitle: 'Complete client history right at your fingertips',
      description:
        'Centralise customer profiles, property addresses, past service records, and internal notes. Look up gate codes, pet alerts, and previous quote history before arriving on site.',
      points: [
        'Dedicated customer profiles and service addresses',
        'Historical log of past appointments and quotes',
        'Internal technician notes and site access details',
      ],
      previewContent: {
        badge: 'Customer Profile',
        title: 'David Chen (Boutique Property)',
        client: 'david.chen@example.com',
        urgency: 'VIP Client',
        status: 'Active Customer',
        time: '4 Past Jobs',
        notes: 'Side gate unlocked. Please be mindful of golden retriever in back.',
      },
    },
    {
      id: 'ai-assistance',
      icon: Sparkles,
      title: 'AI Summaries & Reply Drafts',
      subtitle: 'Human-in-the-loop assistance that keeps you in control',
      description:
        'AI analyzes incoming messages to draft concise summaries and polite, customized customer replies. Every suggestion remains in draft form until you personally inspect, edit, and approve it—ensuring total quality and trust.',
      points: [
        'Contextual response drafts from your service catalog',
        'One-click approval or inline text editing',
        'Strict human sign-off: no unvetted automated replies',
      ],
      previewContent: {
        badge: 'AI Draft • Needs Approval',
        title: 'Proposed Reply Draft',
        client: 'Emma Vance',
        urgency: 'Draft Ready',
        status: 'Pending Sign-off',
        time: 'Sample draft preview',
        notes:
          '"Hi Emma, thanks for reaching out to BrightPath Home Services! We can conduct a full panel safety inspection this Thursday morning at $120..."',
      },
    },
  ];

  return (
    <section className="py-16 sm:py-24 scroll-mt-20 relative" id="features">
      {/* Subtle ambient glow in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-violet-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Essential Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Built for the Realities of Running a Service Business
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            ServiceFlow AI provides practical, purpose-built tools that replace administrative
            clutter with operational clarity.
          </p>
        </div>

        {/* Feature Grid / Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const isAi = feat.id === 'ai-assistance';

            return (
              <div
                key={feat.id}
                className={`rounded-2xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between ${
                  isAi
                    ? 'bg-gradient-to-b from-[#141A3D]/90 to-[#0A0D20]/95 border-violet-500/40 shadow-glow'
                    : 'bg-gradient-to-b from-[#0F142F]/80 to-[#0A0D20]/90 border-white/10 hover:border-violet-500/40 hover:shadow-soft'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-violet-600/20 text-violet-300 flex items-center justify-center border border-violet-500/30 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    {isAi ? (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 text-xs font-bold shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Human-in-the-Loop</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-medium text-slate-400">
                        Module 0{idx + 1}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{feat.title}</h3>
                    <p className="text-xs font-medium text-violet-400 mt-0.5">{feat.subtitle}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>

                  {/* Bullet Highlights */}
                  <div className="space-y-2 pt-2">
                    {feat.points.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-center space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Illustrative Micro Preview */}
                <div className="mt-6 pt-4 border-t border-white/10 bg-[#070914]/80 rounded-xl p-4 border border-white/10 text-xs space-y-2.5">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-semibold text-slate-200">{feat.previewContent.badge}</span>
                    <span className="text-slate-400">{feat.previewContent.time}</span>
                  </div>
                  <div className="font-bold text-white text-xs">
                    {feat.previewContent.title}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{feat.previewContent.client}</span>
                    <span className="px-2 py-0.5 rounded bg-violet-600/20 border border-violet-500/30 font-medium text-violet-300">
                      {feat.previewContent.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 italic bg-[#0D1126] p-2.5 rounded-lg border border-white/10 leading-relaxed">
                    {feat.previewContent.notes}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Transparency Guardrail Callout */}
        <div className="bg-gradient-to-r from-[#121838] via-[#0E132D] to-[#0A0D20] border border-violet-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
          <div className="flex items-start space-x-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex-shrink-0 flex items-center justify-center shadow-md shadow-violet-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">
                Principled AI: Assisted, Not Autonomous
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                ServiceFlow AI is designed so that you remain the decision-maker. AI models formulate
                helpful drafts and summarize complex job requests, but no external customer email,
                quote, or booking confirmation is dispatched without your deliberate sign-off.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0">
            <span className="inline-flex items-center space-x-2 text-xs font-semibold px-3.5 py-2 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-violet-400" />
              <span>Full Operator Control</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
