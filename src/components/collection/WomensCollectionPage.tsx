import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Filter, 
  Search, 
  RotateCcw, 
  Crown, 
  ChevronRight, 
  Scissors, 
  Layers, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';
import { Product, ProductCategory, ProductSize } from '../../types';
import { ProductCard } from '../shop/ProductCard';
import { Taka } from '../common/Taka';

interface WomensCollectionPageProps {
  products: Product[];
  initialCategory?: ProductCategory | 'All';
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: ProductSize) => void;
  onBuyNow: (product: Product, size: ProductSize) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onNavigateToShop: () => void;
}

const WOMENS_CATEGORIES: { label: string; value: ProductCategory | 'All' }[] = [
  { label: "All Women's", value: 'All' },
  { label: 'Three Piece', value: 'Three Piece' },
  { label: 'Two Piece', value: 'Two Piece' },
  { label: 'Saree', value: 'Saree' },
  { label: 'Kurti', value: 'Kurti' },
  { label: 'Hijab Couture', value: 'Hijab Collection' },
  { label: 'Western Atelier', value: 'Western Wear' },
];

export const WomensCollectionPage: React.FC<WomensCollectionPageProps> = ({
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

  // Filter products belonging to Women's collection
  const womensProducts = useMemo(() => {
    return products.filter((p) => {
      // If product has explicit gender, match women; otherwise match traditional women's categories
      const isWomen = p.gender === 'women' || !p.gender || ['Three Piece', 'Two Piece', 'Saree', 'Kurti', 'Hijab Collection', 'Western Wear'].includes(p.category);
      if (!isWomen) return false;

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

      // Price filter
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
      {/* Editorial Women's Collection Hero Banner */}
      <section className="relative overflow-hidden border-b border-[#D4AF66]/20 bg-gradient-to-b from-[#14100c] via-[#080808] to-[#080808] py-16 sm:py-24">
        {/* Ambient gold glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF66]/10 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#b91c1c]/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1b1710] border border-[#D4AF66]/40 text-[#D4AF66] text-xs">
              <Crown className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-widest text-[10px]">
                Haute Couture Atelier • Women's Collection
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-white tracking-tight leading-[1.15]">
              Women's Three-Piece & <span className="text-gold-gradient block sm:inline">Royal Couture</span>
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              Step into high-artistry Eastern opulence. Hand-stitched Zardozi needlework, pure organza silk, heavy jacquard dupattas, and artisanal Jamdani sarees tailored for festive galas, Eid celebrations, and heirloom wardrobes.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-neutral-400">
              <span className="flex items-center space-x-1.5 bg-[#141414] px-3 py-1.5 rounded-lg border border-neutral-800">
                <Scissors className="w-3.5 h-3.5 text-[#D4AF66]" />
                <span>Bespoke 3-Piece Tailoring</span>
              </span>
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
            {WOMENS_CATEGORIES.map((cat) => (
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
            Showing <strong className="text-[#D4AF66] font-mono text-sm">{womensProducts.length}</strong> luxury women's silhouettes
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
        {womensProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {womensProducts.map((product) => (
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
              Try adjusting your category or filter selection to explore more handcrafted three-pieces.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-semibold text-xs"
            >
              View All Women's Collection
            </button>
          </div>
        )}

        {/* Fabric & Artistry Editorial Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-neutral-800">
          <div className="bg-[#121212] p-5 rounded-xl border border-neutral-800 space-y-2">
            <h4 className="font-cinzel text-sm font-bold text-[#D4AF66]">Pure Organza Silk</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Woven from fine natural silk yarns offering radiant sheen, graceful bounce, and breathable drape across all seasons.
            </p>
          </div>
          <div className="bg-[#121212] p-5 rounded-xl border border-neutral-800 space-y-2">
            <h4 className="font-cinzel text-sm font-bold text-[#D4AF66]">Artisanal Jamdani Weave</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              UNESCO-recognized Bangladeshi heritage weaving from Narayanganj with intricate floral kalkas and gold zari thread.
            </p>
          </div>
          <div className="bg-[#121212] p-5 rounded-xl border border-neutral-800 space-y-2">
            <h4 className="font-cinzel text-sm font-bold text-[#D4AF66]">Mughal Zardozi Work</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Fine metallic threadwork, cutdana beads, and dabka needlecraft hand-embroidered by master artisans in Old Dhaka.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
