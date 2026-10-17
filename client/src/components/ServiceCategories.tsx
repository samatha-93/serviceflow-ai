import { TreePine, Sparkles, HeartHandshake, Wrench, Briefcase, CheckCircle2 } from 'lucide-react';

export function ServiceCategories() {
  const categories = [
    {
      id: 'outdoor',
      name: 'Property & Exterior Maintenance',
      description:
        'Exterior surface washing, gutter clearance, architectural cleaning, and seasonal property care.',
      icon: TreePine,
      badge: 'Field Ops',
      examples: ['Surface pressure washing', 'Gutter & drainage inspection', 'Seasonal property check'],
    },
    {
      id: 'cleaning',
      name: 'Cleaning Services',
      description:
        'Residential home cleaning, commercial offices, post-construction cleanups, and rental turnovers.',
      icon: Sparkles,
      badge: 'Recurring',
      examples: ['Weekly & bi-weekly visits', 'End of tenancy deep clean', 'Custom checklist tracking'],
    },
    {
      id: 'beauty',
      name: 'Beauty & Wellness',
      description:
        'Mobile hair stylists, massage therapists, estheticians, and private wellness practitioners.',
      icon: HeartHandshake,
      badge: 'Appointments',
      examples: ['Client booking buffers', 'Intake notes & preferences', 'Session coordination'],
    },
    {
      id: 'maintenance',
      name: 'Home Maintenance',
      description:
        'Plumbing diagnostics, electrical repairs, HVAC servicing, handyman tasks, and appliance care.',
      icon: Wrench,
      badge: 'On-Demand',
      examples: ['Urgent enquiry triage', 'Job hazard & site notes', 'Dispatch coordination'],
    },
    {
      id: 'professionals',
      name: 'Independent Professionals',
      description:
        'Business consultants, mobile notaries, property inspectors, and specialized freelance experts.',
      icon: Briefcase,
      badge: 'Solo & Boutique',
      examples: ['Consultation calendar', 'Client document records', 'Direct message triage'],
    },
  ];

  return (
    <section className="py-16 sm:py-24 scroll-mt-20 relative" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Tailored Workflows</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Designed for Service-Based Businesses
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Every trade has unique operational rhythms. ServiceFlow AI adapts intake questions,
            scheduling rules, and customer communications to fit your specific service model.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="group relative bg-gradient-to-b from-[#101533]/80 to-[#0A0D20]/90 rounded-2xl p-6 sm:p-7 border border-white/10 hover:border-violet-500/40 hover:shadow-soft transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="h-11 w-11 rounded-xl bg-violet-600/20 text-violet-300 group-hover:bg-gradient-to-tr group-hover:from-violet-600 group-hover:to-indigo-500 group-hover:text-white transition-colors duration-200 flex items-center justify-center border border-violet-500/30 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#070914] text-slate-300 border border-white/10 group-hover:border-violet-500/30 transition-colors">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors duration-200">
                    {cat.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 space-y-1.5">
                  {cat.examples.map((ex, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* 6th Card: Universal Flexibility */}
          <div className="bg-gradient-to-br from-[#1E1B4B] via-[#161B3B] to-[#0A0D20] text-white rounded-2xl p-6 sm:p-7 border border-violet-500/40 shadow-glow flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 inline-block">
                Configurable Core
              </span>
              <h3 className="text-lg sm:text-xl font-bold leading-snug text-white">
                Customise for your exact operating model
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Whether you charge by the hour, quote per square foot, or schedule multi-day projects,
                ServiceFlow AI is structured to match how you quote, schedule, and communicate.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium">Flexible fields & appointment rules</span>
              <span className="px-2 py-0.5 rounded bg-violet-500/20 border border-violet-500/30 font-mono text-violet-300">Phase 1 Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
