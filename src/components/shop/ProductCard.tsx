import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Eye, 
  Sparkles, 
  Check, 
  Zap, 
  Star 
} from 'lucide-react';
import { Product, ProductSize } from '../../types';
import { Taka } from '../common/Taka';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: ProductSize) => void;
  onBuyNow: (product: Product, size: ProductSize) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'Free Size');
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length > 1 && !showSizePicker) {
      setShowSizePicker(true);
      return;
    }
    onAddToCart(product, selectedSize);
    setShowSizePicker(false);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow(product, selectedSize);
  };

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group relative bg-[#121212] rounded-xl overflow-hidden border border-neutral-800 hover:border-[#D4AF66]/70 transition-all duration-500 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-[0_12px_35px_rgba(212,175,102,0.18)] hover:-translate-y-1"
    >
      {/* Image Container with Badges & Secondary Image Crossfade */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0c0c0c]">
        {/* Primary Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-cover object-top transition-transform duration-700 ${
            product.images[1] ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-105'
          }`}
        />

        {/* Secondary Editorial Shot on Hover */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 w-full h-full object-cover object-top opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none"
          />
        )}

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.gender === 'men' && (
            <span className="bg-[#1e293b] text-[#93c5fd] border border-[#3b82f6]/40 font-semibold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Men's Royal
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#D4AF66] text-black font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#1b4332] text-[#74c69d] border border-[#2d6a4f] font-semibold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              New Arrival
            </span>
          )}
          {product.discountPercentage && (
            <span className="bg-[#b91c1c] text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
              {product.discountPercentage}% Off
            </span>
          )}
        </div>

        {/* Top Right Wishlist & Quick View */}
        <div className="absolute top-3 right-3 flex flex-col space-y-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black border border-neutral-700 hover:border-[#D4AF66] flex items-center justify-center text-neutral-300 transition"
          >
            <Heart 
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-[#D4AF66] text-[#D4AF66]' : 'hover:text-[#D4AF66]'
              }`} 
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            title="Quick View"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black border border-neutral-700 hover:border-[#D4AF66] flex items-center justify-center text-neutral-300 hover:text-[#D4AF66] transition opacity-0 group-hover:opacity-100 sm:transition-opacity"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Stock status indicator at bottom of image */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px]">
          <span className="bg-black/70 px-2 py-0.5 rounded text-neutral-300 border border-neutral-800">
            {product.category}
          </span>
          <span className="text-[10px] font-medium text-emerald-400 bg-black/70 px-2 py-0.5 rounded border border-neutral-800">
            {product.inStock ? `${product.stockCount} in Stock` : 'Sold Out'}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
        <div>
          {/* Star Rating */}
          <div className="flex items-center space-x-1 mb-1">
            <div className="flex text-[#D4AF66]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) 
                      ? 'fill-[#D4AF66] text-[#D4AF66]' 
                      : 'text-neutral-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-neutral-400">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-cinzel font-semibold text-white group-hover:text-[#D4AF66] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Fabric mini-snippet */}
          <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
            {product.fabricDetails.kameezFabric}
          </p>
        </div>

        {/* Pricing in Bangladeshi Taka (strictly ৳0 to ৳5000) */}
        <div className="flex items-baseline space-x-2 pt-1 border-t border-neutral-900">
          <span className="text-lg font-cinzel font-bold text-[#D4AF66] flex items-center">
            <Taka className="w-3.5 h-3.5 mr-0.5 inline" />{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-neutral-500 line-through flex items-center">
              <Taka className="w-2.5 h-2.5 mr-0.5 inline text-neutral-500" />{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Available Sizes List */}
        <div className="flex items-center space-x-1.5 pt-0.5">
          <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Sizes:</span>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`text-[10px] px-1.5 py-0.5 rounded border transition ${
                  selectedSize === size
                    ? 'border-[#D4AF66] bg-[#D4AF66]/10 text-[#D4AF66] font-semibold'
                    : 'border-neutral-800 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleAdd}
            className={`w-full py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition border ${
              addedAnimation
                ? 'bg-emerald-900/60 border-emerald-500 text-emerald-300'
                : 'bg-[#181818] hover:bg-[#202020] border-neutral-700 hover:border-[#D4AF66] text-neutral-200'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF66]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuy}
            className="w-full py-2 px-2 rounded-lg bg-gold-gradient hover:opacity-95 text-black font-semibold text-xs flex items-center justify-center space-x-1 transition shadow-[0_0_12px_rgba(212,175,102,0.25)]"
          >
            <Zap className="w-3.5 h-3.5 text-black fill-black" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
