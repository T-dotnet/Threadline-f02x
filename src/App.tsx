/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { X as CloseIcon } from "lucide-react";

// Layout
import { Navbar } from "./components/layout/Navbar";
import { DebugMenu } from "./components/layout/DebugMenu";
import { FeatureToggleModal } from "./components/layout/FeatureToggleModal";
import { cn } from "./lib/utils";

// Features
import { ConditionList } from "./features/conditions/ConditionList";
import { ConditionDetail } from "./features/conditions/ConditionDetail";
import { ThreadlineModule } from "./features/threadline/ThreadlineModule";
import { ChangeLogWorkspace } from "./features/threadline/ChangeLogWorkspace";
import { GlobalModals } from "./features/threadline/Modals";

// UI & Shared
import { StyleGuide } from "./components/playground/StyleGuide";
import { Button } from "./components/ui/Button";

// Context & Types
import { FeatureToggleProvider } from "./contexts/FeatureToggleContext";
import { Condition } from "./types";
import { ALL_CONDITIONS } from "./constants";
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./features/threadline/mockData";

export default function App() {
  return (
    <FeatureToggleProvider>
      <AppContent />
    </FeatureToggleProvider>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [conditions, setConditions] = useState<Condition[]>(() => [...ALL_CONDITIONS]);
  const [showMockData, setShowMockData] = useState(false);
  const [showFeatureToggles, setShowFeatureToggles] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isDebugMinimized, setIsDebugMinimized] = useState(true);

  const handleCreateCondition = (data: { name: string; category: string; guideline: string }) => {
    const newCondition: Condition = {
      id: Math.max(...conditions.map(c => c.id), 0) + 1,
      name: data.name,
      category: data.category,
      guideline: data.guideline,
      code: "NEW",
      status: "Draft",
      updated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + " – " + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      population: "N/A",
      reviewer: "Current User",
      overview: "Newly created condition guideline.",
      refs: []
    };
    setConditions([newCondition, ...conditions]);
  };

  const isPlayground = location.pathname === '/playground';

  return (
    <div className="font-sans bg-workspace-bg min-h-screen relative text-text-primary selection:bg-primary/10">
      {/* Mock Data Overlay */}
      <AnimatePresence>
        {showMockData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowMockData(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-h-[80vh] overflow-y-auto w-full max-w-4xl shadow-2xl border border-divider"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-medium">Mock Client Data</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowMockData(false)}>
                  <CloseIcon size={20} />
                </Button>
              </div>
              <pre className="text-xs p-4 bg-gray-50 rounded-lg overflow-x-auto font-mono border border-divider">
                {JSON.stringify({ MOCK_CLIENTS, MOCK_CLIENT_DATA }, null, 2)}
              </pre>
              <div className="mt-6 flex justify-end">
                <Button variant="brand" onClick={() => setShowMockData(false)}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isPlayground && (
        <Navbar
          onAvatarClick={() => setShowFeatureToggles(true)}
          onAddClick={() => {
            const params = new URLSearchParams(location.search);
            params.set("modal", "add_evidence");
            navigate({ search: params.toString() });
          }}
          isAdminView={isAdminView}
        />
      )}

      <main className={cn(
        "pb-8 mt-0",
        isPlayground ? "w-full" : "px-6 md:px-[60px] max-w-[1500px] mx-auto"
      )}>
        <AnimatePresence>
          <motion.div
            key={location.pathname.split('/')[1] || 'root'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Navigate to="/clients" replace />} />
              <Route path="/playground" element={<StyleGuide />} />
              <Route path="/conditions" element={
                <ConditionList
                  conditions={conditions}
                  onCreateCondition={handleCreateCondition}
                  onRowClick={(row) => navigate(`/conditions/${row.id}`)}
                />
              } />
              <Route path="/conditions/:id" element={<ConditionDetailWrapper conditions={conditions} />} />
              
              {/* Feature Modules */}
              <Route path="/clients/*" element={<ThreadlineModule type="clients" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/patients/*" element={<ThreadlineModule type="patients" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/sessions/*" element={<ThreadlineModule type="sessions" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/assessments/*" element={<ThreadlineModule type="assessments" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/documents/*" element={<ThreadlineModule type="documents" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/resources/*" element={<ThreadlineModule type="resources" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/users/*" element={<ThreadlineModule type="users" onGuidelinesClick={() => navigate('/conditions')} />} />
              <Route path="/changelog" element={<ChangeLogWorkspace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <DebugMenu 
        isDebugMinimized={isDebugMinimized}
        setIsDebugMinimized={setIsDebugMinimized}
        showFeatureToggles={showFeatureToggles}
        setShowFeatureToggles={setShowFeatureToggles}
        isPlayground={isPlayground}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
        setShowMockData={setShowMockData}
        onNavigate={navigate}
      />

      <GlobalModals />
      <FeatureToggleModal isOpen={showFeatureToggles} onClose={() => setShowFeatureToggles(false)} />
    </div>
  );
}

function ConditionDetailWrapper({ conditions }: { conditions: Condition[] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const condition = conditions.find(c => c.id === Number(id));
  if (!condition) return <Navigate to="/conditions" replace />;
  return <ConditionDetail row={condition} onBack={() => navigate('/conditions')} />;
}
