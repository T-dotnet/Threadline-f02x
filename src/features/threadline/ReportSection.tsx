import React from 'react';
import { Edit3 as EditIcon } from 'lucide-react';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';

interface ReportSectionProps {
  title: string;
  children: React.ReactNode;
  noCollapse?: boolean;
  reviewBadge?: React.ReactNode;
}

export const ReportSection: React.FC<ReportSectionProps> = ({ 
  title, 
  children, 
  noCollapse, 
  reviewBadge 
}) => {
  return (
    <CollapsibleSection
      title={title}
      noCollapse={noCollapse}
      headerAction={(
        <>
          {reviewBadge}
          <button className="p-1 hover:bg-slate-50 rounded-md transition-colors text-slate-400 hover:text-slate-600">
            <EditIcon size={16} />
          </button>
        </>
      )}
    >
      {children}
    </CollapsibleSection>
  );
};
