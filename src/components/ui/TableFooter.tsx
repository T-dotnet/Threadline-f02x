import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";
import { Typography } from "./Typography";

interface TableFooterProps {
  page: number;
  setPage: (page: number | ((p: number) => number)) => void;
  rpp: number;
  setRpp: (rpp: number) => void;
  total: number;
  s: number;
  e: number;
  count: number;
  className?: string;
}

export function TableFooter({ page, setPage, rpp, setRpp, total, s, e, count, className }: TableFooterProps) {
  const [rppOpen, setRppOpen] = useState(false);

  return (
    <div className={cn(
      "flex items-center justify-end gap-6 px-4 py-2 bg-gray-50/50 border-t border-divider",
      className
    )}>
      <div className="flex items-center gap-2 relative">
        <Typography variant="body-sm">Rows per page:</Typography>
        <button 
          onClick={() => setRppOpen(o => !o)} 
          className="flex items-center gap-1 text-xs font-medium text-text-primary hover:bg-gray-100 px-2 py-1 rounded transition-colors"
        >
          {rpp}
          <ChevronDown size={14} className={cn("transition-transform duration-200", rppOpen && "rotate-180")} />
        </button>
        
        <AnimatePresence>
          {rppOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setRppOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full right-0 mb-1 min-w-[80px] bg-white border border-divider rounded-lg shadow-xl z-20 overflow-hidden"
              >
                {[5, 10, 25, 50].map(n => (
                  <button 
                    key={n} 
                    onClick={() => { setRpp(n); setPage(0); setRppOpen(false); }}
                    className={cn(
                      "w-full text-left px-4 py-2 text-xs transition-colors hover:bg-gray-50",
                      n === rpp ? "bg-primary-light text-primary font-medium" : "text-text-primary"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <Typography variant="body-sm" className="min-w-[80px] text-right">
        {count === 0 ? "0" : `${s}–${e}`} of {count}
      </Typography>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          className="w-8 h-8 rounded-full"
        >
          <ChevronLeft size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPage(p => Math.min(total - 1, p + 1))}
          disabled={page >= total - 1}
          className="w-8 h-8 rounded-full"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
