/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Typography, Badge } from "../../components/ui";
import { cn } from "../../lib/utils";
import { Condition, SortField, SortDirection } from "../../types";

interface ConditionTableProps {
  paged: Condition[];
  sortField: SortField;
  sortOrder: SortDirection;
  onSort: (field: SortField) => void;
  onRowClick: (row: Condition) => void;
}

export function ConditionTable({ paged, sortField, sortOrder, onSort, onRowClick }: ConditionTableProps) {
  const TH = ({ children, field, className }: { children: React.ReactNode; field?: SortField; className?: string }) => {
    const isSorted = sortField === field;
    return (
      <th 
        onClick={() => field && onSort(field)} 
        className={cn(
          "px-4 h-12 text-left bg-gray-50 border-b border-divider transition-colors",
          field ? "cursor-pointer hover:bg-gray-100 select-none" : "cursor-default",
          className
        )}
      >
        <div className="flex items-center gap-1.5">
          <Typography variant="label-micro" className="text-text-primary">
            {children}
          </Typography>
          {field && (
            <div className="flex flex-col">
              {isSorted ? (
                sortOrder === "asc" ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />
              ) : (
                <ChevronDown size={12} className="text-gray-300 opacity-0 group-hover:opacity-100" />
              )}
            </div>
          )}
        </div>
      </th>
    );
  };

  const statusVariants: Record<string, any> = {
    Approved: "success",
    "In Review": "info",
    Deprecated: "error",
    Draft: "default",
  };

  const guidelineVariants: Record<string, any> = {
    "DSM-5-TR": "brand",
    "ICD-11": "info",
  };

  return (
    <table className="w-full border-collapse table-fixed">
      <colgroup>
        <col className="w-[350px]" />
        <col className="w-[140px]" />
        <col className="w-[280px]" />
        <col className="w-[130px]" />
        <col className="w-[180px]" />
      </colgroup>
      <thead>
        <tr className="group">
          <TH field="name">Condition Name</TH>
          <TH field="status">Status</TH>
          <TH field="category">Category</TH>
          <TH field="code">Guideline</TH>
          <TH field="updated">Last Updated</TH>
        </tr>
      </thead>
      <tbody className="divide-y divide-divider">
        {paged.map(row => (
          <tr 
            key={row.id} 
            onClick={() => onRowClick(row)} 
            className="hover:bg-primary-light/30 cursor-pointer transition-colors"
          >
            <td className="px-4 py-4">
              <Typography className="font-medium text-primary">
                {row.name}
              </Typography>
            </td>
            <td className="px-4 py-4">
              <Badge variant={statusVariants[row.status] || "default"}>
                {row.status}
              </Badge>
            </td>
            <td className="px-4 py-4">
              <Typography variant="body">
                {row.category}
              </Typography>
            </td>
            <td className="px-4 py-4">
              <Badge variant={guidelineVariants[row.guideline] || "outline"} className="font-mono">
                {row.guideline}
              </Badge>
            </td>
            <td className="px-4 py-4">
              <Typography variant="body-sm">
                {row.updated}
              </Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
