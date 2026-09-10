import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import {
  PlayCircle,
  AlertTriangle,
  Zap,
  LifeBuoy,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const DemoScenarios: React.FC = () => {
  const {
    loadScenario,
    triggerCriticalInterruption,
    setActiveTab,
    setJudgeModeOpen,
  } = useDisaster();

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">Demo Scenario Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pre-configured disaster benchmarks designed for SIH26206 jury evaluation.
          </p>
        </div>

        <button
          onClick={() => setJudgeModeOpen(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded shadow-lg shadow-amber-950 text-xs transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Launch 2-Minute Judge Walkthrough</span>
        </button>
      </div>

      {/* 3 Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* SCENARIO 1: FLOOD CLUSTER */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 uppercase">
                Scenario 1
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Assam Floods</span>
            </div>

            <h3 className="font-bold text-sm text-white">Flood Cluster (3 Incidents)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Concurrent disasters across Dibrugarh, Dhemaji, and Tinsukia with diverse casualty profiles and road blockages.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <strong className="text-red-400">I001 (Dibrugarh):</strong> Flood, 30 trapped, 2 injured, medical emergency.
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <strong className="text-amber-400">I002 (Dhemaji):</strong> Flood, 60 affected, culvert cut, people isolated.
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <strong className="text-blue-400">I003 (Tinsukia):</strong> Road blockage, 20 commuters affected.
              </div>
            </div>
          </div>

          <button
            id="scenario-1-btn"
            onClick={() => {
              loadScenario(1);
              setActiveTab('command_center');
            }}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-950"
          >
            <span>LOAD SCENARIO 1</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SCENARIO 2: RESOURCE CONFLICT (CORE INNOVATION) */}
        <div className="bg-slate-900/90 border-2 border-amber-600/70 rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-xl shadow-amber-950/20">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 uppercase">
                Scenario 2 (Core Innovation)
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">Scarce Asset Deficit</span>
            </div>

            <h3 className="font-bold text-sm text-white">Resource Conflict (Two Floods, One Boat)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Two active floods demand high-capacity watercraft, but only <strong>ONE</strong> motorized boat is available in the operational inventory.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <strong className="text-orange-400">I001 (Priority 88):</strong> 35 trapped + active medical emergency.
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <strong className="text-yellow-400">I002 (Priority 76):</strong> 40 trapped, isolated, no injuries.
              </div>
              <div className="p-2 rounded bg-amber-950/40 border border-amber-800/60 text-amber-300 text-[11px]">
                <strong>Solver Output:</strong> Boat allocated to I001; I002 shows Boat UNMET with explicit explainable justification.
              </div>
            </div>
          </div>

          <button
            id="scenario-2-btn"
            onClick={() => {
              loadScenario(2);
              setActiveTab('resources');
            }}
            className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-950"
          >
            <span>LOAD SCENARIO 2</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SCENARIO 3: CRITICAL INTERRUPTION */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 uppercase">
                Scenario 3
              </span>
              <span className="text-[10px] text-red-400 font-mono font-bold">Dynamic Preemption</span>
            </div>

            <h3 className="font-bold text-sm text-white">Critical Batch Interruption</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Starts with I001 (HIGH) and I002 (MEDIUM) waiting in a 120s batch window. An incoming CRITICAL dyke breach preemptively interrupts and releases the batch early!
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <span>1. Loads I001 (HIGH) &amp; I002 (MEDIUM) batch</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                <span>2. Introduce I003 CRITICAL (dyke failure, 40 trapped)</span>
              </div>
              <div className="p-2 rounded bg-red-950/40 border border-red-800/60 text-red-300 text-[11px]">
                <strong>Alert Displayed:</strong> "CRITICAL INCIDENT DETECTED — BATCH RELEASED EARLY"
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              id="scenario-3-init-btn"
              onClick={() => {
                loadScenario(3);
                setActiveTab('command_center');
              }}
              className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold py-1.5 px-3 rounded text-xs transition-colors cursor-pointer"
            >
              1. Initialize Scenario 3 Batch
            </button>

            <button
              id="scenario-3-trigger-crit-btn"
              onClick={() => {
                triggerCriticalInterruption();
                setActiveTab('command_center');
              }}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-3 rounded text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-950 animate-pulse"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>2. INTRODUCE CRITICAL I003</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
