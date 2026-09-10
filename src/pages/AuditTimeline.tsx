import React, { useState } from 'react';
import { useDisaster } from '../context/DisasterContext';
import {
  Clock,
  CheckCircle,
  FileText,
  Search,
  Download,
  Filter,
  Shield,
  Activity,
  UserCheck,
  Cpu,
  AlertCircle,
} from 'lucide-react';

export const AuditTimeline: React.FC = () => {
  const { auditEvents } = useDisaster();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');

  const filteredEvents = auditEvents.filter((ev) => {
    const matchesSearch =
      ev.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.stage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.incident_id && ev.incident_id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = selectedStage === 'ALL' || ev.stage === selectedStage;

    return matchesSearch && matchesStage;
  });

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `RakshaSetu_Audit_Log_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Report received':
      case 'Report validated':
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'AI understanding completed':
      case 'Location resolved':
      case 'Priority calculated':
      case 'Resource requirements generated':
        return <Activity className="w-4 h-4 text-blue-400" />;
      case 'Incident added to batch':
      case 'Joint optimization executed':
      case 'Response plan generated':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'Authority decision':
      case 'Manual override':
        return <UserCheck className="w-4 h-4 text-amber-400" />;
      case 'Resources deployed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Immutable Audit Timeline &amp; Decision Logs
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete provenance from initial raw citizen report through AI understanding, joint optimization, and human authority deployment.
          </p>
        </div>

        <button
          onClick={handleExportJSON}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 px-3 py-1.5 rounded text-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by incident ID, keywords, or details..."
            className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-white text-xs font-mono focus:outline-none"
          >
            <option value="ALL">All Stages ({auditEvents.length})</option>
            <option value="Report received">Report received</option>
            <option value="Report validated">Report validated</option>
            <option value="AI understanding completed">AI understanding completed</option>
            <option value="Location resolved">Location resolved</option>
            <option value="Priority calculated">Priority calculated</option>
            <option value="Resource requirements generated">Resource requirements generated</option>
            <option value="Incident added to batch">Incident added to batch</option>
            <option value="Joint optimization executed">Joint optimization executed</option>
            <option value="Response plan generated">Response plan generated</option>
            <option value="Authority decision">Authority decision</option>
            <option value="Resources deployed">Resources deployed</option>
            <option value="Manual override">Manual override</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
        {filteredEvents.map((ev) => (
          <div key={ev.event_id} className="relative group">
            {/* Dot on line */}
            <div className="absolute -left-[31px] top-2 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getStageIcon(ev.stage)}
                  <span className="font-bold text-xs text-white uppercase tracking-wider">
                    {ev.stage}
                  </span>
                  {ev.incident_id && (
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-cyan-300">
                      {ev.incident_id}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span>{ev.event_id}</span>
                  <span>•</span>
                  <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{ev.details}</p>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No audit records matching the search query.
          </div>
        )}
      </div>
    </div>
  );
};
