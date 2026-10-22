import React from 'react';
import { 
  CheckCircle, 
  Printer, 
  MessageSquare, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { Order } from '../../types';
import { Taka } from '../common/Taka';

interface OrderConfirmationPageProps {
  order: Order;
  onContinueShopping: () => void;
  onOpenAdminPortal?: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  onContinueShopping,
  onOpenAdminPortal,
}) => {
  const [copiedId, setCopiedId] = React.useState(false);

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const openWhatsAppConfirmation = () => {
    const text = encodeURIComponent(
      `Hello ZenvyWear Support! I have just placed Order #${order.id} for ৳${order.totalAmount} (${order.payment.method}${
        order.payment.transactionId ? `, TrxID: ${order.payment.transactionId}` : ''
      }). Please confirm verification when ready.`
    );
    window.open(`https://wa.me/8801712345678?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white py-12 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Top Success Badge */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-[#182315] border border-emerald-500/50 text-emerald-400 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#D4AF66] font-semibold">
              Thank You for Your Patronage
            </span>
            <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-tight">
              Order Registered Successfully
            </h1>
          </div>

          {/* Order ID Pill with Copy */}
          <div className="inline-flex items-center space-x-2 bg-[#141414] border border-[#D4AF66]/40 px-4 py-2 rounded-xl text-xs">
            <span className="text-neutral-400">Order Reference:</span>
            <span className="font-mono text-sm font-bold text-[#D4AF66]">
              {order.id}
            </span>
            <button
              onClick={handleCopyOrderId}
              className="text-neutral-400 hover:text-white transition ml-1"
              title="Copy Order ID"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Verification Status Alert for bKash/Nagad */}
        {order.payment.method !== 'Cash on Delivery' ? (
          <div className="bg-[#1c1409] border border-[#D4AF66]/50 rounded-2xl p-5 mb-8 text-xs text-neutral-300 space-y-2">
            <div className="flex items-center space-x-2 text-[#D4AF66] font-semibold text-sm">
              <Clock className="w-4 h-4" />
              <span>Status: Pending Manual Verification</span>
            </div>
            <p className="leading-relaxed">
              We received your submitted <strong>{order.payment.method} Transaction ID: {order.payment.transactionId}</strong> from <strong>{order.payment.senderNumber}</strong>. Our accounts desk is cross-referencing this against our merchant statement. You will receive an SMS confirmation once verified.
            </p>
            {onOpenAdminPortal && (
              <div className="pt-2 text-[11px] text-neutral-400">
                <span>(Shop Owner / Reviewer? </span>
                <button
                  onClick={onOpenAdminPortal}
                  className="text-[#D4AF66] underline font-medium hover:text-white"
                >
                  Open Admin Dashboard to verify this order
                </button>
                <span>)</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#0e1713] border border-emerald-500/40 rounded-2xl p-5 mb-8 text-xs text-neutral-300 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Status: Cash on Delivery Confirmed for Processing</span>
            </div>
            <p className="leading-relaxed">
              Our support team will place a brief phone call to <strong>{order.customer.phone}</strong> to confirm delivery timing before parcel dispatch.
            </p>
          </div>
        )}

        {/* Order Card Container for Display / Print */}
        <div id="printable-order-invoice" className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
          
          {/* Header of Invoice */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
            <div>
              <div className="text-xl font-cinzel font-bold text-white tracking-widest">
                ZENVY<span className="text-[#D4AF66]">WEAR</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[#D4AF66]">
                Dhaka Atelier Invoice
              </div>
            </div>

            <div className="text-xs sm:text-right text-neutral-400 font-mono">
              <div>Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
              <div>Invoice #: {order.id}</div>
              <div className="text-[#D4AF66]">Status: {order.status}</div>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                Delivery Recipient
              </span>
              <div className="font-semibold text-white text-sm">{order.customer.fullName}</div>
              <div className="text-neutral-300 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-[#D4AF66]" />
                <span>{order.customer.phone}</span>
              </div>
              {order.customer.email && (
                <div className="text-neutral-400">{order.customer.email}</div>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                Shipping Destination
              </span>
              <div className="text-neutral-300 leading-relaxed">
                {order.customer.fullAddress}
              </div>
              <div className="text-[#D4AF66] font-medium">
                District: {order.customer.district} ({order.customer.division} Division)
              </div>
              {order.customer.deliveryNotes && (
                <div className="text-[11px] text-neutral-400 italic">
                  Note: {order.customer.deliveryNotes}
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium block">
              Purchased Items
            </span>

            <div className="divide-y divide-neutral-800 border-y border-neutral-800">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover object-top rounded-lg bg-black border border-neutral-800"
                    />
                    <div>
                      <div className="font-medium text-white">{item.product.name}</div>
                      <div className="text-neutral-400 text-[11px]">
                        Size: {item.selectedSize} • Qty: {item.quantity}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-[#D4AF66] font-semibold flex items-center">
                    <Taka className="w-3 h-3 mr-0.5 inline" />{(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="space-y-2 text-xs pt-2">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal:</span>
              <span className="font-mono text-neutral-200 flex items-center">
                <Taka className="w-3 h-3 mr-0.5 inline" />{order.subtotal.toLocaleString()}
              </span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#D4AF66]">
                <span>Voucher Discount:</span>
                <span className="font-mono flex items-center">
                  -<Taka className="w-3 h-3 mr-0.5 inline" />{order.discountAmount.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex justify-between text-neutral-400">
              <span>Delivery Charge ({order.customer.district}):</span>
              <span className="font-mono text-neutral-200">
                {order.deliveryCharge === 0 ? (
                  <span className="text-emerald-400 font-bold">FREE</span>
                ) : (
                  <span className="flex items-center"><Taka className="w-2.5 h-2.5 mr-0.5 inline" />{order.deliveryCharge}</span>
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-neutral-800">
              <span className="font-cinzel">Total Paid / Payable:</span>
              <span className="font-cinzel text-xl text-[#D4AF66] flex items-center">
                <Taka className="w-4 h-4 mr-0.5 inline" />{order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method Record */}
          <div className="bg-[#161616] rounded-xl p-4 text-xs space-y-1 border border-neutral-800">
            <div className="text-neutral-400">
              Payment Method: <strong className="text-white">{order.payment.method}</strong>
            </div>
            {order.payment.senderNumber && (
              <div className="text-neutral-400">
                Sender Number: <strong className="text-white font-mono">{order.payment.senderNumber}</strong>
              </div>
            )}
            {order.payment.transactionId && (
              <div className="text-neutral-400">
                Transaction ID (TrxID): <strong className="text-[#D4AF66] font-mono">{order.payment.transactionId}</strong>
              </div>
            )}
            <div className="text-[11px] text-neutral-500 pt-1">
              Payment Status: <strong>{order.payment.status}</strong>
            </div>
          </div>

        </div>

        {/* Action Buttons: Print, WhatsApp, Continue */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#181818] hover:bg-[#202020] border border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center space-x-2 transition"
          >
            <Printer className="w-4 h-4 text-[#D4AF66]" />
            <span>Print Invoice Receipt</span>
          </button>

          <button
            onClick={openWhatsAppConfirmation}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/50 text-[#25D366] text-xs font-semibold flex items-center justify-center space-x-2 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Notify Support via WhatsApp</span>
          </button>

          <button
            onClick={onContinueShopping}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold-gradient text-black font-cinzel text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:scale-[1.01] transition"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
