import {
  RawReport,
  ParsedReport,
  IncidentType,
  SeverityIndicator,
  LocationStatus,
  LocationSource,
} from '../types';
import { ASSAM_LOCATIONS, isLocationInAssam } from '../data/assamData';

export function parseEmergencyReport(report: RawReport): ParsedReport {
  const text = (report.description + ' ' + report.location_text).toLowerCase();

  // 1. Incident Type Extraction
  let extractedType: IncidentType = 'other';
  if (
    text.includes('flood') ||
    text.includes('inundat') ||
    text.includes('water rise') ||
    text.includes('river overflow') ||
    text.includes('submerged') ||
    text.includes('waterlogging')
  ) {
    extractedType = 'flood';
  } else if (
    text.includes('landslide') ||
    text.includes('mudslide') ||
    text.includes('rockfall') ||
    text.includes('debris flow')
  ) {
    extractedType = 'landslide';
  } else if (
    text.includes('building collapse') ||
    text.includes('structure collapse') ||
    text.includes('wall collapsed') ||
    text.includes('crumbled') ||
    text.includes('roof fell')
  ) {
    extractedType = 'building_collapse';
  } else if (
    text.includes('road block') ||
    text.includes('blocked road') ||
    text.includes('highway cut') ||
    text.includes('traffic blocked') ||
    text.includes('bridge washed away')
  ) {
    extractedType = 'road_blockage';
  } else if (
    text.includes('storm') ||
    text.includes('cyclone') ||
    text.includes('heavy rain') ||
    text.includes('gale') ||
    text.includes('high winds')
  ) {
    extractedType = 'storm';
  }

  // 2. Affected / Injured People Extraction (override from structured report takes precedence)
  let extractedAffected: number | null = null;
  let extractedInjured: number | null = null;
  let extractedTrappedCount: number | null = null;

  // Regex patterns for people counts
  const affectedMatch = text.match(/(\d+)\s*(people|persons|villagers|citizens|residents)?\s*(affected|stranded|homeless|displaced)/i);
  if (affectedMatch && affectedMatch[1]) {
    extractedAffected = parseInt(affectedMatch[1], 10);
  }

  const injuredMatch = text.match(/(\d+)\s*(people|persons|individuals)?\s*(injured|hurt|wounded|casualties)/i);
  if (injuredMatch && injuredMatch[1]) {
    extractedInjured = parseInt(injuredMatch[1], 10);
  }

  const trappedMatch = text.match(/(\d+)\s*(people|persons|villagers|citizens)?\s*(trapped|marooned|surrounded by water|stuck)/i);
  if (trappedMatch && trappedMatch[1]) {
    extractedTrappedCount = parseInt(trappedMatch[1], 10);
  }

  // 3. Structured Values Override (reporter supplied values strictly take priority)
  const finalAffected = report.affected_people !== null ? report.affected_people : extractedAffected;
  const finalInjured = report.injured_people !== null ? report.injured_people : extractedInjured;

  let finalPeopleTrapped: boolean | null = null;
  if (report.people_trapped === 'YES') {
    finalPeopleTrapped = true;
  } else if (report.people_trapped === 'NO') {
    finalPeopleTrapped = false;
  } else {
    // If don't know, check if description mentions trapped
    if (
      text.includes('trapped') ||
      text.includes('marooned') ||
      text.includes('stuck on roof') ||
      text.includes('surrounded by water') ||
      text.includes('under debris') ||
      extractedTrappedCount !== null
    ) {
      finalPeopleTrapped = true;
    } else {
      finalPeopleTrapped = null; // Never invent missing values
    }
  }

  let finalMedicalEmergency: boolean | null = null;
  if (report.medical_emergency === 'YES') {
    finalMedicalEmergency = true;
  } else if (report.medical_emergency === 'NO') {
    finalMedicalEmergency = false;
  } else {
    if (
      text.includes('medical emergency') ||
      text.includes('critical patient') ||
      text.includes('bleeding') ||
      text.includes('oxygen needed') ||
      text.includes('ambulance needed') ||
      (finalInjured !== null && finalInjured > 0)
    ) {
      finalMedicalEmergency = true;
    } else {
      finalMedicalEmergency = null;
    }
  }

  // Vulnerable people check
  let vulnerablePeople: boolean | null = null;
  if (
    text.includes('children') ||
    text.includes('child') ||
    text.includes('elderly') ||
    text.includes('senior') ||
    text.includes('pregnant') ||
    text.includes('infant') ||
    text.includes('disabled')
  ) {
    vulnerablePeople = true;
  }

  // 4. Severity Indicators (Allowed 10 only)
  const severityIndicators: SeverityIndicator[] = [];

  if (finalPeopleTrapped === true) {
    severityIndicators.push('people_trapped');
  }
  if (finalInjured !== null && finalInjured > 0) {
    severityIndicators.push('injuries_reported');
  }
  if (finalMedicalEmergency === true) {
    severityIndicators.push('medical_emergency');
  }
  if (vulnerablePeople === true) {
    severityIndicators.push('vulnerable_people_present');
  }
  if (finalAffected !== null && finalAffected >= 50) {
    severityIndicators.push('large_population_affected');
  }
  if (
    text.includes('road blocked') ||
    text.includes('highway blocked') ||
    text.includes('bridge cut') ||
    text.includes('access cut') ||
    extractedType === 'road_blockage'
  ) {
    severityIndicators.push('road_blocked');
  }
  if (
    text.includes('isolated') ||
    text.includes('cut off') ||
    text.includes('marooned island') ||
    text.includes('remote')
  ) {
    severityIndicators.push('people_isolated');
  }
  if (
    extractedType === 'building_collapse' ||
    text.includes('collapse') ||
    text.includes('rubble')
  ) {
    severityIndicators.push('building_collapse');
  }
  if (
    text.includes('residential') ||
    text.includes('colony') ||
    text.includes('village center') ||
    text.includes('homes') ||
    text.includes('housing')
  ) {
    severityIndicators.push('residential_area_affected');
  }
  if (
    text.includes('rapidly worsening') ||
    text.includes('water level rising fast') ||
    text.includes('currents strong') ||
    text.includes('spreading') ||
    text.includes('emergency escalation') ||
    text.includes('immediate')
  ) {
    severityIndicators.push('rapidly_worsening_condition');
  }

  // 5. Location Resolution
  let resolvedLat: number | null = report.latitude;
  let resolvedLng: number | null = report.longitude;
  let locationSource: LocationSource = 'unresolved';
  let locationStatus: LocationStatus = 'unresolved';

  if (resolvedLat !== null && resolvedLng !== null) {
    locationSource = 'device_gps';
    if (isLocationInAssam(resolvedLat, resolvedLng)) {
      locationStatus = 'resolved';
    } else {
      locationStatus = 'out_of_scope';
    }
  } else {
    // Try to geocode from Assam locations
    const locText = report.location_text.toLowerCase();
    const matchedLoc = ASSAM_LOCATIONS.find(
      (loc) =>
        locText.includes(loc.name.toLowerCase()) ||
        locText.includes(loc.district.toLowerCase())
    );

    if (matchedLoc) {
      resolvedLat = matchedLoc.latitude;
      resolvedLng = matchedLoc.longitude;
      locationSource = 'geocoded';
      locationStatus = 'resolved';
    } else {
      // Check if user entered an outside city
      if (
        locText.includes('delhi') ||
        locText.includes('mumbai') ||
        locText.includes('bangalore') ||
        locText.includes('kolkata') ||
        locText.includes('chennai')
      ) {
        locationSource = 'geocoded';
        locationStatus = 'out_of_scope';
      } else {
        // Unresolved location: never fabricate coordinates!
        resolvedLat = null;
        resolvedLng = null;
        locationSource = 'unresolved';
        locationStatus = 'unresolved';
      }
    }
  }

  return {
    report_id: report.report_id,
    source_type: report.source_type,
    description: report.description,
    incident_type: extractedType,
    location_text: report.location_text,
    latitude: resolvedLat,
    longitude: resolvedLng,
    location_status: locationStatus,
    location_source: locationSource,
    affected_people: finalAffected,
    injured_people: finalInjured,
    people_trapped: finalPeopleTrapped,
    trapped_people: extractedTrappedCount,
    medical_emergency: finalMedicalEmergency,
    vulnerable_people: vulnerablePeople,
    severity_indicators: severityIndicators,
    submitted_at: report.submitted_at,
  };
}
