/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Logo } from "../shared/Logo";
import { Typography, Input, Button } from "../ui";

interface NavbarProps {
  onAvatarClick?: () => void;
  onAddClick?: () => void;
  isAdminView?: boolean;
}

export function Navbar({ onAvatarClick, onAddClick, isAdminView = false }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem = useMemo(() => {
    const path = location.pathname;
    const segments = [
      "Conditions", "Clients", "Patients", "Sessions",
      "Assessments", "Documents", "Resources", "Users", "Playground", "Changelog",
    ];
    for (const seg of segments) {
      if (path.startsWith(`/${seg.toLowerCase()}`)) return seg === "Changelog" ? "Change Log" : seg;
    }
    return "Clients";
  }, [location.pathname]);

  const navItems = ["Sessions", "Assessments", "Documents"];
  if (isAdminView) {
    navItems.push("Conditions", "Users", "Playground");
  }

  const handleNavItem = (item: string) => {
    navigate(`/${item.toLowerCase()}`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-divider h-16 px-6 md:px-[60px] flex items-center justify-between shadow-sm backdrop-blur-md bg-white/90">
      <div className="flex items-center gap-8">
        {/* Brand */}
        <div className="cursor-pointer" onClick={() => navigate("/clients")}>
          <Logo size={32} />
        </div>

        <div className="hidden lg:block w-px h-6 bg-divider" />

        {/* Primary Action */}
        <Button
          variant={activeItem === "Clients" ? "brand" : "ghost"}
          size="sm"
          onClick={() => navigate("/clients")}
          className="hidden md:flex font-bold tracking-tight rounded-full px-5"
        >
          Client Workspace
        </Button>
      </div>

      <div className="flex items-center gap-6">
        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden xl:block w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <Input
              placeholder="Search clients, notes..."
              className="pl-9 h-9 bg-gray-50/50 border-divider focus:bg-white text-xs"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddClick?.()}
            className="h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-lg border border-divider shadow-sm shrink-0"
          >
            <Plus size={20} />
          </Button>
        </div>

        <div className="hidden lg:block w-px h-6 bg-divider" />

        {/* Dynamic Nav Items */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item}
              onClick={() => handleNavItem(item)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                item === activeItem
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:text-primary hover:bg-gray-50"
              )}
            >
              {item}
            </button>
          ))}

          <div className="w-px h-4 bg-divider mx-1" />

          <button
            onClick={() => navigate("/changelog")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5",
              activeItem === "Change Log"
                ? "bg-primary-light text-primary"
                : "text-text-secondary hover:text-primary hover:bg-gray-50"
            )}
          >
            Change Log
          </button>

          <div className="w-px h-4 bg-divider mx-1" />
        </div>

        {/* User Profile */}
        <button
          onClick={onAvatarClick}
          className="flex items-center gap-3 pl-6 border-l border-divider transition-opacity hover:opacity-80"
        >
          <div className="hidden sm:block text-right">
            <Typography variant="label-micro" className="font-black text-primary">Dr. O. P.</Typography>
            <Typography variant="code" className="text-[9px] text-text-secondary">Clinician</Typography>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#e4e0dc] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden ring-1 ring-divider">
            <Typography variant="label-micro" className="text-primary font-black">OP</Typography>
          </div>
        </button>
      </div>
    </nav>
  );
}
