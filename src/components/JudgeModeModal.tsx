import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  LifeBuoy,
  Shield,
  Cpu,
  UserCheck,
  Scale,
  RefreshCw,
} from 'lucide-react';

export const JudgeModeModal: React.FC = () => {
  const {
    judgeModeOpen,
    setJudgeModeOpen,
    loadScenario,
    runOptimization,
    approvePlan,
    currentPlan,
    setActiveTab,
  } = useDisaster();

  const [step, setStep] = useState(1);

  if (!judgeModeOpen) return null;

  const totalSteps = 6;

  const handleNext = () => {
    if (step === 1) {
      // Ensure Scenario 2 (conflict benchmark) is loaded
      loadScenario(2);
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      runOptimization();
      setStep(4);
    } else if (step === 4) {
      setStep(5);
    } else if (step === 5) {
      setStep(6);
    } else if (step === 6) {
      approvePlan('SIH26206 Evaluation Authority', 'Demonstration approved.');
      setJudgeModeOpen(false);
      setActiveTab('command_center');
    }
  };

  const handleReset = () => {
    loadScenario(2);
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl shadow-amber-950/40 flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white tracking-wide flex items-center gap-2">
                <span>JUDGE MODE — 2-MINUTE CORE DEMO FLOW</span>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded">
                  SIH26206
                </span>
              </h2>
              <span className="text-[11px] text-slate-400">
                Step {step} of {totalSteps}: Rapid Walkthrough of RakshaSetu's Core Innovation
              </span>
            </div>
          </div>

          <button
            onClick={() => setJudgeModeOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-800 w-full">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* STEP 1: Multiple Incidents */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span>STAGE 1</span>
                <span>•</span>
                <span>CONCURRENT DISASTER ARRIVAL</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Multiple Disasters Strike Simultaneously in Assam
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                During monsoon surges, multiple severe incidents occur within minutes of each other across Assam districts:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded border border-red-900/60 space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span className="text-red-400">Incident I001 (Dibrugarh)</span>
                    <span className="bg-red-950 text-red-300 px-1.5 py-0.5 rounded text-[10px]">
                      HIGH / CRITICAL
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Embankment breach: 35 villagers trapped on roof, 3 injured with medical emergency.
                  </p>
                  <div className="text-[10px] text-cyan-400 pt-1 border-t border-slate-800">
                    Requires: 1x Boat + 1x Rescue Team + 1x Ambulance
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-amber-900/60 space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span className="text-amber-400">Incident I002 (Dhemaji)</span>
                    <span className="bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded text-[10px]">
                      HIGH
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Flash flood waterlogging: 40 villagers cut off by surrounding water.
                  </p>
                  <div className="text-[10px] text-cyan-400 pt-1 border-t border-slate-800">
                    Requires: 1x Boat + 1x Rescue Team
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400">
                Notice: Both disasters urgently demand a high-capacity motorized evacuation boat.
              </div>
            </div>
          )}

          {/* STEP 2: Limited Resources (The Conflict) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span>STAGE 2</span>
                <span>•</span>
                <span>SEVERE RESOURCE SCARCITY</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Resource Scarcity: Only ONE Suitable Boat is Available
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                In real emergency theaters, state resources are strictly finite. In this theater sector:
              </p>

              <div className="p-4 bg-amber-950/30 border border-amber-800/80 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono font-bold text-amber-300">
                    <LifeBuoy className="w-5 h-5 text-amber-400" />
                    <span>Boat Demand: 2 Units Required</span>
                  </div>
                  <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded font-mono text-xs font-bold">
                    DEFICIT: 1 UNIT
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-slate-950 rounded border border-emerald-800 text-emerald-300">
                    ✓ BT-01 Zodiac Boat: AVAILABLE
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-500 line-through">
                    ✗ BT-02 Boat: IN MAINTENANCE
                  </div>
                </div>

                <p className="text-[11px] text-amber-200">
                  <strong>The Dilemma:</strong> Traditional dispatch assigns BT-01 greedily to whoever calls first or is closest. If I002 was slightly closer, I002 would hoard the boat, leaving I001's drowning patients to perish!
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Priority Scoring */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span>STAGE 3</span>
                <span>•</span>
                <span>EXPLAINABLE PRIORITY SCORING</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Deterministic Mathematical Prioritization (0–100)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                RakshaSetu evaluates both incidents using standard, transparent life-safety weights:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded border border-cyan-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Incident I001</span>
                    <span className="text-lg font-extrabold text-red-400">88 PTS</span>
                  </div>
                  <div className="text-[11px] space-y-1 text-slate-300">
                    <div>• People Trapped: +30</div>
                    <div>• Medical Emergency: +20</div>
                    <div>• 3 Injured Casualties: +15</div>
                    <div>• Vulnerable Citizens: +10</div>
                    <div>• Large Population (35+): +10</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Incident I002</span>
                    <span className="text-lg font-extrabold text-amber-400">76 PTS</span>
                  </div>
                  <div className="text-[11px] space-y-1 text-slate-300">
                    <div>• People Trapped: +30</div>
                    <div>• People Isolated: +5</div>
                    <div>• Residential Area: +5</div>
                    <div>• No Active Casualties: 0</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400">
                Incidents are queued into the 120s batch window for joint global optimization.
              </div>
            </div>
          )}

          {/* STEP 4: Joint Optimization Execution */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span>STAGE 4</span>
                <span>•</span>
                <span>GLOBAL JOINT SOLVER EXECUTION</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                All Incidents Considered Together Simultaneously
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Instead of treating each incident in isolation, the optimization engine considers all active emergencies, available assets, Haversine travel distances, and life-safety priority:
              </p>

              <div className="p-4 bg-slate-950 rounded-lg border border-cyan-800 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-cyan-300 font-bold border-b border-slate-800 pb-2">
                  <span>Joint Solver Algorithm</span>
                  <span>GLOBAL OBJECTIVE MAXIMUM</span>
                </div>
                <div className="text-slate-300 space-y-1 text-[11px]">
                  <div>1. Identified deficit of 1 Boat between I001 (P:88) and I002 (P:76).</div>
                  <div>2. Awarded BT-01 Boat to I001 to resolve active life-critical threat.</div>
                  <div>3. Matched nearest available Rescue Teams (RT-01, RT-02) and ALS Ambulance (AMB-01).</div>
                  <div>4. Generated structured response plan awaiting Human Authority decision.</div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Allocation Decisions & WHY (Unmet Requirement) */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span>STAGE 5</span>
                <span>•</span>
                <span>EXPLAINABLE ALLOCATION &amp; UNMET STATUS</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Clear Allocation Outcome + The "WHY"
              </h3>

              <div className="space-y-3 text-xs font-mono">
                {/* I001 */}
                <div className="p-3 bg-slate-950 rounded border border-emerald-800 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-white">I001 (Dibrugarh - Priority 88)</span>
                    <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                      ALLOCATED
                    </span>
                  </div>
                  <div className="text-emerald-300 text-[11px]">
                    ✓ BT-01 Boat &nbsp; ✓ RT-01 Rescue Team &nbsp; ✓ AMB-01 Ambulance
                  </div>
                </div>

                {/* I002 */}
                <div className="p-3 bg-slate-950 rounded border border-amber-800 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-white">I002 (Dhemaji - Priority 76)</span>
                    <span className="text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                      PARTIALLY ALLOCATED
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px]">
                    ✓ RT-02 Rescue Team &nbsp; <span className="text-red-400 font-bold">⚠ Boat UNMET</span>
                  </div>

                  <div className="p-2.5 rounded bg-amber-950/40 border border-amber-800/60 font-sans text-amber-200 text-xs mt-1">
                    <strong>Why Boat was Assigned to I001:</strong>
                    <p className="mt-1 leading-relaxed">
                      "Only one suitable boat was available and I001 had higher priority (88 vs 76) because people were trapped and an active medical emergency with 3 casualties was reported."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Human Authority Approval */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                <span>STAGE 6</span>
                <span>•</span>
                <span>HUMAN AUTHORITY SOVEREIGN APPROVAL</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Human Authority Approval Before Deployment
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                RakshaSetu strictly forbids autonomous AI deployment. The Recommended Response Plan must be formally authorized:
              </p>

              <div className="p-4 bg-emerald-950/30 border-2 border-emerald-600 rounded-lg space-y-3 text-center">
                <Shield className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-white text-sm">
                  Plan {currentPlan?.plan_id || 'PLAN-01'} Awaiting Authority Decision
                </div>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Clicking "Authorize Deployment" will dispatch the assets, mark resources as <strong className="text-emerald-400">DEPLOYED</strong>, and record the signature in the immutable audit log.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Controls */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restart Demo</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Previous
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-950 cursor-pointer"
            >
              <span>{step === totalSteps ? 'Authorize & Deploy' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
