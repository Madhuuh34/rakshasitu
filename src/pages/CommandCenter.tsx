import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { AssamMap } from '../components/AssamMap';
import {
  AlertCircle,
  Clock,
  ArrowRight,
  Shield,
  LifeBuoy,
  Zap,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { PriorityLevel } from '../types';

export const CommandCenter: React.FC = () => {
  const {
    incidents,
    resources,
    currentPlan,
    batchSecondsRemaining,
    selectedIncidentId,
    setSelectedIncidentId,
    setActiveTab,
    runOptimization,
  } = useDisaster();

  const selectedIncident = incidents.find((i) => i.incident_id === selectedIncidentId) || incidents[0];

  const getPriorityColor = (level: PriorityLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'text-red-400 bg-red-950/80 border-red-700/80';
      case 'HIGH':
        return 'text-orange-400 bg-orange-950/80 border-orange-700/80';
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-950/80 border-yellow-700/80';
      case 'LOW':
        return 'text-blue-400 bg-blue-950/80 border-blue-700/80';
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      {/* Top Banner: Joint Batch Window Status & Quick Optimization */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">Active 120s Batch Window</span>
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                BATCH #{currentPlan?.batch_id || 'BATCH-0922'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pooling incoming Assam disaster reports. When window closes or critical incident arrives, global joint solver optimizes scarce regional assets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => runOptimization()}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-4 py-2 rounded-md shadow-lg shadow-cyan-900/30 text-xs transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>RUN JOINT OPTIMIZATION</span>
          </button>
          {currentPlan?.status === 'AWAITING_APPROVAL' && (
            <button
              onClick={() => setActiveTab('approval')}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded-md text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Review Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Map (Left 65%) + Priority Queue (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Map Area */}
        <div className="lg:col-span-8 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Live Geotagged Disaster Incidents & Assam Resource Depots
            </span>
            <span className="text-[11px] text-slate-500">Click marker to inspect sector</span>
          </div>

          <div className="h-[460px] w-full">
            <AssamMap />
          </div>
        </div>

        {/* Right Panel: Priority Queue */}
        <div className="lg:col-span-4 flex flex-col bg-slate-900/90 border border-slate-800 rounded-lg overflow-hidden h-[485px]">
          <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-xs text-white uppercase tracking-wider">
                Priority Queue ({incidents.length})
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">0-100 Score</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-800/40">
            {incidents.map((inc) => {
              const isSelected = selectedIncident?.incident_id === inc.incident_id;
              const alloc = currentPlan?.allocations.find((a) => a.incident_id === inc.incident_id);

              return (
                <div
                  key={inc.incident_id}
                  onClick={() => setSelectedIncidentId(inc.incident_id)}
                  className={`pt-2.5 first:pt-0 p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/80 shadow-md shadow-cyan-950'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs">
                          {inc.incident_id}
                        </span>
                        <span className="text-xs font-semibold text-slate-300">
                          {inc.location_text}
                        </span>
                      </div>
                      <span className="text-[11px] text-cyan-400 capitalize">
                        {inc.incident_type}
                      </span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono ${getPriorityColor(
                          inc.priority_level
                        )}`}
                      >
                        {inc.priority_level} • {inc.priority_score}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5">
                    {inc.description}
                  </p>

                  {/* Requirements and Allocation Status */}
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1 text-slate-400">
                      <span>Needs:</span>
                      {inc.resource_requirements.map((r, i) => (
                        <span
                          key={i}
                          className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono"
                        >
                          {r.count}x {r.resource_type}
                        </span>
                      ))}
                    </div>

                    {alloc && (
                      <span
                        className={`font-mono font-bold px-1.5 py-0.2 rounded ${
                          alloc.status === 'ALLOCATED'
                            ? 'text-emerald-400 bg-emerald-950/60'
                            : alloc.status === 'PARTIALLY ALLOCATED'
                            ? 'text-amber-400 bg-amber-950/60'
                            : 'text-red-400 bg-red-950/60'
                        }`}
                      >
                        {alloc.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-center">
            <button
              onClick={() => setActiveTab('intelligence')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center justify-center gap-1 w-full cursor-pointer"
            >
              <span>View Full AI Intelligence &amp; Score Math</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Area: Resource Availability Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-xs text-white uppercase tracking-wider">
              Assam Regional Resource Availability ({resources.length} Assets Registered)
            </span>
          </div>
          <button
            onClick={() => setActiveTab('resources')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Allocation Matrix &amp; Traditional vs RakshaSetu</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {resources.map((res) => {
            const isAvail = res.availability === 'available';
            const isDeployed = res.availability === 'deployed';
            const isAssigned = res.availability === 'assigned';

            const statusBg = isDeployed
              ? 'border-emerald-700 bg-emerald-950/40 text-emerald-300'
              : isAssigned
              ? 'border-blue-700 bg-blue-950/40 text-blue-300'
              : isAvail
              ? 'border-cyan-700/60 bg-cyan-950/20 text-cyan-300'
              : 'border-slate-800 bg-slate-950 text-slate-500';

            const icon =
              res.resource_type === 'boat' ? (
                <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
              ) : res.resource_type === 'ambulance' ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              ) : res.resource_type === 'medical_team' ? (
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              );

            return (
              <div
                key={res.resource_id}
                className={`p-2 rounded border ${statusBg} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {icon}
                      <span className="font-mono font-bold text-xs text-white">
                        {res.resource_id}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded uppercase font-mono">
                      {res.availability}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-200 mt-1 truncate">
                    {res.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {res.base_station_name}
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 mt-2 pt-1 border-t border-slate-800/80 font-mono truncate">
                  {res.current_status}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
