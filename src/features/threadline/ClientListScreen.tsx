/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { Search, Plus, MoreVertical, ChevronDown } from "lucide-react";

// UI & Layout
import { 
  Button, 
  Badge, 
  Card, 
  Typography, 
  Input, 
  Select, 
  TableFooter 
} from "../../components/ui";
import { StatusBadge } from "../../components/shared/StatusBadge";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { AddClientModal } from "./modals/AddClientModal";
import { cn } from "../../lib/utils";

// Domain
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";
import { useFeatureFlags } from "../../contexts/FeatureToggleContext";

export type ClientStatus = any;

export function deriveClientStatus(client: any): ClientStatus {
  const data = MOCK_CLIENT_DATA[client.id];
  if (!data) return 'idle';

  if ((!data.sessions || data.sessions.length === 0) && 
      (!data.assessments || data.assessments.every(a => a.status.toLowerCase() === 'not-started'))) {
    return 'new';
  }

  if (!client.consent || (client.missingDocs && client.missingDocs.length > 0)) return 'missing-documents';
  if (client.hasConflicts) return 'conflicts-unresolved';

  const hasInProgress = data.assessments?.some(a => a.status.toLowerCase() === 'in-progress');
  if (hasInProgress) return 'in-progress';

  if (data.reportUnlocked) return 'ready';

  const sessionsCount = data.sessions?.length || 0;
  const assessmentsCount = data.assessments?.filter((a: any) => a.status.toLowerCase() === 'completed').length || 0;
  const documentsCount = data.documents?.filter((d: any) => d.status === 'uploaded' || d.status === 'completed').length || 0;
  const currentProgress = Math.min(sessionsCount, 2) + Math.min(assessmentsCount, 2) + Math.min(documentsCount, 2);
  
  if (currentProgress >= 6) return 'evidence';

  const allCompleted = data.assessments?.length > 0 && data.assessments.every(a => a.status.toLowerCase() === 'completed');
  if (allCompleted) return 'ready';

  return 'idle';
}

interface ClientListScreenProps {
  onSelectClient: (id: string) => void;
}

export function ClientListScreen({ onSelectClient }: ClientListScreenProps) {
  const { flags } = useFeatureFlags();
  const [search, setSearch] = useState("");
  const [clinicianFilter, setClinicianFilter] = useState("All Clinicians");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredClients = useMemo(() => {
    return MOCK_CLIENTS.filter(c => {
      const ms = c.name.toLowerCase().includes(search.toLowerCase()) || 
                 c.id.includes(search) || 
                 c.extId.toLowerCase().includes(search.toLowerCase());
      const mc = clinicianFilter === "All Clinicians" || c.clinicians.includes(clinicianFilter);
      return ms && mc;
    });
  }, [search, clinicianFilter]);

  const pagedClients = filteredClients.slice(page * rpp, (page + 1) * rpp);
  const total = Math.ceil(filteredClients.length / rpp);

  const mainContent = (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/30 border-b border-divider">
        <div className="w-full sm:w-[240px]">
          <Select 
            label="Clinician"
            value={clinicianFilter}
            onChange={(e) => setClinicianFilter(e.target.value)}
          >
            <option value="All Clinicians">All Clinicians</option>
            <option value="James Wilson">James Wilson</option>
            <option value="Sara Miller">Sara Miller</option>
            <option value="Olivia Porter">Olivia Porter</option>
          </Select>
        </div>

        <div className="relative w-full sm:w-[320px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          <Input 
            placeholder="Search by name, Referral, or ID" 
            className="pl-10"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-divider">
              {[
                { l: "Name", w: "22%" },
                { l: "Status", w: "15%" },
                { l: "External ID", w: "12%" },
                { l: "Clinicians", w: "20%" },
                { l: "Last Session", w: "15%" },
                { l: "Consent", w: "12%" },
                { l: "", w: "4%" }
              ].map(h => (
                <th key={h.l} className="px-6 py-4 text-left" style={{ width: h.w }}>
                  <div className="flex items-center gap-1.5 group cursor-pointer select-none">
                    <Typography variant="label-micro" className="text-text-primary uppercase tracking-wider">
                      {h.l}
                    </Typography>
                    {h.l && h.l !== "Clinicians" && <ChevronDown size={14} className="text-gray-400 group-hover:text-primary transition-colors" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {pagedClients.map((c) => {
              const status = deriveClientStatus(c);
              return (
                <tr 
                  key={c.id} 
                  className="hover:bg-primary-light/20 transition-colors group cursor-pointer"
                  onClick={() => onSelectClient(c.id)}
                >
                  <td className="px-6 py-5">
                    <div className="space-y-0.5">
                      <Typography variant="body" className="font-semibold text-primary">
                        {c.name}
                      </Typography>
                      <Typography variant="code" className="text-[10px] text-text-secondary uppercase">
                        ID: #{c.id}
                      </Typography>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      {status !== 'idle' ? (
                        <StatusBadge status={status} />
                      ) : (
                        <Typography variant="body-sm" className="text-text-disabled">—</Typography>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-text-secondary">
                    <Typography variant="code">{c.extId}</Typography>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1.5">
                      {c.clinicians.map((cl, idx) => (
                        <Badge key={idx} variant="soft" className="text-[11px] px-2 py-0 border-primary/10 text-primary">
                          {cl}
                        </Badge>
                      ))}
                      {c.extra > 0 && (
                        <Typography variant="label-micro" className="mt-1">
                          +{c.extra} more
                        </Typography>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Typography variant="body-sm" className="text-text-secondary">
                      {c.last}
                    </Typography>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={c.consent ? 'completed' : 'missing'} label={c.consent ? "Yes" : "No"} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={16} className="text-gray-400" />
                    </Button>
                  </td>
                </tr>
              );
            })}
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
        e={Math.min((page + 1) * rpp, filteredClients.length)}
        count={filteredClients.length}
        className="bg-white border-t border-divider"
      />
    </div>
  );

  return (
    <div className="pb-16 pt-8">
      <WorkspaceLayout 
        singleColumn
        contentClassName="p-0"
        title="Clients"
        small={false}
        subtitle="Manage your diagnostic registry and client relationships."
        headerActions={
          <Button variant="brand" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            Add Client
          </Button>
        }
        mainContent={
          <>
            {mainContent}
            <AddClientModal 
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAdd={(client) => {
                console.log("Adding client:", client);
                // Here we would typically update state or call an API
                setIsAddModalOpen(false);
              }}
            />
          </>
        }
      />
    </div>
  );
}
