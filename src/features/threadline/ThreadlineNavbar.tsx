import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Logo } from '../../components/shared/Logo';
import { BRAND, DIVIDER, TEXT_PRIMARY } from './constants';

interface ThreadlineNavbarProps {
  onClientsClick?: () => void;
  onPatientsClick?: () => void;
  onSessionsClick?: () => void;
  onDocumentsClick?: () => void;
  onConditionsClick?: () => void;
}

export const ThreadlineNavbar: React.FC<ThreadlineNavbarProps> = ({ 
  onClientsClick, 
  onPatientsClick, 
  onSessionsClick, 
  onDocumentsClick,
  onConditionsClick 
}) => {
  return (
    <nav className="bg-white border border-slate-100 rounded-xl px-5 h-[60px] flex items-center justify-between shadow-sm mb-4">
      <div className="flex items-center gap-2 cursor-pointer" onClick={onClientsClick}>
        <Logo size={28} />
      </div>
      
      <div className="flex gap-1.5 items-center">
        {["Users", "Clients", "Resources", "Patients", "Sessions", "Assessments", "Documents", "Conditions"].map(item => (
          <button 
            key={item} 
            onClick={() => {
              if (item === "Clients" && onClientsClick) onClientsClick();
              if (item === "Patients" && onPatientsClick) onPatientsClick();
              if (item === "Sessions" && onSessionsClick) onSessionsClick();
              if (item === "Documents" && onDocumentsClick) onDocumentsClick();
              if (item === "Conditions" && onConditionsClick) onConditionsClick();
            }}
            className={`px-2.5 py-1.5 text-[13px] font-medium rounded-md transition-colors duration-200 ${item === "Sessions" ? "text-[#06302c] font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
          >
            {item}
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
        <div className="w-9 h-9 rounded-full bg-[#06302c] text-white flex items-center justify-center text-[13px] font-medium border-2 border-white shadow-sm">
          OP
        </div>
        <ChevronDown size={20} className="text-slate-400" />
      </div>
    </nav>
  );
}
