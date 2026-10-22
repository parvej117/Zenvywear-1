import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Crown, 
  Scissors, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  Ruler, 
  SlidersHorizontal 
} from 'lucide-react';
import { Product, ProductCategory, ProductSize } from '../../types';
import { ProductCard } from '../shop/ProductCard';
import { Taka } from '../common/Taka';

interface MensCollectionPageProps {
  products: Product[];
  initialCategory?: ProductCategory | 'All';
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: ProductSize) => void;
  onBuyNow: (product: Product, size: ProductSize) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onNavigateToShop: () => void;
}

const MENS_CATEGORIES: { label: string; value: ProductCategory | 'All' }[] = [
  { label: "All Men's", value: 'All' },
  { label: 'Royal Panjabi', value: 'Royal Panjabi' },
  { label: 'Kabli Suit', value: 'Kabli Suit' },
  { label: 'Embroidered Waistcoat', value: 'Embroidered Waistcoat' },
  { label: 'Sherwani & Kurta', value: 'Sherwani & Kurta' },
  { label: 'Silk Sets', value: 'Men Silk Set' },
];

export const MensCollectionPage: React.FC<MensCollectionPageProps> = ({
  products,
  initialCategory = 'All',
  onQuickView,
  onAddToCart,
  onBuyNow,
  wishlist,
  onToggleWishlist,
  onNavigateToShop,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'bestseller'>('featured');
  const [priceCap, setPriceCap] = useState<number>(5000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  // Filter products belonging to Men's collection
  const mensProducts = useMemo(() => {
    return products.filter((p) => {
      // Must be men's gender or men's categories
      const isMen = p.gender === 'men' || ['Royal Panjabi', 'Kabli Suit', 'Embroidered Waistcoat', 'Sherwani & Kurta', 'Men Silk Set'].includes(p.category);
      if (!isMen) return false;

      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = p.name.toLowerCase().includes(q) || 
                      p.description.toLowerCase().includes(q) ||
                      p.fabricDetails.kameezFabric.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Price filter strictly within ৳0 - ৳5,000
      if (p.price > priceCap) return false;

      // Stock
      if (onlyInStock && (!p.inStock || p.stockCount <= 0)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'bestseller') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, sortBy, priceCap, onlyInStock]);

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Editorial Men's Collection Hero Banner */}
      <section className="relative overflow-hidden border-b border-[#D4AF66]/20 bg-gradient-to-b from-[#101318] via-[#080808] to-[#080808] py-16 sm:py-24">
        {/* Ambient deep gold/sapphire glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF66]/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#1e293b]/30 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#151922] border border-[#D4AF66]/40 text-[#D4AF66] text-xs">
              <Crown className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-widest text-[10px]">
                Royal Heritage Atelier • Men's Couture
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-white tracking-tight leading-[1.15]">
              Men's Royal Panjabi & <span className="text-gold-gradient block sm:inline">Kabli Couture</span>
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Exquisite masculine craftsmanship for Eid, weddings, and distinguished gatherings. Pure Tussar silk panjabis, structured linen Kabli suits, Banarasi brocade prince waistcoats, and regal handloom Jamdani weaves.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-neutral-400">
              <span className="flex items-center space-x-1.5 bg-[#141414] px-3 py-1.5 rounded-lg border border-neutral-800">
                <Scissors className="w-3.5 h-3.5 text-[#D4AF66]" />
                <span>Sizes 38 to 46 Custom Tailored</span>
              </span>
              <button 
                onClick={() => setShowSizeModal(true)}
                className="flex items-center space-x-1.5 bg-[#141414] hover:bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-[#D4AF66]/40 text-[#D4AF66] transition cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Panjabi Size Guide</span>
              </button>
              <span className="flex items-center space-x-1.5 bg-[#141414] px-3 py-1.5 rounded-lg border border-neutral-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>bKash & Nagad Verified (BDT ৳0–৳5,000)</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
        {/* Category Pills Slider */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-neutral-800 pb-6">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none w-full sm:w-auto">
            {MENS_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all border ${
                  selectedCategory === cat.value
                    ? 'bg-gold-gradient text-black font-semibold border-[#D4AF66] shadow-[0_0_15px_rgba(212,175,102,0.3)]'
                    : 'bg-[#121212] text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-neutral-500 uppercase tracking-wider text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#141414] border border-neutral-800 rounded-lg px-3 py-2 text-neutral-200 outline-none"
            >
              <option value="featured">Featured Atelier</option>
              <option value="bestseller">Top Rated & Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Active Count */}
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <div>
            Showing <strong className="text-[#D4AF66] font-mono text-sm">{mensProducts.length}</strong> royal masculine silhouettes
          </div>
          {(selectedCategory !== 'All' || searchQuery.trim() || priceCap < 5000 || onlyInStock) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setPriceCap(5000);
                setOnlyInStock(false);
              }}
              className="text-[#D4AF66] hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Product Grid */}
        {mensProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {mensProducts.map((product) => (
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
        ) : (
          <div className="py-20 text-center space-y-4 bg-[#101010] rounded-2xl border border-neutral-800 p-8">
            <div className="w-12 h-12 rounded-full bg-[#1c1912] border border-[#D4AF66]/40 flex items-center justify-center text-[#D4AF66] mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-lg text-white font-bold">No Silhouettes Matched</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Try adjusting your category or filter selection to explore more royal panjabi and kabli designs.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-semibold text-xs"
            >
              View All Men's Collection
            </button>
          </div>
        )}

        {/* Men's Craftsmanship Editorial Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-neutral-800">
          <div className="bg-[#121212] p-5 rounded-xl border border-neutral-800 space-y-2">
            <h4 className="font-cinzel text-sm font-bold text-[#D4AF66]">Tussar & Raw Silk</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Breathable, lustrous handloom silk that maintains sharp tailoring and wrinkle resistance throughout all-day Eid festivities.
            </p>
          </div>
          <div className="bg-[#121212] p-5 rounded-xl border border-neutral-800 space-y-2">
            <h4 className="font-cinzel text-sm font-bold text-[#D4AF66]">Structured Kabli Tailoring</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Meticulous shoulder epaulets, double-needle topstitching, and customized Pathani shalwars crafted for commanding presence.
            </p>
          </div>
          <div className="bg-[#121212] p-5 rounded-xl border border-neutral-800 space-y-2">
            <h4 className="font-cinzel text-sm font-bold text-[#D4AF66]">Brocade Prince Waistcoats</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Opulent Mughal gold and brass shank buttons with Banarasi woven floral patterns for formal dinners and groom celebrations.
            </p>
          </div>
        </div>
      </section>

      {/* Men's Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#121212] border border-[#D4AF66]/40 rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-cinzel text-base font-bold text-white flex items-center space-x-2">
                <Ruler className="w-4 h-4 text-[#D4AF66]" />
                <span>Men's Panjabi & Kabli Size Guide</span>
              </h3>
              <button 
                onClick={() => setShowSizeModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <table className="w-full text-xs text-neutral-300 text-left">
              <thead>
                <tr className="border-b border-neutral-800 text-[#D4AF66]">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest (Inches)</th>
                  <th className="py-2">Length (Inches)</th>
                  <th className="py-2">Shoulder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                <tr><td className="py-2 font-bold text-white">38 (S)</td><td>38–39"</td><td>40"</td><td>17.5"</td></tr>
                <tr><td className="py-2 font-bold text-white">40 (M)</td><td>40–41"</td><td>42"</td><td>18.0"</td></tr>
                <tr><td className="py-2 font-bold text-white">42 (L)</td><td>42–43"</td><td>44"</td><td>18.5"</td></tr>
                <tr><td className="py-2 font-bold text-white">44 (XL)</td><td>44–45"</td><td>44"</td><td>19.0"</td></tr>
                <tr><td className="py-2 font-bold text-white">46 (XXL)</td><td>46–47"</td><td>46"</td><td>19.5"</td></tr>
              </tbody>
            </table>

            <p className="text-[11px] text-neutral-400">
              * For custom measurements or tailored alterations, reach our concierge on WhatsApp (+880 1712-345678).
            </p>

            <button
              onClick={() => setShowSizeModal(false)}
              className="w-full py-2.5 bg-[#181818] hover:bg-[#202020] border border-neutral-700 rounded-xl text-xs font-semibold text-white"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
