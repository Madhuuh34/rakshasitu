import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Incident,
  RawReport,
  Resource,
  OptimizationPlan,
  TraditionalAllocationComparison,
  AuditEvent,
} from '../types';
import { getScenario1Data, getScenario2Data, getScenario3InitialData, CRITICAL_INTERRUPTION_INCIDENT, createIncidentFromRawReport } from '../data/seedData';
import { parseEmergencyReport } from '../engine/aiParser';
import { calculatePriority } from '../engine/priorityEngine';
import { generateResourceRequirements } from '../engine/requirementEngine';
import { runJointOptimization } from '../engine/optimizer';

interface DisasterContextType {
  incidents: Incident[];
  rawReports: RawReport[];
  resources: Resource[];
  currentPlan: OptimizationPlan | null;
  comparisonData: TraditionalAllocationComparison | null;
  auditEvents: AuditEvent[];
  batchSecondsRemaining: number;
  batchAlertMessage: string | null;
  activeTab: string;
  selectedIncidentId: string | null;
  judgeModeOpen: boolean;
  isProcessingNewReport: boolean;
  pipelineStep: number; // 0 to 7
  setActiveTab: (tab: string) => void;
  setSelectedIncidentId: (id: string | null) => void;
  setJudgeModeOpen: (open: boolean) => void;
  submitEmergencyReport: (raw: RawReport) => Promise<string>;
  runOptimization: () => void;
  approvePlan: (authorityName: string, notes?: string) => void;
  rejectPlan: (reason: string) => void;
  modifyPlanAllocation: (incidentId: string, resourceId: string, action: 'add' | 'remove') => void;
  loadScenario: (scenarioNumber: 1 | 2 | 3) => void;
  triggerCriticalInterruption: () => void;
  resetBatchTimer: () => void;
  addAuditEvent: (stage: AuditEvent['stage'], details: string, incident_id?: string) => void;
}

const DisasterContext = createContext<DisasterContextType | undefined>(undefined);

