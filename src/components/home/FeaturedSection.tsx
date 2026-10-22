import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Clock, Flame, Award, HeartHandshake } from 'lucide-react';
import { Product, ProductSize } from '../../types';
import { ProductCard } from '../shop/ProductCard';
import { Taka } from '../common/Taka';

interface FeaturedSectionProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: ProductSize) => void;
  onBuyNow: (product: Product, size: ProductSize) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onViewAll: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products,
  onQuickView,
  onAddToCart,
  onBuyNow,
  wishlist,
  onToggleWishlist,
  onViewAll,
}) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'bestsellers' | 'offers'>('featured');

  // Interactive countdown timer for special offers (e.g. 14 hours 28 mins)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'new':
        return products.filter((p) => p.isNewArrival);
      case 'bestsellers':
        return products.filter((p) => p.isBestSeller);
      case 'offers':
        return products.filter((p) => p.isSpecialOffer || (p.discountPercentage && p.discountPercentage >= 15));
      case 'featured':
      default:
        return products.filter((p) => p.featured || p.isBestSeller).slice(0, 8);
    }
  };

  const displayedProducts = getFilteredProducts();

  return (
    <section className="py-16 sm:py-24 bg-[#080808] border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#D4AF66] mb-2 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Royal Wardrobe</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-tight">
              Featured Collections
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF66] mt-2" />
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-[#121212] p-1.5 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'featured'
                  ? 'bg-gold-gradient text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Featured
            </button>

            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'new'
                  ? 'bg-gold-gradient text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              New Arrivals
            </button>

            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                activeTab === 'bestsellers'
                  ? 'bg-gold-gradient text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Best Sellers
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition flex items-center space-x-1.5 ${
                activeTab === 'offers'
                  ? 'bg-[#b91c1c] text-white font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#ff7979]" />
              <span>Special Offers</span>
            </button>
          </div>
        </div>

        {/* Special Offers Countdown Banner if 'offers' tab is active */}
        {activeTab === 'offers' && (
          <div className="mb-8 bg-gradient-to-r from-[#200b0f] via-[#14080a] to-[#200b0f] border border-[#b91c1c]/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-[#ff6b6b]" />
              <div>
                <span className="text-sm font-cinzel font-bold text-white block">
                  Flash Festive Deals Ending Soon
                </span>
                <span className="text-xs text-neutral-400">
                  Save up to 25% on selected Three-Piece sets and Sarees
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <div className="bg-black/80 px-2.5 py-1.5 rounded border border-neutral-800 text-center">
                <span className="text-base font-bold text-[#ff6b6b] block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-neutral-400 uppercase">Hours</span>
              </div>
              <span className="text-[#ff6b6b] font-bold">:</span>
              <div className="bg-black/80 px-2.5 py-1.5 rounded border border-neutral-800 text-center">
                <span className="text-base font-bold text-[#ff6b6b] block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-neutral-400 uppercase">Mins</span>
              </div>
              <span className="text-[#ff6b6b] font-bold">:</span>
              <div className="bg-black/80 px-2.5 py-1.5 rounded border border-neutral-800 text-center">
                <span className="text-base font-bold text-[#ff6b6b] block">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] text-neutral-400 uppercase">Secs</span>
              </div>
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <button
            onClick={onViewAll}
            className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl border border-[#D4AF66] text-[#D4AF66] hover:bg-[#D4AF66] hover:text-black font-cinzel text-xs font-bold uppercase tracking-widest transition-all duration-300"
          >
            <span className="flex items-center">
              <span>View All Collections (</span><Taka className="w-3 h-3 mx-0.5 inline" />0 - <Taka className="w-3 h-3 mx-0.5 inline" />5,000)
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
