import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import { SimpleDropdown } from "../../components/common/UIElements";
import { WorkspaceLayout } from "../../components/layout/WorkspaceLayout";
import { Card, Typography, Button } from "../../components/ui";

export function UsersWorkspace() {
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const users = [
    { name: "Dr. Olivia Porter", role: "Admin", email: "olivia.porter@threadline.com", lastActive: "Just now" },
    { name: "Dr. James Wilson", role: "Clinician", email: "james.wilson@threadline.com", lastActive: "2 hours ago" },
    { name: "Sara Miller", role: "Clinician", email: "sara.miller@threadline.com", lastActive: "5 hours ago" },
    { name: "Michael Davies", role: "Coordinator", email: "michael.davies@threadline.com", lastActive: "Yesterday" },
    { name: "Jessica Thompson", role: "Clinician", email: "jessica.thompson@threadline.com", lastActive: "Yesterday" },
  ];

  const mainContent = (
    <Card className="p-0 overflow-hidden divide-y divide-divider flex flex-col">
        <div className="p-6 flex justify-between items-center gap-4 border-b border-divider bg-white">
          <div className="flex gap-4">
            <SimpleDropdown 
               label="Role" 
               value={roleFilter} 
               options={["All Roles", "Admin", "Clinician", "Coordinator"]} 
               onChange={setRoleFilter} 
            />
          </div>

          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
            <input 
              type="text" 
              placeholder="Search by Name or Email" 
              className="w-full h-11 pl-10 pr-4 border border-divider rounded-lg text-sm bg-white outline-none focus:border-primary/50 text-text-primary placeholder:text-text-disabled" 
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-divider">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary w-[25%]">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary w-[15%]">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary w-[30%]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary w-[20%]">Last Active</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-text-secondary w-[10%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-divider bg-white">
              {users.map((u, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{u.role}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{u.lastActive}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-brand text-sm font-medium hover:underline transition-all">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 flex justify-end items-center gap-4 text-sm text-text-secondary bg-gray-50 border-t border-divider">
          <div>Rows per page: 10</div>
          <div>1-{users.length} of {users.length}</div>
          <div className="flex gap-2">
              <button className="w-8 h-8 flex justify-center items-center rounded-md hover:bg-gray-200 text-text-secondary transition-colors">&lt;</button>
              <button className="w-8 h-8 flex justify-center items-center rounded-md hover:bg-gray-200 text-text-secondary transition-colors">&gt;</button>
          </div>
        </div>
    </Card>
  );

  return (
    <div className="pb-16 pt-8">
      <WorkspaceLayout 
        singleColumn 
        title="Users" 
        small={false}
        subtitle="Manage users and permissions within your organization." 
        headerActions={
          <Button variant="brand" icon={<Plus size={16} />}>
            Invite User
          </Button>
        }
        mainContent={mainContent} 
      />
    </div>
  );
}
