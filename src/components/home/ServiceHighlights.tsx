import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Gem, Clock, Headphones } from 'lucide-react';
import { renderWithTaka } from '../common/Taka';

export const ServiceHighlights: React.FC = () => {
  const highlights = [
    {
      icon: Gem,
      title: 'Premium Quality',
      description: 'Pure Organza, Swiss Lawn, and authentic Narayanganj Jamdani with intricate hand embroidery.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Ordering',
      description: 'Direct bKash & Nagad advance payment with manual merchant verification or Cash on Delivery.',
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      description: '24-48h express delivery inside Dhaka (৳70) & reliable doorstep delivery to all 64 districts (৳130).',
    },
    {
      icon: RotateCcw,
      title: '7-Day Easy Returns',
      description: 'Hassle-free size replacement and direct bKash/Nagad refund if fabric does not meet your expectations.',
    },
  ];

  return (
    <section className="py-14 bg-[#0a0a0a] border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#121212] p-6 rounded-xl border border-neutral-800 hover:border-[#D4AF66]/40 transition group flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1a1813] border border-[#D4AF66]/40 group-hover:border-[#D4AF66] text-[#D4AF66] flex items-center justify-center mb-4 transition shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-cinzel font-bold text-white group-hover:text-[#D4AF66] transition">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {renderWithTaka(item.description)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
