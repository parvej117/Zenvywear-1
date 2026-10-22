import React from 'react';
import { Sparkles, Truck, ShieldCheck, X } from 'lucide-react';
import { renderWithTaka } from '../common/Taka';

interface AnnouncementBarProps {
  text: string;
  onTrackOrder?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ 
  text, 
  onTrackOrder 
}) => {
  return (
    <div className="bg-[#12100B] border-b border-[#D4AF66]/30 text-neutral-300 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF66] shrink-0" />
          <span className="font-medium tracking-wide text-neutral-200">
            {renderWithTaka(text)}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-[11px] text-neutral-400">
          <div className="flex items-center space-x-1">
            <Truck className="w-3.5 h-3.5 text-[#D4AF66]" />
            <span>Dhaka: 24-48h | Nationwide: 3-5 days</span>
          </div>
          <span className="text-neutral-700">|</span>
          {onTrackOrder && (
            <button 
              onClick={onTrackOrder}
              className="text-[#D4AF66] hover:underline font-medium hover:text-[#e4c27f] transition"
            >
              Track Order
            </button>
          )}
          <span className="hidden md:inline text-neutral-700">|</span>
          <span className="hidden md:inline text-neutral-400">
            Showroom: Banani, Dhaka
          </span>
        </div>
      </div>
    </div>
  );
};