export const DisasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with Scenario 1
  const initial = getScenario1Data();

  const [incidents, setIncidents] = useState<Incident[]>(initial.incidents);
  const [rawReports, setRawReports] = useState<RawReport[]>(initial.rawReports);
  const [resources, setResources] = useState<Resource[]>(initial.resources);
  const [currentPlan, setCurrentPlan] = useState<OptimizationPlan | null>(null);
  const [comparisonData, setComparisonData] = useState<TraditionalAllocationComparison | null>(null);
  const [batchSecondsRemaining, setBatchSecondsRemaining] = useState<number>(84);
  const [batchAlertMessage, setBatchAlertMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('command_center');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(initial.incidents[0]?.incident_id || null);
  const [judgeModeOpen, setJudgeModeOpen] = useState<boolean>(false);
  const [isProcessingNewReport, setIsProcessingNewReport] = useState<boolean>(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);

  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([
    {
      event_id: 'AUD-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
      stage: 'Report received',
      incident_id: 'I001',
      details: 'Incoming citizen report from Dibrugarh Riverfront. Embankment failure alert.',
    },
    {
      event_id: 'AUD-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      stage: 'Report validated',
      incident_id: 'I001',
      details: 'Payload structure validated. Geocoded coordinates resolved to Dibrugarh District, Assam.',
    },
    {
      event_id: 'AUD-003',
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      stage: 'AI understanding completed',
      incident_id: 'I001',
      details: 'Extracted incident_type: flood. Severity indicators: [people_trapped, injuries_reported, medical_emergency].',
    },
    {
      event_id: 'AUD-004',
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      stage: 'Priority calculated',
      incident_id: 'I001',
      details: 'Priority score computed: 88 (CRITICAL/HIGH threshold). Trapped villagers + Medical emergency.',
    },
    {
      event_id: 'AUD-005',
      timestamp: new Date(Date.now() - 1000 * 60 * 13).toISOString(),
      stage: 'Resource requirements generated',
      incident_id: 'I001',
      details: 'Requirement set: 1x boat (essential), 1x rescue_team (essential), 1x ambulance (essential).',
    },
    {
      event_id: 'AUD-006',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      stage: 'Incident added to batch',
      incident_id: 'I001',
      details: 'Enqueued into regional optimization batch window #BATCH-0922.',
    },
  ]);

  const addAuditEvent = useCallback(
    (stage: AuditEvent['stage'], details: string, incident_id?: string) => {
      const newEvent: AuditEvent = {
        event_id: 'AUD-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        timestamp: new Date().toISOString(),
        stage,
        details,
        incident_id,
      };
      setAuditEvents((prev) => [newEvent, ...prev]);
    },
    []
  );

  // Batch window countdown timer (120s loop)
  useEffect(() => {
    const timer = setInterval(() => {
      setBatchSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 120; // reset window
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const resetBatchTimer = useCallback(() => {
    setBatchSecondsRemaining(120);
    setBatchAlertMessage(null);
  }, []);

  // Run Joint Optimization
  const runOptimization = useCallback(() => {
    const { plan, comparison } = runJointOptimization(incidents, resources);
    setCurrentPlan(plan);
    setComparisonData(comparison);

    addAuditEvent(
      'Joint optimization executed',
      `Joint optimization evaluated ${plan.incidents_considered} incident(s) simultaneously. Identified ${plan.scarce_resources_resolved.length} resource deficit(s).`
    );
    addAuditEvent(
      'Response plan generated',
      `Response Plan ${plan.plan_id} generated. Awaiting human authority decision.`
    );
  }, [incidents, resources, addAuditEvent]);

  // Initial optimization on mount
  useEffect(() => {
    if (!currentPlan && incidents.length > 0) {
      const { plan, comparison } = runJointOptimization(incidents, resources);
      setCurrentPlan(plan);
      setComparisonData(comparison);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Approve Response Plan
  const approvePlan = useCallback(
    (authorityName: string, notes?: string) => {
      if (!currentPlan) return;

      const updatedPlan: OptimizationPlan = {
        ...currentPlan,
        status: 'APPROVED',
        approved_by: authorityName || 'District Disaster Management Authority (DDMA)',
        decided_at: new Date().toISOString(),
        decision_notes: notes || 'Authorized for immediate multi-agency deployment.',
      };

      setCurrentPlan(updatedPlan);

      // Deploy allocated resources
      const deployedIds = new Set<string>();
      updatedPlan.allocations.forEach((alloc) => {
        alloc.allocated_resource_ids.forEach((id) => deployedIds.add(id));
      });

      setResources((prev) =>
        prev.map((r) => {
          if (deployedIds.has(r.resource_id)) {
            return {
              ...r,
              availability: 'deployed',
              current_status: `Deployed to ${updatedPlan.allocations.find((a) => a.allocated_resource_ids.includes(r.resource_id))?.location_text || 'emergency site'}`,
            };
          }
          return r;
        })
      );

      // Update incident statuses
      setIncidents((prev) =>
        prev.map((inc) => {
          const alloc = updatedPlan.allocations.find((a) => a.incident_id === inc.incident_id);
          if (alloc && alloc.allocated_resource_ids.length > 0) {
            return {
              ...inc,
              incident_status: 'response_assigned',
            };
          }
          return inc;
        })
      );

      addAuditEvent(
        'Authority decision',
        `Response plan approved by ${authorityName || 'DDMA Controller'}. Notes: ${notes || 'Authorized.'}`
      );
      addAuditEvent(
        'Resources deployed',
        `Dispatched ${deployedIds.size} tactical resources across assigned Assam incident sectors.`
      );
    },
    [currentPlan, addAuditEvent]
  );

  // Reject Response Plan
  const rejectPlan = useCallback(
    (reason: string) => {
      if (!currentPlan) return;

      const updatedPlan: OptimizationPlan = {
        ...currentPlan,
        status: 'REJECTED',
        decided_at: new Date().toISOString(),
        decision_notes: reason,
      };
      setCurrentPlan(updatedPlan);

      addAuditEvent(
        'Authority decision',
        `Response plan REJECTED by authority. Reason: ${reason}`
      );
    },
    [currentPlan, addAuditEvent]
  );

  // Modify Plan Allocation (Manual Override)
  const modifyPlanAllocation = useCallback(
    (incidentId: string, resourceId: string, action: 'add' | 'remove') => {
      if (!currentPlan) return;

      const updatedAllocations = currentPlan.allocations.map((alloc) => {
        if (alloc.incident_id === incidentId) {
          if (action === 'add') {
            const resObj = resources.find((r) => r.resource_id === resourceId);
            if (!resObj) return alloc;

            const newAllocatedIds = [...new Set([...alloc.allocated_resource_ids, resourceId])];
            const newAllocatedResources = [
              ...alloc.allocated_resources.filter((r) => r.resource_id !== resourceId),
              {
                resource_id: resObj.resource_id,
                resource_type: resObj.resource_type,
                name: resObj.name,
                distance_km: 12.4, // estimated override
              },
            ];

            const unmet = alloc.unmet_requirements
              .map((u) => {
                if (u.resource_type === resObj.resource_type) {
                  return { ...u, count: Math.max(0, u.count - 1) };
                }
                return u;
              })
              .filter((u) => u.count > 0);

            return {
              ...alloc,
              allocated_resource_ids: newAllocatedIds,
              allocated_resources: newAllocatedResources,
              unmet_requirements: unmet,
              status: unmet.length === 0 ? ('ALLOCATED' as const) : ('PARTIALLY ALLOCATED' as const),
              justification: `[MANUAL OVERRIDE DETECTED] Authority reassigned ${resObj.resource_id} (${resObj.name}) directly to this incident.`,
            };
          } else {
            // Remove
            const newAllocatedIds = alloc.allocated_resource_ids.filter((id) => id !== resourceId);
            const newAllocatedResources = alloc.allocated_resources.filter(
              (r) => r.resource_id !== resourceId
            );
            return {
              ...alloc,
              allocated_resource_ids: newAllocatedIds,
              allocated_resources: newAllocatedResources,
              status: newAllocatedIds.length === 0 ? ('UNMET' as const) : ('PARTIALLY ALLOCATED' as const),
              justification: `[MANUAL OVERRIDE DETECTED] Authority manually revoked asset ${resourceId} from this sector.`,
            };
          }
        }
        return alloc;
      });

      const modifiedPlan: OptimizationPlan = {
        ...currentPlan,
        allocations: updatedAllocations,
        status: 'MODIFIED',
        is_manual_override: true,
      };

      setCurrentPlan(modifiedPlan);
      addAuditEvent(
        'Manual override',
        `Authority performed manual override on plan: ${action.toUpperCase()} resource ${resourceId} for incident ${incidentId}.`,
        incidentId
      );
    },
    [currentPlan, resources, addAuditEvent]
  );

  // Submit Emergency Report with simulated 8-stage pipeline
  const submitEmergencyReport = useCallback(
    async (raw: RawReport): Promise<string> => {
      setIsProcessingNewReport(true);
      setPipelineStep(0); // 0: REPORT RECEIVED

      // Step 1: Validating
      await new Promise((r) => setTimeout(r, 450));
      setPipelineStep(1);

      // Step 2: AI Understanding
      await new Promise((r) => setTimeout(r, 550));
      setPipelineStep(2);
      const parsed = parseEmergencyReport(raw);

      // Step 3: Location Resolution
      await new Promise((r) => setTimeout(r, 400));
      setPipelineStep(3);

      // Step 4: Severity Analysis
      await new Promise((r) => setTimeout(r, 450));
      setPipelineStep(4);

      // Step 5: Priority Calculation
      await new Promise((r) => setTimeout(r, 450));
      setPipelineStep(5);
      const priority = calculatePriority(parsed);

      // Step 6: Resource Requirement
      await new Promise((r) => setTimeout(r, 450));
      setPipelineStep(6);
      const reqs = generateResourceRequirements(parsed);

      // Step 7: Optimization Batch
      await new Promise((r) => setTimeout(r, 450));
      setPipelineStep(7);

      const newIncidentId = 'I00' + (incidents.length + 1);
      const newIncident: Incident = {
        incident_id: newIncidentId,
        source_report_id: raw.report_id,
        incident_type: parsed.incident_type,
        description: parsed.description,
        location_text: parsed.location_text,
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        affected_people: parsed.affected_people,
        injured_people: parsed.injured_people,
        people_trapped: parsed.people_trapped,
        trapped_people: parsed.trapped_people,
        medical_emergency: parsed.medical_emergency,
        vulnerable_people: parsed.vulnerable_people,
        severity_indicators: parsed.severity_indicators,
        priority_score: priority.priority_score,
        priority_level: priority.priority_level,
        priority_reasons: priority.priority_reasons,
        resource_requirements: reqs,
        allocation_eligible: parsed.location_status === 'resolved',
        incident_status: 'in_batch',
        reported_at: raw.submitted_at,
        created_at: new Date().toISOString(),
      };

      setRawReports((prev) => [raw, ...prev]);
      setIncidents((prev) => [newIncident, ...prev]);
      setSelectedIncidentId(newIncidentId);

      addAuditEvent('Report received', `Citizen report ${raw.report_id} received from ${raw.location_text}`, newIncidentId);
      addAuditEvent('Report validated', `Integrity check passed. Location: ${parsed.location_status} (${parsed.location_source})`, newIncidentId);
      addAuditEvent('AI understanding completed', `Identified ${parsed.incident_type} with ${parsed.severity_indicators.length} indicators`, newIncidentId);
      addAuditEvent('Location resolved', `Coordinates mapped to [${parsed.latitude}, ${parsed.longitude}] (${parsed.location_text})`, newIncidentId);
      addAuditEvent('Priority calculated', `Computed score: ${priority.priority_score} (${priority.priority_level})`, newIncidentId);
      addAuditEvent('Resource requirements generated', `Generated requirements: ${reqs.map((r) => `${r.count}x ${r.resource_type}`).join(', ')}`, newIncidentId);
      addAuditEvent('Incident added to batch', `Enqueued to current 120s optimization window`, newIncidentId);

      // Check if CRITICAL: If so, trigger early release!
      if (priority.priority_level === 'CRITICAL') {
        setBatchAlertMessage('CRITICAL INCIDENT DETECTED — BATCH RELEASED EARLY');
        setBatchSecondsRemaining(0);
        addAuditEvent('Joint optimization executed', `BATCH RELEASED EARLY due to critical incoming incident ${newIncidentId}.`);
      }

      // Re-run optimization with new incident included
      setTimeout(() => {
        setIsProcessingNewReport(false);
      }, 500);

      return newIncidentId;
    },
    [incidents, addAuditEvent]
  );

  // Load Scenarios
  const loadScenario = useCallback((scenarioNumber: 1 | 2 | 3) => {
    setBatchAlertMessage(null);
    if (scenarioNumber === 1) {
      const data = getScenario1Data();
      setIncidents(data.incidents);
      setRawReports(data.rawReports);
      setResources(data.resources);
      const { plan, comparison } = runJointOptimization(data.incidents, data.resources);
      setCurrentPlan(plan);
      setComparisonData(comparison);
      setSelectedIncidentId('I001');
      setBatchSecondsRemaining(95);
    } else if (scenarioNumber === 2) {
      const data = getScenario2Data();
      setIncidents(data.incidents);
      setRawReports(data.rawReports);
      setResources(data.resources);
      const { plan, comparison } = runJointOptimization(data.incidents, data.resources);
      setCurrentPlan(plan);
      setComparisonData(comparison);
      setSelectedIncidentId('I001');
      setBatchSecondsRemaining(70);
    } else if (scenarioNumber === 3) {
      const data = getScenario3InitialData();
      setIncidents(data.incidents);
      setRawReports(data.rawReports);
      setResources(data.resources);
      const { plan, comparison } = runJointOptimization(data.incidents, data.resources);
      setCurrentPlan(plan);
      setComparisonData(comparison);
      setSelectedIncidentId('I001');
      setBatchSecondsRemaining(60);
    }
  }, []);

  // Trigger Critical Interruption for Scenario 3
  const triggerCriticalInterruption = useCallback(() => {
    const raw = CRITICAL_INTERRUPTION_INCIDENT.raw;
    const critIncident = createIncidentFromRawReport(raw, 'I003');
    critIncident.priority_score = 96;
    critIncident.priority_level = 'CRITICAL';
    critIncident.priority_reasons = [
      'Rapid dyke failure with 40 people trapped in fast currents',
      'Active medical emergency with 5 casualties requiring immediate resuscitation',
      'Infants and elderly marooned without refuge',
    ];
    critIncident.resource_requirements = [
      { resource_type: 'boat', count: 1, criticality: 'essential' },
      { resource_type: 'rescue_team', count: 1, criticality: 'essential' },
      { resource_type: 'ambulance', count: 1, criticality: 'essential' },
    ];

    setBatchAlertMessage('CRITICAL INCIDENT DETECTED — BATCH RELEASED EARLY');
    setBatchSecondsRemaining(0);

    const updatedIncidents = [critIncident, ...incidents.filter((i) => i.incident_id !== 'I003')];
    setIncidents(updatedIncidents);
    setSelectedIncidentId('I003');

    addAuditEvent(
      'Report received',
      `CRITICAL SOS received from Dibrugarh Brahmaputra Embankment. Threat to life imminent!`,
      'I003'
    );
    addAuditEvent(
      'Joint optimization executed',
      `CRITICAL INCIDENT DETECTED — 120s Batch window interrupted and released early for urgent solver execution.`,
      'I003'
    );

    const { plan, comparison } = runJointOptimization(updatedIncidents, resources);
    setCurrentPlan(plan);
    setComparisonData(comparison);
  }, [incidents, resources, addAuditEvent]);

  return (
    <DisasterContext.Provider
      value={{
        incidents,
        rawReports,
        resources,
        currentPlan,
        comparisonData,
        auditEvents,
        batchSecondsRemaining,
        batchAlertMessage,
        activeTab,
        selectedIncidentId,
        judgeModeOpen,
        isProcessingNewReport,
        pipelineStep,
        setActiveTab,
        setSelectedIncidentId,
        setJudgeModeOpen,
        submitEmergencyReport,
        runOptimization,
        approvePlan,
        rejectPlan,
        modifyPlanAllocation,
        loadScenario,
        triggerCriticalInterruption,
        resetBatchTimer,
        addAuditEvent,
      }}
    >
      {children}
    </DisasterContext.Provider>
  );
};

export const useDisaster = () => {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisaster must be used within a DisasterProvider');
  }
  return context;
};
