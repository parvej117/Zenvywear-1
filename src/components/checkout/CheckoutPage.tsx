import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Info, 
  MapPin, 
  Phone, 
  User, 
  Copy, 
  Check, 
  QrCode, 
  Building2, 
  Smartphone,
  Lock,
  Sparkles
} from 'lucide-react';
import { CartItem, CustomerInfo, PaymentMethod, Order, AdminSettings } from '../../types';
import { BANGLADESH_DISTRICTS } from '../../data/mockData';
import { Taka } from '../common/Taka';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface CheckoutPageProps {
  items: CartItem[];
  subtotal: number;
  appliedDiscount: number;
  couponCode?: string;
  adminSettings: AdminSettings;
  onBackToCart: () => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  subtotal,
  appliedDiscount,
  couponCode,
  adminSettings,
  onBackToCart,
  onOrderPlaced,
}) => {
  const { currentUser, customerToken, isAuthenticated, openAuthModal, refreshCustomerOrders } = useAuth();

  // Form fields pre-filled from customer account
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [fullAddress, setFullAddress] = useState(currentUser?.address || '');
  const [district, setDistrict] = useState(currentUser?.district || 'Dhaka');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Sync with currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.fullName);
      if (!phone) setPhone(currentUser.phone);
      if (!email) setEmail(currentUser.email);
      if (!fullAddress && currentUser.address) setFullAddress(currentUser.address);
      if (currentUser.district) setDistrict(currentUser.district);
    }
  }, [currentUser]);

  // Payment Category & Method
  const [paymentCategory, setPaymentCategory] = useState<'mfs' | 'cards' | 'bank' | 'qr' | 'cod'>('mfs');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [bankName, setBankName] = useState('City Bank PLC');
  const [accountReference, setAccountReference] = useState('');

  // Card details (if card selected)
  const [cardHolder, setCardHolder] = useState('');
  const [cardMasked, setCardMasked] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [serverError, setServerError] = useState('');

  // Calculate delivery fee based on selected district
  const selectedDistrictObj = BANGLADESH_DISTRICTS.find((d) => d.name === district);
  const isInsideDhaka = selectedDistrictObj ? selectedDistrictObj.isDhakaZone : district === 'Dhaka';

  const isFreeDelivery = subtotal >= adminSettings.freeDeliveryThreshold;
  const deliveryCharge = isFreeDelivery
    ? 0
    : isInsideDhaka
    ? adminSettings.dhakaDeliveryFee
    : adminSettings.outsideDhakaDeliveryFee;

  const totalAmount = subtotal - appliedDiscount + deliveryCharge;

  // Active payment number / account info
  const getActivePaymentAccount = () => {
    switch (paymentMethod) {
      case 'bKash':
        return { number: adminSettings.shopOwnerBkashNumber, type: adminSettings.bkashType };
      case 'Nagad':
        return { number: adminSettings.shopOwnerNagadNumber, type: adminSettings.nagadType };
      case 'Rocket':
        return { number: adminSettings.shopOwnerRocketNumber, type: adminSettings.rocketType };
      case 'Upay':
        return { number: adminSettings.shopOwnerUpayNumber, type: adminSettings.upayType };
      case 'tap':
        return { number: adminSettings.shopOwnerTapNumber, type: 'Personal' };
      default:
        return { number: adminSettings.shopOwnerBkashNumber, type: 'Personal' };
    }
  };

  const activeAccount = getActivePaymentAccount();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text.replace(/[^0-9]/g, ''));
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!fullName.trim()) errs.fullName = 'Please enter recipient full name.';

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      errs.phone = 'Mobile number is required.';
    } else if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      errs.phone = 'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).';
    }

    if (!fullAddress.trim() || fullAddress.trim().length < 8) {
      errs.fullAddress = 'Please enter full house/road/area address for accurate parcel delivery.';
    }

    if (!district) {
      errs.district = 'Please select your delivery district.';
    }

    // MFS Validation
    if (['bKash', 'Nagad', 'Rocket', 'Upay', 'tap'].includes(paymentMethod)) {
      const cleanSender = senderNumber.replace(/[^0-9]/g, '');
      if (!cleanSender) {
        errs.senderNumber = `Please enter your ${paymentMethod} sender number.`;
      } else if (cleanSender.length < 10) {
        errs.senderNumber = 'Please enter a valid sender mobile number.';
      }

      if (!transactionId.trim()) {
        errs.transactionId = `Please enter the Transaction ID (TrxID) from your ${paymentMethod} SMS or statement.`;
      } else if (transactionId.trim().length < 5) {
        errs.transactionId = 'Transaction ID is too short.';
      }
    }

    // Bank Transfer Validation
    if (paymentMethod === 'Bank Transfer') {
      if (!accountReference.trim()) {
        errs.accountReference = 'Please enter your bank transfer reference or deposit slip number.';
      }
    }

    // Bangla QR Validation
    if (paymentMethod === 'Bangla QR') {
      if (!transactionId.trim()) {
        errs.transactionId = 'Please enter the transaction reference from your banking app after scanning Bangla QR.';
      }
    }

    // Cards Validation (Card Simulator)
    if (paymentMethod === 'Visa' || paymentMethod === 'Mastercard') {
      if (!cardHolder.trim()) {
        errs.cardHolder = 'Cardholder name is required.';
      }
      if (!cardMasked.trim() || cardMasked.replace(/[^0-9]/g, '').length < 16) {
        errs.cardMasked = 'Please enter a valid 16-digit card number for simulated gateway session.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login', 'Please sign in or create an account to finalize your order.');
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const orderPayload = {
        items,
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          fullAddress: fullAddress.trim(),
          district,
          deliveryNotes: deliveryNotes.trim() || undefined,
        },
        payment: {
          method: paymentMethod,
          senderNumber: senderNumber ? senderNumber.trim() : undefined,
          transactionId: transactionId ? transactionId.trim().toUpperCase() : undefined,
          bankName: paymentMethod === 'Bank Transfer' ? bankName : undefined,
          accountReference: accountReference ? accountReference.trim() : undefined,
          shopNumberUsed: activeAccount.number,
        },
        couponCode,
      };

      // Call full-stack server endpoint /api/orders with customerToken
      const createdOrder = await api.createOrder(orderPayload, customerToken || undefined);
      await refreshCustomerOrders();
      setIsSubmitting(false);
      onOrderPlaced(createdOrder);
    } catch (err: any) {
      setIsSubmitting(false);
      setServerError(err.message || 'Error processing order. Please check your details and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation back */}
        <button
          onClick={onBackToCart}
          className="inline-flex items-center space-x-2 text-xs text-neutral-400 hover:text-[#D4AF66] mb-6 sm:mb-8 transition min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Shopping Bag</span>
        </button>

        {/* Guest Authentication Interstitial Banner if unauthenticated */}
        {!isAuthenticated && (
          <div className="mb-8 p-6 bg-[#16130b] border-2 border-[#D4AF66] rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center space-x-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-gold-gradient text-black flex items-center justify-center shrink-0 shadow">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-cinzel font-bold text-white">
                  Customer Sign-In Required Before Checkout
                </h3>
                <p className="text-xs text-neutral-300">
                  To securely confirm your order and track manual bKash/Nagad verification, please sign in or register your customer account.
                </p>
              </div>
            </div>

            <button
              onClick={() => openAuthModal('login', 'Please sign in or create an account to finalize your order.')}
              className="px-6 py-3 bg-gold-gradient text-black font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 transition whitespace-nowrap min-h-[44px]"
            >
              Sign In / Register
            </button>
          </div>
        )}

        <div className="mb-8 text-left">
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-white tracking-tight">
            Checkout & Sovereign Finalization
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {isAuthenticated ? (
              <span className="text-[#D4AF66]">
                Signed in as <strong>{currentUser?.fullName}</strong> ({currentUser?.email}) • Details pre-filled
              </span>
            ) : (
              'Carefully verify delivery destination and manual payment details • Calculated server-side'
            )}
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500 text-red-200 text-xs flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Left 7 Columns: Delivery & Payment Details */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              
              {/* Section 1: Customer & Delivery Address */}
              <div className="bg-[#101010] border border-neutral-800 rounded-2xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-xl">
                <div className="flex items-center space-x-2 pb-3 border-b border-neutral-800">
                  <MapPin className="w-5 h-5 text-[#D4AF66]" />
                  <h2 className="text-base sm:text-lg font-cinzel font-bold text-white">
                    1. Recipient & Shipping Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                      Recipient Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Farhana Sultana"
                      className={`w-full bg-[#161616] border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition min-h-[44px] ${
                        errors.fullName ? 'border-red-500' : 'border-neutral-800 focus:border-[#D4AF66]'
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-[11px] text-red-400 block">{errors.fullName}</span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                      Mobile Number (01XXXXXXXXX) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01712345678"
                      className={`w-full bg-[#161616] border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition font-mono min-h-[44px] ${
                        errors.phone ? 'border-red-500' : 'border-neutral-800 focus:border-[#D4AF66]'
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-red-400 block">{errors.phone}</span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="for order invoice receipt"
                      className="w-full bg-[#161616] border border-neutral-800 focus:border-[#D4AF66] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition min-h-[44px]"
                    />
                  </div>

                  {/* District Selection */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium">
                        District (64 Districts Covered) <span className="text-red-400">*</span>
                      </label>
                      <span className="text-[11px] text-[#D4AF66] font-medium flex items-center">
                        {isInsideDhaka ? (
                          <span className="flex items-center">Inside Dhaka (<Taka className="w-2.5 h-2.5 mx-0.5 inline" />70)</span>
                        ) : (
                          <span className="flex items-center">Outside Dhaka (<Taka className="w-2.5 h-2.5 mx-0.5 inline" />130)</span>
                        )}
                      </span>
                    </div>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-[#161616] border border-neutral-800 focus:border-[#D4AF66] text-white text-xs sm:text-sm rounded-xl px-4 py-3 outline-none min-h-[44px]"
                    >
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name} ({d.division} Division) — {d.isDhakaZone ? 'BDT 70 (24-48h)' : 'BDT 130 (3-5 days)'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Full Street Address */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                      Detailed Delivery Address (House, Road, Area, Landmark) <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={fullAddress}
                      onChange={(e) => setFullAddress(e.target.value)}
                      placeholder="e.g. House #24, Road #7, Block C, Banani / Flat 4B, Dhanmondi, Dhaka"
                      className={`w-full bg-[#161616] border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition ${
                        errors.fullAddress ? 'border-red-500' : 'border-neutral-800 focus:border-[#D4AF66]'
                      }`}
                    />
                    {errors.fullAddress && (
                      <span className="text-[11px] text-red-400 block">{errors.fullAddress}</span>
                    )}
                  </div>

                  {/* Delivery Instructions */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium block">
                      Optional Delivery Instructions
                    </label>
                    <input
                      type="text"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="e.g. Call before delivery, ring bell twice, etc."
                      className="w-full bg-[#161616] border border-neutral-800 focus:border-[#D4AF66] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Comprehensive Bangladesh Payment System */}
              <div className="bg-[#101010] border border-neutral-800 rounded-2xl p-5 sm:p-8 space-y-6 shadow-xl">
                <div className="flex items-center space-x-2 pb-3 border-b border-neutral-800">
                  <CreditCard className="w-5 h-5 text-[#D4AF66]" />
                  <h2 className="text-base sm:text-lg font-cinzel font-bold text-white">
                    2. Bangladesh Payment Methods
                  </h2>
                </div>

                {/* Category Selector Tabs: MFS, Cards, Bank, Bangla QR, COD */}
                <div className="flex flex-wrap items-center gap-1.5 bg-[#161616] p-1.5 rounded-xl border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentCategory('mfs');
                      setPaymentMethod('bKash');
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 min-h-[40px] ${
                      paymentCategory === 'mfs'
                        ? 'bg-[#D4AF66] text-black font-bold shadow'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>MFS (bKash/Nagad/Rocket)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentCategory('cards');
                      setPaymentMethod('Visa');
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 min-h-[40px] ${
                      paymentCategory === 'cards'
                        ? 'bg-[#D4AF66] text-black font-bold shadow'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Cards (Visa/Master)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentCategory('bank');
                      setPaymentMethod('Bank Transfer');
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 min-h-[40px] ${
                      paymentCategory === 'bank'
                        ? 'bg-[#D4AF66] text-black font-bold shadow'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Bank Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentCategory('qr');
                      setPaymentMethod('Bangla QR');
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 min-h-[40px] ${
                      paymentCategory === 'qr'
                        ? 'bg-[#D4AF66] text-black font-bold shadow'
                        : 'text-neutral-300 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Bangla QR</span>
                  </button>

                  {adminSettings.enableCod && (
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentCategory('cod');
                        setPaymentMethod('Cash on Delivery');
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 min-h-[40px] ${
                        paymentCategory === 'cod'
                          ? 'bg-emerald-600 text-white font-bold shadow'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Cash on Delivery</span>
                    </button>
                  )}
                </div>

                {/* Sub-method selections for MFS */}
                {paymentCategory === 'mfs' && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                    {(['bKash', 'Nagad', 'Rocket', 'Upay', 'tap'] as PaymentMethod[]).map((mfs) => (
                      <button
                        type="button"
                        key={mfs}
                        onClick={() => setPaymentMethod(mfs)}
                        className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center min-h-[50px] ${
                          paymentMethod === mfs
                            ? 'border-[#D4AF66] bg-[#221c11] text-[#D4AF66] font-bold shadow'
                            : 'border-neutral-800 bg-[#161616] text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <span className="text-xs">{mfs}</span>
                        <span className="text-[9px] text-neutral-400">Mobile Wallet</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Sub-method selection for Cards */}
                {paymentCategory === 'cards' && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Visa')}
                      className={`p-3 rounded-xl border text-center transition ${
                        paymentMethod === 'Visa'
                          ? 'border-[#D4AF66] bg-[#221c11] text-[#D4AF66] font-bold'
                          : 'border-neutral-800 bg-[#161616] text-neutral-300'
                      }`}
                    >
                      <span className="text-xs block font-bold">Visa Card</span>
                      <span className="text-[10px] text-neutral-400">Debit / Credit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Mastercard')}
                      className={`p-3 rounded-xl border text-center transition ${
                        paymentMethod === 'Mastercard'
                          ? 'border-[#D4AF66] bg-[#221c11] text-[#D4AF66] font-bold'
                          : 'border-neutral-800 bg-[#161616] text-neutral-300'
                      }`}
                    >
                      <span className="text-xs block font-bold">Mastercard</span>
                      <span className="text-[10px] text-neutral-400">Debit / Credit</span>
                    </button>
                  </div>
                )}

                {/* Payment Instructions & Credentials Box */}
                {paymentCategory === 'mfs' && (
                  <div className="bg-[#14110b] border border-[#D4AF66]/40 rounded-xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs uppercase tracking-wider text-[#D4AF66] font-semibold block">
                          Shop Owner Official {paymentMethod} Number ({activeAccount.type})
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-mono text-xl sm:text-2xl font-bold text-white tracking-widest">
                            {activeAccount.number}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(activeAccount.number)}
                            className="bg-[#241c10] hover:bg-[#332715] text-[#D4AF66] p-2 rounded-lg border border-[#D4AF66]/40 transition min-h-[36px]"
                            title="Copy Number"
                          >
                            {copiedNumber ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-neutral-400 block">Total Payable:</span>
                        <span className="font-cinzel text-lg font-bold text-[#D4AF66] flex items-center sm:justify-end">
                          <Taka className="w-4 h-4 mr-0.5 inline" />{totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-step instructions */}
                    <div className="bg-black/60 rounded-xl p-3.5 text-xs text-neutral-300 space-y-1.5 border border-neutral-800">
                      <div className="font-semibold text-white mb-1 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF66]" />
                        <span>How to complete manual {paymentMethod} payment:</span>
                      </div>
                      <p>1. Open your <strong>{paymentMethod} app</strong> or dial USSD.</p>
                      <p>2. Select <strong>{activeAccount.type === 'Merchant' ? 'Make Payment' : 'Send Money'}</strong>.</p>
                      <p>3. Enter shop recipient number: <strong className="text-[#D4AF66] font-mono">{activeAccount.number}</strong>.</p>
                      <p className="flex items-center flex-wrap gap-1">
                        <span>4. Amount to send:</span>
                        <strong className="text-[#D4AF66] inline-flex items-center">
                          <Taka className="w-3.5 h-3.5 mr-0.5 inline" />{totalAmount.toLocaleString()} BDT
                        </strong>
                      </p>
                      <p>5. Copy your <strong>Transaction ID (TrxID)</strong> and enter below with your sender mobile number.</p>
                    </div>

                    {/* Customer Inputs for Verification */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                          Your {paymentMethod} Sender Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className={`w-full bg-[#181818] border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none font-mono min-h-[44px] ${
                            errors.senderNumber ? 'border-red-500' : 'border-neutral-700 focus:border-[#D4AF66]'
                          }`}
                        />
                        {errors.senderNumber && (
                          <span className="text-[11px] text-red-400 block">{errors.senderNumber}</span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                          Transaction ID (TrxID) <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                          placeholder="e.g. 9K72B108X"
                          className={`w-full bg-[#181818] border rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none font-mono uppercase min-h-[44px] ${
                            errors.transactionId ? 'border-red-500' : 'border-neutral-700 focus:border-[#D4AF66]'
                          }`}
                        />
                        {errors.transactionId && (
                          <span className="text-[11px] text-red-400 block">{errors.transactionId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Instructions */}
                {paymentCategory === 'bank' && (
                  <div className="bg-[#141414] border border-[#D4AF66]/40 rounded-xl p-5 space-y-4 text-xs">
                    <span className="text-xs uppercase tracking-wider text-[#D4AF66] font-semibold block">
                      Direct Bank Transfer / Internet Banking Details
                    </span>

                    <div className="bg-black/60 rounded-xl p-4 border border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-neutral-500 text-[10px] block uppercase">Bank Name</span>
                        <span className="font-semibold text-white">{adminSettings.bankDetails.bankName}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 text-[10px] block uppercase">Account Name</span>
                        <span className="font-semibold text-white">{adminSettings.bankDetails.accountName}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 text-[10px] block uppercase">Account Number</span>
                        <span className="font-mono text-sm text-[#D4AF66] font-bold">{adminSettings.bankDetails.accountNumber}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 text-[10px] block uppercase">Branch & Routing</span>
                        <span className="text-neutral-300">{adminSettings.bankDetails.branchName} (Routing: {adminSettings.bankDetails.routingNumber})</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-neutral-300 font-medium">Your Sending Bank Name:</label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          placeholder="e.g. BRAC Bank, EBL, Dutch Bangla"
                          className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-white outline-none min-h-[44px]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-neutral-300 font-medium">Transfer Reference / Slip No. *</label>
                        <input
                          type="text"
                          required
                          value={accountReference}
                          onChange={(e) => setAccountReference(e.target.value)}
                          placeholder="e.g. BEFTN/NPSB Ref 849201"
                          className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-white outline-none min-h-[44px]"
                        />
                        {errors.accountReference && (
                          <span className="text-[11px] text-red-400 block">{errors.accountReference}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bangla QR Instructions */}
                {paymentCategory === 'qr' && (
                  <div className="bg-[#141414] border border-[#D4AF66]/40 rounded-xl p-5 space-y-4 text-xs">
                    <div className="flex items-center space-x-2 text-[#D4AF66] font-semibold">
                      <QrCode className="w-5 h-5" />
                      <span>Bangla QR (National Interoperable Standard)</span>
                    </div>

                    <p className="text-neutral-300">
                      Scan the Bangla QR code below using your banking app (City Touch, EBL Skybanking, BRAC Astha) or MFS app (bKash, Nagad, Rocket).
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/60 p-4 rounded-xl border border-neutral-800">
                      <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center">
                        {/* Procedural clean QR pattern representation */}
                        <div className="w-full h-full border-4 border-black p-1 flex flex-col justify-between">
                          <div className="flex justify-between">
                            <div className="w-6 h-6 bg-black" />
                            <div className="w-6 h-6 bg-black" />
                          </div>
                          <div className="text-center font-bold font-mono text-[9px] text-black">
                            BANGLA QR
                          </div>
                          <div className="flex justify-between">
                            <div className="w-6 h-6 bg-black" />
                            <div className="w-4 h-4 bg-black" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-center sm:text-left">
                        <div className="text-white font-bold">ZenvyWear Merchant Bangla QR</div>
                        <div className="text-neutral-400 font-mono text-[11px]">Merchant ID: ZW-BANANI-001</div>
                        <div className="text-[#D4AF66] font-bold text-sm flex items-center justify-center sm:justify-start">
                          <span>Amount:</span>
                          <Taka className="w-3.5 h-3.5 mx-0.5 inline" />
                          <span>{totalAmount.toLocaleString()} BDT</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">Supports: bKash, Nagad, Rocket, Upay, Visa, Master</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label className="text-neutral-300 font-medium">Transaction Reference from App *</label>
                      <input
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                        placeholder="e.g. BQR-904812"
                        className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-white outline-none min-h-[44px]"
                      />
                      {errors.transactionId && (
                        <span className="text-[11px] text-red-400 block">{errors.transactionId}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Cards Sandbox / Simulator Form */}
                {paymentCategory === 'cards' && (
                  <div className="bg-[#141414] border border-[#D4AF66]/40 rounded-xl p-5 space-y-4 text-xs">
                    <div className="flex items-center space-x-2 text-[#D4AF66] font-semibold">
                      <Lock className="w-4 h-4" />
                      <span>Direct Card Gateway Simulator (SSLCOMMERZ / Shurjopay Demo)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-neutral-300 font-medium">Cardholder Full Name *</label>
                        <input
                          type="text"
                          required
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="e.g. Samira Ahmed"
                          className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-white outline-none min-h-[44px]"
                        />
                        {errors.cardHolder && (
                          <span className="text-[11px] text-red-400 block">{errors.cardHolder}</span>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-neutral-300 font-medium">16-Digit Card Number *</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardMasked}
                          onChange={(e) => setCardMasked(e.target.value)}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-white outline-none font-mono min-h-[44px]"
                        />
                        {errors.cardMasked && (
                          <span className="text-[11px] text-red-400 block">{errors.cardMasked}</span>
                        )}
                      </div>
                    </div>

                    <p className="text-[10px] text-neutral-500">
                      * Security notice: Automated payment processing verifies signed webhook responses server-side. Sensitive card PINs or OTPs are never stored.
                    </p>
                  </div>
                )}

                {/* Cash on Delivery Selection */}
                {paymentCategory === 'cod' && (
                  <div className="bg-[#0e1713] border border-emerald-500/30 rounded-xl p-4 text-xs text-neutral-300 space-y-2">
                    <div className="font-semibold text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Cash on Delivery Selected</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Our customer verification desk will place a confirmation call to <strong>{phone || 'your phone number'}</strong> before dispatching parcel. No advance payment required.
                    </p>
                  </div>
                )}

                {/* Safety Guarantee Notice */}
                <div className="bg-[#1a150c] border-l-2 border-[#D4AF66] p-3 text-[11px] text-neutral-300 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-[#D4AF66] shrink-0 mt-0.5" />
                  <span>
                    <strong>Payment Safety Notice:</strong> All submitted transaction references are stored as <strong className="text-[#D4AF66]">"Pending Verification"</strong>. Our accounting staff independently reconciles every reference with our merchant bank statement. Never share your confidential PIN or SMS OTP with anyone.
                  </span>
                </div>

              </div>

            </div>

            {/* Right 5 Columns: Itemized Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#101010] border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6 sticky top-28 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <h3 className="font-cinzel font-bold text-base text-white">
                    Order Summary
                  </h3>
                  <span className="text-xs text-neutral-400">
                    {items.reduce((acc, i) => acc + i.quantity, 0)} Items
                  </span>
                </div>

                {/* Items Mini List */}
                <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="flex space-x-3 items-center py-1.5 border-b border-neutral-900"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover object-top rounded-lg bg-black border border-neutral-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-white truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-neutral-400 flex items-center space-x-2">
                          <span>Size: <strong>{item.selectedSize}</strong></span>
                          <span>Qty: <strong>{item.quantity}</strong></span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#D4AF66] flex items-center">
                        <Taka className="w-3 h-3 mr-0.5 inline" />{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial Breakdown */}
                <div className="space-y-2 text-xs pt-1 border-t border-neutral-800">
                  <div className="flex justify-between text-neutral-400">
                    <span>Products Subtotal:</span>
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
                    <span>Delivery Charge ({isInsideDhaka ? 'Dhaka' : district}):</span>
                    <span className="font-mono text-neutral-200">
                      {deliveryCharge === 0 ? (
                        <span className="text-emerald-400 font-bold">FREE</span>
                      ) : (
                        <span className="flex items-center"><Taka className="w-3 h-3 mr-0.5 inline" />{deliveryCharge}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-neutral-800">
                    <span className="font-cinzel">Total Payable:</span>
                    <span className="font-cinzel text-xl text-[#D4AF66] flex items-center">
                      <Taka className="w-4 h-4 mr-0.5 inline" />{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gold-gradient text-black font-cinzel font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(212,175,102,0.3)] hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50 min-h-[48px] flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <span>Registering Order Server-Side...</span>
                  ) : paymentMethod === 'Cash on Delivery' ? (
                    <span className="flex items-center justify-center">
                      <span>Confirm Cash on Delivery Order (</span><Taka className="w-3.5 h-3.5 mx-0.5 inline" />{totalAmount.toLocaleString()})
                    </span>
                  ) : (
                    <span>Submit {paymentMethod} Order for Verification</span>
                  )}
                </button>

                {/* Security Trust Badges */}
                <div className="pt-2 text-center text-[10px] text-neutral-500 space-y-1">
                  <div className="flex items-center justify-center space-x-2 text-neutral-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF66]" />
                    <span>Protected Client Information • Dhaka Artisanal Guarantee</span>
                  </div>
                  <p>7-Day Hassle-Free Exchange on all unworn items</p>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
