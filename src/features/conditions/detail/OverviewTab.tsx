/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExternalLink } from "lucide-react";
import { Typography } from "../../../components/ui";
import { Condition } from "../../../types";

export function OverviewTab({ row }: { row: Condition }) {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <Typography variant="h3">Overview</Typography>
          <Typography variant="body" className="text-text-secondary leading-relaxed">
            {row.overview}
          </Typography>
        </div>
        
        <div className="space-y-4">
          <Typography variant="h3">Guideline References</Typography>
          <div className="flex flex-col gap-3">
            {row.refs.map((ref, i) => (
              <a 
                key={i} 
                href="#" 
                onClick={e => e.preventDefault()} 
                className="flex items-center gap-2 group w-fit"
              >
                <Typography variant="body" className="text-primary hover:underline group-hover:text-primary-dark transition-colors">
                  {ref}
                </Typography>
                <ExternalLink size={14} className="text-primary group-hover:text-primary-dark" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Typography variant="h3">Metadata</Typography>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-divider pt-6">
          {[
            { label: "Guideline Version", value: row.guideline },
            { label: "Population Applicability", value: row.population },
            { label: "Last Reviewer", value: row.reviewer },
            { label: "Last Update", value: row.updated.split("–")[0].trim() },
          ].map(({ label, value }, i, arr) => (
            <div 
              key={label} 
              className={`space-y-2 py-4 ${i < arr.length - 1 ? 'border-r border-divider pr-6' : ''} ${i > 0 ? 'pl-6' : ''}`}
            >
              <Typography variant="label-micro" className="text-text-secondary uppercase">{label}</Typography>
              <Typography variant="body" className="font-semibold">{value}</Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
