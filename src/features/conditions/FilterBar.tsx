/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, X } from "lucide-react";
import { ALL_CATS } from "../../constants";
import { 
  Input, 
  Select, 
  Button, 
  Badge 
} from "../../components/ui";

interface FilterBarProps {
  search: string;
  setSearch: (s: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  catFilters: string[];
  toggleCat: (cat: string) => void;
  catOpen: boolean;
  setCatOpen: (o: boolean) => void;
}

export function FilterBar({
  search, setSearch,
  statusFilter, setStatusFilter,
  catFilters, toggleCat,
}: FilterBarProps) {
  return (
    <div className="p-6 border-b border-divider bg-gray-50/30">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="sm:w-[200px]">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Status">All Status</option>
              <option value="Approved">Approved</option>
              <option value="In Review">In Review</option>
              <option value="Deprecated">Deprecated</option>
              <option value="Draft">Draft</option>
            </Select>
          </div>

          <div className="sm:w-[240px]">
            <Select
              label="Categories"
              value=""
              onChange={(e) => e.target.value && toggleCat(e.target.value)}
            >
              <option value="" disabled>Select Categories...</option>
              {ALL_CATS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="relative w-full lg:w-[320px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          <Input
            placeholder="Search conditions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {catFilters.map(cat => (
          <Badge 
            key={cat} 
            variant="soft" 
            className="pl-2 pr-1 py-1 gap-1 border-divider"
          >
            {cat.length > 24 ? cat.slice(0, 24) + "..." : cat}
            <button 
              onClick={() => toggleCat(cat)}
              className="hover:bg-primary-light rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </Badge>
        ))}
        {catFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleCat("CLEAR_ALL")}
            className="text-primary font-semibold h-7"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
