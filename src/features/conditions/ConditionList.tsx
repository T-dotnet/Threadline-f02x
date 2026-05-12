/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

// UI Components
import { Button, Card, Typography, TableFooter } from "../../components/ui";

// Relative Features
import { FilterBar } from "./FilterBar";
import { ConditionTable } from "./ConditionTable";
import { CreateConditionModal } from "./CreateConditionModal";

// Types & Data
import { Condition, SortField, SortDirection } from "../../types";

interface ListPageProps {
  onRowClick: (row: Condition) => void;
  conditions: Condition[];
  onCreateCondition: (data: { name: string; category: string; guideline: string }) => void;
  key?: string | number;
}

export function ConditionList({ onRowClick, conditions, onCreateCondition }: ListPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [catFilters, setCatFilters] = useState<string[]>(["Anxiety & Fear-Related"]);
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);
  const [catOpen, setCatOpen] = useState(false);
  const [sf, setSf] = useState<SortField>("updated");
  const [sd, setSd] = useState<SortDirection>("desc");

  const toggleCat = (cat: string) => {
    if (cat === "CLEAR_ALL") setCatFilters([]);
    else if (catFilters.includes(cat)) setCatFilters(f => f.filter(x => x !== cat));
    else setCatFilters(f => [...f, cat]);
    setPage(0);
  };

  const filtered = useMemo(() => {
    return conditions.filter(c => {
      const ms = c.name.toLowerCase().includes(search.toLowerCase());
      const mf = statusFilter === "All Status" || c.status === statusFilter;
      const mc = catFilters.length === 0 || catFilters.includes(c.category);
      return ms && mf && mc;
    }).sort((a, b) => {
      if (sf === "updated") {
        const d1 = new Date(a.updated.replace('–', '')).getTime();
        const d2 = new Date(b.updated.replace('–', '')).getTime();
        return sd === "asc" ? d1 - d2 : d2 - d1;
      }
      const v1 = String(a[sf]);
      const v2 = String(b[sf]);
      return sd === "asc" ? v1.localeCompare(v2) : v2.localeCompare(v1);
    });
  }, [conditions, search, statusFilter, catFilters, sf, sd]);

  const paged = filtered.slice(page * rpp, (page + 1) * rpp);
  const total = Math.ceil(filtered.length / rpp);
  const s = page * rpp + 1;
  const e = Math.min((page + 1) * rpp, filtered.length);

  const onSort = (field: SortField) => {
    if (sf === field) setSd(d => d === "asc" ? "desc" : "asc");
    else { setSf(field); setSd("asc"); }
  };

  const handleCreatePrompt = (data: { name: string; category: string; guideline: string }) => {
    onCreateCondition(data);
    setSearch("");
    setStatusFilter("All Status");
    setCatFilters([]);
    setPage(0);
  };

  return (
    <div className="py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Typography variant="h1">Clinical Guidelines</Typography>
          <Typography variant="sub">Access and manage clinical documentation and diagnostic guidelines.</Typography>
        </div>
        <Button 
          variant="brand" 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto"
        >
          <Plus size={16} />
          Create New Condition
        </Button>
      </div>

      {/* Main Table Container */}
      <Card className="overflow-hidden border-divider">
        <FilterBar
          search={search} setSearch={setSearch}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          catFilters={catFilters} toggleCat={toggleCat}
          catOpen={catOpen} setCatOpen={setCatOpen}
        />
        
        <div className="overflow-x-auto">
          <ConditionTable
            paged={paged}
            sortField={sf}
            sortOrder={sd}
            onSort={onSort}
            onRowClick={onRowClick}
          />

          <TableFooter 
            page={page} 
            setPage={setPage} 
            rpp={rpp} 
            setRpp={setRpp} 
            total={total} 
            s={s} 
            e={e} 
            count={filtered.length} 
          />
        </div>
      </Card>

      <CreateConditionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreatePrompt} 
      />
    </div>
  );
}
