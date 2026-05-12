import { Settings, X as CloseIcon, FlaskConical } from "lucide-react";
import { Button } from "../ui/Button";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";

interface DebugMenuProps {
  isDebugMinimized: boolean;
  setIsDebugMinimized: (val: boolean) => void;
  showFeatureToggles: boolean;
  setShowFeatureToggles: (val: boolean) => void;
  isPlayground: boolean;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  setShowMockData: (val: boolean) => void;
  onNavigate: (path: string) => void;
}

export function DebugMenu({
  isDebugMinimized,
  setIsDebugMinimized,
  showFeatureToggles,
  setShowFeatureToggles,
  isPlayground,
  isAdminView,
  setIsAdminView,
  setShowMockData,
  onNavigate
}: DebugMenuProps) {
  const { activeCount, useGroupedTabs, setUseGroupedTabs, flags, setFlag } = useFeatureFlags();

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-2 z-[1000] p-1.5 bg-white rounded-full shadow-lg border border-slate-200 transition-all duration-300 ${isDebugMinimized ? 'max-w-[88px]' : 'max-w-[1200px] overflow-hidden'}`}>
      <div className="flex items-center gap-1.5">
        <Button 
          variant={isDebugMinimized ? 'brand' : 'ghost'}
          size="sm"
          onClick={() => setIsDebugMinimized(!isDebugMinimized)}
          className="w-8 h-8 p-0 rounded-full shrink-0"
          title={isDebugMinimized ? "Show Debug Menu" : "Minimize Debug Menu"}
        >
          {isDebugMinimized ? <Settings size={14} /> : <CloseIcon size={14} />}
        </Button>
        {isDebugMinimized && (
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('/playground')}
            className="w-8 h-8 p-0 rounded-full shrink-0 text-text-secondary hover:text-primary transition-colors"
            title="Go to Playground"
          >
            <FlaskConical size={14} />
          </Button>
        )}
      </div>
      
      {!isDebugMinimized && (
        <div className="flex items-center gap-2 pr-2">
          <Button 
            variant={showFeatureToggles ? 'brand' : 'ghost'}
            size="sm"
            onClick={() => setShowFeatureToggles(true)}
            className="rounded-full px-4 h-8 text-xs flex gap-2"
          >
            Features 
            {activeCount > 0 && (
              <span className={`rounded-full px-1.5 min-w-[18px] text-[10px] font-bold ${showFeatureToggles ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                {activeCount}
              </span>
            )}
          </Button>
          <Button 
            variant={isPlayground ? 'brand' : 'ghost'}
            size="sm"
            onClick={() => onNavigate(isPlayground ? '/conditions' : '/playground')}
            className="rounded-full px-4 h-8 text-xs flex gap-2 items-center"
          >
            <FlaskConical size={14} />
            {isPlayground ? "Back to App" : "Playground"}
          </Button>
          {!isPlayground && (
            <Button 
              variant={isAdminView ? 'brand' : 'ghost'}
              size="sm"
              onClick={() => setIsAdminView(!isAdminView)}
              className="rounded-full px-4 h-8 text-xs"
            >
              Admin: {isAdminView ? "ON" : "OFF"}
            </Button>
          )}
          {!isPlayground && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setShowMockData(true)}
              className="rounded-full px-4 h-8 text-xs"
            >
              Mock
            </Button>
          )}
          <Button 
            variant="brand"
            size="sm"
            onClick={() => setUseGroupedTabs(!useGroupedTabs)}
            className="rounded-full px-4 h-8 text-xs opacity-90"
          >
            Nav: {useGroupedTabs ? "Grouped" : "Classic"}
          </Button>
          <Button 
            variant={flags.FEATURE_COMPACT_HUD ? 'brand' : 'outline'}
            size="sm"
            onClick={() => setFlag("FEATURE_COMPACT_HUD", !flags.FEATURE_COMPACT_HUD)}
            className="rounded-full px-4 h-8 text-xs border-primary"
          >
            HUD: {flags.FEATURE_COMPACT_HUD ? "Compact" : "Normal"}
          </Button>
        </div>
      )}
    </div>
  );
}
