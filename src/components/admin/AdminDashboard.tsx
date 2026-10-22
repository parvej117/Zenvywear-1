import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  X,
  Clock, 
  DollarSign, 
  Users, 
  Search, 
  Download, 
  Database, 
  Key, 
  Lock, 
  Unlock, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Phone,
  MapPin,
  Check,
  Eye,
  EyeOff,
  Filter,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Tag,
  Image,
  UploadCloud,
  MoveLeft,
  MoveRight,
  Star,
  SlidersHorizontal,
  ArrowUpDown,
  CheckSquare,
  Square
} from 'lucide-react';
import { Product, Order, OrderStatus, AdminSettings, ProductCategory, ProductSize, PaymentMethod } from '../../types';
import { Taka } from '../common/Taka';
import { api } from '../../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (products: Product[]) => void;
  orders: Order[];
  onUpdateOrderStatus: (
    orderId: string, 
    status: OrderStatus, 
    note?: string, 
    paymentStatus?: string, 
    rejectionReason?: string
  ) => void;
  adminSettings: AdminSettings;
  onSaveSettings: (settings: AdminSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  orders,
  onUpdateOrderStatus,
  adminSettings,
  onSaveSettings,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState<string>('');
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings' | 'analytics' | 'architecture'>('orders');

  // Order filters
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  // Product Search & Filters
  const [productSearch, setProductSearch] = useState('');
  const [productDepartmentFilter, setProductDepartmentFilter] = useState<'all' | 'women' | 'men'>('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // Product editing modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);

  // Product Delete Confirmation Modal (Replaces browser confirm)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  // Settings local state
  const [settingsForm, setSettingsForm] = useState<AdminSettings>(adminSettings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Payment Rejection Modal
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Transaction reference not found on statement.');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError('');
    const res = await api.loginAdmin(passcode.trim());
    if (res.success && res.token) {
      setIsAuthenticated(true);
      setAdminToken(res.token);
      sessionStorage.setItem('zenvy_admin_token', res.token);
    } else {
      setPasscodeError(res.error || 'Invalid admin passcode. Default: "zenvyadmin"');
    }
  };

  const handleApprovePayment = (order: Order) => {
    onUpdateOrderStatus(
      order.id, 
      'Confirmed', 
      `Payment reference ${order.payment.transactionId || order.payment.accountReference} manually verified by shop administrator.`,
      'Verified'
    );
  };

  const handleConfirmRejection = () => {
    if (!rejectingOrder) return;
    onUpdateOrderStatus(
      rejectingOrder.id,
      'Cancelled',
      `Payment rejected: ${rejectionReason}`,
      'Rejected',
      rejectionReason
    );
    setRejectingOrder(null);
  };

  const handleSaveProduct = async (prod: Product) => {
    setIsSavingProduct(true);
    const validatedPrice = Math.max(0, Math.min(5000, Number(prod.price) || 0));
    const cleanProd = { ...prod, price: validatedPrice, inStock: (prod.stockCount || 0) > 0 };

    try {
      if (isNewProduct) {
        await api.createProduct(cleanProd, adminToken);
        onSaveProducts([cleanProd, ...products]);
      } else {
        await api.updateProduct(cleanProd.id, cleanProd, adminToken);
        onSaveProducts(products.map((p) => (p.id === cleanProd.id ? cleanProd : p)));
      }
      setEditingProduct(null);
      setUploadError(null);
    } catch (err) {
      console.error('Error saving product:', err);
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeletingProduct(true);
    try {
      await api.deleteProduct(productToDelete.id, true, adminToken);
      onSaveProducts(products.filter((p) => p.id !== productToDelete.id));
      setProductToDelete(null);
    } catch (err) {
      console.error('Failed to permanently delete product', err);
    } finally {
      setIsDeletingProduct(false);
    }
  };

  const handleToggleProductVisibility = async (productId: string) => {
    await api.deleteProduct(productId, false, adminToken);
    onSaveProducts(
      products.map((p) => (p.id === productId ? { ...p, isHidden: !p.isHidden } : p))
    );
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.updateSettings(settingsForm, adminToken);
    onSaveSettings(settingsForm);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
  };

  // Direct CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Date',
      'Customer Name',
      'Phone',
      'District',
      'Full Address',
      'Payment Method',
      'TrxID / Reference',
      'Payment Status',
      'Order Status',
      'Subtotal (BDT)',
      'Delivery Charge (BDT)',
      'Discount (BDT)',
      'Total Amount (BDT)',
    ];

    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${new Date(o.createdAt).toISOString()}"`,
      `"${o.customer.fullName.replace(/"/g, '""')}"`,
      `"${o.customer.phone}"`,
      `"${o.customer.district}"`,
      `"${o.customer.fullAddress.replace(/"/g, '""')}"`,
      `"${o.payment.method}"`,
      `"${o.payment.transactionId || o.payment.accountReference || 'N/A'}"`,
      `"${o.payment.status}"`,
      `"${o.status}"`,
      o.subtotal,
      o.deliveryCharge,
      o.discountAmount,
      o.totalAmount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers.join(','), ...rows.map((r) => r.join(','))].join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `zenvywear_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Filtering orders
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (paymentFilter !== 'all' && o.payment.method !== paymentFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchPhone = o.customer.phone.includes(q);
      const matchName = o.customer.fullName.toLowerCase().includes(q);
      const matchTrx = o.payment.transactionId?.toLowerCase().includes(q);
      if (!matchId && !matchPhone && !matchName && !matchTrx) return false;
    }
    return true;
  });

  // Filtering products
  const filteredProducts = products.filter((p) => {
    if (productDepartmentFilter === 'women' && p.gender !== 'women') return false;
    if (productDepartmentFilter === 'men' && p.gender !== 'men') return false;
    if (productStockFilter === 'in_stock' && p.stockCount <= 5) return false;
    if (productStockFilter === 'low_stock' && (p.stockCount <= 0 || p.stockCount > 5)) return false;
    if (productStockFilter === 'out_of_stock' && p.stockCount > 0) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchFabric = p.fabricDetails?.kameezFabric?.toLowerCase().includes(q);
      const matchColor = p.colors?.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchCat && !matchFabric && !matchColor) return false;
    }
    return true;
  });

  // Analytics KPIs
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingVerificationCount = orders.filter((o) => o.status === 'Payment Verification').length;
  const processingCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Confirmed').length;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 5);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6">
      <div className="relative w-full max-w-6xl bg-[#0f0f0f] border border-[#D4AF66]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#0a0a0a] border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#1e1910] border border-[#D4AF66]/40 flex items-center justify-center text-[#D4AF66]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-cinzel font-bold text-white tracking-wide">
                ZenvyWear Atelier • Protected /admin Dashboard
              </h2>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">
                Server-Validated Management & Payment Verification
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setAdminToken('');
                  sessionStorage.removeItem('zenvy_admin_token');
                }}
                className="text-xs text-neutral-400 hover:text-white flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-neutral-800 min-h-[36px]"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4AF66]" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white min-h-[36px]"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate Screen */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-14 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#D4AF66]/40 flex items-center justify-center text-[#D4AF66]">
              <Key className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-cinzel font-bold text-white">
                Administrator Authentication
              </h3>
              <p className="text-xs text-neutral-400">
                Authorized access required to review order statements, verify payments, and manage catalog prices.
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (default: zenvyadmin)"
                className="w-full bg-[#161616] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs sm:text-sm rounded-xl px-4 py-3 outline-none text-center font-mono min-h-[44px]"
              />
              {passcodeError && (
                <span className="text-xs text-red-400 block">{passcodeError}</span>
              )}
              <button
                type="submit"
                className="w-full py-3.5 bg-gold-gradient text-black font-semibold text-xs uppercase tracking-wider rounded-xl shadow-md min-h-[44px]"
              >
                Authenticate & Unlock
              </button>
            </form>

            <div className="bg-[#141414] border border-neutral-800 rounded-xl p-3.5 text-[11px] text-neutral-400 w-full text-left space-y-1">
              <div className="text-[#D4AF66] font-semibold">Security Note:</div>
              <div>Default credential: <strong className="text-white font-mono">zenvyadmin</strong></div>
              <div className="text-[10px] text-neutral-500">
                Session tokens are validated server-side. Passcode can be updated in Settings tab.
              </div>
            </div>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Navigation Tabs */}
            <div className="bg-[#121212] border-b border-neutral-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 overflow-x-auto shrink-0 scrollbar-none">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition min-h-[38px] ${
                    activeTab === 'orders'
                      ? 'bg-gold-gradient text-black font-bold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Orders ({orders.length})</span>
                  {pendingVerificationCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                      {pendingVerificationCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition min-h-[38px] ${
                    activeTab === 'products'
                      ? 'bg-gold-gradient text-black font-bold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Catalog & Stock ({products.length})</span>
                  {lowStockProducts.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-600 text-black text-[10px] font-bold">
                      {lowStockProducts.length} low
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition min-h-[38px] ${
                    activeTab === 'analytics'
                      ? 'bg-gold-gradient text-black font-bold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Overview & KPIs</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition min-h-[38px] ${
                    activeTab === 'settings'
                      ? 'bg-gold-gradient text-black font-bold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Payments & Fees</span>
                </button>

                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 whitespace-nowrap transition min-h-[38px] ${
                    activeTab === 'architecture'
                      ? 'bg-gold-gradient text-black font-bold'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Database & Free-Tier</span>
                </button>
              </div>

              {/* Quick CSV Export */}
              <button
                onClick={handleExportCSV}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] border border-neutral-700 text-xs text-neutral-200 rounded-lg transition shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-[#D4AF66]" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* TAB 1: ORDERS & PAYMENT VERIFICATION */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {/* Search and Filters Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#141414] p-3.5 rounded-xl border border-neutral-800">
                    <div className="sm:col-span-6 relative">
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search by Order ID, Phone, Customer, or TrxID..."
                        className="w-full bg-[#1b1b1b] border border-neutral-700 text-xs rounded-lg pl-8 pr-3 py-2.5 text-white outline-none min-h-[40px]"
                      />
                      <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-3" />
                    </div>

                    <div className="sm:col-span-3">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-[#1b1b1b] border border-neutral-700 text-neutral-300 text-xs rounded-lg px-3 py-2.5 outline-none min-h-[40px]"
                      >
                        <option value="all">All Statuses ({orders.length})</option>
                        <option value="Pending">Pending</option>
                        <option value="Payment Verification">Payment Verification ({pendingVerificationCount})</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 flex gap-2">
                      <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                        className="w-full bg-[#1b1b1b] border border-neutral-700 text-neutral-300 text-xs rounded-lg px-2.5 py-2.5 outline-none min-h-[40px]"
                      >
                        <option value="all">All Payment Methods</option>
                        <option value="bKash">bKash</option>
                        <option value="Nagad">Nagad</option>
                        <option value="Rocket">Rocket</option>
                        <option value="Upay">Upay</option>
                        <option value="tap">tap</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Bangla QR">Bangla QR</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                      </select>

                      <button
                        onClick={handleExportCSV}
                        className="md:hidden px-3 bg-[#202020] border border-neutral-700 rounded-lg text-neutral-300 flex items-center justify-center min-h-[40px]"
                        title="Download CSV"
                      >
                        <Download className="w-4 h-4 text-[#D4AF66]" />
                      </button>
                    </div>
                  </div>

                  {/* Orders List / Responsive Cards */}
                  <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                      <div className="bg-[#141414] border border-neutral-800 rounded-xl p-8 text-center text-xs text-neutral-400">
                        No orders match the current filter.
                      </div>
                    ) : (
                      filteredOrders.map((order) => {
                        const isPendingVerification = order.status === 'Payment Verification';

                        return (
                          <div
                            key={order.id}
                            className={`bg-[#141414] border rounded-xl p-4 sm:p-5 space-y-4 transition ${
                              isPendingVerification
                                ? 'border-[#D4AF66] shadow-[0_0_15px_rgba(212,175,102,0.15)]'
                                : 'border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            {/* Card Top: Order ID, Timestamp, Total, Status Dropdown */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-800 gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-sm sm:text-base font-bold text-[#D4AF66]">
                                  {order.id}
                                </span>
                                <span className="text-xs text-neutral-400">
                                  {new Date(order.createdAt).toLocaleString()}
                                </span>
                                <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded border border-neutral-800 text-neutral-300">
                                  {order.payment.method}
                                </span>
                              </div>

                              <div className="flex items-center space-x-3 justify-between sm:justify-end">
                                <span className="font-mono text-sm sm:text-base font-bold text-white flex items-center">
                                  <Taka className="w-3.5 h-3.5 mr-0.5 inline" />{order.totalAmount.toLocaleString()}
                                </span>

                                {/* Status Selector Dropdown */}
                                <select
                                  value={order.status}
                                  onChange={(e: any) => onUpdateOrderStatus(order.id, e.target.value)}
                                  className="bg-[#1e1e1e] border border-neutral-700 text-xs rounded-lg px-2.5 py-1.5 text-white font-medium outline-none min-h-[36px]"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Payment Verification">Payment Verification</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Processing">Processing</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>

                            {/* Details Grid: Customer + Payment Verification + Items */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              {/* Customer Information */}
                              <div className="bg-[#181818] p-3 rounded-lg border border-neutral-800 space-y-1">
                                <div className="text-neutral-500 uppercase text-[10px] font-semibold">
                                  Delivery Customer
                                </div>
                                <div className="font-bold text-white text-sm">{order.customer.fullName}</div>
                                <div className="text-[#D4AF66] font-mono">{order.customer.phone}</div>
                                <div className="text-neutral-300 text-[11px] leading-snug">
                                  {order.customer.fullAddress}
                                </div>
                                <div className="text-neutral-400 text-[11px]">
                                  District: <strong>{order.customer.district}</strong> ({order.customer.division})
                                </div>
                                {order.customer.deliveryNotes && (
                                  <div className="text-[10px] text-neutral-500 italic pt-1">
                                    Notes: {order.customer.deliveryNotes}
                                  </div>
                                )}
                              </div>

                              {/* Payment Verification Information */}
                              <div className="bg-[#181818] p-3 rounded-lg border border-neutral-800 space-y-2 flex flex-col justify-between">
                                <div className="space-y-1">
                                  <div className="text-neutral-500 uppercase text-[10px] font-semibold flex items-center justify-between">
                                    <span>Payment Claim Details</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                      order.payment.status === 'Verified' 
                                        ? 'text-emerald-400 bg-emerald-950/60' 
                                        : order.payment.status === 'Rejected'
                                        ? 'text-red-400 bg-red-950/60'
                                        : 'text-amber-400 bg-amber-950/60'
                                    }`}>
                                      {order.payment.status}
                                    </span>
                                  </div>

                                  <div className="text-neutral-300">
                                    Method: <strong className="text-white">{order.payment.method}</strong>
                                  </div>

                                  {order.payment.senderNumber && (
                                    <div className="text-neutral-300">
                                      Sender: <strong className="font-mono text-white">{order.payment.senderNumber}</strong>
                                    </div>
                                  )}

                                  {(order.payment.transactionId || order.payment.accountReference) && (
                                    <div className="text-neutral-300">
                                      Reference: <strong className="font-mono text-[#D4AF66] bg-black px-1.5 py-0.5 rounded">{order.payment.transactionId || order.payment.accountReference}</strong>
                                    </div>
                                  )}

                                  {order.payment.bankName && (
                                    <div className="text-neutral-400 text-[11px]">
                                      Bank: {order.payment.bankName}
                                    </div>
                                  )}

                                  {order.payment.rejectionReason && (
                                    <div className="text-red-400 text-[10px] bg-red-950/40 p-1.5 rounded">
                                      Rejection Note: {order.payment.rejectionReason}
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons: Approve or Reject */}
                                {isPendingVerification && (
                                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-800">
                                    <button
                                      onClick={() => handleApprovePayment(order)}
                                      className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-1 transition min-h-[36px]"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Verify & Confirm</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        setRejectingOrder(order);
                                        setRejectionReason('Transaction reference not found on bank/MFS statement.');
                                      }}
                                      className="py-2 bg-red-900/60 hover:bg-red-800 border border-red-700 text-red-200 font-bold text-xs rounded-lg flex items-center justify-center space-x-1 transition min-h-[36px]"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>Reject</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Items Summary */}
                              <div className="bg-[#181818] p-3 rounded-lg border border-neutral-800 space-y-1">
                                <div className="text-neutral-500 uppercase text-[10px] font-semibold">
                                  Items ({order.items.length})
                                </div>
                                <div className="space-y-1 max-h-24 overflow-y-auto">
                                  {order.items.map((i, idx) => (
                                    <div key={idx} className="flex justify-between text-neutral-300 text-[11px]">
                                      <span className="truncate pr-2">{i.product.name} ({i.selectedSize}) × {i.quantity}</span>
                                      <span className="font-mono text-neutral-400 flex items-center">
                                        <Taka className="w-2.5 h-2.5 mr-0.5 inline" />{i.product.price * i.quantity}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                <div className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800 flex justify-between items-center">
                                  <span>Delivery Fee ({order.customer.district}):</span>
                                  <span className="flex items-center"><Taka className="w-2.5 h-2.5 mr-0.5 inline" />{order.deliveryCharge}</span>
                                </div>
                              </div>
                            </div>

                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CATALOG & STOCK MANAGEMENT */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-cinzel font-bold text-white">
                        Product Catalog, Colors & Stock Control
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Prices strictly capped between 0 and 5,000 BDT • Toggle visibility or update stock levels
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsNewProduct(true);
                        setEditingProduct({
                          id: `prod-${Date.now().toString().slice(-4)}`,
                          name: '',
                          slug: '',
                          category: 'Three Piece',
                          price: 2200,
                          description: '',
                          fabricDetails: {
                            kameezFabric: 'Pure Organza Silk',
                            salwarFabric: 'Dyed Cambric',
                            dupattaFabric: 'Jacquard Organza',
                            workType: 'Zardozi Hand Embroidery',
                            careInstructions: 'Dry clean recommended.',
                          },
                          sizes: ['S', 'M', 'L', 'XL'],
                          colors: ['Jet Black', 'Antique Gold'],
                          inStock: true,
                          stockCount: 15,
                          images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop'],
                          rating: 4.8,
                          reviewsCount: 1,
                          tags: ['New', 'Couture'],
                          isHidden: false,
                        });
                      }}
                      className="px-4 py-2.5 bg-gold-gradient text-black font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow min-h-[44px]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Silhouette</span>
                    </button>
                  </div>

                  {/* Product Search & Filters Bar */}
                  <div className="bg-[#141414] border border-neutral-800 rounded-xl p-3 sm:p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      {/* Search Input */}
                      <div className="sm:col-span-6 relative">
                        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search silhouette by name, category, fabric, color..."
                          className="w-full bg-[#1b1b1b] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none min-h-[44px]"
                        />
                      </div>

                      {/* Department Filter */}
                      <div className="sm:col-span-3">
                        <select
                          value={productDepartmentFilter}
                          onChange={(e: any) => setProductDepartmentFilter(e.target.value)}
                          className="w-full bg-[#1b1b1b] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl px-3 py-2.5 outline-none min-h-[44px]"
                        >
                          <option value="all">All Departments</option>
                          <option value="women">Women's Atelier</option>
                          <option value="men">Men's Couture</option>
                        </select>
                      </div>

                      {/* Stock Status Filter */}
                      <div className="sm:col-span-3">
                        <select
                          value={productStockFilter}
                          onChange={(e: any) => setProductStockFilter(e.target.value)}
                          className="w-full bg-[#1b1b1b] border border-neutral-700 focus:border-[#D4AF66] text-white text-xs rounded-xl px-3 py-2.5 outline-none min-h-[44px]"
                        >
                          <option value="all">All Stock Status</option>
                          <option value="in_stock">In Stock (&gt; 5)</option>
                          <option value="low_stock">Low Stock (1–5)</option>
                          <option value="out_of_stock">Out of Stock (0)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                      <span>Showing <strong className="text-white">{filteredProducts.length}</strong> of <strong className="text-white">{products.length}</strong> silhouettes</span>
                      {(productSearch || productDepartmentFilter !== 'all' || productStockFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setProductSearch('');
                            setProductDepartmentFilter('all');
                            setProductStockFilter('all');
                          }}
                          className="text-[#D4AF66] hover:underline"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Empty state */}
                  {filteredProducts.length === 0 ? (
                    <div className="p-10 text-center bg-[#141414] border border-neutral-800 rounded-xl space-y-2">
                      <Package className="w-8 h-8 text-neutral-500 mx-auto" />
                      <div className="text-sm font-semibold text-white">No silhouettes match your filters</div>
                      <p className="text-xs text-neutral-400">Try adjusting your search query or department filter.</p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile Cards View (Android & Small Screens) */}
                      <div className="grid grid-cols-1 gap-3 sm:hidden">
                        {filteredProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-[#141414] border border-neutral-800 rounded-xl p-3.5 space-y-3"
                          >
                            <div className="flex items-start space-x-3">
                              <img
                                src={prod.images[0]}
                                alt={prod.name}
                                className="w-16 h-20 object-cover object-top rounded-lg bg-black border border-neutral-800 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase tracking-wider text-[#D4AF66] font-semibold">
                                    {prod.gender === 'men' ? "Men's Couture" : "Women's Atelier"}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    prod.stockCount > 5 ? 'text-emerald-400 bg-emerald-950/40' : prod.stockCount > 0 ? 'text-amber-400 bg-amber-950/40' : 'text-red-400 bg-red-950/40'
                                  }`}>
                                    {prod.stockCount} units
                                  </span>
                                </div>
                                <h4 className="font-semibold text-white text-xs truncate mt-0.5">{prod.name}</h4>
                                <div className="text-[11px] text-neutral-400">{prod.category}</div>
                                <div className="font-mono font-bold text-sm text-[#D4AF66] mt-1 flex items-center">
                                  <Taka className="w-3.5 h-3.5 mr-0.5 inline" />{prod.price.toLocaleString()}
                                </div>
                              </div>
                            </div>

                            <div className="text-[11px] text-neutral-400 flex flex-wrap gap-1">
                              <span>Sizes: {prod.sizes.join(', ')}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-neutral-800 gap-2">
                              <button
                                onClick={() => handleToggleProductVisibility(prod.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex items-center space-x-1 min-h-[36px] ${
                                  prod.isHidden
                                    ? 'bg-neutral-800 text-neutral-400'
                                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                }`}
                              >
                                {prod.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                <span>{prod.isHidden ? 'Hidden' : 'Visible'}</span>
                              </button>

                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setIsNewProduct(false);
                                    setEditingProduct(prod);
                                  }}
                                  className="px-3 py-1.5 bg-[#1f1f1f] hover:bg-[#282828] text-neutral-200 hover:text-white rounded-lg text-xs font-medium flex items-center space-x-1 border border-neutral-700 min-h-[36px]"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-[#D4AF66]" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => setProductToDelete(prod)}
                                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-lg text-xs font-medium flex items-center space-x-1 border border-red-800 min-h-[36px]"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table View */}
                      <div className="hidden sm:block bg-[#141414] border border-neutral-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs text-neutral-300 min-w-[700px]">
                            <thead className="bg-[#1b1b1b] text-[#D4AF66] uppercase text-[10px] tracking-wider border-b border-neutral-800">
                              <tr>
                                <th className="p-3">Silhouette</th>
                                <th className="p-3">Department & Category</th>
                                <th className="p-3">Price (BDT)</th>
                                <th className="p-3">Stock Units</th>
                                <th className="p-3">Sizes & Colors</th>
                                <th className="p-3">Visibility</th>
                                <th className="p-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/60">
                              {filteredProducts.map((prod) => (
                                <tr key={prod.id} className="hover:bg-[#1a1a1a]">
                                  <td className="p-3 flex items-center space-x-3">
                                    <img
                                      src={prod.images[0]}
                                      alt={prod.name}
                                      className="w-10 h-12 object-cover object-top rounded bg-black border border-neutral-800 shrink-0"
                                    />
                                    <div>
                                      <div className="font-semibold text-white">{prod.name}</div>
                                      <div className="text-[10px] text-neutral-400 font-mono">{prod.id}</div>
                                    </div>
                                  </td>

                                  <td className="p-3 font-medium text-neutral-200">
                                    <div className="text-white">{prod.category}</div>
                                    <div className="text-[10px] text-[#D4AF66] capitalize">
                                      {prod.gender === 'men' ? "Men's Couture" : "Women's Atelier"}
                                    </div>
                                  </td>

                                  <td className="p-3 font-mono font-bold text-[#D4AF66]">
                                    <span className="flex items-center"><Taka className="w-3 h-3 mr-0.5 inline" />{prod.price.toLocaleString()}</span>
                                  </td>

                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                      prod.stockCount > 5 ? 'text-emerald-400 bg-emerald-950/40' : prod.stockCount > 0 ? 'text-amber-400 bg-amber-950/40' : 'text-red-400 bg-red-950/40'
                                    }`}>
                                      {prod.stockCount} units
                                    </span>
                                  </td>

                                  <td className="p-3 text-[11px] text-neutral-400">
                                    <div>{prod.sizes.join(', ')}</div>
                                    <div className="text-neutral-500">{prod.colors?.join(', ')}</div>
                                  </td>

                                  <td className="p-3">
                                    <button
                                      onClick={() => handleToggleProductVisibility(prod.id)}
                                      className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center space-x-1 min-h-[32px] ${
                                        prod.isHidden
                                          ? 'bg-neutral-800 text-neutral-400'
                                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                      }`}
                                    >
                                      {prod.isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                      <span>{prod.isHidden ? 'Hidden' : 'Visible'}</span>
                                    </button>
                                  </td>

                                  <td className="p-3 text-right space-x-1 whitespace-nowrap">
                                    <button
                                      onClick={() => {
                                        setIsNewProduct(false);
                                        setEditingProduct(prod);
                                      }}
                                      className="p-1.5 hover:bg-neutral-800 rounded text-neutral-300 hover:text-[#D4AF66] transition min-h-[36px]"
                                      title="Edit Product"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => setProductToDelete(prod)}
                                      className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-red-400 transition min-h-[36px]"
                                      title="Permanently Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 3: OVERVIEW & ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-cinzel font-bold text-white">
                      Business Overview & Atelier Statistics
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Real-time inventory levels, gross sales, and fulfillment metrics
                    </p>
                  </div>

                  {/* 4 Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-[#141414] p-5 rounded-xl border border-neutral-800 space-y-2">
                      <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Gross Revenue</span>
                      <div className="font-cinzel text-2xl font-bold text-[#D4AF66] flex items-center">
                        <Taka className="w-5 h-5 mr-0.5 inline" />{totalRevenue.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-400">Across {orders.length} orders</span>
                    </div>

                    <div className="bg-[#141414] p-5 rounded-xl border border-neutral-800 space-y-2">
                      <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Pending Verification</span>
                      <div className="font-cinzel text-2xl font-bold text-amber-400">
                        {pendingVerificationCount}
                      </div>
                      <span className="text-[10px] text-neutral-400">Awaiting bank reconciliation</span>
                    </div>

                    <div className="bg-[#141414] p-5 rounded-xl border border-neutral-800 space-y-2">
                      <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Active Tailoring / Transit</span>
                      <div className="font-cinzel text-2xl font-bold text-white">
                        {processingCount}
                      </div>
                      <span className="text-[10px] text-neutral-400">Processing & Shipped</span>
                    </div>

                    <div className="bg-[#141414] p-5 rounded-xl border border-neutral-800 space-y-2">
                      <span className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Delivered Parcels</span>
                      <div className="font-cinzel text-2xl font-bold text-emerald-400">
                        {deliveredCount}
                      </div>
                      <span className="text-[10px] text-neutral-400">Successfully completed</span>
                    </div>
                  </div>

                  {/* Low Stock Warning Box */}
                  {lowStockProducts.length > 0 && (
                    <div className="bg-[#1a140b] border border-amber-600/40 rounded-xl p-4 text-xs space-y-2">
                      <div className="font-semibold text-amber-400 flex items-center space-x-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Low Inventory Alert ({lowStockProducts.length} items with &lt;= 5 units)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lowStockProducts.map((p) => (
                          <span key={p.id} className="bg-black/60 px-2.5 py-1 rounded border border-neutral-800 text-neutral-300">
                            {p.name}: <strong className="text-amber-400">{p.stockCount} left</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SETTINGS (Payment numbers, Bank, Bangla QR, Shipping) */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettingsSubmit} className="max-w-3xl space-y-6">
                  <div>
                    <h3 className="text-sm font-cinzel font-bold text-white">
                      Bangladeshi Payment Methods & Shipping Charges
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Configure your shop credentials for bKash, Nagad, Rocket, Upay, Bank Account, and Bangla QR
                    </p>
                  </div>

                  {/* MFS Settings */}
                  <div className="bg-[#141414] border border-neutral-800 rounded-xl p-5 space-y-4">
                    <span className="text-xs font-semibold text-[#D4AF66] uppercase tracking-wider block">
                      Mobile Financial Services (MFS)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-300">bKash Account Number:</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.shopOwnerBkashNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, shopOwnerBkashNumber: e.target.value })}
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white font-mono min-h-[44px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300">bKash Type:</label>
                        <select
                          value={settingsForm.bkashType}
                          onChange={(e: any) => setSettingsForm({ ...settingsForm, bkashType: e.target.value })}
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white min-h-[44px]"
                        >
                          <option value="Personal">Personal (Send Money)</option>
                          <option value="Merchant">Merchant (Make Payment)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300">Nagad Account Number:</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.shopOwnerNagadNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, shopOwnerNagadNumber: e.target.value })}
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white font-mono min-h-[44px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300">Nagad Type:</label>
                        <select
                          value={settingsForm.nagadType}
                          onChange={(e: any) => setSettingsForm({ ...settingsForm, nagadType: e.target.value })}
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white min-h-[44px]"
                        >
                          <option value="Personal">Personal (Send Money)</option>
                          <option value="Merchant">Merchant (Make Payment)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300">Rocket (DBBL) Number:</label>
                        <input
                          type="text"
                          value={settingsForm.shopOwnerRocketNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, shopOwnerRocketNumber: e.target.value })}
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white font-mono min-h-[44px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300">Upay (UCB) Number:</label>
                        <input
                          type="text"
                          value={settingsForm.shopOwnerUpayNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, shopOwnerUpayNumber: e.target.value })}
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white font-mono min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bank Account Settings */}
                  <div className="bg-[#141414] border border-neutral-800 rounded-xl p-5 space-y-4">
                    <span className="text-xs font-semibold text-[#D4AF66] uppercase tracking-wider block">
                      Bank Transfer Details (Direct Deposit / BEFTN / NPSB)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-300">Bank Name:</label>
                        <input
                          type="text"
                          value={settingsForm.bankDetails?.bankName || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              bankDetails: { ...settingsForm.bankDetails, bankName: e.target.value },
                            })
                          }
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white min-h-[44px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300">Account Name:</label>
                        <input
                          type="text"
                          value={settingsForm.bankDetails?.accountName || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              bankDetails: { ...settingsForm.bankDetails, accountName: e.target.value },
                            })
                          }
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white min-h-[44px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300">Account Number:</label>
                        <input
                          type="text"
                          value={settingsForm.bankDetails?.accountNumber || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              bankDetails: { ...settingsForm.bankDetails, accountNumber: e.target.value },
                            })
                          }
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white font-mono min-h-[44px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300">Branch & Routing:</label>
                        <input
                          type="text"
                          value={settingsForm.bankDetails?.branchName || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              bankDetails: { ...settingsForm.bankDetails, branchName: e.target.value },
                            })
                          }
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white min-h-[44px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Charges & COD */}
                  <div className="bg-[#141414] border border-neutral-800 rounded-xl p-5 space-y-4">
                    <span className="text-xs font-semibold text-[#D4AF66] uppercase tracking-wider block">
                      Delivery Fees & Policies
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-300">Inside Dhaka (BDT):</label>
                        <input
                          type="number"
                          value={settingsForm.dhakaDeliveryFee}
                          onChange={(e) => setSettingsForm({ ...settingsForm, dhakaDeliveryFee: Number(e.target.value) })}
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white font-mono min-h-[44px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300">Outside Dhaka (BDT):</label>
                        <input
                          type="number"
                          value={settingsForm.outsideDhakaDeliveryFee}
                          onChange={(e) => setSettingsForm({ ...settingsForm, outsideDhakaDeliveryFee: Number(e.target.value) })}
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white font-mono min-h-[44px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-300">Free Shipping Threshold (BDT):</label>
                        <input
                          type="number"
                          value={settingsForm.freeDeliveryThreshold}
                          onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                          className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white font-mono min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
                      <div>
                        <span className="text-xs text-white font-medium block">Allow Cash on Delivery (COD)</span>
                        <span className="text-[11px] text-neutral-400">If disabled, only advance payments (bKash/Nagad/Bank) will be permitted</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.enableCod}
                        onChange={(e) => setSettingsForm({ ...settingsForm, enableCod: e.target.checked })}
                        className="w-5 h-5 accent-[#D4AF66]"
                      />
                    </div>
                  </div>

                  {/* Passcode & Banner */}
                  <div className="bg-[#141414] border border-neutral-800 rounded-xl p-5 space-y-4 text-xs">
                    <span className="text-xs font-semibold text-[#D4AF66] uppercase tracking-wider block">
                      Admin Passcode & Announcement
                    </span>

                    <div className="space-y-1">
                      <label className="text-neutral-300">Top Announcement Banner:</label>
                      <input
                        type="text"
                        value={settingsForm.announcementText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                        className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white min-h-[44px]"
                      />
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="text-neutral-300">Change Admin Passcode:</label>
                      <input
                        type="text"
                        value={settingsForm.adminPasscode}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminPasscode: e.target.value })}
                        className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-lg p-2.5 text-white font-mono min-h-[44px]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gold-gradient text-black font-semibold text-xs rounded-xl shadow min-h-[44px]"
                    >
                      Save Configuration
                    </button>
                    {settingsSavedToast && (
                      <span className="text-xs text-emerald-400 flex items-center space-x-1">
                        <Check className="w-4 h-4" />
                        <span>Settings saved to server!</span>
                      </span>
                    )}
                  </div>
                </form>
              )}

              {/* TAB 5: DATABASE & FREE-TIER BACKEND GUIDE */}
              {activeTab === 'architecture' && (
                <div className="max-w-3xl space-y-6">
                  <div className="bg-[#141414] border border-[#D4AF66]/40 rounded-xl p-5 sm:p-6 space-y-4">
                    <div className="flex items-center space-x-2 text-[#D4AF66] font-cinzel font-bold text-sm">
                      <Database className="w-5 h-5" />
                      <span>Zero-Budget Free-Tier Production Architecture</span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      ZenvyWear is powered by an <strong>Express + React full-stack backend architecture (`server.ts`)</strong>. Order calculations, Bangladeshi phone validation, inventory stock decrements, and admin session tokens are validated on the server.
                    </p>

                    <div className="bg-[#1b150c] border-l-2 border-[#D4AF66] p-4 text-xs text-neutral-300 space-y-2">
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <AlertTriangle className="w-4 h-4 text-[#D4AF66]" />
                        <span>Zero-Budget Hosting & Database Recommendations:</span>
                      </div>
                      <p>
                        For a 0 BDT starting budget, you can deploy both backend and database on permanent free-tier cloud platforms:
                      </p>
                    </div>

                    {/* Supabase Free Tier */}
                    <div className="bg-[#111] p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 text-sm">Option 1: Supabase (Managed PostgreSQL)</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded">Free Tier: 500MB DB, 50,000 monthly active users</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed">
                        • Free relational SQL storage with instant row-level security (RLS).<br />
                        • Built-in email/password authentication for administrators.<br />
                        • Setup: Run <code className="text-neutral-200">npm install @supabase/supabase-js</code> and add credentials to server environment variables.
                      </p>
                    </div>

                    {/* Firebase Free Tier */}
                    <div className="bg-[#111] p-4 rounded-xl border border-neutral-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-400 text-sm">Option 2: Firebase Firestore (Spark Plan)</span>
                        <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded">Free Tier: 1GB Storage, 50k reads/day</span>
                      </div>
                      <p className="text-neutral-400 leading-relaxed">
                        • No-SQL cloud persistence with real-time order listeners.<br />
                        • Setup: Provision Firestore and restrict order modifications via Firestore Security Rules.
                      </p>
                    </div>

                    {/* Live Payment Gateway Integration Steps */}
                    <div className="bg-[#111] p-4 rounded-xl border border-neutral-800 space-y-2 text-xs text-neutral-300">
                      <span className="font-semibold text-white block">Official Merchant Gateway Integration Steps (When Ready):</span>
                      <p className="text-neutral-400">
                        1. Obtain trade license and merchant account from <strong>SSLCOMMERZ, Shurjopay, or bKash Merchant Solutions</strong>.<br />
                        2. Never place merchant store secrets in client JavaScript. Initiate payment sessions in <code className="text-neutral-200">server.ts</code>.<br />
                        3. Verify payment success via backend IPN (Instant Payment Notification) signed webhooks before confirming orders.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Reject Payment Claim Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-red-500/50 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center space-x-2 text-red-400 font-bold">
              <XCircle className="w-5 h-5" />
              <span>Reject Payment Claim for {rejectingOrder.id}</span>
            </div>

            <p className="text-xs text-neutral-300">
              Please enter an explanation for the customer. The order will be marked as Cancelled and recorded in audit logs.
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-neutral-700 rounded-xl p-3 text-xs text-white outline-none"
            />

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 border border-neutral-700 rounded-xl text-xs text-neutral-300"
              >
                Back
              </button>
              <button
                onClick={handleConfirmRejection}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-red-500/60 rounded-2xl p-5 sm:p-6 w-full max-w-md space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-cinzel font-bold text-white">Delete Silhouette</h3>
                <span className="text-[11px] text-red-400/80">Permanent removal from store catalog</span>
              </div>
            </div>

            <div className="p-3 bg-[#1a1a1a] rounded-xl border border-neutral-800 flex items-center space-x-3">
              <img
                src={productToDelete.images[0]}
                alt={productToDelete.name}
                className="w-12 h-16 object-cover object-top rounded-lg bg-black border border-neutral-800 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-white truncate">{productToDelete.name}</h4>
                <div className="text-[10px] text-neutral-400">{productToDelete.category} • SKU: {productToDelete.id}</div>
                <div className="text-xs font-mono font-bold text-[#D4AF66] mt-0.5 flex items-center">
                  <Taka className="w-3 h-3 mr-0.5 inline" />{productToDelete.price.toLocaleString()}
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to delete <strong>"{productToDelete.name}"</strong>? This will immediately remove it from both the public storefront collections and database inventory. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 border border-neutral-700 rounded-xl text-xs text-neutral-300 hover:text-white min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingProduct}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow min-h-[44px] flex items-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingProduct ? 'Deleting...' : 'Confirm Permanent Deletion'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="bg-[#111111] border border-[#D4AF66]/50 rounded-2xl p-5 sm:p-6 w-full max-w-2xl space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#1a1610] border border-[#D4AF66]/40 flex items-center justify-center text-[#D4AF66]">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-base text-white">
                    {isNewProduct ? 'Add New Three-Piece or Silhouette' : `Edit: ${editingProduct.name}`}
                  </h3>
                  <span className="text-[10px] text-neutral-400">
                    Capped strictly ৳0–৳5,000 • Instant Storefront Sync
                  </span>
                </div>
              </div>

              <button
                onClick={() => { setEditingProduct(null); setUploadError(null); }}
                className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-950/60 border border-red-500 rounded-xl text-red-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{uploadError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveProduct(editingProduct);
              }}
              className="space-y-4 text-xs"
            >
              {/* Product Name */}
              <div>
                <label className="text-neutral-300 block mb-1 font-medium">Silhouette Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Royal Emerald Handcrafted Three Piece"
                  className="w-full bg-[#181818] border border-neutral-700 focus:border-[#D4AF66] rounded-xl p-3 text-white outline-none min-h-[44px]"
                />
              </div>

              {/* Department, Category, Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Department *</label>
                  <select
                    value={editingProduct.gender || 'women'}
                    onChange={(e: any) => setEditingProduct({ ...editingProduct, gender: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-[#D4AF66] rounded-xl p-2.5 text-white outline-none min-h-[44px]"
                  >
                    <option value="women">Women's Atelier</option>
                    <option value="men">Men's Couture</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e: any) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-[#D4AF66] rounded-xl p-2.5 text-white outline-none min-h-[44px]"
                  >
                    <optgroup label="Women's Atelier">
                      <option value="Three Piece">Three Piece (Women's)</option>
                      <option value="Two Piece">Two Piece</option>
                      <option value="Saree">Saree</option>
                      <option value="Kurti">Kurti</option>
                      <option value="Hijab Collection">Hijab Collection</option>
                      <option value="Western Wear">Western Wear</option>
                    </optgroup>
                    <optgroup label="Men's Couture">
                      <option value="Royal Panjabi">Royal Panjabi</option>
                      <option value="Kabli Suit">Kabli Suit</option>
                      <option value="Embroidered Waistcoat">Embroidered Waistcoat</option>
                      <option value="Sherwani & Kurta">Sherwani & Kurta</option>
                      <option value="Men Silk Set">Men Silk Set</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Price in BDT (৳0–৳5,000) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      max="5000"
                      value={editingProduct.price}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(5000, Number(e.target.value) || 0));
                        setEditingProduct({ ...editingProduct, price: val });
                      }}
                      className="w-full bg-[#181818] border border-neutral-700 focus:border-[#D4AF66] rounded-xl p-2.5 text-white font-mono min-h-[44px]"
                    />
                  </div>
                  {editingProduct.price > 5000 && (
                    <span className="text-[10px] text-amber-400">Price is capped at ৳5,000 maximum.</span>
                  )}
                </div>
              </div>

              {/* Original Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Original Price (Optional for discount display)</label>
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => {
                      const val = e.target.value ? Math.min(5000, Number(e.target.value)) : undefined;
                      const disc = val && val > editingProduct.price ? Math.round(((val - editingProduct.price) / val) * 100) : 0;
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: val,
                        discountPercentage: disc,
                      });
                    }}
                    placeholder="e.g. 3200"
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-[#D4AF66] rounded-xl p-2.5 text-white font-mono min-h-[44px]"
                  />
                  {editingProduct.discountPercentage ? (
                    <span className="text-[10px] text-emerald-400">
                      Calculated discount: {editingProduct.discountPercentage}% OFF
                    </span>
                  ) : null}
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Stock Inventory Units *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editingProduct.stockCount}
                    onChange={(e) => {
                      const count = Math.max(0, Number(e.target.value) || 0);
                      setEditingProduct({
                        ...editingProduct,
                        stockCount: count,
                        inStock: count > 0,
                      });
                    }}
                    className="w-full bg-[#181818] border border-neutral-700 focus:border-[#D4AF66] rounded-xl p-2.5 text-white font-mono min-h-[44px]"
                  />
                </div>
              </div>

              {/* PREMIUM MULTI-IMAGE UPLOADER & GALLERY */}
              <div className="bg-[#141414] border border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#D4AF66] font-semibold flex items-center space-x-1.5">
                    <UploadCloud className="w-4 h-4" />
                    <span>Product Imagery & Gallery</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {editingProduct.images.length} photo{editingProduct.images.length !== 1 ? 's' : ''} • First photo is Primary
                  </span>
                </div>

                {/* Drag and Drop Zone / File Input */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                    if (files.length === 0) {
                      setUploadError('Please drop valid image files (JPG, PNG, WebP).');
                      return;
                    }
                    files.forEach(file => {
                      if (file.size > 5 * 1024 * 1024) {
                        setUploadError(`File ${file.name} is too large (> 5MB). Please optimize.`);
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) {
                          setEditingProduct(prev => prev ? ({
                            ...prev,
                            images: [...prev.images, String(ev.target!.result)],
                          }) : null);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                  className="border-2 border-dashed border-[#D4AF66]/40 hover:border-[#D4AF66] rounded-xl p-5 text-center bg-[#181818] hover:bg-[#1a1710] transition cursor-pointer"
                  onClick={() => document.getElementById('admin-file-picker')?.click()}
                >
                  <input
                    id="admin-file-picker"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach(file => {
                        if (file.size > 5 * 1024 * 1024) {
                          setUploadError(`File ${file.name} exceeds 5MB size limit.`);
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            setEditingProduct(prev => prev ? ({
                              ...prev,
                              images: [...prev.images, String(ev.target!.result)],
                            }) : null);
                          }
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                  />
                  <UploadCloud className="w-7 h-7 text-[#D4AF66] mx-auto mb-1.5" />
                  <div className="font-semibold text-white text-xs">
                    Drag and drop photos here, or <span className="text-[#D4AF66] underline">browse from phone or PC</span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Supports selecting multiple high-res photos (JPG, PNG, WebP up to 5MB each)
                  </p>
                </div>

                {/* Direct Image URL input option */}
                <div className="flex space-x-2 pt-1">
                  <input
                    type="url"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    placeholder="Or paste an image web URL (https://...)"
                    className="flex-1 bg-[#1b1b1b] border border-neutral-700 rounded-lg px-3 py-2 text-white font-mono text-[11px] outline-none min-h-[38px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrlInput.trim()) {
                        setEditingProduct({
                          ...editingProduct,
                          images: [...editingProduct.images, newImageUrlInput.trim()],
                        });
                        setNewImageUrlInput('');
                      }
                    }}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg border border-neutral-700"
                  >
                    Add URL
                  </button>
                </div>

                {/* Image Previews Gallery with Reorder & Set Primary */}
                {editingProduct.images.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] text-neutral-400 block font-medium">Uploaded Gallery Thumbnails:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {editingProduct.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-xl border p-1 bg-black group ${
                            idx === 0 ? 'border-[#D4AF66] ring-1 ring-[#D4AF66]' : 'border-neutral-800'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt=""
                            className="w-full h-24 object-cover object-top rounded-lg"
                          />
                          {idx === 0 && (
                            <span className="absolute top-2 left-2 bg-gold-gradient text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                              MAIN IMAGE
                            </span>
                          )}

                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            {idx !== 0 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const reordered = [...editingProduct.images];
                                  const [moved] = reordered.splice(idx, 1);
                                  reordered.unshift(moved);
                                  setEditingProduct({ ...editingProduct, images: reordered });
                                }}
                                className="text-[#D4AF66] hover:underline"
                              >
                                Make Main
                              </button>
                            ) : (
                              <span className="text-neutral-500">Primary</span>
                            )}

                            <div className="flex items-center space-x-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = [...editingProduct.images];
                                    [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                                    setEditingProduct({ ...editingProduct, images: arr });
                                  }}
                                  className="p-1 hover:text-[#D4AF66] text-neutral-400"
                                  title="Move Left"
                                >
                                  <MoveLeft className="w-3 h-3" />
                                </button>
                              )}
                              {idx < editingProduct.images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const arr = [...editingProduct.images];
                                    [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                                    setEditingProduct({ ...editingProduct, images: arr });
                                  }}
                                  className="p-1 hover:text-[#D4AF66] text-neutral-400"
                                  title="Move Right"
                                >
                                  <MoveRight className="w-3 h-3" />
                                </button>
                              )}
                              {editingProduct.images.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProduct({
                                      ...editingProduct,
                                      images: editingProduct.images.filter((_, i) => i !== idx),
                                    });
                                  }}
                                  className="p-1 text-red-400 hover:text-red-300 ml-1"
                                  title="Remove Image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* AVAILABLE SIZES SELECTION */}
              <div className="bg-[#141414] border border-neutral-800 rounded-xl p-3.5 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#D4AF66] font-semibold block">
                  Available Sizes *
                </span>
                <div className="flex flex-wrap gap-2">
                  {(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', '38', '40', '42', '44', '46'] as ProductSize[]).map((size) => {
                    const isSelected = editingProduct.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => {
                          const currentSizes = editingProduct.sizes;
                          const nextSizes = isSelected
                            ? currentSizes.filter((s) => s !== size)
                            : [...currentSizes, size];
                          setEditingProduct({
                            ...editingProduct,
                            sizes: nextSizes.length > 0 ? nextSizes : [size],
                          });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition min-h-[36px] ${
                          isSelected
                            ? 'bg-gold-gradient text-black font-bold shadow'
                            : 'bg-[#1e1e1e] border border-neutral-700 text-neutral-300 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AVAILABLE COLORS & QUICK SUGGESTIONS */}
              <div className="bg-[#141414] border border-neutral-800 rounded-xl p-3.5 space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#D4AF66] font-semibold block">
                  Available Colors
                </span>
                <input
                  type="text"
                  value={editingProduct.colors?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      colors: e.target.value.split(',').map((c) => c.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. Jet Black, Antique Gold, Royal Emerald"
                  className="w-full bg-[#1b1b1b] border border-neutral-700 rounded-xl p-2.5 text-white min-h-[44px]"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-neutral-400">
                  <span>Quick Add:</span>
                  {['Jet Black', 'Antique Gold', 'Royal Emerald', 'Ruby Maroon', 'Pearl Ivory', 'Mink Grey', 'Navy Blue'].map((color) => (
                    <button
                      type="button"
                      key={color}
                      onClick={() => {
                        const current = editingProduct.colors || [];
                        if (!current.includes(color)) {
                          setEditingProduct({ ...editingProduct, colors: [...current, color] });
                        }
                      }}
                      className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-[10px]"
                    >
                      + {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric & Work Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Fabric Type / Material</label>
                  <input
                    type="text"
                    value={editingProduct.fabricDetails.kameezFabric}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        fabricDetails: { ...editingProduct.fabricDetails, kameezFabric: e.target.value },
                      })
                    }
                    placeholder="e.g. Pure Organza Silk / Cotton Jacquard"
                    className="w-full bg-[#181818] border border-neutral-700 rounded-xl p-2.5 text-white min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 block mb-1 font-medium">Embroidery & Workmanship</label>
                  <input
                    type="text"
                    value={editingProduct.fabricDetails.workType}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        fabricDetails: { ...editingProduct.fabricDetails, workType: e.target.value },
                      })
                    }
                    placeholder="e.g. Zardozi Hand Embroidery / Cutwork"
                    className="w-full bg-[#181818] border border-neutral-700 rounded-xl p-2.5 text-white min-h-[44px]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-neutral-300 block mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  placeholder="Detail the cut, silhouette, fabric handfeel, and included pieces..."
                  className="w-full bg-[#181818] border border-neutral-700 rounded-xl p-2.5 text-white"
                />
              </div>

              {/* Labels & Tags */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isNewArrival || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isNewArrival: e.target.checked })}
                    className="accent-[#D4AF66] w-4 h-4"
                  />
                  <span className="text-neutral-300">New Arrival Label</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="accent-[#D4AF66] w-4 h-4"
                  />
                  <span className="text-neutral-300">Featured Atelier Silhouette</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => { setEditingProduct(null); setUploadError(null); }}
                  className="px-4 py-2.5 border border-neutral-700 rounded-xl text-neutral-300 text-xs min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 bg-gold-gradient text-black font-semibold text-xs rounded-xl shadow min-h-[44px]"
                >
                  {isSavingProduct ? 'Saving Silhouette...' : isNewProduct ? 'Publish Silhouette' : 'Update Silhouette'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
