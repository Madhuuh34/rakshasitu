import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import {
  CheckCircle2,
  XCircle,
  Edit3,
  ShieldCheck,
  AlertTriangle,
  Send,
  UserCheck,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const ResponseApproval: React.FC = () => {
  const {
    currentPlan,
    resources,
    incidents,
    approvePlan,
    rejectPlan,
    modifyPlanAllocation,
    setActiveTab,
  } = useDisaster();

  const [authorityName, setAuthorityName] = useState('DDMA Commander (Assam Zone)');
  const [approvalNotes, setApprovalNotes] = useState('Verified against field telemetry. Approved for rapid multi-agency dispatch.');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);

  // Modification target selection
  const [selectedIncidentForMod, setSelectedIncidentForMod] = useState<string>('');
  const [selectedResourceForMod, setSelectedResourceForMod] = useState<string>('');
  const [modAction, setModAction] = useState<'add' | 'remove'>('add');

  const isApproved = currentPlan?.status === 'APPROVED';
  const isRejected = currentPlan?.status === 'REJECTED';
  const isModified = currentPlan?.status === 'MODIFIED' || currentPlan?.is_manual_override;

  const handleApprove = () => {
    approvePlan(authorityName, approvalNotes);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) return;
    rejectPlan(rejectReason);
    setShowRejectModal(false);
  };

  const handleApplyModify = () => {
    if (!selectedIncidentForMod || !selectedResourceForMod) return;
    modifyPlanAllocation(selectedIncidentForMod, selectedResourceForMod, modAction);
    setShowModifyModal(false);
  };

  if (!currentPlan) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-white">No Active Response Plan Generated</h2>
        <p className="text-xs text-slate-400">
          Run the Joint Optimization solver from the Command Center or Resources tab to generate an authority decision plan.
        </p>
        <button
          onClick={() => setActiveTab('resources')}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded text-xs transition-colors cursor-pointer"
        >
          Go to Optimization Engine
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      {/* Top Authority Alert Box */}
      <div
        className={`p-4 rounded-lg border flex flex-wrap items-center justify-between gap-4 ${
          isApproved
            ? 'bg-emerald-950/40 border-emerald-700/80 text-emerald-300'
            : isRejected
            ? 'bg-red-950/40 border-red-700/80 text-red-300'
            : 'bg-amber-950/40 border-amber-600/80 text-amber-200 animate-pulse'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-950/80 border border-current flex items-center justify-center font-bold">
            {isApproved ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            ) : isRejected ? (
              <XCircle className="w-6 h-6 text-red-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold block opacity-80">
              HUMAN AUTHORITY IN THE LOOP PROTOCOL
            </span>
            <h1 className="text-base font-extrabold text-white">
              {isApproved
                ? 'RESPONSE PLAN APPROVED & RESOURCES DEPLOYED'
                : isRejected
                ? 'RESPONSE PLAN REJECTED BY AUTHORITY'
                : 'RESPONSE PLAN AWAITING AUTHORITY DECISION'}
            </h1>
          </div>
        </div>

        {isModified && (
          <div className="bg-red-600 text-white font-mono font-bold text-xs px-3 py-1 rounded shadow animate-bounce flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>MANUAL OVERRIDE DETECTED</span>
          </div>
        )}
      </div>

      {/* Plan Details & Review Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white">
              Response Plan: {currentPlan.plan_id} (Batch {currentPlan.batch_id})
            </h2>
            <p className="text-xs text-slate-400">
              Evaluated {currentPlan.allocations.length} disaster incident sectors in Assam.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Status:{' '}
            <strong
              className={`font-bold ${
                isApproved ? 'text-emerald-400' : isRejected ? 'text-red-400' : 'text-amber-400'
              }`}
            >
              {currentPlan.status}
            </strong>
          </div>
        </div>

        {/* Action Button Bar */}
        {!isApproved && !isRejected && (
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Authorizing Officer / Authority:</label>
                <input
                  type="text"
                  value={authorityName}
                  onChange={(e) => setAuthorityName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Decision Operational Notes:</label>
                <input
                  type="text"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="approve-plan-btn"
                onClick={handleApprove}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-2.5 px-4 rounded shadow-lg shadow-emerald-950 text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>APPROVE RESPONSE PLAN</span>
              </button>

              <button
                onClick={() => setShowModifyModal(true)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-semibold py-2.5 px-4 rounded text-xs transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>MODIFY PLAN</span>
              </button>

              <button
                onClick={() => setShowRejectModal(true)}
                className="flex items-center gap-1.5 bg-red-950/60 hover:bg-red-900/60 border border-red-800 text-red-300 font-semibold py-2.5 px-4 rounded text-xs transition-colors cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>REJECT</span>
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Banner when approved */}
        {isApproved && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-700/60 rounded-lg text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Response Plan Authorized &amp; Deployed</span>
            </div>
            <p className="text-slate-300">
              Resources transitioned to <strong className="text-emerald-400">DEPLOYED</strong>. Incidents transitioned to <strong className="text-emerald-400">RESPONSE_ASSIGNED</strong>. Dispatched under operational authority of <strong>{currentPlan.approved_by}</strong> at {new Date(currentPlan.decided_at || '').toLocaleTimeString()}.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => setActiveTab('command_center')}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <span>View Real-Time Tactical Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className="text-slate-400 hover:text-slate-200 font-semibold flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <span>View Full Audit Trail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Allocation Verification List */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Sector Dispatch Matrix Awaiting Execution:
          </h3>

          <div className="space-y-2">
            {currentPlan.allocations.map((alloc) => (
              <div
                key={alloc.incident_id}
                className="p-3 bg-slate-950 rounded border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{alloc.incident_id}</span>
                    <span className="font-semibold text-slate-200">{alloc.location_text}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      (Priority {alloc.priority_score} - {alloc.priority_level})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {alloc.justification}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">Assigned:</span>
                  {alloc.allocated_resources.length > 0 ? (
                    alloc.allocated_resources.map((r, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono font-bold text-[11px]"
                      >
                        {r.resource_id} ({r.distance_km}km)
                      </span>
                    ))
                  ) : (
                    <span className="text-red-400 font-mono font-bold">NONE (DEFICIT)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <XCircle className="w-5 h-5" />
              <span>Reject Response Plan</span>
            </div>
            <p className="text-xs text-slate-300">
              Authority protocol requires a documented reason for rejecting the optimization response plan. This will be logged in the permanent audit trail.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g. Ground communication established; local SDRF boat already on scene..."
              className="w-full bg-slate-950 border border-slate-700 rounded p-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                disabled={!rejectReason.trim()}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold rounded text-xs cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modify Plan Modal (Manual Override) */}
      {showModifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Edit3 className="w-5 h-5" />
              <span>Manual Resource Reassignment</span>
            </div>
            <p className="text-xs text-slate-300">
              Perform direct authority override. The system will track this modification and badge it as{' '}
              <span className="font-mono text-red-400 font-bold">MANUAL OVERRIDE DETECTED</span>.
            </p>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Target Incident:</label>
                <select
                  value={selectedIncidentForMod}
                  onChange={(e) => setSelectedIncidentForMod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none"
                >
                  <option value="">Select Incident...</option>
                  {incidents.map((i) => (
                    <option key={i.incident_id} value={i.incident_id}>
                      {i.incident_id} - {i.location_text} ({i.priority_score} pts)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Resource Asset:</label>
                <select
                  value={selectedResourceForMod}
                  onChange={(e) => setSelectedResourceForMod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono text-xs focus:outline-none"
                >
                  <option value="">Select Resource...</option>
                  {resources.map((r) => (
                    <option key={r.resource_id} value={r.resource_id}>
                      {r.resource_id} - {r.name} ({r.resource_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Action:</label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="modAction"
                      value="add"
                      checked={modAction === 'add'}
                      onChange={() => setModAction('add')}
                    />
                    <span>Force Assign Asset</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="modAction"
                      value="remove"
                      checked={modAction === 'remove'}
                      onChange={() => setModAction('remove')}
                    />
                    <span>Remove Asset</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModifyModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyModify}
                disabled={!selectedIncidentForMod || !selectedResourceForMod}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded text-xs cursor-pointer"
              >
                Apply Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
