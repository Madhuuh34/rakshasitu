import React from 'react';
import { useDisaster } from '../context/DisasterContext';
import { parseEmergencyReport } from '../engine/aiParser';
import { calculatePriority } from '../engine/priorityEngine';
import {
  Brain,
  CheckCircle2,
  MapPin,
  AlertOctagon,
  LifeBuoy,
  FileCode,
  Sliders,
  Scale,
  Activity,
  Layers,
} from 'lucide-react';
import { SeverityIndicator } from '../types';

export const IncidentIntelligence: React.FC = () => {
  const { incidents, rawReports, selectedIncidentId, setSelectedIncidentId } = useDisaster();

  const selectedIncident =
    incidents.find((i) => i.incident_id === selectedIncidentId) || incidents[0];

  const matchedRaw = rawReports.find(
    (r) => r.report_id === selectedIncident?.source_report_id
  ) || {
    report_id: selectedIncident?.source_report_id || 'REP-001',
    source_type: 'citizen' as const,
    location_text: selectedIncident?.location_text || '',
    latitude: selectedIncident?.latitude || null,
    longitude: selectedIncident?.longitude || null,
    description: selectedIncident?.description || '',
    affected_people: selectedIncident?.affected_people || null,
    injured_people: selectedIncident?.injured_people || null,
    people_trapped: selectedIncident?.people_trapped ? 'YES' : 'NO',
    medical_emergency: selectedIncident?.medical_emergency ? 'YES' : 'NO',
    submitted_at: selectedIncident?.reported_at || new Date().toISOString(),
  };

  const parsed = parseEmergencyReport(matchedRaw);
  const priorityBreakdown = calculatePriority(parsed);

  const ALL_ALLOWED_SEVERITY_INDICATORS: {
    id: SeverityIndicator;
    label: string;
    points: string;
  }[] = [
    { id: 'people_trapped', label: 'People Trapped / Marooned', points: '+30' },
    { id: 'medical_emergency', label: 'Life-Threatening Medical Emergency', points: '+20' },
    { id: 'injuries_reported', label: 'Injuries / Casualties Reported', points: '+15' },
    { id: 'vulnerable_people_present', label: 'Vulnerable People (Infants / Elderly / Pregnant)', points: '+10' },
    { id: 'large_population_affected', label: 'Large Population Affected (>= 50 citizens)', points: '+10' },
    { id: 'people_isolated', label: 'Community Geographically Isolated', points: '+5' },
    { id: 'residential_area_affected', label: 'Dense Residential Colony / Habitation Impacted', points: '+5' },
    { id: 'rapidly_worsening_condition', label: 'Rapidly Worsening Environmental Conditions', points: '+5' },
    { id: 'building_collapse', label: 'Building / Infrastructure Collapse', points: 'Structure' },
    { id: 'road_blocked', label: 'Arterial Road / Evacuation Route Blocked', points: 'Access' },
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {/* Header & Incident Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Incident Intelligence &amp; AI Understanding
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic extraction, strict structured override rules, Assam coordinate validation, and mathematical priority explainability.
          </p>
        </div>

        {/* Incident Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-slate-400 font-semibold">Select Incident:</span>
          {incidents.map((inc) => {
            const isSelected = inc.incident_id === selectedIncident?.incident_id;
            return (
              <button
                key={inc.incident_id}
                onClick={() => setSelectedIncidentId(inc.incident_id)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{inc.incident_id}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    inc.priority_level === 'CRITICAL'
                      ? 'bg-red-500 animate-pulse'
                      : inc.priority_level === 'HIGH'
                      ? 'bg-orange-500'
                      : inc.priority_level === 'MEDIUM'
                      ? 'bg-yellow-400'
                      : 'bg-blue-500'
                  }`}
                ></span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: 3-column analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Col 1: Raw Report vs Parsed Report (Data Contracts) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-slate-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Data Contract Pipeline
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">Strict Schema</span>
            </div>

            {/* Ingestion Rules Badge */}
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <strong className="text-slate-200 block text-[10px] uppercase tracking-wider">
                System Invariant:
              </strong>
              <p className="text-[10px] leading-relaxed text-slate-400">
                Structured values supplied by the reporter override extracted values.
                Never invent missing values. Unknown values remain null.
              </p>
            </div>

            {/* Raw Report Preview */}
            <div>
              <span className="text-[11px] font-mono font-bold text-slate-300 block mb-1">
                1. raw_report payload
              </span>
              <pre className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto max-h-40">
{JSON.stringify(
  {
    report_id: matchedRaw.report_id,
    source_type: matchedRaw.source_type,
    location_text: matchedRaw.location_text,
    description: matchedRaw.description,
    affected_people: matchedRaw.affected_people,
    injured_people: matchedRaw.injured_people,
    people_trapped: matchedRaw.people_trapped,
    medical_emergency: matchedRaw.medical_emergency,
    submitted_at: matchedRaw.submitted_at,
  },
  null,
  2
)}
              </pre>
            </div>

            {/* Parsed Report Preview */}
            <div>
              <span className="text-[11px] font-mono font-bold text-cyan-300 block mb-1">
                2. parsed_report object
              </span>
              <pre className="bg-slate-950 p-2.5 rounded border border-cyan-900/60 text-[10px] font-mono text-cyan-200/90 overflow-x-auto max-h-48">
{JSON.stringify(
  {
    report_id: parsed.report_id,
    incident_type: parsed.incident_type,
    location_status: parsed.location_status,
    location_source: parsed.location_source,
    latitude: parsed.latitude,
    longitude: parsed.longitude,
    affected_people: parsed.affected_people,
    injured_people: parsed.injured_people,
    people_trapped: parsed.people_trapped,
    trapped_people: parsed.trapped_people,
    medical_emergency: parsed.medical_emergency,
    severity_indicators: parsed.severity_indicators,
  },
  null,
  2
)}
              </pre>
            </div>
          </div>

          {/* Location Intelligence */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Location Engine Validation
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">location_status:</span>
                <span className="font-mono font-bold text-emerald-400 uppercase">
                  {parsed.location_status}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">location_source:</span>
                <span className="font-mono font-bold text-cyan-400 uppercase">
                  {parsed.location_source}
                </span>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
              Coordinates: [{parsed.latitude !== null ? `${parsed.latitude}°N` : 'null'},{' '}
              {parsed.longitude !== null ? `${parsed.longitude}°E` : 'null'}]
            </div>

            <p className="text-[10px] text-slate-500 italic">
              *Prototype geography strictly verifies Assam theater bounds (24.1°N–28.2°N). Coordinates outside Assam are marked out_of_scope. Never fabricates coordinates.
            </p>
          </div>
        </div>

        {/* Col 2: Severity Indicators (10 Allowed Only) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Severity Indicators (10 Allowed)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-amber-300 font-bold">
                {parsed.severity_indicators.length} Active
              </span>
            </div>

            <div className="space-y-1.5">
              {ALL_ALLOWED_SEVERITY_INDICATORS.map((ind) => {
                const isTriggered = parsed.severity_indicators.includes(ind.id);
                return (
                  <div
                    key={ind.id}
                    className={`p-2 rounded border text-xs flex items-center justify-between transition-all ${
                      isTriggered
                        ? 'bg-amber-950/40 border-amber-600/70 text-amber-200'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isTriggered ? 'bg-amber-400' : 'bg-slate-700'
                        }`}
                      ></span>
                      <span className="font-medium text-[11px]">{ind.label}</span>
                    </div>
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900">
                      {ind.points}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generated Resource Requirements */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <LifeBuoy className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Resource Requirements Logic
              </h3>
            </div>

            <p className="text-[11px] text-slate-400">
              Only allowed tactical types: <code className="text-cyan-300">rescue_team</code>, <code className="text-cyan-300">ambulance</code>, <code className="text-cyan-300">boat</code>, <code className="text-cyan-300">medical_team</code>.
            </p>

            <div className="space-y-2">
              {selectedIncident?.resource_requirements.map((req, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs">
                      {req.count}x
                    </span>
                    <div>
                      <span className="font-mono font-bold text-xs text-white uppercase">
                        {req.resource_type}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Criticality: {req.criticality}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] text-cyan-400 font-mono font-semibold">
                    Derived by Rules Engine
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Explainable Priority Math (0-100) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Priority Calculation Math
                </h3>
              </div>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                  selectedIncident?.priority_level === 'CRITICAL'
                    ? 'text-red-400 bg-red-950 border-red-800'
                    : selectedIncident?.priority_level === 'HIGH'
                    ? 'text-orange-400 bg-orange-950 border-orange-800'
                    : 'text-yellow-400 bg-yellow-950 border-yellow-800'
                }`}
              >
                {selectedIncident?.priority_level} ({selectedIncident?.priority_score}/100)
              </span>
            </div>

            {/* Score Breakdown Table */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Additive Factor Breakdown:
              </span>

              {priorityBreakdown.score_breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-start justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-200 block text-[11px]">
                      {item.factor}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.reason}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 text-xs shrink-0 ml-2">
                    +{item.points}
                  </span>
                </div>
              ))}
            </div>

            {/* Score Clamping Equation Box */}
            <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-xs space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Raw Sum:</span>
                <span className="text-white font-bold">
                  {priorityBreakdown.score_breakdown.reduce((acc, curr) => acc + curr.points, 0)} pts
                </span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Clamped to 100 max:</span>
                <span className="text-emerald-400 font-bold">{priorityBreakdown.priority_score} pts</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1 text-slate-300 font-bold text-[11px]">
                <span>Threshold Category:</span>
                <span className="text-cyan-400">{priorityBreakdown.priority_level}</span>
              </div>
            </div>

            {/* Clear Justification Reason list */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Official Priority Reasons:
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                {priorityBreakdown.priority_reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
