/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import { 
  Button, 
  Input, 
  Select, 
  TableFooter, 
  Typography,
  Badge
} from "../../ui";
import { StatusBadge } from "../../shared/StatusBadge";

export function ListViewTemplate() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Dummy data for demonstration
  const items = [
    { id: "1", name: "John Archer", status: "active", category: "Patient", date: "May 11, 2026" },
    { id: "2", name: "Sarah Miller", status: "in-review", category: "Clinician", date: "May 09, 2026" },
    { id: "3", name: "Robert Wilson", status: "completed", category: "Admin", date: "May 02, 2026" },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-divider overflow-hidden">
      {/* Header & Controls */}
      <div className="p-6 border-b border-divider flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search items..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="w-40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
        
        <Button variant="brand" icon={<Plus size={18} />}>
          New Entity
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-divider">
              <th className="px-6 py-4 text-left"><Typography variant="label-micro">Name</Typography></th>
              <th className="px-6 py-4 text-left"><Typography variant="label-micro">Category</Typography></th>
              <th className="px-6 py-4 text-left"><Typography variant="label-micro">Status</Typography></th>
              <th className="px-6 py-4 text-left"><Typography variant="label-micro">Date</Typography></th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider text-sm text-slate-600">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                <td className="px-6 py-5">
                  <div className="font-semibold text-primary">{item.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-tighter">ID: #{item.id}</div>
                </td>
                <td className="px-6 py-5">
                  <Badge variant="soft">{item.category}</Badge>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={item.status as any} />
                </td>
                <td className="px-6 py-5 text-slate-400 font-mono text-xs">
                  {item.date}
                </td>
                <td className="px-6 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                    <MoreHorizontal size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <TableFooter 
        count={items.length} 
        rpp={10} 
        setRpp={() => {}} 
        page={0} 
        setPage={() => {}} 
        total={1} 
        s={1} 
        e={items.length} 
        className="border-t border-divider"
      />
    </div>
  );
}
