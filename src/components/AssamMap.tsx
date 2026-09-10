import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useDisaster } from '../context/DisasterContext';
import { ASSAM_LOCATIONS } from '../data/assamData';

export const AssamMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const { incidents, resources, currentPlan, selectedIncidentId, setSelectedIncidentId } = useDisaster();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Assam: ~26.7°N, 93.8°E
    const map = L.map(mapContainerRef.current, {
      center: [26.9, 93.9],
      zoom: 7.5,
      minZoom: 6,
      maxZoom: 14,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Dark-themed tiles from CartoDB or OpenStreetMap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers and Allocation Lines when incidents/resources change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Add Assam Reference Location Markers (subtle dots)
    ASSAM_LOCATIONS.forEach((loc) => {
      const cityMarker = L.circleMarker([loc.latitude, loc.longitude], {
        radius: 4,
        color: '#64748b',
        fillColor: '#334155',
        fillOpacity: 0.6,
        weight: 1,
      });
      cityMarker.bindTooltip(
        `<div class="text-xs font-mono font-semibold">${loc.name}</div><div class="text-[10px] text-slate-400">${loc.district}</div>`,
        { permanent: false, direction: 'top', className: 'map-tooltip' }
      );
      layerGroup.addLayer(cityMarker);
    });

    // 2. Add Resource Base Stations & Units
    resources.forEach((res) => {
      const isDeployed = res.availability === 'deployed';
      const isAssigned = res.availability === 'assigned';
      const isAvailable = res.availability === 'available';

      const iconBg = isDeployed
        ? '#10b981' // emerald
        : isAssigned
        ? '#3b82f6' // blue
        : isAvailable
        ? '#06b6d4' // cyan
        : '#64748b'; // gray

      const typeSymbol =
        res.resource_type === 'boat'
          ? '🚤'
          : res.resource_type === 'ambulance'
          ? '🚑'
          : res.resource_type === 'medical_team'
          ? '🩺'
          : '🛡️';

      const customIcon = L.divIcon({
        className: 'resource-marker',
        html: `
          <div style="
            background: #0f172a;
            border: 2px solid ${iconBg};
            color: white;
            border-radius: 6px;
            padding: 2px 5px;
            font-size: 11px;
            font-family: monospace;
            display: flex;
            align-items: center;
            gap: 3px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            white-space: nowrap;
          ">
            <span>${typeSymbol}</span>
            <span style="font-weight: 700;">${res.resource_id}</span>
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      const marker = L.marker([res.latitude, res.longitude], { icon: customIcon });
      marker.bindPopup(`
        <div style="background: #090d16; color: #f1f5f9; padding: 10px; border-radius: 8px; font-family: sans-serif; min-width: 220px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; border-bottom: 1px solid #1e293b; padding-bottom: 4px;">
            <strong style="color: #38bdf8;">${res.resource_id}</strong>
            <span style="background: ${iconBg}; color: black; font-size: 10px; font-weight: bold; padding: 1px 6px; border-radius: 4px;">
              ${res.availability.toUpperCase()}
            </span>
          </div>
          <div style="font-weight: 600; font-size: 13px; margin-bottom: 4px;">${res.name}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 6px;">Station: ${res.base_station_name}</div>
          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px;">Status: ${res.current_status}</div>
          <div style="font-size: 10px; color: #64748b; font-family: monospace;">
            [${res.latitude.toFixed(4)}°N, ${res.longitude.toFixed(4)}°E]
          </div>
        </div>
      `);
      layerGroup.addLayer(marker);
    });

    // 3. Add Incident Markers
    incidents.forEach((inc) => {
      if (inc.latitude === null || inc.longitude === null) return;

      const isSelected = selectedIncidentId === inc.incident_id;

      // Color mapping
      let color = '#3b82f6'; // LOW = blue
      if (inc.priority_level === 'CRITICAL') color = '#ef4444'; // red
      else if (inc.priority_level === 'HIGH') color = '#f97316'; // orange
      else if (inc.priority_level === 'MEDIUM') color = '#eab308'; // yellow

      const pulseStyle =
        inc.priority_level === 'CRITICAL'
          ? 'box-shadow: 0 0 16px rgba(239, 68, 68, 0.9); animation: pulse 1.5s infinite;'
          : '';

      const incidentIcon = L.divIcon({
        className: 'incident-marker',
        html: `
          <div style="
            background: ${color};
            color: #ffffff;
            border: ${isSelected ? '3px solid #ffffff' : '2px solid rgba(0,0,0,0.8)'};
            border-radius: 9999px;
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 11px;
            font-family: monospace;
            cursor: pointer;
            ${pulseStyle}
          ">
            ${inc.incident_id}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([inc.latitude, inc.longitude], { icon: incidentIcon });

      marker.on('click', () => {
        setSelectedIncidentId(inc.incident_id);
      });

      // Find allocation details
      const alloc = currentPlan?.allocations.find((a) => a.incident_id === inc.incident_id);

      const reqHtml = inc.resource_requirements
        .map((r) => `<span style="background: #1e293b; color: #38bdf8; padding: 2px 6px; border-radius: 4px; margin-right: 4px; font-size: 10px;">${r.count}x ${r.resource_type}</span>`)
        .join('');

      marker.bindPopup(`
        <div style="background: #090d16; color: #f1f5f9; padding: 12px; border-radius: 8px; font-family: sans-serif; min-width: 250px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
            <strong style="color: ${color}; font-size: 14px;">${inc.incident_id} • ${inc.incident_type.toUpperCase()}</strong>
            <span style="background: ${color}; color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">
              ${inc.priority_level} (${inc.priority_score})
            </span>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #e2e8f0; margin-bottom: 4px;">${inc.location_text}</div>
          <p style="font-size: 11px; color: #94a3b8; margin-bottom: 8px; line-height: 1.4;">${inc.description}</p>
          
          <div style="font-size: 11px; margin-bottom: 6px;">
            <strong style="color: #cbd5e1;">Requirements:</strong>
            <div style="margin-top: 3px;">${reqHtml}</div>
          </div>

          ${
            alloc
              ? `
            <div style="font-size: 11px; margin-top: 8px; padding-top: 6px; border-top: 1px dashed #334155;">
              <strong style="color: #34d399;">Joint Solver Result:</strong>
              <div style="margin-top: 2px; color: #f8fafc; font-weight: bold;">${alloc.status}</div>
              <div style="font-size: 10px; color: #94a3b8; margin-top: 3px;">${alloc.justification}</div>
            </div>
          `
              : ''
          }
        </div>
      `);

      layerGroup.addLayer(marker);
    });

    // 4. Draw Allocation Dispatch Lines (between assigned resources and incidents)
    if (currentPlan) {
      currentPlan.allocations.forEach((alloc) => {
        const inc = incidents.find((i) => i.incident_id === alloc.incident_id);
        if (!inc || inc.latitude === null || inc.longitude === null) return;

        alloc.allocated_resource_ids.forEach((resId) => {
          const res = resources.find((r) => r.resource_id === resId);
          if (!res) return;

          const polyline = L.polyline(
            [
              [res.latitude, res.longitude],
              [inc.latitude, inc.longitude],
            ],
            {
              color: inc.priority_level === 'CRITICAL' ? '#ef4444' : '#06b6d4',
              weight: 2.5,
              dashArray: '6, 8',
              opacity: 0.8,
            }
          );

          polyline.bindTooltip(
            `<span class="text-[10px] font-mono">${res.resource_id} → ${inc.incident_id} (${alloc.allocated_resources.find((r) => r.resource_id === resId)?.distance_km || 0} km)</span>`,
            { permanent: false, direction: 'center' }
          );

          layerGroup.addLayer(polyline);
        });
      });
    }
  }, [incidents, resources, currentPlan, selectedIncidentId, setSelectedIncidentId]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
      {/* Map Header Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-md px-3 py-1.5 flex items-center gap-3 text-xs shadow-xl pointer-events-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-slate-200">ASSAM THEATER SECTOR</span>
        </div>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400 font-mono">24.1°N - 28.2°N</span>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-md p-2.5 text-[11px] shadow-xl">
        <div className="font-semibold text-slate-300 mb-1.5 text-[10px] uppercase tracking-wider">Map Legend</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
            <span>CRITICAL (90-100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>HIGH (70-89)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span>MEDIUM (40-69)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>LOW (0-39)</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 pt-1 border-t border-slate-800 text-[10px] text-slate-400">
            <span className="font-mono text-cyan-400">---</span> Assigned Dispatch Vector (Haversine Distance)
          </div>
        </div>
      </div>

      <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '380px' }} />
    </div>
  );
};
