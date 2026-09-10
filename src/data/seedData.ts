import { Incident, RawReport, Resource } from '../types';
import { parseEmergencyReport } from '../engine/aiParser';
import { calculatePriority } from '../engine/priorityEngine';
import { generateResourceRequirements } from '../engine/requirementEngine';
import { INITIAL_RESOURCES } from './assamData';

// Helper to convert RawReport into Incident through the exact pipeline
export function createIncidentFromRawReport(
  raw: RawReport,
  customId?: string
): Incident {
  const parsed = parseEmergencyReport(raw);
  const priority = calculatePriority(parsed);
  const reqs = generateResourceRequirements(parsed);

  return {
    incident_id: customId || `INC-${Date.now().toString().slice(-4)}`,
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
}

// Default Scenario 1: Flood Cluster (Dibrugarh, Dhemaji, Tinsukia)
export function getScenario1Data(): {
  incidents: Incident[];
  rawReports: RawReport[];
  resources: Resource[];
} {
  const raw1: RawReport = {
    report_id: 'REP-001',
    source_type: 'citizen',
    location_text: 'Dibrugarh Brahmaputra Riverfront Ward 4',
    latitude: 27.4728,
    longitude: 94.912,
    description:
      'Severe embankment breach near Ward 4. Water rising rapidly. 30 villagers trapped on school roof, 2 elderly severely injured needing critical medical support.',
    affected_people: 45,
    injured_people: 2,
    people_trapped: 'YES',
    medical_emergency: 'YES',
    submitted_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  };

  const raw2: RawReport = {
    report_id: 'REP-002',
    source_type: 'citizen',
    location_text: 'Dhemaji Alluvial Lowlands',
    latitude: 27.4833,
    longitude: 94.5833,
    description:
      'Flash flooding in Dhemaji fields. 60 residents affected, connecting culvert collapsed leaving families isolated without food or drinking water.',
    affected_people: 60,
    injured_people: 0,
    people_trapped: 'NO',
    medical_emergency: 'NO',
    submitted_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  };

  const raw3: RawReport = {
    report_id: 'REP-003',
    source_type: 'citizen',
    location_text: 'Tinsukia National Highway Corridor',
    latitude: 27.4922,
    longitude: 95.3468,
    description:
      'Heavy mud and tree fall blocking the main arterial highway. 20 commuters stranded in vehicles. Road completely blocked.',
    affected_people: 20,
    injured_people: 0,
    people_trapped: 'NO',
    medical_emergency: 'NO',
    submitted_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  };

  const inc1 = createIncidentFromRawReport(raw1, 'I001');
  // Fine-tune priority score to reflect high severity
  inc1.priority_score = 88;
  inc1.priority_level = 'HIGH'; // or CRITICAL depending on breakdown
  if (inc1.priority_score >= 90) inc1.priority_level = 'CRITICAL';
  else inc1.priority_level = 'HIGH';

  const inc2 = createIncidentFromRawReport(raw2, 'I002');
  inc2.priority_score = 55;
  inc2.priority_level = 'MEDIUM';

  const inc3 = createIncidentFromRawReport(raw3, 'I003');
  inc3.priority_score = 35;
  inc3.priority_level = 'LOW';

  return {
    incidents: [inc1, inc2, inc3],
    rawReports: [raw1, raw2, raw3],
    resources: INITIAL_RESOURCES.map((r) => ({ ...r })),
  };
}

// Scenario 2: Resource Conflict (Two floods competing for ONE scarce boat)
export function getScenario2Data(): {
  incidents: Incident[];
  rawReports: RawReport[];
  resources: Resource[];
} {
  const raw1: RawReport = {
    report_id: 'REP-201',
    source_type: 'citizen',
    location_text: 'Dibrugarh Brahmaputra Lowland Colony',
    latitude: 27.4728,
    longitude: 94.912,
    description:
      'Catastrophic river surge. 35 people trapped on rooftops, elderly patients requiring immediate resuscitation and medical emergency evacuation.',
    affected_people: 50,
    injured_people: 3,
    people_trapped: 'YES',
    medical_emergency: 'YES',
    submitted_at: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  };

  const raw2: RawReport = {
    report_id: 'REP-202',
    source_type: 'citizen',
    location_text: 'Dhemaji Submerged Agricultural Ward',
    latitude: 27.4833,
    longitude: 94.5833,
    description:
      'Intense waterlogging in residential settlement. 40 villagers cut off by surrounding water. Evacuation boat urgently requested before nightfall.',
    affected_people: 40,
    injured_people: 0,
    people_trapped: 'YES',
    medical_emergency: 'NO',
    submitted_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  };

  const inc1 = createIncidentFromRawReport(raw1, 'I001');
  inc1.priority_score = 88;
  inc1.priority_level = 'HIGH';
  inc1.priority_reasons = [
    '35 People trapped in rising water',
    'Active medical emergency with 3 casualties',
    'Vulnerable elderly patients requiring life support',
  ];
  inc1.resource_requirements = [
    { resource_type: 'boat', count: 1, criticality: 'essential' },
    { resource_type: 'rescue_team', count: 1, criticality: 'essential' },
    { resource_type: 'ambulance', count: 1, criticality: 'essential' },
  ];

  const inc2 = createIncidentFromRawReport(raw2, 'I002');
  inc2.priority_score = 76;
  inc2.priority_level = 'HIGH';
  inc2.priority_reasons = [
    'People trapped in floodwater',
    'People isolated without access road',
    'Residential area affected',
  ];
  inc2.resource_requirements = [
    { resource_type: 'boat', count: 1, criticality: 'essential' },
    { resource_type: 'rescue_team', count: 1, criticality: 'essential' },
  ];

  // Restrict boat inventory so there is strictly ONLY ONE suitable boat available
  const scarceResources: Resource[] = INITIAL_RESOURCES.map((r) => {
    if (r.resource_id === 'BT-02') {
      return { ...r, availability: 'maintenance', current_status: 'Routine engine overhaul' };
    }
    return { ...r, availability: 'available', current_status: 'Ready at station' };
  });

  return {
    incidents: [inc1, inc2],
    rawReports: [raw1, raw2],
    resources: scarceResources,
  };
}

// Scenario 3: Critical Interruption (I001 HIGH, I002 MEDIUM, then I003 CRITICAL arrives and breaks the batch)
export function getScenario3InitialData(): {
  incidents: Incident[];
  rawReports: RawReport[];
  resources: Resource[];
} {
  const raw1: RawReport = {
    report_id: 'REP-301',
    source_type: 'citizen',
    location_text: 'Jorhat Industrial Zone',
    latitude: 26.7509,
    longitude: 94.2037,
    description: 'Submerged warehouse district, 30 workers trapped in flooded compound.',
    affected_people: 30,
    injured_people: 0,
    people_trapped: 'YES',
    medical_emergency: 'NO',
    submitted_at: new Date(Date.now() - 1000 * 45).toISOString(),
  };

  const raw2: RawReport = {
    report_id: 'REP-302',
    source_type: 'citizen',
    location_text: 'Sivasagar Town Periphery',
    latitude: 26.9826,
    longitude: 94.6425,
    description: 'Culvert blockage and minor flooding affecting 25 shopkeepers.',
    affected_people: 25,
    injured_people: 0,
    people_trapped: 'NO',
    medical_emergency: 'NO',
    submitted_at: new Date(Date.now() - 1000 * 20).toISOString(),
  };

  const inc1 = createIncidentFromRawReport(raw1, 'I001');
  inc1.priority_score = 72;
  inc1.priority_level = 'HIGH';

  const inc2 = createIncidentFromRawReport(raw2, 'I002');
  inc2.priority_score = 45;
  inc2.priority_level = 'MEDIUM';

  return {
    incidents: [inc1, inc2],
    rawReports: [raw1, raw2],
    resources: INITIAL_RESOURCES.map((r) => ({ ...r })),
  };
}

export const CRITICAL_INTERRUPTION_INCIDENT: { raw: RawReport; customId: string } = {
  raw: {
    report_id: 'REP-303-CRIT',
    source_type: 'sos',
    location_text: 'Dibrugarh Brahmaputra Embankment Breach',
    latitude: 27.4728,
    longitude: 94.912,
    description:
      'URGENT SOS: Massive dyke collapse! 40 villagers and children trapped in fast swirling currents, 5 injured, immediate resuscitation and life support ambulance required!',
    affected_people: 80,
    injured_people: 5,
    people_trapped: 'YES',
    medical_emergency: 'YES',
    submitted_at: new Date().toISOString(),
  },
  customId: 'I003',
};
