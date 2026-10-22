import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShoppingBag, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package, 
  AlertCircle, 
  ChevronRight,
  ExternalLink,
  Edit2,
  Save,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BANGLADESH_DISTRICTS } from '../../data/mockData';
import { Taka } from '../common/Taka';
import { OrderStatus } from '../../types';

interface CustomerProfileModalProps {
  onOpenTracking?: (orderId: string) => void;
  onContinueShopping?: () => void;
}

export const CustomerProfileModal: React.FC<CustomerProfileModalProps> = ({ 
  onOpenTracking,
  onContinueShopping 
}) => {
  const { 
    currentUser, 
    customerOrders, 
    isProfileModalOpen, 
    closeProfileModal, 
    profileModalTab, 
    logout, 
    updateProfile 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>(profileModalTab);
  
  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [district, setDistrict] = useState(currentUser?.district || 'Dhaka');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setPhone(currentUser.phone);
      setAddress(currentUser.address || '');
      setDistrict(currentUser.district || 'Dhaka');
    }
    setActiveTab(profileModalTab);
  }, [currentUser, profileModalTab, isProfileModalOpen]);

  if (!isProfileModalOpen || !currentUser) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone && (cleanPhone.length !== 11 || !cleanPhone.startsWith('01'))) {
      setSaveError('Please enter a valid 11-digit Bangladeshi mobile number starting with 01.');
      return;
    }

    const selectedDist = BANGLADESH_DISTRICTS.find(d => d.name === district);

    const res = await updateProfile({
      fullName: fullName.trim(),
      phone: cleanPhone,
      address: address.trim(),
      district,
      division: selectedDist?.division || 'Dhaka',
    });

    if (res.success) {
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(res.error || 'Failed to update profile');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'Shipped':
      case 'Processing':
      case 'Confirmed':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'Payment Verification':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Cancelled':
        return 'bg-red-950 text-red-300 border-red-800';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-[#0f0f0f] border border-[#D4AF66]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh] animate-fadeIn">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#0a0a0a] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient text-black font-cinzel font-bold flex items-center justify-center text-sm shadow">
              {currentUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-cinzel font-bold text-white tracking-wide">
                {currentUser.fullName}
              </h2>
              <span className="text-[11px] text-[#D4AF66] font-mono">
                {currentUser.email} • {currentUser.role === 'admin' ? 'Administrator' : 'Valued Patron'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => logout()}
              className="text-xs text-neutral-400 hover:text-red-400 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-red-900 transition min-h-[36px]"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

            <button
              onClick={closeProfileModal}
              className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition min-h-[36px]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 bg-[#121212] border-b border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 font-semibold transition border-b-2 flex items-center justify-center space-x-2 min-h-[44px] ${
              activeTab === 'orders'
                ? 'border-[#D4AF66] text-[#D4AF66] bg-[#161410]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({customerOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 font-semibold transition border-b-2 flex items-center justify-center space-x-2 min-h-[44px] ${
              activeTab === 'profile'
                ? 'border-[#D4AF66] text-[#D4AF66] bg-[#161410]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Details & Address</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {customerOrders.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3 bg-[#141414] rounded-2xl border border-neutral-800">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
                    <ShoppingBag className="w-6 h-6 text-[#D4AF66]" />
                  </div>
                  <h3 className="text-base font-cinzel font-bold text-white">No Orders Placed Yet</h3>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto">
                    You have not placed any orders yet. Discover our exclusive handcrafted women's three-piece outfits and royal men's couture.
                  </p>
                  <button
                    onClick={() => {
                      closeProfileModal();
                      if (onContinueShopping) onContinueShopping();
                    }}
                    className="px-6 py-2.5 bg-gold-gradient text-black font-semibold text-xs rounded-xl shadow min-h-[40px] mt-2 inline-flex items-center space-x-1.5"
                  >
                    <span>Explore Collection</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-[#141414] border border-neutral-800 hover:border-[#D4AF66]/40 rounded-xl p-4 sm:p-5 space-y-3 transition"
                    >
                      {/* Top Bar: Order ID, Date, Status Pill */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#D4AF66]">
                            {order.id}
                          </span>
                          <span className="text-neutral-500 text-xs">•</span>
                          <span className="text-xs text-neutral-400 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 inline mr-1 text-neutral-500" />
                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                          {onOpenTracking && (
                            <button
                              onClick={() => {
                                closeProfileModal();
                                onOpenTracking(order.id);
                              }}
                              className="text-[11px] text-[#D4AF66] hover:underline flex items-center space-x-0.5 ml-2"
                            >
                              <span>Track</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-3 text-xs text-neutral-300">
                            {item.product.images && item.product.images[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-12 h-14 object-cover rounded border border-neutral-800 shrink-0 bg-black"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-white truncate">{item.product.name}</div>
                              <div className="text-[11px] text-neutral-400">
                                Size: <span className="text-white">{item.selectedSize}</span> • Qty: <span className="text-white">{item.quantity}</span>
                              </div>
                            </div>
                            <div className="font-mono text-right text-xs text-[#D4AF66]">
                              <Taka className="w-3 h-3 inline mr-0.5" />
                              {(item.product.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Summary Footnote */}
                      <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
                        <div>
                          Payment: <strong className="text-white">{order.payment.method}</strong> ({order.payment.status})
                        </div>
                        <div className="flex items-center space-x-3">
                          <span>Delivery: <Taka className="w-2.5 h-2.5 inline mr-0.5" />{order.deliveryCharge}</span>
                          <span className="text-white font-bold font-mono text-sm flex items-center">
                            Total: <Taka className="w-3.5 h-3.5 inline ml-1 mr-0.5 text-[#D4AF66]" />
                            <span className="text-[#D4AF66]">{order.totalAmount.toLocaleString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROFILE & ADDRESS */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {saveSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500 rounded-xl text-emerald-200 text-xs flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {saveError && (
                <div className="p-3 bg-red-950/60 border border-red-500 rounded-xl text-red-200 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>{saveError}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="bg-[#141414] border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-xs uppercase tracking-wider text-[#D4AF66] font-semibold">
                      Personal Details
                    </span>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-xs text-[#D4AF66] hover:underline flex items-center space-x-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-neutral-400">Editing profile</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-neutral-400 block font-medium">Full Name</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#1b1b1b] disabled:bg-[#111] border border-neutral-700 disabled:border-neutral-800 rounded-lg p-2.5 text-white outline-none min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 block font-medium">Email Address (Immutable)</label>
                      <input
                        type="email"
                        disabled
                        value={currentUser.email}
                        className="w-full bg-[#111] border border-neutral-800 rounded-lg p-2.5 text-neutral-400 font-mono min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 block font-medium">Mobile Number (11 Digits)</label>
                      <input
                        type="tel"
                        disabled={!isEditing}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#1b1b1b] disabled:bg-[#111] border border-neutral-700 disabled:border-neutral-800 rounded-lg p-2.5 text-white font-mono outline-none min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 block font-medium">Delivery District</label>
                      <select
                        disabled={!isEditing}
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full bg-[#1b1b1b] disabled:bg-[#111] border border-neutral-700 disabled:border-neutral-800 rounded-lg p-2.5 text-white outline-none min-h-[44px]"
                      >
                        {BANGLADESH_DISTRICTS.map((d) => (
                          <option key={d.name} value={d.name}>
                            {d.name} ({d.division})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-neutral-400 block font-medium">Full Shipping Address</label>
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House, Road, Area (e.g. House 14, Road 7, Sector 3, Uttara)"
                        className="w-full bg-[#1b1b1b] disabled:bg-[#111] border border-neutral-700 disabled:border-neutral-800 rounded-lg p-2.5 text-white outline-none min-h-[44px]"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-2 pt-2 border-t border-neutral-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFullName(currentUser.fullName);
                          setPhone(currentUser.phone);
                          setAddress(currentUser.address || '');
                          setDistrict(currentUser.district || 'Dhaka');
                        }}
                        className="px-4 py-2 border border-neutral-700 rounded-xl text-xs text-neutral-300 min-h-[40px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-gold-gradient text-black font-semibold text-xs rounded-xl shadow min-h-[40px] flex items-center space-x-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
