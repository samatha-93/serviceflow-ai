import React, { useState, useRef } from 'react';
import {
  Inbox,
  Sparkles,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Edit3,
  Check,
  RotateCcw,
  Sparkle,
} from 'lucide-react';

interface Stage {
  id: string;
  step: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const STAGES: Stage[] = [
  {
    id: 'enquiry',
    step: '01',
    title: 'Customer Enquiry',
    shortTitle: 'Enquiry',
    subtitle: 'Unified intake from website forms, email, and phone',
    icon: Inbox,
    tag: 'Inbound Stream',
  },
  {
    id: 'suggested-reply',
    step: '02',
    title: 'Suggested Reply',
    shortTitle: 'Suggested Reply',
    subtitle: 'Pre-drafted message formulated from service catalog & rates',
    icon: Sparkles,
    tag: 'Assisted Template',
  },
  {
    id: 'owner-approval',
    step: '03',
    title: 'Owner Approval',
    shortTitle: 'Approval',
    subtitle: 'Mandatory human sign-off before any message is dispatched',
    icon: ShieldCheck,
    tag: 'Human Review Gate',
  },
  {
    id: 'booking',
    step: '04',
    title: 'Booking & Schedule',
    shortTitle: 'Booking',
    subtitle: 'Confirmed appointment locked to calendar with assigned staff',
    icon: Calendar,
    tag: 'Calendar Confirmed',
  },
  {
    id: 'follow-up',
    step: '05',
    title: 'Follow-up & History',
    shortTitle: 'Follow-up',
    subtitle: 'Completed job details, invoice status, and client profile log',
    icon: CheckCircle2,
    tag: 'Client Record',
  },
];

const DEFAULT_DRAFT =
  "Hi Emma, thank you for contacting Apex Electrical. We can inspect your breaker panel this Thursday between 9:00 AM and 11:00 AM. Our diagnostic fee is $89, which is credited toward any work performed. Please let us know if that window suits you.";

export function WorkflowVisual() {
  const [activeStageId, setActiveStageId] = useState<string>('suggested-reply');
  const [draftText, setDraftText] = useState<string>(DEFAULT_DRAFT);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [hasCustomEdits, setHasCustomEdits] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = STAGES.findIndex((s) => s.id === activeStageId);
  const activeStage = STAGES[activeIndex !== -1 ? activeIndex : 1];
  const ActiveIcon = activeStage.icon;

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % STAGES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + STAGES.length) % STAGES.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = STAGES.length - 1;
    }

    if (nextIndex !== index) {
      setActiveStageId(STAGES[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  const goToNextStage = () => {
    const nextIdx = (activeIndex + 1) % STAGES.length;
    setActiveStageId(STAGES[nextIdx].id);
  };

  const goToPrevStage = () => {
    const prevIdx = (activeIndex - 1 + STAGES.length) % STAGES.length;
    setActiveStageId(STAGES[prevIdx].id);
  };

  const handleDraftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftText(e.target.value);
    setHasCustomEdits(e.target.value !== DEFAULT_DRAFT);
  };

  const handleResetDraft = () => {
    setDraftText(DEFAULT_DRAFT);
    setHasCustomEdits(false);
    setIsEditing(false);
  };

  const progressPercent = (activeIndex / (STAGES.length - 1)) * 100;

  return (
    <div
      className="relative w-full select-none"
      style={{ perspective: '1200px' }}
      aria-label="Interactive 3D 5-Stage Operational AI Workflow"
    >
      {/* 3D Floating Console (Movie-like 3D breathing / floating motion) */}
      <div
        className="w-full rounded-2xl bg-gradient-to-b from-[#0F142E]/95 via-[#0B0F24]/95 to-[#060815]/98 border border-white/10 p-4 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_35px_-5px_rgba(139,92,246,0.2)] backdrop-blur-xl relative transition-transform duration-500 animate-movie-3d-float"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Specular top border highlight */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* 3D Floating Satellite 1: Top-Right (Orbiting Chip) */}
        <div
          className="absolute -top-3 right-3 sm:-top-4 sm:right-6 z-30 hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#0E132D]/95 border border-violet-500/40 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.7),0_0_20px_rgba(139,92,246,0.3)] backdrop-blur-md animate-satellite-1"
          style={{ transform: 'translate3d(0, 0, 45px)' }}
          aria-hidden="true"
        >
          <Sparkle className="w-3.5 h-3.5 text-violet-300 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="text-[11px] font-semibold text-violet-200">
            Assisted Core
          </span>
          <span className="text-[10px] text-slate-400 border-l border-white/10 pl-1.5 font-mono">
            Interactive Deck
          </span>
        </div>

        {/* 3D Floating Satellite 2: Bottom-Left (Orbiting Chip) */}
        <div
          className="absolute -bottom-3 left-3 sm:-bottom-4 sm:left-6 z-30 hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0A0E26]/95 border border-cyan-500/35 shadow-[0_12px_30px_-5px_rgba(0,0,0,0.7),0_0_20px_rgba(56,189,248,0.25)] backdrop-blur-md animate-satellite-2"
          style={{ transform: 'translate3d(0, 0, 40px)' }}
          aria-hidden="true"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-semibold text-slate-200">
            Human Sign-Off Guard
          </span>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800/60">
            Active
          </span>
        </div>

        {/* Console Header Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 text-xs relative z-10">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-slate-400 font-mono text-[11px] pl-1 font-medium">
              workflow.engine // 5-stage loop
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-medium text-violet-300 bg-violet-950/60 border border-violet-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Product Walkthrough
            </span>
            <span className="text-slate-500 font-mono text-[10px] hidden sm:inline">
              Stage {activeStage.step}/05
            </span>
          </div>
        </div>

        {/* 5-Stage Stepper Track */}
        <div className="relative mb-5" role="region" aria-label="Workflow Navigation">
          {/* Connecting Track Line */}
          <div
            className="hidden sm:block absolute top-[22px] left-[8%] right-[8%] h-0.5 bg-white/10 -translate-y-1/2 pointer-events-none z-0"
            aria-hidden="true"
          >
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Accessible 5-Stage Tablist */}
          <div
            className="grid grid-cols-5 gap-1.5 sm:gap-2 relative z-10"
            role="tablist"
            aria-label="Workflow Stages"
          >
            {STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isSelected = stage.id === activeStageId;

              return (
                <button
                  key={stage.id}
                  ref={(el) => (tabRefs.current[index] = el)}
                  role="tab"
                  id={`stage-tab-${stage.id}`}
                  aria-selected={isSelected}
                  aria-controls={`stage-panel-${stage.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  type="button"
                  onClick={() => setActiveStageId(stage.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`group flex flex-col items-center text-center p-2 rounded-xl transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                    isSelected
                      ? 'bg-violet-950/70 border border-violet-500/70 shadow-[0_0_15px_rgba(139,92,246,0.3)] scale-[1.02]'
                      : 'bg-white/[0.02] border border-white/5 hover:border-white/15 hover:bg-white/[0.05]'
                  }`}
                  title={`Stage ${stage.step}: ${stage.title}`}
                >
                  {/* Node icon */}
                  <div
                    className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                        : 'bg-[#121733] text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>

                  {/* Step indicator */}
                  <span
                    className={`text-[10px] font-mono mt-1 ${
                      isSelected ? 'text-violet-300 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {stage.step}
                  </span>

                  {/* Title */}
                  <span
                    className={`text-[10px] sm:text-[11px] font-medium leading-tight mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <span className="hidden sm:inline">{stage.shortTitle}</span>
                    <span className="sm:hidden">{stage.step}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stage Content Panel with Distinctive Technical/Editor Styling */}
        <div
          id={`stage-panel-${activeStage.id}`}
          role="tabpanel"
          aria-labelledby={`stage-tab-${activeStage.id}`}
          className="rounded-xl border border-white/10 bg-[#070918]/90 p-4 sm:p-5 relative transition-all shadow-inner"
        >
          {/* Header with Title and Step Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                <ActiveIcon className="w-4 h-4 text-violet-300" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono text-[11px] text-violet-400 font-bold">
                    STAGE {activeStage.step}
                  </span>
                  <span className="text-slate-600">•</span>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">
                    {activeStage.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {activeStage.subtitle}
                </p>
              </div>
            </div>

            {/* Stage Tag and Prev/Next */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-slate-300 bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded">
                {activeStage.tag}
              </span>
              <div className="flex items-center space-x-1 pl-1">
                <button
                  type="button"
                  onClick={goToPrevStage}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Previous stage"
                  aria-label="Previous workflow stage"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={goToNextStage}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Next stage"
                  aria-label="Next workflow stage"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Interface Mockup Card */}
          <div className="rounded-lg border border-white/10 bg-[#0B0F24]/80 p-3.5 space-y-2.5">
            {/* Stage 01: Customer Enquiry */}
            {activeStage.id === 'enquiry' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-white/5 font-mono">
                  <span className="text-slate-300">payload: inbound_request.json</span>
                  <span className="text-cyan-400">Web Form Channel</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pb-1">
                  <div>
                    <span className="text-slate-500 block">Customer:</span>
                    <span className="text-white font-medium">Emma Vance</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Contact:</span>
                    <span className="text-slate-300">emma.vance@example.com</span>
                  </div>
                </div>
                <div className="bg-[#070918] p-2.5 rounded border border-white/5 font-sans">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                    Service Requested:
                  </span>
                  <p className="text-slate-200 text-xs italic">
                    &ldquo;Looking for an inspection of our residential breaker panel and quote for a 200A service upgrade.&rdquo;
                  </p>
                </div>
                <div className="pt-1.5 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Enquiry received • Ready for suggested response</span>
                  <span className="text-cyan-400">Step 1 of 5</span>
                </div>
              </div>
            )}

            {/* Stage 02: Suggested Reply (INTERACTIVE & EDITABLE!) */}
            {activeStage.id === 'suggested-reply' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-white/5 font-mono">
                  <span className="text-slate-300 flex items-center space-x-1.5">
                    <span>draft: response_preview.md</span>
                    {hasCustomEdits && (
                      <span className="text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-700/60 text-[10px]">
                        Edited by Operator
                      </span>
                    )}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {hasCustomEdits && (
                      <button
                        type="button"
                        onClick={handleResetDraft}
                        className="inline-flex items-center space-x-1 text-[10px] text-slate-400 hover:text-white transition-colors"
                        title="Reset to default suggested template"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-violet-950/80 border border-violet-500/40 text-violet-300 hover:text-white hover:bg-violet-900/80 text-[10px] font-medium transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditing ? 'Done Editing' : 'Click to Edit Draft'}</span>
                    </button>
                  </div>
                </div>

                {/* Editable Text Area vs Formatted Display */}
                {isEditing ? (
                  <div className="space-y-1.5">
                    <textarea
                      value={draftText}
                      onChange={handleDraftChange}
                      rows={4}
                      className="w-full bg-[#070918] text-slate-100 text-xs p-2.5 rounded border border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-400 font-sans leading-relaxed resize-none"
                      placeholder="Customize your response draft here..."
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>Live interactive editor • Try typing custom instructions</span>
                      <span>{draftText.length} characters</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsEditing(true)}
                    className="bg-[#070918] p-2.5 rounded border border-white/5 text-slate-200 leading-relaxed font-sans text-xs cursor-text hover:border-violet-500/30 transition-colors group relative"
                    title="Click anywhere to edit draft"
                  >
                    <p className="text-slate-100">&ldquo;{draftText}&rdquo;</p>
                    <span className="text-[10px] text-violet-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity block mt-1">
                      ✎ Click to customize text
                    </span>
                  </div>
                )}

                <div className="pt-1.5 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Template assistance • Requires owner review before sending</span>
                  <span className="text-violet-400">Step 2 of 5</span>
                </div>
              </div>
            )}

            {/* Stage 03: Owner Approval (Review Gate with Interactive Approval) */}
            {activeStage.id === 'owner-approval' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-white/5 font-mono">
                  <span className="text-slate-300">gate: operator_signoff.auth</span>
                  <span className="text-amber-400">Mandatory Review</span>
                </div>

                <div className="bg-[#070918] p-2.5 rounded border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300">Reviewer: Alex M. (Operator)</span>
                    <span className={isApproved ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                      {isApproved ? '✓ Authorization Granted' : 'Awaiting Approval'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans p-2 rounded bg-white/[0.02] border border-white/5 italic">
                    &ldquo;{draftText}&rdquo;
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setIsApproved(!isApproved)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isApproved
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                        : 'bg-violet-600 hover:bg-violet-500 text-white shadow-sm'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isApproved ? 'Approved for Dispatch' : 'Approve & Dispatch Reply'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveStageId('suggested-reply');
                      setIsEditing(true);
                    }}
                    className="text-[11px] text-slate-400 hover:text-white font-mono transition-colors"
                  >
                    Edit Draft ➔
                  </button>
                </div>

                <div className="pt-1.5 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Zero autonomous sending without human verification</span>
                  <span className="text-amber-400">Step 3 of 5</span>
                </div>
              </div>
            )}

            {/* Stage 04: Booking & Schedule */}
            {activeStage.id === 'booking' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-white/5 font-mono">
                  <span className="text-slate-300">dispatch: appointment_lock.cal</span>
                  <span className="text-emerald-400">Schedule Synced</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pb-1">
                  <div>
                    <span className="text-slate-500 block">Date & Slot:</span>
                    <span className="text-white font-medium">Thursday, Oct 19 • 10:00 AM</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Assigned Staff:</span>
                    <span className="text-white font-medium">Dan K. (Lead Electrician)</span>
                  </div>
                </div>

                <div className="bg-[#070918] p-2.5 rounded border border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-300">Address: 42 Elmwood Avenue, Riverdale</span>
                  <span className="text-emerald-400 font-semibold">Calendar Locked</span>
                </div>

                <div className="pt-1.5 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Appointment locked • Customer notified and technician dispatched</span>
                  <span className="text-emerald-400">Step 4 of 5</span>
                </div>
              </div>
            )}

            {/* Stage 05: Follow-up & History */}
            {activeStage.id === 'follow-up' && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-white/5 font-mono">
                  <span className="text-slate-300">archive: service_history.log</span>
                  <span className="text-blue-400">Archived Record</span>
                </div>

                <div className="bg-[#070918] p-2.5 rounded border border-white/5 space-y-1.5 font-sans">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-white font-medium">Order #SO-8841 Completed</span>
                    <span className="text-slate-400">Oct 19</span>
                  </div>
                  <p className="text-slate-300 text-xs">
                    Main breaker panel inspected. Upgrade quote delivered to client. Logged to customer profile for scheduled future maintenance.
                  </p>
                </div>

                <div className="pt-1.5 border-t border-white/5 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Customer history preserved • Ready for repeat service</span>
                  <span className="text-blue-400">Step 5 of 5</span>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Footer Help */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3">
            <div className="flex items-center space-x-1.5">
              <UserCheck className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
              <span>Full human supervisory authority at every transition</span>
            </div>

            <div className="flex items-center space-x-1 font-mono text-[10px] text-slate-400">
              <span className="hidden sm:inline">Use arrows or click 01–05</span>
              <ChevronRight className="w-3 h-3 text-violet-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
