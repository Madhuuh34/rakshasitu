import React from 'react';
import {
  ShieldAlert,
  Activity,
  Layers,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  Brain,
  Sliders,
  PlayCircle,
  GitBranch,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useDisaster } from '../context/DisasterContext';

export const Navbar: React.FC = () => {
  const {
    incidents,
    resources,
    currentPlan,
    batchSecondsRemaining,
    batchAlertMessage,
    activeTab,
    setActiveTab,
    setJudgeModeOpen,
  } = useDisaster();

  const activeIncidentsCount = incidents.filter((i) => i.incident_status !== 'resolved').length;
  const criticalCount = incidents.filter(
    (i) => i.priority_level === 'CRITICAL' && i.incident_status !== 'resolved'
  ).length;

  const availableResourcesCount = resources.filter((r) => r.availability === 'available').length;
  const deployedResourcesCount = resources.filter((r) => r.availability === 'deployed').length;
  const pendingApprovalsCount = currentPlan?.status === 'AWAITING_APPROVAL' ? 1 : 0;

  const navItems = [
    { id: 'command_center', label: 'Command Center', icon: Activity },
    { id: 'report', label: 'Report Emergency', icon: ShieldAlert },
    { id: 'intelligence', label: 'Incident Intelligence', icon: Brain },
    { id: 'resources', label: 'Resources & Allocation', icon: Layers },
    { id: 'approval', label: 'Response Approval', icon: CheckCircle2, badge: pendingApprovalsCount },
    { id: 'audit', label: 'Audit Timeline', icon: Clock },
    { id: 'scenarios', label: 'Demo Scenarios', icon: PlayCircle },
    { id: 'architecture', label: 'Architecture', icon: GitBranch },
  ];

  const batchPercent = Math.min(100, Math.max(0, (batchSecondsRemaining / 120) * 100));

  return (
    <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 shadow-2xl">
      {/* Top Telemetry Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Hackathon Tag */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500 font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-sm tracking-wide">RAKSHASETU</span>
                  <span className="bg-red-950/80 text-red-400 border border-red-800/60 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                    SIH26206
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  AI-Assisted Multi-Disaster Orchestration
                </span>
              </div>
            </div>

            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

            {/* System Status & Region */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-[11px]">OPERATIONAL</span>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[11px]">ASSAM, INDIA</span>
              </div>
            </div>
          </div>

          {/* Real-time Emergency Counters */}
          <div className="flex items-center gap-3 overflow-x-auto">
            {/* Active Incidents */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800">
              <span className="text-slate-400 text-[11px]">Active:</span>
              <span className="font-mono font-bold text-white text-xs">{activeIncidentsCount}</span>
            </div>

            {/* Critical Incidents */}
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded border ${
                criticalCount > 0
                  ? 'bg-red-950/70 border-red-800 text-red-300 animate-pulse'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span className="text-[11px]">Critical:</span>
              <span className="font-mono font-bold text-xs">{criticalCount}</span>
            </div>

            {/* Resources (Available / Deployed) */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[11px]">
              <span className="text-slate-400">Assets:</span>
              <span className="text-cyan-400 font-mono font-bold">{availableResourcesCount} Avail</span>
              <span className="text-slate-600">/</span>
              <span className="text-emerald-400 font-mono font-bold">{deployedResourcesCount} Deployed</span>
            </div>

            {/* Pending Approvals Badge */}
            {pendingApprovalsCount > 0 && (
              <button
                onClick={() => setActiveTab('approval')}
                className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-1 rounded text-xs font-semibold hover:bg-amber-500/30 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>Plan Awaiting Approval</span>
              </button>
            )}

            {/* Batch Window Countdown Pill */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400 text-[10px] uppercase">Batch:</span>
              <span className="font-bold text-indigo-300">{batchSecondsRemaining}s</span>
              <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${batchPercent}%` }}
                ></div>
              </div>
            </div>

            {/* JUDGE MODE BUTTON (High Priority for 2-min pitch) */}
            <button
              id="judge-mode-btn"
              onClick={() => setJudgeModeOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3 py-1 rounded shadow-lg shadow-amber-500/20 text-xs transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
              <span>JUDGE MODE (2-Min Flow)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Critical Interruption Banner if active */}
      {batchAlertMessage && (
        <div className="bg-red-600 text-white font-mono font-bold text-xs py-1.5 px-4 text-center tracking-wider animate-pulse flex items-center justify-center gap-2 border-b border-red-700">
          <AlertTriangle className="w-4 h-4" />
          <span>{batchAlertMessage}</span>
          <span className="bg-red-950/80 px-2 py-0.5 rounded text-[10px] text-red-200">
            JOINT SOLVER ENGAGED IMMEDIATELY
          </span>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-4 overflow-x-auto flex items-center gap-1 py-1 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {Boolean(item.badge) && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
