import React from 'react';
import { Edit3 as EditIcon } from 'lucide-react';
import { CollapsibleSection } from '../../components/ui/CollapsibleSection';
import { SysBadge } from '../../components/shared/SysBadge';
import { Button } from '../../components/ui/Button';

interface InterpRowProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
  bg?: string;
  editable?: boolean;
  isNextStep?: boolean;
}

export function InterpRow({ 
  title, 
  content, 
  defaultOpen = false, 
  bg = "bg-white", 
  editable = false, 
  isNextStep = false 
}: InterpRowProps) {
  const [editing, setEditing] = React.useState(false);
  const [text, setText] = React.useState(content);

  return (
    <CollapsibleSection
      title={title}
      defaultOpen={defaultOpen}
      bg={bg}
      headerAction={editable && !editing && (
        <button 
          onClick={(e) => { e.stopPropagation(); setEditing(true); }} 
          className="p-1 hover:bg-slate-50 rounded-md transition-colors text-slate-400 hover:text-slate-600 outline-none"
        >
          <EditIcon size={16} />
        </button>
      )}
    >
      {editing ? (
        <div className="mt-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full min-h-[120px] p-3 text-sm font-sans border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#06302c]/5 focus:border-[#06302c] outline-none transition-all resize-vertical leading-relaxed text-slate-900"
            autoFocus
          />
          <div className="flex gap-2 justify-end mt-3">
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
            <Button variant="brand" size="sm" onClick={() => setEditing(false)}>Save</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className={`text-sm leading-relaxed font-sans ${isNextStep && !text ? "text-slate-400 italic" : "text-slate-900"}`}>
            {text || "Type next steps here..."}
          </div>
          {!editable && (
            <div className="ml-auto">
              <SysBadge />
            </div>
          )}
        </div>
      )}
    </CollapsibleSection>
  );
}
