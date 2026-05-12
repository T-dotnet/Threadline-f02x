import React from 'react';
import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ToastProps {
  message: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div 
        initial={{ opacity: 0, y: 20, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 20, x: "-50%" }}
        className="fixed bottom-10 left-[55%] -translate-x-1/2 bg-[#2e7d32] text-white px-6 py-3 rounded-lg shadow-xl z-[2000] flex items-center gap-2 text-sm font-medium"
      >
        <Check size={18} strokeWidth={3} />
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);
