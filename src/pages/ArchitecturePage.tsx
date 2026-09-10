import React from 'react';
import {
  GitBranch,
  User,
  Shield,
  Brain,
  Layers,
  Cpu,
  CheckCircle2,
  Lock,
  Server,
  Database,
  Terminal,
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="p-4 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-cyan-400" />
          <h1 className="text-xl font-bold text-white tracking-wide">
            System Architecture &amp; Data Pipeline
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          RakshaSetu End-to-End Orchestration Architecture for Smart India Hackathon 2026 (SIH26206)
        </p>
      </div>

      {/* Core Philosophy Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-2 shadow-2xl">
        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
          THE RAKSHASETU DOCTRINE
        </span>
        <blockquote className="text-lg md:text-xl font-extrabold text-white tracking-wide font-sans">
          "AI interprets. Explainable logic prioritizes. Optimization allocates. Humans decide."
        </blockquote>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Guarantees transparent accountability, mathematically prevents greedy local resource hogging, and ensures life-safety assets are deployed only with human authority approval.
        </p>
      </div>

      {/* Vertical Modular Flowchart */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-0.5 before:bg-slate-800 before:z-0">
        {/* Node: CITIZEN */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-lg flex items-center gap-2.5 max-w-sm w-full justify-center">
            <User className="w-5 h-5 text-blue-400" />
            <div>
              <span className="font-mono text-xs font-bold text-white uppercase block">
                CITIZEN / FIRST RESPONDER
              </span>
              <span className="text-[10px] text-slate-400">Field SOS / Emergency Reporter</span>
            </div>
          </div>
          <div className="text-slate-500 text-xs py-1">↓</div>
        </div>

        {/* Node: MODULE 1 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 bg-slate-900 border border-cyan-800/80 rounded-lg shadow-lg max-w-md w-full space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-cyan-400">
                MODULE 1 — REPORT INTAKE
              </span>
              <span className="text-[10px] font-mono text-slate-500">Intake API</span>
            </div>
            <p className="text-xs text-slate-300">
              Validates input schema, attaches automated metadata (<code className="text-cyan-300">report_id</code>, <code className="text-cyan-300">source_type</code>, <code className="text-cyan-300">submitted_at</code>). Does not require manual coordinates.
            </p>
          </div>
          <div className="font-mono text-[10px] text-cyan-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 my-1">
            ↓ raw_report
          </div>
        </div>

        {/* Node: MODULE 2 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 bg-slate-900 border border-indigo-800/80 rounded-lg shadow-lg max-w-md w-full space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-400">
                MODULE 2 — AI UNDERSTANDING + LOCATION
              </span>
              <span className="text-[10px] font-mono text-slate-500">NLP / Geo-Resolution</span>
            </div>
            <p className="text-xs text-slate-300">
              Deterministic extractor tags 6 allowed incident types and 10 severity indicators. Enforces structured reporter override precedence. Resolves Assam coordinates or flags out_of_scope. Never invents missing values.
            </p>
          </div>
          <div className="font-mono text-[10px] text-indigo-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 my-1">
            ↓ parsed_report
          </div>
        </div>

        {/* Node: MODULE 3 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 bg-slate-900 border border-amber-800/80 rounded-lg shadow-lg max-w-md w-full space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-400">
                MODULE 3 — INCIDENT + PRIORITY + BATCHING
              </span>
              <span className="text-[10px] font-mono text-slate-500">Priority Engine</span>
            </div>
            <p className="text-xs text-slate-300">
              Computes transparent 0–100 score (+30 trapped, +20 medical, +15 injuries, etc.). Groups incoming incidents into 120s multi-incident windows. Dynamically releases early if a CRITICAL emergency arrives.
            </p>
          </div>
          <div className="font-mono text-[10px] text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 my-1">
            ↓ incident_batch
          </div>
        </div>

        {/* Node: MODULE 4 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 bg-slate-900 border border-emerald-800/80 rounded-lg shadow-lg max-w-md w-full space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-400">
                MODULE 4 — RESOURCE + ALLOCATION ENGINE
              </span>
              <span className="text-[10px] font-mono text-slate-500">Joint Solver</span>
            </div>
            <p className="text-xs text-slate-300">
              Solves global constraint optimization across all batched incidents. Evaluates Haversine distance, capability compatibility, and resolves scarce asset deficits with clear WHY rationale.
            </p>
          </div>
          <div className="font-mono text-[10px] text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 my-1">
            ↓ response_plan
          </div>
        </div>

        {/* Node: MODULE 5 */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 bg-slate-900 border border-purple-800/80 rounded-lg shadow-lg max-w-md w-full space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-purple-400">
                MODULE 5 — COMMAND DASHBOARD
              </span>
              <span className="text-[10px] font-mono text-slate-500">Decision UI</span>
            </div>
            <p className="text-xs text-slate-300">
              Renders geospatial sector map, prioritized triage queue, resource availability strip, and traditional vs joint comparison metrics.
            </p>
          </div>
          <div className="text-slate-500 text-xs py-1">↓</div>
        </div>

        {/* Node: HUMAN AUTHORITY */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 bg-slate-950 border-2 border-emerald-500 rounded-lg shadow-2xl max-w-md w-full space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <Shield className="w-5 h-5" />
              <span className="font-mono text-xs font-extrabold uppercase tracking-widest">
                HUMAN AUTHORITY (DDMA / NDRF)
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Resources are NEVER automatically deployed. Human authority retains full sovereign control.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1 font-mono text-xs font-bold">
              <span className="bg-emerald-950 border border-emerald-700 text-emerald-300 px-2 py-0.5 rounded">
                APPROVE
              </span>
              <span className="text-slate-500">/</span>
              <span className="bg-red-950 border border-red-700 text-red-300 px-2 py-0.5 rounded">
                REJECT
              </span>
              <span className="text-slate-500">/</span>
              <span className="bg-amber-950 border border-amber-700 text-amber-300 px-2 py-0.5 rounded">
                MODIFY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Production Technology Stack Specifications */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <span>Production Stack Architecture Specifications</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
            <strong className="text-cyan-400 block font-mono">1. Optimization Microservice</strong>
            <p className="text-slate-300">
              <span className="text-white font-semibold">Python + FastAPI + Google OR-Tools CP-SAT</span>. Formulates multi-objective MILP / CP problem maximizing priority life-safety fulfillment and minimizing travel distance.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
            <strong className="text-cyan-400 block font-mono">2. Ingestion &amp; Message Bus</strong>
            <p className="text-slate-300">
              <span className="text-white font-semibold">Redis / Kafka Event Streaming</span>. Manages the 120-second rolling batch windows and triggers instant interrupts when CRITICAL priority alerts are received.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5">
            <strong className="text-cyan-400 block font-mono">3. GIS &amp; Command UI</strong>
            <p className="text-slate-300">
              <span className="text-white font-semibold">React + Leaflet + OpenStreetMap</span> with offline tile caching for field resilience during telecommunication outages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
