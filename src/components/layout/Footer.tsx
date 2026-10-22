import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  Heart
} from 'lucide-react';
import { ProductCategory } from '../../types';

interface FooterProps {
  onNavigate: (view: string, category?: ProductCategory) => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTracking,
  onOpenAdmin,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <footer className="bg-[#050505] border-t border-[#D4AF66]/20 text-neutral-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-900">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')}
              className="cursor-pointer inline-block"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-cinzel tracking-[0.25em] font-bold text-white">
                  ZENVY<span className="text-[#D4AF66]">WEAR</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-[#D4AF66] shadow-[0_0_8px_#D4AF66]" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF66] font-light mt-0.5">
                Elegance in Every Wear
              </p>
            </div>

            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
              Crafting contemporary South Asian luxury through hand-embroidered Three Pieces, heritage Jamdani sarees, and modest couture. Rooted in Dhaka's artisanal heritage with nationwide delivery.
            </p>

            {/* Flagship Showroom details */}
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-start space-x-2 text-neutral-300">
                <MapPin className="w-4 h-4 text-[#D4AF66] shrink-0 mt-0.5" />
                <span>House 42, Road 11, Block D, Banani (Near Kemal Ataturk Ave), Dhaka-1213</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300">
                <Phone className="w-4 h-4 text-[#D4AF66] shrink-0" />
                <span>Hotline / WhatsApp: +880 1712-345678</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300">
                <Mail className="w-4 h-4 text-[#D4AF66] shrink-0" />
                <span>concierge@zenvywear.com</span>
              </div>
              <div className="flex items-center space-x-2 text-neutral-400">
                <Clock className="w-4 h-4 text-[#D4AF66] shrink-0" />
                <span>Sat - Thu: 10:00 AM – 9:00 PM | Friday: 2:00 PM - 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold mb-4 border-b border-[#D4AF66]/20 pb-2">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => onNavigate('shop', 'Three Piece')} 
                  className="hover:text-[#D4AF66] transition"
                >
                  Three Piece Collection
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('shop', 'Saree')} 
                  className="hover:text-[#D4AF66] transition"
                >
                  Handloom Jamdani & Silk Sarees
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('shop', 'Two Piece')} 
                  className="hover:text-[#D4AF66] transition"
                >
                  Casual Two-Piece Sets
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('shop', 'Kurti')} 
                  className="hover:text-[#D4AF66] transition"
                >
                  Designer & Block Print Kurtis
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('shop', 'Hijab Collection')} 
                  className="hover:text-[#D4AF66] transition"
                >
                  Turkish Hijabs & Modest Caps
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('shop', 'Western Wear')} 
                  className="hover:text-[#D4AF66] transition"
                >
                  Satin Co-ords & Blazers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold mb-4 border-b border-[#D4AF66]/20 pb-2">
              Client Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={onOpenTracking} className="text-[#D4AF66] hover:underline transition flex items-center space-x-1">
                  <span>Track Order (bKash/Nagad)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-[#D4AF66] transition">
                  7-Day Return & Exchange Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-[#D4AF66] transition">
                  bKash/Nagad Refund Timelines
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-[#D4AF66] transition">
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#D4AF66] transition">
                  About ZenvyWear Craft
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#D4AF66] transition">
                  Visit Our Banani Studio
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-neutral-500 hover:text-white transition font-mono">
                  Shop Owner Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Privilege Club */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold mb-4 border-b border-[#D4AF66]/20 pb-2">
              Privilege Circle
            </h4>
            <p className="text-xs text-neutral-400 mb-3">
              Subscribe to receive private invitations to festive trunk shows and an instant ৳200 voucher on your first order.
            </p>

            {subscribed ? (
              <div className="bg-[#151515] border border-[#D4AF66]/50 rounded-lg p-3 text-xs text-[#D4AF66] flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#D4AF66]" />
                <span>Welcome! Use code <strong className="text-white">ZENVY10</strong> at checkout for 10% off.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-[#121212] border border-neutral-800 focus:border-[#D4AF66] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#D4AF66] hover:bg-[#b8954e] text-black font-semibold rounded text-xs transition flex items-center justify-center"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-neutral-500 block">
                  We respect your privacy. No spam ever.
                </span>
              </form>
            )}

            {/* Bangladesh Payment Methods Badges */}
            <div className="pt-4">
              <span className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-2 font-medium">
                Payment Partners in Bangladesh
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-[#D81B60]/10 border border-[#D81B60]/40 text-[#ff4081] text-[11px] font-bold rounded">
                  bKash
                </span>
                <span className="px-2.5 py-1 bg-[#F57C00]/10 border border-[#F57C00]/40 text-[#ffa726] text-[11px] font-bold rounded">
                  Nagad
                </span>
                <span className="px-2.5 py-1 bg-[#2E7D32]/10 border border-[#2E7D32]/40 text-[#81c784] text-[11px] font-bold rounded">
                  Cash on Delivery
                </span>
                <span className="px-2 py-1 bg-[#1a1a1a] border border-neutral-800 text-neutral-300 text-[10px] rounded">
                  Visa / Master
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} ZenvyWear Bangladesh. All Rights Reserved. Artisanal Haute Couture.
          </div>
          <div className="flex items-center space-x-6">
            <button onClick={() => onNavigate('policies')} className="hover:text-neutral-300">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('policies')} className="hover:text-neutral-300">
              Terms & Conditions
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-neutral-300">
              Dhaka Showroom
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
