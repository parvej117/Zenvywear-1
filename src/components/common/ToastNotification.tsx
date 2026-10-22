import React, { useEffect } from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

interface ToastNotificationProps {
  message: string | null;
  onClose: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#151515] border border-[#D4AF66] text-white px-4 py-3 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.8)] flex items-center space-x-3 text-xs">
        <Sparkles className="w-4 h-4 text-[#D4AF66] shrink-0" />
        <span className="font-medium text-neutral-200">{message}</span>
        <button onClick={onClose} className="text-neutral-400 hover:text-white pl-2">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
