import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  RotateCcw, 
  ChevronDown,
  Tag,
  Filter
} from 'lucide-react';
import { Product, ProductCategory, ProductSize } from '../../types';
import { ProductCard } from './ProductCard';
import { Taka, renderWithTaka } from '../common/Taka';

interface ShopPageProps {
  products: Product[];
  initialCategory?: ProductCategory | 'All';
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: ProductSize) => void;
  onBuyNow: (product: Product, size: ProductSize) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

const ALL_CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Three Piece',
  'Royal Panjabi',
  'Kabli Suit',
  'Embroidered Waistcoat',
  'Saree',
  'Two Piece',
  'Kurti',
  'Sherwani & Kurta',
  'Hijab Collection',
  'Western Wear',
];

const WOMENS_CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Three Piece',
  'Two Piece',
  'Saree',
  'Kurti',
  'Hijab Collection',
  'Western Wear',
];

const MENS_CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Royal Panjabi',
  'Kabli Suit',
  'Embroidered Waistcoat',
  'Sherwani & Kurta',
  'Men Silk Set',
];

const SIZES: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', '38', '40', '42', '44', '46'];

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  initialCategory = 'All',
  onQuickView,
  onAddToCart,
  onBuyNow,
  wishlist,
  onToggleWishlist,
}) => {
  // Filters
  const [departmentFilter, setDepartmentFilter] = useState<'All' | 'women' | 'men'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>(initialCategory);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [selectedSize, setSelectedSize] = useState<ProductSize | 'All'>('All');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'bestseller'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync if initialCategory prop changes
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Department filter
      if (departmentFilter !== 'All') {
        const isMen = prod.gender === 'men' || ['Royal Panjabi', 'Kabli Suit', 'Embroidered Waistcoat', 'Sherwani & Kurta', 'Men Silk Set'].includes(prod.category);
        if (departmentFilter === 'men' && !isMen) return false;
        if (departmentFilter === 'women' && isMen) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesDesc = prod.description.toLowerCase().includes(q);
        const matchesFabric = prod.fabricDetails.kameezFabric.toLowerCase().includes(q);
        const matchesTag = prod.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesFabric && !matchesTag) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && prod.category !== selectedCategory) {
        return false;
      }

      // Price filter strictly within ৳0 - ৳5000
      if (prod.price < minPrice || prod.price > maxPrice) {
        return false;
      }

      // Size filter
      if (selectedSize !== 'All' && !prod.sizes.includes(selectedSize)) {
        return false;
      }

      // In-stock filter
      if (onlyInStock && (!prod.inStock || prod.stockCount <= 0)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'bestseller') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, departmentFilter, searchQuery, selectedCategory, minPrice, maxPrice, selectedSize, onlyInStock, sortBy]);

  const handleResetFilters = () => {
    setDepartmentFilter('All');
    setSearchQuery('');
    setSelectedCategory('All');
    setMinPrice(0);
    setMaxPrice(5000);
    setSelectedSize('All');
    setOnlyInStock(false);
    setSortBy('featured');
  };

  const hasActiveFilters = 
    departmentFilter !== 'All' ||
    searchQuery.trim() !== '' || 
    selectedCategory !== 'All' || 
    minPrice > 0 || 
    maxPrice < 5000 || 
    selectedSize !== 'All' || 
    onlyInStock;

  const currentCategories = departmentFilter === 'women' 
    ? WOMENS_CATEGORIES 
    : departmentFilter === 'men' 
    ? MENS_CATEGORIES 
    : ALL_CATEGORIES;

  const pageTitle = selectedCategory !== 'All' 
    ? `${selectedCategory} Collection`
    : departmentFilter === 'men' 
    ? "Men's Royal Couture Collection" 
    : departmentFilter === 'women' 
    ? "Women's Haute Couture Atelier" 
    : "All ZenvyWear Luxury Silhouettes";

  return (
    <div className="min-h-screen bg-[#080808] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-xs text-neutral-400 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#D4AF66]">Atelier Catalog</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-white">{selectedCategory}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 flex items-center flex-wrap gap-1">
                <span>Prices strictly between</span>
                <span className="inline-flex items-center text-neutral-300"><Taka className="w-3 h-3 mr-0.5 inline" />0</span>
                <span>and</span>
                <span className="inline-flex items-center text-neutral-300"><Taka className="w-3 h-3 mr-0.5 inline" />5,000 BDT</span>
                <span>• Delivered nationwide across Bangladesh</span>
              </p>
            </div>

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center justify-center space-x-2 bg-[#141414] border border-[#D4AF66]/40 hover:border-[#D4AF66] text-[#D4AF66] px-4 py-2.5 rounded-xl text-xs font-semibold"
            >
              <Filter className="w-4 h-4" />
              <span>Filters & Price Slider</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#D4AF66]" />
              )}
            </button>
          </div>
        </div>

        {/* Department Switcher Bar */}
        <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-neutral-900 overflow-x-auto">
          <span className="text-xs text-neutral-400 uppercase tracking-wider font-semibold mr-2 shrink-0">
            Collection:
          </span>
          <button
            onClick={() => {
              setDepartmentFilter('All');
              setSelectedCategory('All');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              departmentFilter === 'All'
                ? 'bg-gold-gradient text-black border-[#D4AF66] shadow'
                : 'bg-[#151515] text-neutral-300 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            All Atelier
          </button>
          <button
            onClick={() => {
              setDepartmentFilter('women');
              setSelectedCategory('All');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              departmentFilter === 'women'
                ? 'bg-gold-gradient text-black border-[#D4AF66] shadow'
                : 'bg-[#151515] text-neutral-300 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            Women's Collection
          </button>
          <button
            onClick={() => {
              setDepartmentFilter('men');
              setSelectedCategory('All');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              departmentFilter === 'men'
                ? 'bg-gold-gradient text-black border-[#D4AF66] shadow'
                : 'bg-[#151515] text-neutral-300 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            Men's Collection
          </button>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {currentCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-gold-gradient text-black border-transparent shadow-[0_0_12px_rgba(212,175,102,0.3)]'
                  : 'bg-[#121212] text-neutral-300 border-neutral-800 hover:border-neutral-600 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Layout: Left Sidebar Filters + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-[#0f0f0f] border border-neutral-800/80 rounded-2xl p-6 h-fit sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center space-x-2 text-sm font-cinzel font-bold text-white">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF66]" />
                <span>Refine Selection</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-[#D4AF66] hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Live Search Input */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Search Atelier
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Black, Organza, Saree..."
                  className="w-full bg-[#161616] border border-neutral-800 focus:border-[#D4AF66] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Price Filter Slider: ৳0 to ৳5,000 */}
            <div className="space-y-3 pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Price Range (BDT)
                </label>
                <span className="text-xs font-mono text-[#D4AF66] font-bold flex items-center">
                  <Taka className="w-3 h-3 mr-0.5 inline" />{minPrice.toLocaleString()} – <Taka className="w-3 h-3 mx-0.5 inline" />{maxPrice.toLocaleString()}
                </span>
              </div>

              {/* Slider for Max Price */}
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#D4AF66] cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Min Price</span>
                  <div className="bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 font-mono text-neutral-200 flex items-center">
                    <Taka className="w-2.5 h-2.5 mr-0.5 inline" />{minPrice}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">Max Price</span>
                  <div className="bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 font-mono text-[#D4AF66] font-bold flex items-center">
                    <Taka className="w-2.5 h-2.5 mr-0.5 inline" />{maxPrice}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-neutral-500 flex items-center">
                <span>All collections capped at</span>
                <Taka className="w-2.5 h-2.5 mx-0.5 inline" />
                <span>5,000 max.</span>
              </p>
            </div>

            {/* Size Filter */}
            <div className="space-y-2 pt-4 border-t border-neutral-800">
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                Size
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSize('All')}
                  className={`px-2.5 py-1 text-xs rounded border transition ${
                    selectedSize === 'All'
                      ? 'bg-[#D4AF66] text-black font-bold border-[#D4AF66]'
                      : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  All
                </button>
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 text-xs rounded border transition ${
                      selectedSize === sz
                        ? 'bg-[#D4AF66] text-black font-bold border-[#D4AF66]'
                        : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* In-stock Only Toggle */}
            <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs text-neutral-300">In Stock Only</span>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF66] cursor-pointer"
              />
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Toolbar: Result count & Sort */}
            <div className="bg-[#121212] border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-300">
                Showing <strong className="text-[#D4AF66]">{filteredProducts.length}</strong> of{' '}
                <strong className="text-white">{products.length}</strong> designs
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-neutral-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-[#1a1a1a] border border-neutral-700 text-neutral-200 text-xs rounded-lg px-3 py-1.5 outline-none focus:border-[#D4AF66]"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="bestseller">Popularity / Reviews</option>
                </select>
              </div>
            </div>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-400">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="bg-[#181818] border border-[#D4AF66]/50 text-xs text-[#D4AF66] px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <span>{selectedCategory}</span>
                    <button onClick={() => setSelectedCategory('All')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {maxPrice < 5000 && (
                  <span className="bg-[#181818] border border-[#D4AF66]/50 text-xs text-[#D4AF66] px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="flex items-center">Up to <Taka className="w-2.5 h-2.5 mx-0.5 inline" />{maxPrice}</span>
                    <button onClick={() => setMaxPrice(5000)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSize !== 'All' && (
                  <span className="bg-[#181818] border border-[#D4AF66]/50 text-xs text-[#D4AF66] px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <span>Size: {selectedSize}</span>
                    <button onClick={() => setSelectedSize('All')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {onlyInStock && (
                  <span className="bg-[#181818] border border-[#D4AF66]/50 text-xs text-[#D4AF66] px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <span>In Stock Only</span>
                    <button onClick={() => setOnlyInStock(false)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-neutral-400 hover:text-white underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-12 text-center space-y-4">
                <Sparkles className="w-8 h-8 text-[#D4AF66] mx-auto opacity-70" />
                <h3 className="text-lg font-cinzel font-bold text-white">
                  No Silhouettes Match Your Criteria
                </h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Try adjusting your price slider or clearing your category filters to view more couture items.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-semibold text-xs transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
            )}
          </main>

        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex justify-end lg:hidden">
          <div className="w-full max-w-sm bg-[#121212] h-full p-6 overflow-y-auto space-y-6 border-l border-neutral-800">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <span className="font-cinzel font-bold text-lg text-white">Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Category selection */}
            <div>
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium block mb-2">
                Category
              </label>
              <div className="flex flex-col space-y-1">
                {currentCategories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCategory(c)}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition ${
                      selectedCategory === c
                        ? 'bg-[#D4AF66] text-black font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Price Cap
                </label>
                <span className="text-xs font-mono text-[#D4AF66] font-bold flex items-center">
                  <Taka className="w-3 h-3 mr-0.5 inline" />0 – <Taka className="w-3 h-3 mx-0.5 inline" />{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#D4AF66]"
              />
            </div>

            {/* Size Filter */}
            <div>
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium block mb-2">
                Size
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSize('All')}
                  className={`px-3 py-1.5 text-xs rounded border ${
                    selectedSize === 'All'
                      ? 'bg-[#D4AF66] text-black font-bold'
                      : 'border-neutral-800 text-neutral-300'
                  }`}
                >
                  All
                </button>
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 text-xs rounded border ${
                      selectedSize === s
                        ? 'bg-[#D4AF66] text-black font-bold'
                        : 'border-neutral-800 text-neutral-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* In stock */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <span className="text-xs text-neutral-300">In Stock Only</span>
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 accent-[#D4AF66]"
              />
            </div>

            <div className="pt-6 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="w-1/2 py-3 rounded-xl border border-neutral-700 text-neutral-300 text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-3 rounded-xl bg-gold-gradient text-black text-xs font-bold"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
