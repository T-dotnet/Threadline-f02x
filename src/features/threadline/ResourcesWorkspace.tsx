import React, { useState } from "react";
import { Search, Download } from "lucide-react";
import { TEXT_PRIMARY, TEXT_SECONDARY, DIVIDER, outlineBtn, cardStyle, cardContentStyle, h1Style, subStyle } from "./constants";
import { MultiDropdown } from "../../components/common/UIElements";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { Input, Button, Card, Typography } from "../../components/ui";

export function ResourcesWorkspace() {
  const [selectedCats, setSelectedCats] = useState<string[]>(["All"]);
  const categories = ["All", "User Guides", "Templates", "Brochures", "Consumer Handouts", "White Papers"];
  
  const toggleCat = (cat: string) => {
    if (cat === "All") setSelectedCats(["All"]);
    else {
      const next = selectedCats.includes(cat) ? selectedCats.filter(c => c !== cat) : [...selectedCats.filter(c => c !== "All"), cat];
      setSelectedCats(next.length === 0 ? ["All"] : next);
    }
  };

  const resources = [
    { title: "Worry Management Toolkit", desc: "Evidence-based techniques for managing anxiety", type: "User Guide" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "Templates" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "Brochures" },
    { title: "Worry Management Toolkit", desc: "Evidence-based techniques for managing anxiety", type: "White Papers" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "User Guide" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "Consumer Handouts" },
    { title: "Worry Management Toolkit", desc: "Evidence-based techniques for managing anxiety", type: "Templates" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "User Guide" },
    { title: "Sleep Hygiene Foundations", desc: "Build healthy sleep routines and patterns", type: "Brochures" },
  ];

  const mainContent = (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6 gap-4 border-b border-divider pb-6 -mt-2">
        <MultiDropdown 
          label="Categories" 
          value={selectedCats} 
          options={categories} 
          onToggle={toggleCat} 
          width={240} 
        />

        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
          <Input 
            placeholder="Search Resources" 
            className="pl-10"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((r, idx) => (
          <Card key={idx} className="flex flex-col justify-between p-6 min-h-[180px]">
            <div>
              <Typography variant="h3" className="mb-2">{r.title}</Typography>
              <Typography className="text-text-secondary line-clamp-2">{r.desc}</Typography>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-4">
              <span className="text-[13px] text-text-secondary">{r.type}</span>
              <Button variant="outline" size="sm" className="gap-2">
                Download <Download size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pb-16">
      <WorkspaceLayout 
        singleColumn
        title="Resources"
        small={false}
        subtitle="Evidence-informed resources for clinicians."
        mainContent={mainContent}
      />
    </div>
  );
}

