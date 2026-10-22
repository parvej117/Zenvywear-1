import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { CartItem } from '../../types';
import { Taka } from '../common/Taka';
import { useAuth } from '../../context/AuthContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  couponCode: string;
  appliedDiscount: number;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  freeDeliveryThreshold?: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  couponCode,
  appliedDiscount,
  onApplyCoupon,
  onRemoveCoupon,
  freeDeliveryThreshold = 4000,
}) => {
  const { isAuthenticated, openAuthModal, setRedirectIntent } = useAuth();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const ok = onApplyCoupon(promoInput.trim());
    if (!ok) {
      setPromoError('Invalid coupon code. Try ZENVY10 for 10% off.');
    } else {
      setPromoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-[#101010] h-full border-l border-[#D4AF66]/30 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-[#0a0a0a]">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF66]" />
            <h2 className="text-base font-cinzel font-bold text-white tracking-wide">
              Your Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Threshold Bar */}
        <div className="bg-[#151515] px-5 py-3 border-b border-neutral-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center space-x-1.5 text-neutral-300">
              <Truck className="w-4 h-4 text-[#D4AF66]" />
              {remainingForFreeDelivery === 0 ? (
                <span className="text-emerald-400 font-semibold">
                  Congratulations! You unlocked Free Nationwide Delivery!
                </span>
              ) : (
                <span className="flex items-center flex-wrap gap-1">
                  <span>Add</span>
                  <strong className="text-[#D4AF66] inline-flex items-center">
                    <Taka className="w-3 h-3 mr-0.5 inline" />{remainingForFreeDelivery.toLocaleString()}
                  </strong>
                  <span>more for Free Delivery</span>
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-neutral-500 flex items-center">
              <Taka className="w-2.5 h-2.5 mr-0.5 inline" />{subtotal}/<Taka className="w-2.5 h-2.5 mx-0.5 inline" />{freeDeliveryThreshold}
            </span>
          </div>

          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-gradient transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#181818] border border-neutral-800 flex items-center justify-center text-neutral-600">
                <ShoppingBag className="w-8 h-8 text-[#D4AF66]/40" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-cinzel font-semibold text-white">
                  Your Bag is Empty
                </h3>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Discover our curated collection of luxury Three-Pieces, Sarees, and festive couture.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onContinueShopping();
                }}
                className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-semibold text-xs transition"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="bg-[#141414] border border-neutral-800/80 rounded-xl p-3 flex space-x-3 group hover:border-neutral-700 transition"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-24 rounded-lg overflow-hidden bg-black shrink-0 border border-neutral-800">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-[11px] text-neutral-400 mt-0.5">
                        <span className="bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-neutral-800">
                          Size: <strong className="text-neutral-200">{item.selectedSize}</strong>
                        </span>
                        <span className="flex items-center"><Taka className="w-2.5 h-2.5 mr-0.5 inline" />{item.product.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                      className="text-neutral-500 hover:text-red-400 transition p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-neutral-800 rounded-lg bg-[#0e0e0e]">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        className="p-1 hover:text-[#D4AF66] text-neutral-400 text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        className="p-1 hover:text-[#D4AF66] text-neutral-400 text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-cinzel font-bold text-[#D4AF66] flex items-center">
                      <Taka className="w-3 h-3 mr-0.5 inline" />{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Subtotal, Coupon, and Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-800 bg-[#0a0a0a] space-y-4">
            
            {/* Promo Code Input */}
            {couponCode ? (
              <div className="flex items-center justify-between bg-[#181818] border border-[#D4AF66]/40 rounded-xl px-3 py-2 text-xs">
                <div className="flex items-center space-x-2">
                  <Tag className="w-3.5 h-3.5 text-[#D4AF66]" />
                  <span className="text-neutral-300">
                    Promo <strong className="text-[#D4AF66]">{couponCode}</strong> (-৳{appliedDiscount.toLocaleString()})
                  </span>
                </div>
                <button
                  onClick={onRemoveCoupon}
                  className="text-neutral-400 hover:text-white text-xs underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-1">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. ZENVY10)"
                    className="flex-1 bg-[#151515] border border-neutral-800 focus:border-[#D4AF66] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#202020] hover:bg-[#2a2a2a] border border-neutral-700 hover:border-[#D4AF66] text-neutral-200 text-xs font-semibold rounded-xl transition"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <span className="text-[11px] text-red-400 block">{promoError}</span>
                )}
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span className="font-mono text-neutral-200 flex items-center">
                  <Taka className="w-3 h-3 mr-0.5 inline" />{subtotal.toLocaleString()}
                </span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-[#D4AF66]">
                  <span>Voucher Discount:</span>
                  <span className="font-mono flex items-center">
                    -<Taka className="w-3 h-3 mr-0.5 inline" />{appliedDiscount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-neutral-400">
                <span>Estimated Delivery:</span>
                <span className="font-mono text-neutral-300">
                  {subtotal >= freeDeliveryThreshold ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    <span className="flex items-center">
                      <span>Calculated at Checkout (</span><Taka className="w-2.5 h-2.5 mx-0.5 inline" />70/<Taka className="w-2.5 h-2.5 mx-0.5 inline" />130)
                    </span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-neutral-800">
                <span className="font-cinzel">Total (Estimated):</span>
                <span className="font-cinzel text-lg font-bold text-[#D4AF66] flex items-center">
                  <Taka className="w-4 h-4 mr-0.5 inline" />{(subtotal - appliedDiscount).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  setRedirectIntent('checkout');
                  onClose();
                  openAuthModal('login', 'Please sign in or create an account to proceed to checkout.');
                } else {
                  onClose();
                  onProceedToCheckout();
                }
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gold-gradient text-black font-cinzel font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(212,175,102,0.3)] hover:scale-[1.01] transition min-h-[44px]"
            >
              <span>{isAuthenticated ? 'Proceed to Checkout' : 'Sign In & Checkout'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <p className="text-[10px] text-center text-neutral-500">
              Instant bKash, Nagad manual verification & Cash on Delivery available
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
