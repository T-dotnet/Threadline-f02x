/**
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  Badge,
  Modal,
  Avatar,
  TableFooter,
} from "../../components/ui";
import { StatusBadge } from "../../components/shared/StatusBadge";
import {
  History,
  ChevronRight,
  User,
  Calendar,
  ArrowRight,
  Info,
  Clock,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  Share2,
  FileText,
  Plus,
  Search,
} from "lucide-react";
import { MOCK_CHANGE_LOG, ChangeLogEntry } from "./mockChangeLog";
import { cn } from "../../lib/utils";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { ModalHeader } from "./modals/shared/ModalHeader";
import { ModalFooter } from "./modals/shared/ModalFooter";
import { EntityCard } from "./EntityCard";

export function ChangeLogWorkspace() {
  const [selectedEntry, setSelectedEntry] = useState<ChangeLogEntry | null>(
    null,
  );
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rpp, setRpp] = useState(10);

  const filteredLogs = MOCK_CHANGE_LOG.filter((log) => {
    const matchesFilter = filterType === "all" || log.entityType === filterType;
    const matchesSearch =
      log.summary.toLowerCase().includes(search.toLowerCase()) ||
      log.entityName.toLowerCase().includes(search.toLowerCase()) ||
      log.user.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pagedItems = filteredLogs.slice(page * rpp, (page + 1) * rpp);
  const total = Math.ceil(filteredLogs.length / rpp);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionBadge = (action: ChangeLogEntry["action"]) => {
    switch (action) {
      case "create":
        return <StatusBadge status="new" label="Create" />;
      case "modify":
        return <StatusBadge status="processing" label="Modify" />;
      case "status_change":
        return <StatusBadge status="ready" label="Status" />;
      case "share":
        return <StatusBadge status="clinician" label="Share" />;
      case "delete":
        return <StatusBadge status="deprecated" label="Delete" />;
      default:
        return null;
    }
  };

  const getEntityIcon = (type: ChangeLogEntry["entityType"]) => {
    switch (type) {
      case "session":
        return <Clock size={16} className="text-slate-400" />;
      case "assessment":
        return <FileText size={16} className="text-slate-400" />;
      case "client":
        return <User size={16} className="text-slate-400" />;
      default:
        return <History size={16} className="text-slate-400" />;
    }
  };

  const mainContent = (
    <div className="flex flex-col h-full">
      {/* Filters & Search */}
      <div className="p-6 bg-gray-50/30 border-b border-divider flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          {["all", "session", "assessment", "client", "evidence"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setFilterType(t);
                setPage(0);
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
                filterType === t
                  ? "bg-slate-100 text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-[320px]">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled"
          />
          <input
            placeholder="Search logs..."
            className="w-full pl-10 pr-4 h-10 border border-divider rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-divider">
              <th className="px-6 py-4" style={{ width: "18%" }}>
                <Typography
                  variant="label-micro"
                  className="text-text-primary uppercase font-bold tracking-wider"
                >
                  Entity
                </Typography>
              </th>
              <th className="px-6 py-4" style={{ width: "10%" }}>
                <Typography
                  variant="label-micro"
                  className="text-text-primary uppercase font-bold tracking-wider"
                >
                  Type
                </Typography>
              </th>
              <th className="px-6 py-4" style={{ width: "10%" }}>
                <Typography
                  variant="label-micro"
                  className="text-text-primary uppercase font-bold tracking-wider"
                >
                  Action
                </Typography>
              </th>
              <th className="px-6 py-4">
                <Typography
                  variant="label-micro"
                  className="text-text-primary uppercase font-bold tracking-wider"
                >
                  Summary
                </Typography>
              </th>
              <th className="px-6 py-4" style={{ width: "15%" }}>
                <Typography
                  variant="label-micro"
                  className="text-text-primary uppercase font-bold tracking-wider"
                >
                  User
                </Typography>
              </th>
              <th className="px-6 py-4" style={{ width: "12%" }}>
                <Typography
                  variant="label-micro"
                  className="text-text-primary uppercase font-bold tracking-wider"
                >
                  Timestamp
                </Typography>
              </th>
              <th className="px-6 py-4 text-right" style={{ width: "4%" }}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider bg-white">
            {pagedItems.map((log) => (
              <tr
                key={log.id}
                className="group hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedEntry(log)}
              >
                <td className="px-6 py-5">
                  <Typography
                    variant="body-sm"
                    className="text-text-primary font-medium truncate max-w-[200px]"
                    title={log.entityName}
                  >
                    {log.entityName}
                  </Typography>
                </td>
                <td className="px-6 py-5">
                  <Typography
                    variant="label-micro"
                    className="text-text-disabled uppercase tracking-wider"
                  >
                    {log.entityType}
                  </Typography>
                </td>
                <td className="px-6 py-5">{getActionBadge(log.action)}</td>
                <td className="px-6 py-5">
                  <Typography
                    variant="body-sm"
                    className="text-slate-600 leading-relaxed font-medium"
                  >
                    {log.summary}
                  </Typography>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-0.5">
                    <Typography
                      variant="body-sm"
                      className="text-text-primary font-medium"
                    >
                      {log.user.name}
                    </Typography>
                    <Typography
                      variant="label-micro"
                      className="text-text-disabled uppercase tracking-wider"
                    >
                      {log.user.role}
                    </Typography>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-[10px] text-text-disabled uppercase font-mono whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 group-hover:text-primary transition-colors"
                  >
                    <ChevronRight size={18} />
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
        e={Math.min((page + 1) * rpp, filteredLogs.length)}
        count={filteredLogs.length}
        className="bg-white border-t border-divider"
      />
    </div>
  );

  return (
    <div className="pb-16 pt-8">
      <WorkspaceLayout
        singleColumn
        contentClassName="p-0"
        title="Change Log"
        small={false}
        subtitle="Review audit history and modifications across all client systems"
        headerActions={
          <Button
            variant="outline"
            size="sm"
            className="h-10 flex items-center gap-2 text-slate-600 border-slate-200"
          >
            <Download size={14} /> Export Logs
          </Button>
        }
        mainContent={
          <>
            {mainContent}

            {/* Detail Modal */}
            <Modal
              isOpen={!!selectedEntry}
              onClose={() => setSelectedEntry(null)}
              width={600}
            >
              {selectedEntry && (
                <div className="flex flex-col">
                  <ModalHeader
                    title="Change Details"
                    subtitle={`Audit record of modifications by ${selectedEntry.user.name} on ${formatDate(selectedEntry.timestamp)}`}
                  />

                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 p-6">
                    <EntityCard
                      title={selectedEntry.entityName}
                      titleClassName="text-base font-bold leading-relaxed text-slate-800"
                      statusBadge={getActionBadge(selectedEntry.action)}
                      metadata={[
                        {
                          label: "Type",
                          value: (
                            <span className="uppercase">
                              {selectedEntry.entityType}
                            </span>
                          ),
                        },
                        {
                          label: "Date",
                          value: formatDate(selectedEntry.timestamp),
                        },
                      ]}
                      summary={selectedEntry.summary}
                      hoverable={false}
                    />

                    {selectedEntry.details?.reason && (
                      <EntityCard
                        title="Reason for Change"
                        titleClassName="text-sm text-text-disabled uppercase font-bold tracking-wider"
                        hoverable={false}
                      >
                        <Typography
                          variant="body-sm"
                          className="text-text-primary leading-relaxed italic"
                        >
                          "{selectedEntry.details.reason}"
                        </Typography>
                      </EntityCard>
                    )}

                    {selectedEntry.details?.changes &&
                      selectedEntry.details.changes.length > 0 && (
                        <EntityCard
                          title="Field Modifications"
                          titleClassName="text-sm text-text-disabled uppercase font-bold tracking-wider"
                          hoverable={false}
                        >
                          <div className="space-y-3">
                            {selectedEntry.details.changes.map((change, i) => (
                              <div key={i} className="flex flex-col gap-2">
                                <Typography
                                  variant="label-micro"
                                  className="text-text-disabled uppercase font-bold"
                                >
                                  {change.field}
                                </Typography>
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 bg-rose-50 border border-rose-100 rounded px-2 py-1">
                                    <Typography
                                      variant="body-xs"
                                      className="line-through text-rose-500 font-medium"
                                    >
                                      {change.oldValue}
                                    </Typography>
                                  </div>
                                  <ArrowRight
                                    size={14}
                                    className="text-text-disabled shrink-0"
                                  />
                                  <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded px-2 py-1">
                                    <Typography
                                      variant="body-xs"
                                      className="text-emerald-700 font-bold"
                                    >
                                      {change.newValue}
                                    </Typography>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </EntityCard>
                      )}

                    {selectedEntry.details?.metadata && (
                      <EntityCard
                        title="Meta Data"
                        titleClassName="text-sm text-text-disabled uppercase font-bold tracking-wider"
                        metadata={Object.entries(selectedEntry.details.metadata).map(([key, value]) => ({
                          label: key.toUpperCase(),
                          value: <span className="text-text-primary">{String(value)}</span>
                        }))}
                        hoverable={false}
                      />
                    )}

                    <div className="flex justify-end pt-2">
                      <Button
                        variant="brand"
                        onClick={() => setSelectedEntry(null)}
                      >
                        Close Details
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Modal>
          </>
        }
      />
    </div>
  );
}
