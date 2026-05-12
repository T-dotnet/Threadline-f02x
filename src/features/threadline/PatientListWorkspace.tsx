/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Plus, MoreVertical, ChevronDown, User, Calendar, Phone, Mail } from "lucide-react";

// UI Components
import { 
  Button, 
  Badge, 
  Card, 
  Typography, 
  Input, 
  Select, 
  TableFooter 
} from "../../components/ui";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { cn } from "../../lib/utils";

export function PatientListWorkspace() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);

  const patients = [
    { name: "Lean Echo", initials: "LE", sessions: 2, email: "lean.echo@example.com", phone: "+61 412 345 678", status: "active", lastUpdated: "15 Jan 2026" },
    { name: "Thin Whisper", initials: "TW", sessions: 2, email: "thin.whisper@example.com", phone: "+61 423 456 789", status: "active", lastUpdated: "22 Feb 2026" },
    { name: "Slim Shadow", initials: "SS", sessions: 2, email: "slim.shadow@example.com", phone: "+61 434 567 890", status: "inactive", lastUpdated: "10 Mar 2026" },
    { name: "Narrow Breeze", initials: "NB", sessions: 2, email: "narrow.breeze@example.com", phone: "+61 467 890 123", status: "inactive", lastUpdated: "5 Apr 2026" },
    { name: "Sleek Mirage", initials: "SM", sessions: 2, email: "sleek.mirage@example.com", phone: "+61 445 678 901", status: "active", lastUpdated: "18 May 2026" },
    { name: "Faint Glimmer", initials: "FG", sessions: 2, email: "faint.glimmer@example.com", phone: "+61 456 789 012", status: "active", lastUpdated: "30 Jun 2026" },
    { name: "Delicate Trace", initials: "DT", sessions: 2, email: "delicate.trace@example.com", phone: "+61 478 901 234", status: "inactive", lastUpdated: "12 Jul 2026" },
    { name: "Anorexia Nervosa", initials: "AN", sessions: 2, email: "anorexia.nervosa@example.com", phone: "+61 489 012 345", status: "active", lastUpdated: "28 Aug 2026" },
  ];

  const filteredItems = patients.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || 
               p.email.toLowerCase().includes(search.toLowerCase());
    const mc = statusFilter === "All Status" || p.status.toLowerCase() === statusFilter.toLowerCase();
    return ms && mc;
  });

  const pagedItems = filteredItems.slice(page * rpp, (page + 1) * rpp);
  const total = Math.ceil(filteredItems.length / rpp);

  return (
    <div className="space-y-6 pb-16 pt-8">
      <SectionHeader 
        title="Patients"
        subtitle="Manage your patient registry and session history"
        small={false}
        actions={
            <Button variant="brand">
                <Plus size={18} /> Add Patient
            </Button>
        }
      />

      <Card className="overflow-hidden border-divider">
        <div className="p-6 bg-gray-50/30 border-b border-divider flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="w-full md:w-[240px]">
                <Select 
                    label="Status" 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </Select>
             </div>
             <div className="relative w-full md:w-[320px]">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
                <Input 
                    placeholder="Search by name, email..." 
                    className="pl-10"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
             </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 border-b border-divider">
                        <th className="px-6 py-4"><Typography variant="label-micro" className="text-text-primary uppercase">Patient Name</Typography></th>
                        <th className="px-6 py-4"><Typography variant="label-micro" className="text-text-primary uppercase">Contact Details</Typography></th>
                        <th className="px-6 py-4"><Typography variant="label-micro" className="text-text-primary uppercase">Status</Typography></th>
                        <th className="px-6 py-4"><Typography variant="label-micro" className="text-text-primary uppercase">Last Updated</Typography></th>
                        <th className="px-6 py-4 text-right"><Typography variant="label-micro" className="text-text-primary uppercase">Actions</Typography></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-divider">
                    {pagedItems.map((p, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                        {p.initials}
                                    </div>
                                    <div className="space-y-0.5">
                                        <Typography variant="body" className="font-bold text-primary">{p.name}</Typography>
                                        <Typography variant="label-micro" className="text-text-disabled">{p.sessions} sessions recorded</Typography>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Mail size={12} className="text-text-disabled" />
                                        <Typography variant="body-sm">{p.email}</Typography>
                                    </div>
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <Phone size={12} className="text-text-disabled" />
                                        <Typography variant="body-sm">{p.phone}</Typography>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <StatusBadge status={p.status as any} />
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Calendar size={14} className="text-text-disabled" />
                                    <Typography variant="body-sm">{p.lastUpdated}</Typography>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={16} className="text-text-disabled" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <TableFooter 
            page={page}
            setPage={setPage}
            rpp={rpp}
            setRpp={setRpp}
            total={total}
            s={page * rpp + 1}
            e={Math.min((page + 1) * rpp, filteredItems.length)}
            count={filteredItems.length}
            className="bg-white border-t border-divider"
        />
      </Card>
    </div>
  );
}
