import React from 'react';

export function Breadcrumbs({ crumbs }: { crumbs: string[] }) {
  return (
    <div className="flex items-center gap-1 mb-4.5 text-[15px] text-[#0f172a] font-sans">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className={`transition-opacity duration-200 ${i < crumbs.length - 1 ? "cursor-pointer opacity-70 hover:opacity-100" : "cursor-default"}`}>
            {crumb}
          </span>
          {i < crumbs.length - 1 && <span className="text-slate-400 text-[13px]">/</span>}
        </span>
      ))}
    </div>
  );
}
