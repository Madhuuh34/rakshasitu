import { Resource } from '../types';

export interface AssamLocation {
  name: string;
  district: string;
  latitude: number;
  longitude: number;
  description: string;
}

export const ASSAM_LOCATIONS: AssamLocation[] = [
  {
    name: 'Dibrugarh',
    district: 'Dibrugarh',
    latitude: 27.4728,
    longitude: 94.912,
    description: 'Brahmaputra riverbank, upper Assam flood zone',
  },
  {
    name: 'Dhemaji',
    district: 'Dhemaji',
    latitude: 27.4833,
    longitude: 94.5833,
    description: 'Severe flood-prone alluvial plain north of Brahmaputra',
  },
  {
    name: 'Tinsukia',
    district: 'Tinsukia',
    latitude: 27.4922,
    longitude: 95.3468,
    description: 'Eastern corridor, vulnerable to landslides and flash floods',
  },
  {
    name: 'Guwahati',
    district: 'Kamrup Metropolitan',
    latitude: 26.1445,
    longitude: 91.7362,
    description: 'State operational headquarters, GMCH medical hub',
  },
  {
    name: 'Jorhat',
    district: 'Jorhat',
    latitude: 26.7509,
    longitude: 94.2037,
    description: 'Central Assam logistics staging ground & NDRF station',
  },
  {
    name: 'Sivasagar',
    district: 'Sivasagar',
    latitude: 26.9826,
    longitude: 94.6425,
    description: 'Dikhow river basin, heavy monsoonal waterlogging',
  },
];

// Assam boundary coordinates check
export const ASSAM_BOUNDS = {
  minLat: 24.1,
  maxLat: 28.2,
  minLng: 89.7,
  maxLng: 96.1,
};

export function isLocationInAssam(lat: number, lng: number): boolean {
  return (
    lat >= ASSAM_BOUNDS.minLat &&
    lat <= ASSAM_BOUNDS.maxLat &&
    lng >= ASSAM_BOUNDS.minLng &&
    lng <= ASSAM_BOUNDS.maxLng
  );
}

// Initial realistic disaster management resources for the Assam theater
export const INITIAL_RESOURCES: Resource[] = [
  {
    resource_id: 'RT-01',
    name: 'SDRF Alpha Rescue Battalion',
    resource_type: 'rescue_team',
    capabilities: ['flood_evacuation', 'debris_clearing', 'ropes_search'],
    latitude: 27.476,
    longitude: 94.908,
    base_station_name: 'Dibrugarh Fire & Emergency Base',
    availability: 'available',
    current_status: 'Ready at staging ground',
  },
  {
    resource_id: 'RT-02',
    name: 'NDRF 1st Bn Team Bravo',
    resource_type: 'rescue_team',
    capabilities: ['collapsed_structure_search', 'heavy_machinery', 'water_rescue'],
    latitude: 26.754,
    longitude: 94.21,
    base_station_name: 'Jorhat NDRF Forward Base',
    availability: 'available',
    current_status: 'Standby for deployment',
  },
  {
    resource_id: 'BT-01',
    name: 'Brahmaputra Motorized Zodiac Boat 01',
    resource_type: 'boat',
    capabilities: ['high_capacity_rescue', 'shallow_draft_navigation', 'medical_carry'],
    latitude: 27.468,
    longitude: 94.895,
    base_station_name: 'Dibrugarh Brahmaputra Ghat Depot',
    availability: 'available',
    current_status: 'Docked, engine primed',
  },
  {
    resource_id: 'BT-02',
    name: 'Dikhow River Rapid Evacuation Boat 02',
    resource_type: 'boat',
    capabilities: ['shallow_water', 'night_search_floodlight'],
    latitude: 26.985,
    longitude: 94.638,
    base_station_name: 'Sivasagar Marine Station',
    availability: 'available',
    current_status: 'On standby for rapid launch',
  },
  {
    resource_id: 'AMB-01',
    name: 'ALS Trauma Ambulance 108-A',
    resource_type: 'ambulance',
    capabilities: ['advance_life_support', 'ventilator', 'paramedic_crew'],
    latitude: 27.48,
    longitude: 94.92,
    base_station_name: 'Assam Medical College Hospital Dibrugarh',
    availability: 'available',
    current_status: 'Stationed at AMC Emergency Bay',
  },
  {
    resource_id: 'AMB-02',
    name: 'ALS Trauma Ambulance 108-B',
    resource_type: 'ambulance',
    capabilities: ['life_support', 'oxygen_multi_patient', 'ecg_telemetry'],
    latitude: 27.488,
    longitude: 94.575,
    base_station_name: 'Dhemaji Civil Hospital Depot',
    availability: 'available',
    current_status: 'Available on emergency apron',
  },
  {
    resource_id: 'MT-01',
    name: 'Assam Rapid Trauma Medical Team',
    resource_type: 'medical_team',
    capabilities: ['triage', 'emergency_surgery_stabilization', 'mass_casualty_kit'],
    latitude: 27.474,
    longitude: 94.915,
    base_station_name: 'Dibrugarh District Disaster Health Center',
    availability: 'available',
    current_status: 'Surge team ready with portable kits',
  },
];

// Calculate Haversine distance in kilometers
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
