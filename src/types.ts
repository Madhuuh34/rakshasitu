export type SeverityIndicator =
  | 'people_trapped'
  | 'injuries_reported'
  | 'medical_emergency'
  | 'vulnerable_people_present'
  | 'large_population_affected'
  | 'road_blocked'
  | 'people_isolated'
  | 'building_collapse'
  | 'residential_area_affected'
  | 'rapidly_worsening_condition';

export type IncidentType =
  | 'flood'
  | 'landslide'
  | 'road_blockage'
  | 'building_collapse'
  | 'storm'
  | 'other';

export type ResourceType =
  | 'rescue_team'
  | 'ambulance'
  | 'boat'
  | 'medical_team';

export type LocationStatus = 'resolved' | 'unresolved' | 'out_of_scope';
export type LocationSource = 'device_gps' | 'geocoded' | 'unresolved';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus =
  | 'pending_batch'
  | 'in_batch'
  | 'optimized'
  | 'response_assigned'
  | 'resolved';

export interface RawReport {
  report_id: string;
  source_type: 'citizen' | 'sos' | 'authority';
  location_text: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  affected_people: number | null;
  injured_people: number | null;
  people_trapped: 'YES' | 'NO' | 'DONT_KNOW';
  medical_emergency: 'YES' | 'NO' | 'DONT_KNOW';
  submitted_at: string;
}

export interface ParsedReport {
  report_id: string;
  source_type: 'citizen' | 'sos' | 'authority';
  description: string;
  incident_type: IncidentType;
  location_text: string;
  latitude: number | null;
  longitude: number | null;
  location_status: LocationStatus;
  location_source: LocationSource;
  affected_people: number | null;
  injured_people: number | null;
  people_trapped: boolean | null;
  trapped_people: number | null;
  medical_emergency: boolean | null;
  vulnerable_people: boolean | null;
  severity_indicators: SeverityIndicator[];
  submitted_at: string;
}

export interface ResourceRequirement {
  resource_type: ResourceType;
  count: number;
  criticality: 'essential' | 'support';
}

export interface Incident {
  incident_id: string;
  source_report_id: string;
  incident_type: IncidentType;
  description: string;
  location_text: string;
  latitude: number | null;
  longitude: number | null;
  affected_people: number | null;
  injured_people: number | null;
  people_trapped: boolean | null;
  trapped_people: number | null;
  medical_emergency: boolean | null;
  vulnerable_people: boolean | null;
  severity_indicators: SeverityIndicator[];
  priority_score: number; // 0 - 100
  priority_level: PriorityLevel;
  priority_reasons: string[];
  resource_requirements: ResourceRequirement[];
  allocation_eligible: boolean;
  incident_status: IncidentStatus;
  reported_at: string;
  created_at: string;
}

export type ResourceAvailability = 'available' | 'assigned' | 'deployed' | 'maintenance';

export interface Resource {
  resource_id: string;
  name: string;
  resource_type: ResourceType;
  capabilities: string[];
  latitude: number;
  longitude: number;
  base_station_name: string;
  availability: ResourceAvailability;
  current_status: string;
  assigned_incident_id?: string | null;
}

export type AllocationStatus = 'ALLOCATED' | 'PARTIALLY ALLOCATED' | 'UNMET';

export interface IncidentAllocation {
  incident_id: string;
  incident_title: string;
  location_text: string;
  priority_score: number;
  priority_level: PriorityLevel;
  status: AllocationStatus;
  required: ResourceRequirement[];
  allocated_resource_ids: string[];
  allocated_resources: {
    resource_id: string;
    resource_type: ResourceType;
    name: string;
    distance_km: number;
  }[];
  unmet_requirements: {
    resource_type: ResourceType;
    count: number;
  }[];
  justification: string;
}

export interface OptimizationPlan {
  plan_id: string;
  created_at: string;
  batch_id: string;
  incidents_considered: number;
  allocations: IncidentAllocation[];
  scarce_resources_resolved: {
    resource_type: ResourceType;
    demand: number;
    supply: number;
    resolution_rationale: string;
  }[];
  status: 'AWAITING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'MODIFIED';
  approved_by?: string;
  decision_notes?: string;
  decided_at?: string;
  is_manual_override?: boolean;
}

export interface AuditEvent {
  event_id: string;
  timestamp: string;
  stage:
    | 'Report received'
    | 'Report validated'
    | 'AI understanding completed'
    | 'Location resolved'
    | 'Priority calculated'
    | 'Resource requirements generated'
    | 'Incident added to batch'
    | 'Joint optimization executed'
    | 'Response plan generated'
    | 'Authority decision'
    | 'Resources deployed'
    | 'Manual override';
  incident_id?: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface TraditionalAllocationComparison {
  traditional: {
    allocations: {
      incident_id: string;
      resource_id: string;
      distance_km: number;
    }[];
    lives_at_risk_unmet: number;
    critical_incidents_starved: number;
    rationale: string;
  };
  rakshasetu: {
    allocations: {
      incident_id: string;
      resource_id: string;
      distance_km: number;
    }[];
    lives_at_risk_unmet: number;
    critical_incidents_starved: number;
    rationale: string;
  };
}
