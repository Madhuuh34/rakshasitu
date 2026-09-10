import { ParsedReport, PriorityLevel } from '../types';

export interface PriorityEvaluation {
  priority_score: number; // 0 - 100
  priority_level: PriorityLevel;
  priority_reasons: string[];
  score_breakdown: { factor: string; points: number; reason: string }[];
}

export function calculatePriority(report: ParsedReport): PriorityEvaluation {
  let score = 0;
  const reasons: string[] = [];
  const breakdown: { factor: string; points: number; reason: string }[] = [];

  // 1. people trapped +30
  if (report.people_trapped === true || (report.trapped_people !== null && report.trapped_people > 0)) {
    score += 30;
    const msg = report.trapped_people
      ? `People trapped in distress (${report.trapped_people} reported)`
      : 'People trapped in distress';
    reasons.push(msg);
    breakdown.push({ factor: 'People Trapped', points: 30, reason: msg });
  }

  // 2. medical emergency +20
  if (report.medical_emergency === true) {
    score += 20;
    reasons.push('Active medical emergency requiring urgent intervention');
    breakdown.push({
      factor: 'Medical Emergency',
      points: 20,
      reason: 'Life-critical trauma / medical assistance needed',
    });
  }

  // 3. injuries +15
  if (report.injured_people !== null && report.injured_people > 0) {
    score += 15;
    const msg = `${report.injured_people} casualties/injured individuals reported`;
    reasons.push(msg);
    breakdown.push({ factor: 'Injuries Reported', points: 15, reason: msg });
  }

  // 4. vulnerable people +10
  if (report.vulnerable_people === true || report.severity_indicators.includes('vulnerable_people_present')) {
    score += 10;
    reasons.push('Vulnerable demographics present (elderly, infants, pregnant)');
    breakdown.push({
      factor: 'Vulnerable People',
      points: 10,
      reason: 'Infants, elderly, or disabled citizens at scene',
    });
  }

  // 5. large population affected +10
  if (
    (report.affected_people !== null && report.affected_people >= 50) ||
    report.severity_indicators.includes('large_population_affected')
  ) {
    score += 10;
    reasons.push(`Large population affected (${report.affected_people || '50+'} citizens)`);
    breakdown.push({
      factor: 'Large Population Affected',
      points: 10,
      reason: 'Impact zone exceeds 50+ displaced or stranded citizens',
    });
  }

  // 6. people isolated +5
  if (report.severity_indicators.includes('people_isolated')) {
    score += 5;
    reasons.push('Community geographically isolated and cut off from supplies');
    breakdown.push({
      factor: 'People Isolated',
      points: 5,
      reason: 'Access routes severed; marooned pockets',
    });
  }

  // 7. residential area affected +5
  if (report.severity_indicators.includes('residential_area_affected')) {
    score += 5;
    reasons.push('Dense residential colony / village habitation impacted');
    breakdown.push({
      factor: 'Residential Area Affected',
      points: 5,
      reason: 'Habitation density increases potential hazard exposure',
    });
  }

  // 8. rapidly worsening condition +5
  if (report.severity_indicators.includes('rapidly_worsening_condition')) {
    score += 5;
    reasons.push('Hazard escalation: rapidly worsening environmental conditions');
    breakdown.push({
      factor: 'Rapidly Worsening Condition',
      points: 5,
      reason: 'Water discharge increasing or ongoing collapse risks',
    });
  }

  // Baseline minimum score if any disaster is validated
  if (score === 0) {
    score = 15;
    reasons.push('Standard active incident report verified');
    breakdown.push({
      factor: 'Base Incident Verification',
      points: 15,
      reason: 'Verified citizen report in disaster zone',
    });
  }

  // Clamp score to 100
  const finalScore = Math.min(100, score);

  // Priority classification:
  // 90–100 = CRITICAL
  // 70–89 = HIGH
  // 40–69 = MEDIUM
  // 0–39 = LOW
  let level: PriorityLevel = 'LOW';
  if (finalScore >= 90) {
    level = 'CRITICAL';
  } else if (finalScore >= 70) {
    level = 'HIGH';
  } else if (finalScore >= 40) {
    level = 'MEDIUM';
  } else {
    level = 'LOW';
  }

  return {
    priority_score: finalScore,
    priority_level: level,
    priority_reasons: reasons,
    score_breakdown: breakdown,
  };
}
