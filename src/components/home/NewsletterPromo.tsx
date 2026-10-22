import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Tag } from 'lucide-react';

interface NewsletterPromoProps {
  onShopNow: () => void;
}

export const NewsletterPromo: React.FC<NewsletterPromoProps> = ({ onShopNow }) => {
  const [copied, setCopied] = useState(false);
  const couponCode = 'ZENVY10';

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-[#D4AF66]/40 bg-gradient-to-r from-[#17120a] via-[#100d08] to-[#1a140b] p-8 sm:p-14 shadow-2xl">
          
          {/* Subtle gold ornamental accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF66]/10 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#7a5c21]/15 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#241c10] border border-[#D4AF66]/50 text-[#D4AF66] text-xs">
              <Tag className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                Privileged Welcome Offer
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-tight">
              Enjoy 10% Off Your First Couture Order
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Experience the uncompromised craftsmanship of ZenvyWear. Apply code at checkout on any Three-Piece or Saree ensemble.
            </p>

            {/* Promo Code Box */}
            <div className="inline-flex items-center space-x-3 bg-black/60 border border-[#D4AF66]/60 rounded-xl p-2 pl-4">
              <span className="font-mono text-sm sm:text-base font-bold text-[#D4AF66] tracking-widest">
                {couponCode}
              </span>
              <button
                onClick={handleCopy}
                className="bg-[#D4AF66] hover:bg-[#c29c53] text-black px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={onShopNow}
                className="inline-flex items-center space-x-2 text-xs font-cinzel font-semibold uppercase tracking-widest text-[#D4AF66] hover:text-white transition"
              >
                <span>Browse The Atelier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
