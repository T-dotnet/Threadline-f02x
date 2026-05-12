import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Typography } from "./Typography";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
  className?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  width = 520,
  className 
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative bg-surface rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] border border-divider",
              className
            )}
            style={{ width, maxWidth: '100%' }}
          >
            {/* Header */}
            {title && (
              <div className="px-6 py-4 border-b border-divider flex items-center justify-between shrink-0">
                <Typography variant="h3">{title}</Typography>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full"
                >
                  <X size={18} className="text-text-secondary" />
                </Button>
              </div>
            )}

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-divider bg-gray-50/50 flex justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
