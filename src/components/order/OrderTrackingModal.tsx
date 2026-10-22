import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Compass, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [lookupQuery, setLookupQuery] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const q = lookupQuery.trim().toLowerCase();
    if (!q) {
      setFoundOrder(null);
      return;
    }

    const match = orders.find(
      (o) =>
        o.id.toLowerCase() === q ||
        o.customer.phone.replace(/[^0-9]/g, '') === q.replace(/[^0-9]/g, '') ||
        o.payment.transactionId?.toLowerCase() === q
    );

    setFoundOrder(match || null);
  };

  const getStepActiveIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Payment Verification':
        return 1;
      case 'Confirmed':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      case 'Cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const steps = [
    'Order Placed',
    'Payment Verification',
    'Confirmed & Tailoring',
    'Shipped via Courier',
    'Delivered',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-[#121212] border border-[#D4AF66]/40 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#D4AF66]" />
            <h2 className="text-lg font-cinzel font-bold text-white">
              Track Your Order Status
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="space-y-2">
          <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
            Enter Order ID, Phone Number, or TrxID:
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={lookupQuery}
                onChange={(e) => setLookupQuery(e.target.value)}
                placeholder="e.g. ZW-2026-8812 or 01711223344"
                className="w-full bg-[#181818] border border-neutral-700 focus:border-[#D4AF66] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 outline-none uppercase font-mono"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gold-gradient text-black font-semibold text-xs rounded-xl shadow-md"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Result */}
        {hasSearched && (
          <div>
            {!foundOrder ? (
              <div className="bg-[#181818] border border-neutral-800 rounded-xl p-6 text-center text-xs text-neutral-400 space-y-2">
                <AlertCircle className="w-6 h-6 text-neutral-500 mx-auto" />
                <p className="text-white font-medium">No order found with reference "{lookupQuery}"</p>
                <p>Please double-check the Order ID or phone number used during checkout.</p>
              </div>
            ) : (
              <div className="bg-[#161616] border border-neutral-800 rounded-xl p-5 space-y-5">
                
                {/* Order Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
                  <div>
                    <span className="font-mono text-sm font-bold text-[#D4AF66] block">
                      {foundOrder.id}
                    </span>
                    <span className="text-neutral-400 text-[11px]">
                      Placed on {new Date(foundOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    foundOrder.status === 'Delivered'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : foundOrder.status === 'Payment Verification'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700'
                      : foundOrder.status === 'Shipped'
                      ? 'bg-blue-950 text-blue-300 border border-blue-700'
                      : 'bg-[#222] text-neutral-200 border border-neutral-700'
                  }`}>
                    {foundOrder.status}
                  </span>
                </div>

                {/* Stepper Timeline */}
                <div className="py-2">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 z-0" />
                    {steps.map((st, idx) => {
                      const activeIndex = getStepActiveIndex(foundOrder.status);
                      const isCompleted = activeIndex >= idx;
                      const isCurrent = activeIndex === idx;

                      return (
                        <div key={st} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                              isCompleted
                                ? 'bg-[#D4AF66] text-black shadow-[0_0_10px_#D4AF66]'
                                : 'bg-[#202020] text-neutral-500 border border-neutral-700'
                            }`}
                          >
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <span className={`text-[9px] mt-1 text-center max-w-[60px] leading-tight ${
                            isCurrent ? 'text-[#D4AF66] font-bold' : 'text-neutral-500'
                          }`}>
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer & Payment Summary */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-neutral-800">
                  <div>
                    <span className="text-neutral-500 text-[10px] block uppercase">Recipient:</span>
                    <span className="text-white font-medium">{foundOrder.customer.fullName}</span>
                    <span className="text-neutral-400 block text-[11px]">{foundOrder.customer.district}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px] block uppercase">Payment:</span>
                    <span className="text-[#D4AF66] font-medium">{foundOrder.payment.method}</span>
                    {foundOrder.payment.transactionId && (
                      <span className="text-neutral-400 block text-[11px] font-mono">
                        Trx: {foundOrder.payment.transactionId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="pt-2 border-t border-neutral-800 text-xs">
                  <span className="text-neutral-500 text-[10px] block uppercase mb-1">
                    Ordered ({foundOrder.items.length}):
                  </span>
                  {foundOrder.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between text-neutral-300 py-0.5">
                      <span>{i.product.name} ({i.selectedSize}) × {i.quantity}</span>
                      <span className="font-mono text-[#D4AF66]">৳{(i.product.price * i.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-neutral-800 mt-2">
                    <span>Total Amount:</span>
                    <span className="text-[#D4AF66] font-mono">৳{foundOrder.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
