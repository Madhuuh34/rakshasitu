import { ParsedReport, ResourceRequirement } from '../types';

export function generateResourceRequirements(report: ParsedReport): ResourceRequirement[] {
  const requirements: ResourceRequirement[] = [];

  const isFlood = report.incident_type === 'flood';
  const hasTrapped =
    report.people_trapped === true ||
    (report.trapped_people !== null && report.trapped_people > 0) ||
    report.severity_indicators.includes('people_trapped');

  const hasInjuriesOrMedical =
    report.medical_emergency === true ||
    (report.injured_people !== null && report.injured_people > 0) ||
    report.severity_indicators.includes('injuries_reported') ||
    report.severity_indicators.includes('medical_emergency');

  // Rule 1: Flood + trapped people -> rescue_team + boat
  if (isFlood && hasTrapped) {
    requirements.push({
      resource_type: 'boat',
      count: 1,
      criticality: 'essential',
    });
    requirements.push({
      resource_type: 'rescue_team',
      count: 1,
      criticality: 'essential',
    });
  } else if (isFlood) {
    // Flood without confirmed trapped: still needs boat or rescue team
    requirements.push({
      resource_type: 'boat',
      count: 1,
      criticality: 'essential',
    });
  }

  // Rule 2: Injuries / medical emergency -> ambulance + medical_team
  if (hasInjuriesOrMedical) {
    requirements.push({
      resource_type: 'ambulance',
      count: 1,
      criticality: 'essential',
    });
    requirements.push({
      resource_type: 'medical_team',
      count: 1,
      criticality: 'support',
    });
  }

  // Rule 3: Building collapse or landslide without flood
  if (!isFlood && (report.incident_type === 'building_collapse' || report.incident_type === 'landslide')) {
    if (!requirements.some((r) => r.resource_type === 'rescue_team')) {
      requirements.push({
        resource_type: 'rescue_team',
        count: 1,
        criticality: 'essential',
      });
    }
  }

  // Rule 4: Road blockage
  if (report.incident_type === 'road_blockage') {
    if (!requirements.some((r) => r.resource_type === 'rescue_team')) {
      requirements.push({
        resource_type: 'rescue_team',
        count: 1,
        criticality: 'essential',
      });
    }
  }

  // Fallback: If no requirement was derived, assign a rescue team
  if (requirements.length === 0) {
    requirements.push({
      resource_type: 'rescue_team',
      count: 1,
      criticality: 'essential',
    });
  }

  return requirements;
}
