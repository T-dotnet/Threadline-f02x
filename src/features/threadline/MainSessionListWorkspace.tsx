/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search,
  Plus,
  ArrowLeft
} from "lucide-react";

// UI Components
import { 
  Button, 
  Card, 
  Badge, 
  Typography, 
  Input, 
  TableFooter 
} from "../../components/ui";
import { cn } from "../../lib/utils";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { CreateSessionModal } from "./modals/CreateSessionModal";
import { SessionDetail } from "./SessionListWorkspace";

// Domain
import { MOCK_CLIENTS, MOCK_CLIENT_DATA } from "./mockData";

export function MainSessionListWorkspace() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);

  const initialAllSessions = MOCK_CLIENTS.flatMap(client => {
    const clientData = MOCK_CLIENT_DATA[client.id] || { sessions: [] };
    return clientData.sessions.map(session => ({
      ...session,
      clientName: client.name,
      clientId: client.id,
      clinicians: client.clinicians
    }));
  });

  const [sessions, setSessions] = useState(initialAllSessions);

  const handleSessionCreate = (sessionInfo: { type: 'new' | 'existing', code?: string }) => {
    const newSession = {
      id: sessionInfo.type === 'existing' ? sessionInfo.code! : `S-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split('T')[0],
      focus: sessionInfo.type === 'existing' ? "Added Existing Session" : "Manual Session Start",
      notes: "Initialized from Global Sessions view.",
      clientName: "General / Unassigned",
      clientId: "000000",
      clinicians: ["Current User"]
    };
    
    setSessions([newSession, ...sessions]);
    setIsModalOpen(false);
  };

  const filtered = sessions.filter(s => 
    s.clientName.toLowerCase().includes(search.toLowerCase()) || 
    s.focus.toLowerCase().includes(search.toLowerCase()) ||
    s.clinicians.some(cl => cl.toLowerCase().includes(search.toLowerCase()))
  );

  const pagedItems = filtered.slice(page * rpp, (page + 1) * rpp);
  const total = Math.ceil(filtered.length / rpp);

  const mainContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 bg-gray-50/30 border-b border-divider flex justify-end">
           <div className="relative w-full md:w-[320px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" />
              <Input 
                  placeholder="Search by client, focus..." 
                  className="pl-10 h-10"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
              />
           </div>
      </div>

      <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
              <thead>
                  <tr className="bg-gray-50 border-b border-divider">
                      <th className="px-6 py-4"><Typography variant="label-micro" className="text-text-primary uppercase">Session Focus</Typography></th>
                      <th className="px-6 py-4"><Typography variant="label-micro" className="text-text-primary uppercase">Client</Typography></th>
                      <th className="px-6 py-4"><Typography variant="label-micro" className="text-text-primary uppercase">Clinicians</Typography></th>
                      <th className="px-6 py-4 text-right"><Typography variant="label-micro" className="text-text-primary uppercase">Actions</Typography></th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                  {pagedItems.map((session, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-5">
                              <div className="space-y-0.5">
                                  <Typography 
                                    variant="body" 
                                    className="font-bold text-primary hover:underline cursor-pointer"
                                    onClick={() => setSelectedSession(session)}
                                  >
                                    {session.focus}
                                  </Typography>
                                  <div className="text-[10px] text-text-disabled uppercase font-mono">Session #{session.id}</div>
                              </div>
                          </td>
                          <td className="px-6 py-5">
                              <div className="space-y-0.5">
                                  <Typography variant="body" className="text-text-primary">{session.clientName}</Typography>
                                  <div className="text-[10px] text-text-disabled uppercase font-mono">ID: {session.clientId}</div>
                              </div>
                          </td>
                          <td className="px-6 py-5">
                              <div className="flex flex-wrap gap-1.5">
                                  {session.clinicians.map((cl, idx) => (
                                      <Badge key={idx} variant="soft" className="px-2 py-0">{cl}</Badge>
                                  ))}
                              </div>
                          </td>
                          <td className="px-6 py-5 text-right flex items-center justify-end gap-4 whitespace-nowrap">
                              <button 
                                className="text-primary bg-transparent border-none text-sm font-bold cursor-pointer hover:underline"
                                onClick={() => setSelectedSession(session)}
                              >
                                View Session
                              </button>
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
          e={Math.min((page + 1) * rpp, filtered.length)}
          count={filtered.length}
          className="bg-white border-t border-divider"
      />
    </div>
  );

  if (selectedSession) {
    return (
      <div className="p-8">
        <SessionDetail session={selectedSession} onBack={() => setSelectedSession(null)} />
      </div>
    );
  }

  return (
    <div className="pb-16 pt-8">
      <WorkspaceLayout 
        singleColumn
        contentClassName="p-0"
        title="Sessions"
        small={false}
        subtitle="Monitor and manage all client sessions in one place"
        headerActions={
            <Button variant="brand" onClick={() => setIsModalOpen(true)}>
                <Plus size={18} /> New Session
            </Button>
        }
        mainContent={
          <>
            {mainContent}
            <CreateSessionModal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSessionCreate={handleSessionCreate}
            />
          </>
        }
      />
    </div>
  );
}
