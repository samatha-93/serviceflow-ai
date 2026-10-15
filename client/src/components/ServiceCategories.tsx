import { TreePine, Sparkles, HeartHandshake, Wrench, Briefcase, CheckCircle2 } from 'lucide-react';

export function ServiceCategories() {
  const categories = [
    {
      id: 'outdoor',
      name: 'Outdoor & Property Services',
      description:
        'Lawn care, landscaping, tree surgery, pressure washing, and seasonal property maintenance.',
      icon: TreePine,
      badge: 'Field Ops',
      examples: ['Lawn mowing & hedge work', 'Patio & driveway washing', 'Gutter & tree maintenance'],
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
    <section className="py-16 sm:py-24" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-teal-50 border border-brand-teal-100 text-brand-teal text-xs font-semibold">
            <span>Tailored Workflows</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-content-primary">
            Designed for Service-Based Businesses
          </h2>
          <p className="text-base text-content-secondary leading-relaxed">
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
                className="group relative bg-surface-card rounded-2xl p-6 sm:p-7 border border-surface-muted shadow-soft hover:shadow-hover hover:border-brand-teal/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="h-12 w-12 rounded-xl bg-brand-teal-50 text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors duration-300 flex items-center justify-center border border-brand-teal-100/60 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-bg text-content-secondary border border-surface-muted group-hover:border-brand-teal/20 transition-colors">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-content-primary group-hover:text-brand-teal transition-colors duration-200">
                    {cat.name}
                  </h3>

                  <p className="text-sm text-content-secondary mt-2.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-surface-muted/60 space-y-1.5">
                  {cat.examples.map((ex, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-content-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal flex-shrink-0" />
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* 6th Card: Universal Flexibility */}
          <div className="bg-gradient-to-br from-brand-teal to-brand-teal-dark text-white rounded-2xl p-6 sm:p-7 shadow-card flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white inline-block">
                Configurable Core
              </span>
              <h3 className="text-xl font-bold leading-snug">
                Customise for your exact operating model
              </h3>
              <p className="text-sm text-teal-100 leading-relaxed">
                Whether you charge by the hour, quote per square foot, or schedule multi-day projects,
                ServiceFlow AI is structured to match how you quote, schedule, and communicate.
              </p>
            </div>

            <div className="pt-6 border-t border-white/20 flex items-center justify-between text-xs text-white/90">
              <span className="font-medium">Flexible fields & appointment rules</span>
              <span className="px-2 py-0.5 rounded bg-white/10 font-mono">Phase 1 Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
