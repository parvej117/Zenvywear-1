import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  Zap, 
  Star, 
  Ruler, 
  MessageSquare, 
  PhoneCall,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Product, ProductSize } from '../../types';
import { Taka } from '../common/Taka';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: ProductSize, quantity: number, color?: string) => void;
  onBuyNow: (product: Product, size: ProductSize, quantity: number, color?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.sizes[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || 'Standard');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'fabric' | 'delivery' | 'reviews'>('fabric');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const openWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Hello ZenvyWear Concierge! I am inquiring about the "${product.name}" priced at ৳${product.price}. Could you please confirm fabric availability for size ${selectedSize}?`
    );
    window.open(`https://wa.me/8801712345678?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-[#101010] border border-[#D4AF66]/40 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black border border-neutral-700 hover:border-[#D4AF66] text-neutral-300 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-[#0a0a0a] flex flex-col space-y-4">
            {/* Main Showcase Image */}
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-black border border-neutral-800">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
              {product.discountPercentage && (
                <div className="absolute top-3 left-3 bg-[#b91c1c] text-white text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                  {product.discountPercentage}% Off
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                      activeImageIndex === idx
                        ? 'border-[#D4AF66] scale-105'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Direct WhatsApp Concierge Button */}
            <button
              onClick={openWhatsAppInquiry}
              className="w-full py-2.5 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>Ask Concierge on WhatsApp</span>
            </button>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#D4AF66] uppercase tracking-wider font-semibold">
                  {product.category}
                </span>

                <div className="flex items-center space-x-1">
                  <div className="flex text-[#D4AF66]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-[#D4AF66] text-[#D4AF66]'
                            : 'text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-neutral-400 font-mono text-[11px]">
                    {product.rating} ({product.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              {/* Product Title */}
              <h2 className="text-2xl font-cinzel font-bold text-white tracking-tight">
                {product.name}
              </h2>

              {/* Price in BDT (৳) */}
              <div className="flex flex-wrap items-baseline gap-3 pt-1 border-b border-neutral-900 pb-4">
                <span className="text-3xl font-cinzel font-bold text-[#D4AF66] flex items-center">
                  <Taka className="w-6 h-6 mr-1 inline" />{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-neutral-500 line-through flex items-center">
                    <Taka className="w-3.5 h-3.5 mr-0.5 inline text-neutral-500" />{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  Tax Included • Free Delivery over ৳4,000
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                    Available Palette: <strong className="text-[#D4AF66]">{selectedColor}</strong>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border min-h-[36px] ${
                          selectedColor === c
                            ? 'border-[#D4AF66] bg-[#221c10] text-[#D4AF66] font-bold shadow'
                            : 'border-neutral-800 text-neutral-300 hover:border-neutral-600'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector with Size Guide Link */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-neutral-300 font-medium">
                    Select Size: <strong className="text-[#D4AF66]">{selectedSize}</strong>
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    className="text-xs text-[#D4AF66] hover:underline flex items-center space-x-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide Chart</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                        selectedSize === sz
                          ? 'bg-[#D4AF66] text-black border-[#D4AF66] shadow-[0_0_10px_rgba(212,175,102,0.4)]'
                          : 'border-neutral-800 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                {/* Size guide popup inside details */}
                {showSizeGuide && (
                  <div className="bg-[#181818] border border-neutral-700 rounded-xl p-3 text-xs text-neutral-300 space-y-2 mt-2">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Standard Bangladeshi Tailoring (Inches)</span>
                      <button onClick={() => setShowSizeGuide(false)} className="text-neutral-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-700 text-[#D4AF66]">
                          <th className="py-1">Size</th>
                          <th>Chest</th>
                          <th>Kameez Length</th>
                          <th>Hip</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800 text-neutral-400">
                        <tr><td className="py-1 font-semibold text-white">S (36)</td><td>36"</td><td>42"</td><td>38"</td></tr>
                        <tr><td className="py-1 font-semibold text-white">M (38)</td><td>38"</td><td>44"</td><td>40"</td></tr>
                        <tr><td className="py-1 font-semibold text-white">L (40)</td><td>40"</td><td>44"</td><td>42"</td></tr>
                        <tr><td className="py-1 font-semibold text-white">XL (42)</td><td>42"</td><td>45"</td><td>44"</td></tr>
                        <tr><td className="py-1 font-semibold text-white">XXL (44)</td><td>44"</td><td>45"</td><td>46"</td></tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quantity Selector & Stock Indicator */}
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center border border-neutral-700 rounded-lg bg-[#141414]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-400 hover:text-white text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="px-3 py-1.5 text-neutral-400 hover:text-white text-sm"
                  >
                    +
                  </button>
                </div>

                <span className="text-xs text-neutral-400">
                  Stock: <strong className="text-emerald-400">{product.stockCount} available</strong>
                </span>
              </div>

              {/* Tabs: Fabric Specs / Delivery / Reviews */}
              <div className="pt-4 border-t border-neutral-900">
                <div className="flex items-center space-x-4 border-b border-neutral-800 mb-3 text-xs">
                  <button
                    onClick={() => setActiveTab('fabric')}
                    className={`pb-1.5 font-semibold transition border-b-2 ${
                      activeTab === 'fabric'
                        ? 'border-[#D4AF66] text-[#D4AF66]'
                        : 'border-transparent text-neutral-400 hover:text-white'
                    }`}
                  >
                    Fabric Details
                  </button>
                  <button
                    onClick={() => setActiveTab('delivery')}
                    className={`pb-1.5 font-semibold transition border-b-2 ${
                      activeTab === 'delivery'
                        ? 'border-[#D4AF66] text-[#D4AF66]'
                        : 'border-transparent text-neutral-400 hover:text-white'
                    }`}
                  >
                    Delivery & Returns
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-1.5 font-semibold transition border-b-2 ${
                      activeTab === 'reviews'
                        ? 'border-[#D4AF66] text-[#D4AF66]'
                        : 'border-transparent text-neutral-400 hover:text-white'
                    }`}
                  >
                    Client Reviews
                  </button>
                </div>

                {activeTab === 'fabric' && (
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    <div className="flex justify-between py-1 border-b border-neutral-800/60">
                      <span className="text-neutral-500">Kameez / Top:</span>
                      <span className="text-right font-medium">{product.fabricDetails.kameezFabric}</span>
                    </div>
                    {product.fabricDetails.salwarFabric && (
                      <div className="flex justify-between py-1 border-b border-neutral-800/60">
                        <span className="text-neutral-500">Salwar / Bottom:</span>
                        <span className="text-right font-medium">{product.fabricDetails.salwarFabric}</span>
                      </div>
                    )}
                    {product.fabricDetails.dupattaFabric && (
                      <div className="flex justify-between py-1 border-b border-neutral-800/60">
                        <span className="text-neutral-500">Dupatta / Scarf:</span>
                        <span className="text-right font-medium">{product.fabricDetails.dupattaFabric}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-neutral-800/60">
                      <span className="text-neutral-500">Embroidery & Work:</span>
                      <span className="text-right font-medium text-[#D4AF66]">{product.fabricDetails.workType}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-neutral-500">Care:</span>
                      <span className="text-right text-neutral-400">{product.fabricDetails.careInstructions}</span>
                    </div>
                  </div>
                )}

                {activeTab === 'delivery' && (
                  <div className="space-y-2 text-xs text-neutral-300">
                    <div className="flex items-start space-x-2">
                      <Truck className="w-4 h-4 text-[#D4AF66] shrink-0 mt-0.5" />
                      <span><strong>Inside Dhaka:</strong> ৳70 (Delivered within 24–48 hours)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Truck className="w-4 h-4 text-[#D4AF66] shrink-0 mt-0.5" />
                      <span><strong>Outside Dhaka (64 Districts):</strong> ৳130 (Delivered in 3–5 days via Steadfast)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RotateCcw className="w-4 h-4 text-[#D4AF66] shrink-0 mt-0.5" />
                      <span><strong>7-Day Returns:</strong> Free size exchange & prompt bKash refund</span>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-3 text-xs">
                    <div className="bg-[#151515] p-3 rounded-lg border border-neutral-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Tahmina K. (Banani, Dhaka)</span>
                        <span className="text-[10px] text-neutral-500">Verified Buyer</span>
                      </div>
                      <div className="flex text-[#D4AF66]">
                        {'★'.repeat(5)}
                      </div>
                      <p className="text-neutral-300 text-[11px]">
                        "The zardozi finish looks even richer in person than photos! Dupatta quality is exceptional."
                      </p>
                    </div>

                    <div className="bg-[#151515] p-3 rounded-lg border border-neutral-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">Nafisa S. (Chattogram)</span>
                        <span className="text-[10px] text-neutral-500">Verified Buyer</span>
                      </div>
                      <div className="flex text-[#D4AF66]">
                        {'★'.repeat(5)}
                      </div>
                      <p className="text-neutral-300 text-[11px]">
                        "Smooth bKash payment verification and arrived within 3 days. Beautiful packaging."
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="pt-4 border-t border-neutral-900 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedSize, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-neutral-700 hover:border-[#D4AF66] text-white font-semibold text-xs flex items-center justify-center space-x-2 transition"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF66]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, selectedSize, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-gold-gradient text-black font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-[0_0_15px_rgba(212,175,102,0.3)] hover:scale-[1.01] transition"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Buy Now (৳{(product.price * quantity).toLocaleString()})</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="text-xs text-neutral-400 hover:text-[#D4AF66] flex items-center space-x-1"
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#D4AF66] text-[#D4AF66]' : ''}`} />
                  <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="text-xs text-neutral-400 hover:text-white flex items-center space-x-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Design'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
