import React, { useState } from 'react';
import { ShieldCheck, RotateCcw, CreditCard, Truck, Lock, FileText } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'returns' | 'refunds' | 'shipping' | 'privacy'>('returns');

  return (
    <div className="min-h-screen bg-[#080808] text-white py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#161616] border border-[#D4AF66]/40 text-[#D4AF66] text-xs">
            <FileText className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Customer Protection & Policies
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-tight">
            Policies & Guarantees
          </h1>
          <div className="w-16 h-0.5 bg-[#D4AF66] mx-auto" />
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-[#121212] p-1.5 rounded-2xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'returns'
                ? 'bg-gold-gradient text-black font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            7-Day Exchange & Returns
          </button>

          <button
            onClick={() => setActiveTab('refunds')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'refunds'
                ? 'bg-gold-gradient text-black font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            bKash / Nagad Refunds
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'shipping'
                ? 'bg-gold-gradient text-black font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Nationwide Shipping
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === 'privacy'
                ? 'bg-gold-gradient text-black font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Privacy & Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-10 text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-6">
          
          {activeTab === 'returns' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#D4AF66]">
                <RotateCcw className="w-5 h-5" />
                <h2 className="text-lg font-cinzel font-bold text-white">
                  7-Day Return & Exchange Policy
                </h2>
              </div>

              <p>
                At ZenvyWear, we want every garment to fit with sovereign grace. If your ordered Three-Piece, Kurti, or Saree does not meet your sizing expectations or presents any fabric imperfection, you have <strong>7 full days from the date of courier delivery</strong> to request an exchange or return.
              </p>

              <h4 className="font-semibold text-white pt-2">Eligibility Criteria for Return / Exchange:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
                <li>The garment must be unworn, unwashed, and free from perfume, makeup, or deodorant marks.</li>
                <li>All original ZenvyWear brand tags, zardozi care cards, and designer packaging must be intact.</li>
                <li>Unstitched three-piece fabrics that have already been cut or altered by your personal tailor cannot be returned.</li>
              </ul>

              <h4 className="font-semibold text-white pt-2">How to Initiate:</h4>
              <p>
                Simply message our WhatsApp Concierge at <strong>+880 1712-345678</strong> with your Order ID and photo of the item. Our courier partner (Steadfast) will pick up the parcel from your doorstep anywhere in Bangladesh.
              </p>
            </div>
          )}

          {activeTab === 'refunds' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#D4AF66]">
                <CreditCard className="w-5 h-5" />
                <h2 className="text-lg font-cinzel font-bold text-white">
                  bKash & Nagad Refund Timelines
                </h2>
              </div>

              <p>
                For approved returns where an exchange is not desired, we issue direct manual refunds through <strong>bKash</strong> or <strong>Nagad</strong>.
              </p>

              <div className="bg-[#181818] p-4 rounded-xl border border-neutral-700 space-y-2">
                <div className="font-semibold text-white">Refund Processing Timeline:</div>
                <p className="text-xs text-neutral-400">
                  Once your returned item arrives at our Banani studio and passes inspection (usually within 24 hours of receipt), our finance team executes the refund via bKash/Nagad "Send Money" within <strong>3 to 5 business days</strong>.
                </p>
              </div>

              <p className="text-neutral-400 text-xs">
                You will receive a notification SMS containing the refund Transaction ID (TrxID) as soon as the transfer is completed.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#D4AF66]">
                <Truck className="w-5 h-5" />
                <h2 className="text-lg font-cinzel font-bold text-white">
                  Nationwide Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#181818] p-4 rounded-xl border border-neutral-800">
                  <div className="font-bold text-[#D4AF66] text-sm mb-1">Inside Dhaka Metropolitan</div>
                  <div className="text-xs text-neutral-300">Delivery Fee: ৳70</div>
                  <div className="text-xs text-neutral-400 mt-1">Timeline: 24 to 48 hours</div>
                </div>

                <div className="bg-[#181818] p-4 rounded-xl border border-neutral-800">
                  <div className="font-bold text-[#D4AF66] text-sm mb-1">Outside Dhaka (64 Districts)</div>
                  <div className="text-xs text-neutral-300">Delivery Fee: ৳130</div>
                  <div className="text-xs text-neutral-400 mt-1">Timeline: 3 to 5 business days</div>
                </div>
              </div>

              <p className="text-xs text-neutral-400">
                <strong>Free Delivery:</strong> All orders with a subtotal of <strong>৳4,000 or above</strong> automatically qualify for complimentary nationwide shipping.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#D4AF66]">
                <Lock className="w-5 h-5" />
                <h2 className="text-lg font-cinzel font-bold text-white">
                  Privacy Policy & Data Security
                </h2>
              </div>

              <p>
                ZenvyWear is committed to safeguarding your personal information. We collect only the data necessary to fulfill your couture orders: recipient full name, contact phone number, delivery address, and transaction IDs for manual payment matching.
              </p>

              <h4 className="font-semibold text-white pt-2">Our Strict Guarantees:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-400">
                <li>We <strong>never sell, lease, or share</strong> your telephone number or address with third-party telemarketers.</li>
                <li>Your delivery information is shared only with our dedicated courier logistics partner for parcel handover.</li>
                <li>We do not store credit card CVVs or personal banking PINs. All bKash and Nagad payments are processed through your personal mobile apps.</li>
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
