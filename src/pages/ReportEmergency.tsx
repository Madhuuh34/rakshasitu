import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import { RawReport } from '../types';
import { ASSAM_LOCATIONS } from '../data/assamData';
import {
  ShieldAlert,
  MapPin,
  Compass,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Send,
  Users,
  HeartPulse,
  Info,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const ReportEmergency: React.FC = () => {
  const { submitEmergencyReport, isProcessingNewReport, pipelineStep, setActiveTab } = useDisaster();

  // Form states
  const [locationText, setLocationText] = useState('');
  const [selectedAssamPreset, setSelectedAssamPreset] = useState('');
  const [deviceCoords, setDeviceCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('idle');

  const [description, setDescription] = useState('');
  const [affectedPeople, setAffectedPeople] = useState<string>('');
  const [injuredPeople, setInjuredPeople] = useState<string>('');
  const [peopleTrapped, setPeopleTrapped] = useState<'YES' | 'NO' | 'DONT_KNOW'>('DONT_KNOW');
  const [medicalEmergency, setMedicalEmergency] = useState<'YES' | 'NO' | 'DONT_KNOW'>('DONT_KNOW');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  // Use My Current Location (Geolocation API)
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setValidationError('Geolocation API is not supported on this browser.');
      return;
    }

    setGpsStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDeviceCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGpsStatus('success');
        setLocationText(`GPS [${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E]`);
        setValidationError(null);
      },
      (err) => {
        console.warn('Geolocation error, falling back to Assam default:', err);
        setGpsStatus('error');
        // If simulated or permission denied, offer Assam preset
        setLocationText('Dibrugarh Brahmaputra Lowlands');
        setDeviceCoords({ lat: 27.4728, lng: 94.912 });
      }
    );
  };

  const handleSelectAssamLocation = (name: string) => {
    setSelectedAssamPreset(name);
    const found = ASSAM_LOCATIONS.find((l) => l.name === name);
    if (found) {
      setLocationText(`${found.name}, ${found.district} District, Assam`);
      setDeviceCoords({ lat: found.latitude, lng: found.longitude });
    }
  };

  // Quick preset loader
  const handleLoadPreset = (type: 'flood_trapped' | 'landslide_block' | 'medical_surge') => {
    if (type === 'flood_trapped') {
      handleSelectAssamLocation('Dibrugarh');
      setDescription(
        'Severe flood surge breached protective bund! 25 villagers trapped on temple roof surrounded by 6-foot water. 3 elderly citizens require immediate medical care and oxygen.'
      );
      setAffectedPeople('40');
      setInjuredPeople('3');
      setPeopleTrapped('YES');
      setMedicalEmergency('YES');
    } else if (type === 'landslide_block') {
      handleSelectAssamLocation('Tinsukia');
      setDescription(
        'Massive mudslide occurred across the hill highway. 15 vehicles stranded, road completely blocked with heavy boulders and fallen pine trees.'
      );
      setAffectedPeople('25');
      setInjuredPeople('0');
      setPeopleTrapped('NO');
      setMedicalEmergency('NO');
    } else if (type === 'medical_surge') {
      handleSelectAssamLocation('Dhemaji');
      setDescription(
        'Sudden flash flood in alluvial settlement. Families isolated on embankments, 4 patients injured from floating debris with severe lacerations.'
      );
      setAffectedPeople('50');
      setInjuredPeople('4');
      setPeopleTrapped('YES');
      setMedicalEmergency('YES');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate inputs
    if (!locationText.trim()) {
      setValidationError('Please specify an emergency location or use current location.');
      return;
    }

    if (!description.trim() || description.trim().length < 15) {
      setValidationError('Please provide a detailed emergency description (at least 15 characters).');
      return;
    }

    const rawReport: RawReport = {
      report_id: 'REP-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      source_type: 'citizen',
      location_text: locationText.trim(),
      latitude: deviceCoords ? deviceCoords.lat : null,
      longitude: deviceCoords ? deviceCoords.lng : null,
      description: description.trim(),
      affected_people: affectedPeople ? parseInt(affectedPeople, 10) : null,
      injured_people: injuredPeople ? parseInt(injuredPeople, 10) : null,
      people_trapped: peopleTrapped,
      medical_emergency: medicalEmergency,
      submitted_at: new Date().toISOString(),
    };

    const newId = await submitEmergencyReport(rawReport);
    setLastSubmittedId(newId);
  };

  // Pipeline stages definition
  const pipelineStages = [
    { label: 'REPORT RECEIVED', desc: 'Secure intake via citizen channel' },
    { label: 'VALIDATING', desc: 'Schema integrity & verification' },
    { label: 'AI UNDERSTANDING', desc: 'Type & severity extraction' },
    { label: 'LOCATION RESOLUTION', desc: 'Assam coordinate & scope resolution' },
    { label: 'SEVERITY ANALYSIS', desc: '10-factor hazard matrix check' },
    { label: 'PRIORITY CALCULATION', desc: 'Deterministic 0-100 explainable score' },
    { label: 'RESOURCE REQUIREMENT', desc: 'Life-safety asset demand generated' },
    { label: 'OPTIMIZATION BATCH', desc: 'Enqueued into 120s joint solver window' },
  ];

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            <h1 className="text-xl font-bold text-white tracking-wide">Report Emergency Incident</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Citizen &amp; Ground Responder Disaster Intake Portal. Automated AI extraction and joint allocation routing.
          </p>
        </div>

        {/* Quick Demo Presets */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Auto-Fill Scenarios:
          </span>
          <button
            type="button"
            onClick={() => handleLoadPreset('flood_trapped')}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-300 px-2.5 py-1 rounded border border-slate-700 transition-colors text-[11px] cursor-pointer"
          >
            Flood + Trapped
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('landslide_block')}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded border border-slate-700 transition-colors text-[11px] cursor-pointer"
          >
            Landslide Highway
          </button>
          <button
            type="button"
            onClick={() => handleLoadPreset('medical_surge')}
            className="bg-slate-800 hover:bg-slate-700 text-rose-300 px-2.5 py-1 rounded border border-slate-700 transition-colors text-[11px] cursor-pointer"
          >
            Casualties Surge
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-lg p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {validationError && (
              <div className="bg-red-950/80 border border-red-700 text-red-300 px-3 py-2 rounded text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Location Input Section */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Incident Location (Assam Prototype Theater)
                </span>
                <span className="text-[11px] text-slate-500 font-normal">Geocoded or GPS</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="e.g. Dibrugarh Brahmaputra Lowlands or Dhemaji Village"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                />

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-cyan-400 px-3 py-2 rounded text-xs font-medium transition-colors shrink-0 cursor-pointer"
                  title="Acquire device latitude and longitude"
                >
                  <Compass className={`w-3.5 h-3.5 ${gpsStatus === 'locating' ? 'animate-spin' : ''}`} />
                  <span>{gpsStatus === 'locating' ? 'Acquiring...' : 'Use My GPS'}</span>
                </button>
              </div>

              {/* Quick Assam Location Selector */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500">Quick Assam Nodes:</span>
                {ASSAM_LOCATIONS.map((loc) => (
                  <button
                    type="button"
                    key={loc.name}
                    onClick={() => handleSelectAssamLocation(loc.name)}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      selectedAssamPreset === loc.name
                        ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {loc.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Description of Emergency &amp; Immediate Threats</span>
                <span className="text-[11px] text-slate-500">AI parser extracts incident type &amp; severity</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe current situation, water level, structural damage, isolated populations, or urgent needs..."
                className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Structured Quantities: Affected & Injured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Estimated Affected Citizens</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={affectedPeople}
                  onChange={(e) => setAffectedPeople(e.target.value)}
                  placeholder="e.g. 35"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                  <span>Injured / Casualties</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={injuredPeople}
                  onChange={(e) => setInjuredPeople(e.target.value)}
                  placeholder="e.g. 2"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {/* Radio Matrix: People Trapped & Medical Emergency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-200 block">
                  People Trapped / Marooned?
                </span>
                <div className="flex items-center gap-3 text-xs">
                  {(['YES', 'NO', 'DONT_KNOW'] as const).map((opt) => (
                    <label key={opt} className="flex items-center gap-1 text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="people_trapped"
                        value={opt}
                        checked={peopleTrapped === opt}
                        onChange={() => setPeopleTrapped(opt)}
                        className="text-cyan-500"
                      />
                      <span>{opt === 'DONT_KNOW' ? "DON'T KNOW" : opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-200 block">
                  Life-Threatening Medical Emergency?
                </span>
                <div className="flex items-center gap-3 text-xs">
                  {(['YES', 'NO', 'DONT_KNOW'] as const).map((opt) => (
                    <label key={opt} className="flex items-center gap-1 text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="medical_emergency"
                        value={opt}
                        checked={medicalEmergency === opt}
                        onChange={() => setMedicalEmergency(opt)}
                        className="text-red-500"
                      />
                      <span>{opt === 'DONT_KNOW' ? "DON'T KNOW" : opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Note on automated fields */}
            <div className="p-2.5 bg-slate-950/60 rounded border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Automated System Metadata:</strong> Generates unique <code className="text-cyan-300 font-mono">report_id</code>, sets <code className="text-cyan-300 font-mono">source_type = citizen</code>, and stamps UTC submission timestamp. No manual lat/long input required.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessingNewReport}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded shadow-lg shadow-red-950 transition-all cursor-pointer text-xs uppercase tracking-wider"
            >
              {isProcessingNewReport ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Through AI &amp; Optimization Pipeline...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Emergency Report</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Animated Processing Pipeline */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
                Automated Processing Pipeline
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">
                {isProcessingNewReport ? 'EXECUTING PIPELINE' : 'AWAITING DISPATCH'}
              </span>
            </div>

            <div className="space-y-2">
              {pipelineStages.map((stage, idx) => {
                const isCompleted = !isProcessingNewReport ? true : pipelineStep > idx;
                const isCurrent = isProcessingNewReport && pipelineStep === idx;

                let iconColor = 'text-slate-600';
                let borderColor = 'border-slate-800';
                let bgColor = 'bg-slate-950';

                if (isCompleted) {
                  iconColor = 'text-emerald-400';
                  borderColor = 'border-emerald-800/60';
                  bgColor = 'bg-emerald-950/20';
                } else if (isCurrent) {
                  iconColor = 'text-cyan-400 animate-spin';
                  borderColor = 'border-cyan-500';
                  bgColor = 'bg-cyan-950/40';
                }

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded border ${borderColor} ${bgColor} flex items-center justify-between text-xs transition-all`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="font-mono text-[10px] w-5 text-slate-500 font-bold">
                        0{idx + 1}
                      </div>
                      <div>
                        <div className="font-bold text-[11px] text-slate-200">
                          {stage.label}
                        </div>
                        <div className="text-[10px] text-slate-400">{stage.desc}</div>
                      </div>
                    </div>

                    <div>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-700 block"></span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {lastSubmittedId && !isProcessingNewReport && (
            <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-700/60 rounded text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Report Processed &amp; Enqueued as {lastSubmittedId}</span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                AI extraction resolved parameters and enqueued into active batch window.
              </p>
              <button
                onClick={() => setActiveTab('intelligence')}
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-semibold py-1.5 rounded text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Inspect AI Understanding &amp; Score Math</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
