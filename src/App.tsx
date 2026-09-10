import React from 'react';
import { DisasterProvider, useDisaster } from './context/DisasterContext';
import { Navbar } from './components/Navbar';
import { CommandCenter } from './pages/CommandCenter';
import { ReportEmergency } from './pages/ReportEmergency';
import { IncidentIntelligence } from './pages/IncidentIntelligence';
import { ResourcesAllocation } from './pages/ResourcesAllocation';
import { ResponseApproval } from './pages/ResponseApproval';
import { AuditTimeline } from './pages/AuditTimeline';
import { DemoScenarios } from './pages/DemoScenarios';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { JudgeModeModal } from './components/JudgeModeModal';
import { ShieldAlert, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setJudgeModeOpen } = useDisaster();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pb-12">
        {activeTab === 'command_center' && <CommandCenter />}
        {activeTab === 'report' && <ReportEmergency />}
        {activeTab === 'intelligence' && <IncidentIntelligence />}
        {activeTab === 'resources' && <ResourcesAllocation />}
        {activeTab === 'approval' && <ResponseApproval />}
        {activeTab === 'audit' && <AuditTimeline />}
        {activeTab === 'scenarios' && <DemoScenarios />}
        {activeTab === 'architecture' && <ArchitecturePage />}
      </main>

      {/* Persistent Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span className="font-semibold text-slate-300">RakshaSetu</span>
            <span>•</span>
            <span>Smart India Hackathon 2026 (SIH26206)</span>
            <span>•</span>
            <span className="text-slate-400">Disaster Management • Software Category</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Assam Disaster Theater Operational Sector</span>
            <button
              onClick={() => setJudgeModeOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Judge Mode</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 2-Minute Judge Walkthrough Modal */}
      <JudgeModeModal />
    </div>
  );
};

export default function App() {
  return (
    <DisasterProvider>
      <AppContent />
    </DisasterProvider>
  );
}
