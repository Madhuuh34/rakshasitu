import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import {
  Layers,
  Cpu,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  LifeBuoy,
  HeartPulse,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import { ResourceType } from '../types';

export const ResourcesAllocation: React.FC = () => {
  const {
    resources,
    incidents,
    currentPlan,
    comparisonData,
    runOptimization,
    setActiveTab,
  } = useDisaster();

  const [activeView, setActiveView] = useState<'plan' | 'comparison' | 'inventory'>('plan');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ALLOCATED':
        return (
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/80 border border-emerald-700/80 px-2 py-0.5 rounded font-mono font-bold text-xs">
            <CheckCircle className="w-3.5 h-3.5" />
            ALLOCATED
          </span>
        );
      case 'PARTIALLY ALLOCATED':
        return (
          <span className="flex items-center gap-1 text-amber-400 bg-amber-950/80 border border-amber-700/80 px-2 py-0.5 rounded font-mono font-bold text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            PARTIALLY ALLOCATED
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-red-400 bg-red-950/80 border border-red-700/80 px-2 py-0.5 rounded font-mono font-bold text-xs">
            <XCircle className="w-3.5 h-3.5" />
            UNMET
          </span>
        );
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Header & Main Optimization Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Joint Resource Optimization Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Solves multi-incident allocation simultaneously under severe regional resource scarcity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="bg-slate-900 border border-slate-800 rounded p-0.5 flex text-xs">
            <button
              onClick={() => setActiveView('plan')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-medium ${
                activeView === 'plan'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Optimization Plan
            </button>
            <button
              onClick={() => setActiveView('comparison')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-medium ${
                activeView === 'comparison'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Traditional vs RakshaSetu
            </button>
            <button
              onClick={() => setActiveView('inventory')}
              className={`px-3 py-1.5 rounded transition-all cursor-pointer font-medium ${
                activeView === 'inventory'
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Resource Inventory
            </button>
          </div>

          <button
            id="run-joint-optimization-btn"
            onClick={() => runOptimization()}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded shadow-lg shadow-cyan-950 text-xs transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-slate-950" />
            <span>RUN JOINT OPTIMIZATION</span>
          </button>
        </div>
      </div>

      {/* Production Architecture Disclaimer Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-slate-200">
            Production Optimization Architecture Notice:
          </span>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Running browser-compatible deterministic global optimization for hackathon evaluation. Future production microservice architecture is specified as{' '}
            <span className="font-mono text-cyan-300 font-semibold">
              Python + FastAPI + Google OR-Tools CP-SAT (Constraint Programming Solver)
            </span>{' '}
            interfaced via asynchronous message queues.
          </p>
        </div>
      </div>

      {/* VIEW 1: Current Optimization Plan */}
      {activeView === 'plan' && currentPlan && (
        <div className="space-y-4">
          {/* Plan Summary Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">
                    Plan ID: {currentPlan.plan_id}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    ({currentPlan.incidents_considered} Incidents Evaluated)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Batch: {currentPlan.batch_id}</span>
                  <span>•</span>
                  <span>
                    Status:{' '}
                    <strong
                      className={
                        currentPlan.status === 'APPROVED'
                          ? 'text-emerald-400'
                          : currentPlan.status === 'REJECTED'
                          ? 'text-red-400'
                          : 'text-amber-400'
                      }
                    >
                      {currentPlan.status}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('approval')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-950"
              >
                <span>Proceed to Human Authority Decision</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Allocation Cards for Every Incident */}
          <div className="space-y-3">
            {currentPlan.allocations.map((alloc) => {
              const inc = incidents.find((i) => i.incident_id === alloc.incident_id);

              return (
                <div
                  key={alloc.incident_id}
                  className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-white text-base">
                        {alloc.incident_id}
                      </span>
                      <span className="text-sm font-semibold text-slate-200">
                        {alloc.location_text}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${
                          alloc.priority_level === 'CRITICAL'
                            ? 'text-red-400 bg-red-950 border-red-800'
                            : alloc.priority_level === 'HIGH'
                            ? 'text-orange-400 bg-orange-950 border-orange-800'
                            : 'text-yellow-400 bg-yellow-950 border-yellow-800'
                        }`}
                      >
                        {alloc.priority_level} (Priority {alloc.priority_score})
                      </span>
                    </div>

                    <div>{getStatusBadge(alloc.status)}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Allocated Resources */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
                        Allocated Tactical Assets ({alloc.allocated_resources.length})
                      </span>

                      {alloc.allocated_resources.length > 0 ? (
                        <div className="space-y-1.5">
                          {alloc.allocated_resources.map((r, i) => (
                            <div
                              key={i}
                              className="p-2 rounded bg-slate-950 border border-emerald-900/50 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span className="font-mono font-bold text-white">
                                  {r.resource_id}
                                </span>
                                <span className="text-slate-300 capitalize">
                                  ({r.resource_type.replace('_', ' ')})
                                </span>
                              </div>
                              <span className="text-cyan-400 font-mono text-[10px]">
                                {r.distance_km} km (Haversine)
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-500 italic">
                          No resources currently allocated.
                        </div>
                      )}

                      {/* Unmet Requirements */}
                      {alloc.unmet_requirements.length > 0 && (
                        <div className="pt-2 space-y-1">
                          <span className="text-[11px] font-bold text-red-400 block uppercase tracking-wider">
                            Unmet Critical Requirements:
                          </span>
                          {alloc.unmet_requirements.map((u, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded bg-red-950/40 border border-red-800/80 text-red-300 flex items-center justify-between font-mono"
                            >
                              <span className="flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                <span>
                                  {u.count}x {u.resource_type.toUpperCase()}
                                </span>
                              </span>
                              <span className="text-[10px] font-bold text-red-400">
                                DEFICIT / UNMET
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* WHY THE RESOURCE WAS ASSIGNED (The Core Explanation) */}
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Optimization Rationale &amp; Scarcity Resolution:</span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-300 font-normal">
                          "{alloc.justification}"
                        </p>
                      </div>

                      {inc && (
                        <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 space-y-1">
                          <div>
                            <strong>Evaluated Life-Safety Demands:</strong>{' '}
                            {inc.priority_reasons.join('; ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Visual Comparison (Traditional vs RakshaSetu) */}
      {activeView === 'comparison' && comparisonData && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4">
            <h2 className="text-base font-bold text-white mb-1">
              Architectural Paradigm Comparison: Traditional vs RakshaSetu
            </h2>
            <p className="text-xs text-slate-400">
              Why independent greedy nearest-neighbor dispatch fails during concurrent multi-disaster waves in Assam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TRADITIONAL DISPATCH CARD */}
            <div className="bg-red-950/20 border-2 border-red-900/80 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-sm text-red-400 uppercase tracking-wider">
                    TRADITIONAL DISPATCH
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-red-950 border border-red-800 text-red-300 px-2 py-0.5 rounded font-bold">
                  Independent / Greedy
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-2">
                <p>
                  Each incident assigns the nearest resource independently on a first-come, first-served or proximity basis without global priority pooling.
                </p>
                <div className="p-3 bg-slate-950 rounded border border-red-900/50 text-[11px] text-red-300 space-y-1">
                  <strong>Catastrophic Failure Mode:</strong>
                  <p>{comparisonData.traditional.rationale}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                <div className="p-3 bg-red-950/60 border border-red-800 rounded">
                  <span className="text-[10px] uppercase font-bold text-red-300 block">
                    Critical Incidents Starved
                  </span>
                  <span className="font-mono font-extrabold text-2xl text-red-400">
                    {comparisonData.traditional.critical_incidents_starved}
                  </span>
                </div>
                <div className="p-3 bg-red-950/60 border border-red-800 rounded">
                  <span className="text-[10px] uppercase font-bold text-red-300 block">
                    Lives at Risk Unmet
                  </span>
                  <span className="font-mono font-extrabold text-2xl text-red-400">
                    {comparisonData.traditional.lives_at_risk_unmet}+
                  </span>
                </div>
              </div>
            </div>

            {/* RAKSHASETU GLOBAL JOINT OPTIMIZATION CARD */}
            <div className="bg-emerald-950/20 border-2 border-emerald-800/80 rounded-lg p-5 space-y-4 shadow-xl shadow-emerald-950/30">
              <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-300 uppercase tracking-wider">
                    RAKSHASETU ORCHESTRATION
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-950 border border-emerald-700 text-emerald-300 px-2 py-0.5 rounded font-bold">
                  Global Joint Solver
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-2">
                <p>
                  Pools incidents into a 120s window. Solves ALL active emergencies together as a global constraint optimization problem to maximize life-safety utility.
                </p>
                <div className="p-3 bg-slate-950 rounded border border-emerald-800/50 text-[11px] text-emerald-300 space-y-1">
                  <strong>Life-Saving Outcome:</strong>
                  <p>{comparisonData.rakshasetu.rationale}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-center">
                <div className="p-3 bg-emerald-950/60 border border-emerald-700 rounded">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                    Critical Incidents Starved
                  </span>
                  <span className="font-mono font-extrabold text-2xl text-emerald-400">0</span>
                </div>
                <div className="p-3 bg-emerald-950/60 border border-emerald-700 rounded">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                    Lives at Risk Unmet
                  </span>
                  <span className="font-mono font-extrabold text-2xl text-emerald-400">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Resource Inventory Table */}
      {activeView === 'inventory' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Registered Emergency Tactical Assets</h3>
            <span className="text-xs text-slate-400 font-mono">Assam Theater Database</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Asset ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Asset Name</th>
                  <th className="p-3">Base Station</th>
                  <th className="p-3">Coordinates</th>
                  <th className="p-3">Capabilities</th>
                  <th className="p-3">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {resources.map((res) => (
                  <tr key={res.resource_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-cyan-400">{res.resource_id}</td>
                    <td className="p-3 capitalize font-sans">{res.resource_type.replace('_', ' ')}</td>
                    <td className="p-3 font-sans text-white font-medium">{res.name}</td>
                    <td className="p-3 font-sans text-slate-400">{res.base_station_name}</td>
                    <td className="p-3 text-slate-500">
                      [{res.latitude.toFixed(3)}, {res.longitude.toFixed(3)}]
                    </td>
                    <td className="p-3 font-sans">
                      <div className="flex flex-wrap gap-1">
                        {res.capabilities.map((cap, i) => (
                          <span
                            key={i}
                            className="bg-slate-950 px-1.5 py-0.5 rounded text-[10px] text-slate-400"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          res.availability === 'available'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : res.availability === 'deployed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {res.availability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
