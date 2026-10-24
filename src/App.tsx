import React, { useState, useEffect } from 'react';
import { 
  Product, 
  ProductCategory, 
  ProductSize, 
  CartItem, 
  Order, 
  OrderStatus, 
  AdminSettings 
} from './types';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  getStoredOrders, 
  saveStoredOrders, 
  addStoredOrder, 
  updateStoredOrderStatus, 
  getStoredCart, 
  saveStoredCart, 
  getStoredWishlist, 
  saveStoredWishlist, 
  getStoredSettings, 
  saveStoredSettings 
} from './utils/storage';

// Layout & Common Components
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastNotification } from './components/common/ToastNotification';
import { SearchModal } from './components/common/SearchModal';

// Home Views
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FeaturedSection } from './components/home/FeaturedSection';
import { ServiceHighlights } from './components/home/ServiceHighlights';
import { NewsletterPromo } from './components/home/NewsletterPromo';

// Shop & Product
import { ShopPage } from './components/shop/ShopPage';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { WomensCollectionPage } from './components/collection/WomensCollectionPage';
import { MensCollectionPage } from './components/collection/MensCollectionPage';

// Cart & Checkout & Order
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmationPage } from './components/order/OrderConfirmationPage';
import { OrderTrackingModal } from './components/order/OrderTrackingModal';

// Static / Information Pages
import { AboutUsPage } from './components/pages/AboutUsPage';
import { ContactUsPage } from './components/pages/ContactUsPage';
import { PoliciesPage } from './components/pages/PoliciesPage';

// Admin Portal
import { AdminDashboard } from './components/admin/AdminDashboard';

// Customer Authentication & Profile
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomerAuthModal } from './components/auth/CustomerAuthModal';
import { CustomerProfileModal } from './components/auth/CustomerProfileModal';

import { api } from './services/api';

function AppContent() {
  // Navigation View: 'home' | 'shop' | 'checkout' | 'confirmation' | 'about' | 'contact' | 'policies'
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ProductCategory | 'All'>('All');

  // Customer Auth
  const { isAuthenticated, openAuthModal, redirectIntent, setRedirectIntent } = useAuth();

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(getStoredSettings());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Coupons
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);

  // Active Completed Order (for Confirmation Page)
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize from server API with local storage fallback
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (window.location.pathname === '/admin' || hash === '#admin') {
        setIsAdminOpen(true);
      } else if (hash === '#track') {
        setIsTrackingOpen(true);
      } else if (hash === '#womens') {
        setActiveView('womens');
      } else if (hash === '#mens') {
        setActiveView('mens');
      } else if (hash === '#shop') {
        setActiveView('shop');
      } else if (hash === '#checkout') {
        setActiveView('checkout');
      } else if (hash === '#about') {
        setActiveView('about');
      } else if (hash === '#contact') {
        setActiveView('contact');
      } else if (hash === '#policies') {
        setActiveView('policies');
      } else if (hash === '#home') {
        setActiveView('home');
      }
    };

    handleHash();

    const initData = async () => {
      const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem('zenvy_admin_token') : null;
      const [prods, ords, settings] = await Promise.all([
        api.getProducts(),
        storedToken ? api.getOrders(storedToken) : Promise.resolve(getStoredOrders()),
        api.getSettings(),
      ]);
      setProducts(prods);
      setOrders(ords);
      setAdminSettings(settings);
      setCart(getStoredCart());
      setWishlist(getStoredWishlist());
    };

    initData();

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Sync cart changes to storage
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    saveStoredCart(newCart);
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: ProductSize, quantity = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === size
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [...cart, { product, selectedSize: size, quantity }];
    }

    updateCart(updatedCart);
    setToastMessage(`Added "${product.name}" (${size}) to your shopping bag.`);
  };

  // Auto-redirect to checkout when customer signs in with checkout intent
  useEffect(() => {
    if (isAuthenticated && redirectIntent === 'checkout') {
      setRedirectIntent(null);
      setActiveView('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isAuthenticated, redirectIntent, setRedirectIntent]);

  const handleBuyNow = (product: Product, size: ProductSize, quantity = 1) => {
    handleAddToCart(product, size, quantity);
    if (!isAuthenticated) {
      setRedirectIntent('checkout');
      openAuthModal('login', 'Please sign in or create an account to proceed to checkout.');
    } else {
      setActiveView('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpdateCartQuantity = (productId: string, size: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(productId, size);
      return;
    }
    const updated = cart.map((item) => {
      if (item.product.id === productId && item.selectedSize === size) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(updated);
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    const updated = cart.filter(
      (item) => !(item.product.id === productId && item.selectedSize === size)
    );
    updateCart(updated);
  };

  // Wishlist toggle
  const handleToggleWishlist = (productId: string) => {
    let updated: string[];
    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
      setToastMessage('Removed item from your wishlist.');
    } else {
      updated = [...wishlist, productId];
      setToastMessage('Saved item to your wishlist.');
    }
    setWishlist(updated);
    saveStoredWishlist(updated);
  };

  // Coupon handling
  const handleApplyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ZENVY10' || clean === 'EID10') {
      const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      const discount = Math.round(subtotal * 0.1);
      setCouponCode(clean);
      setAppliedDiscount(discount);
      setToastMessage(`Coupon ${clean} applied! 10% discount subtracted.`);
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setAppliedDiscount(0);
    setToastMessage('Coupon removed.');
  };

  // Navigation helper
  const navigateTo = (view: string, category?: ProductCategory) => {
    setActiveView(view);
    if (category) {
      setSelectedCategoryFilter(category);
    } else if (view === 'shop') {
      setSelectedCategoryFilter('All');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Placement
  const handleOrderPlaced = (order: Order) => {
    const updatedOrders = addStoredOrder(order);
    setOrders(updatedOrders);
    setLastPlacedOrder(order);
    // Clear cart
    updateCart([]);
    setCouponCode('');
    setAppliedDiscount(0);
    setActiveView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setToastMessage(`Order #${order.id} submitted successfully!`);
  };

  // Admin order status update
  const handleUpdateOrderStatus = async (
    orderId: string, 
    status: OrderStatus, 
    note?: string,
    paymentStatus?: string,
    rejectionReason?: string
  ) => {
    await api.updateOrderStatus(orderId, status, note, paymentStatus, rejectionReason);
    const updated = updateStoredOrderStatus(orderId, status, note, paymentStatus === 'Verified');
    setOrders(updated);
    setToastMessage(`Order ${orderId} updated to "${status}".`);
  };

  // Admin product save
  const handleSaveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveStoredProducts(newProducts);
    setToastMessage('Product catalog updated successfully.');
  };

  // Admin settings save
  const handleSaveSettings = (newSettings: AdminSettings) => {
    setAdminSettings(newSettings);
    saveStoredSettings(newSettings);
    setToastMessage('Shop settings saved successfully.');
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#080808] text-[#FBF8F1] flex flex-col font-sans selection:bg-[#D4AF66] selection:text-black">
      
      {/* Top Announcement Bar */}
      {adminSettings.showAnnouncement && (
        <AnnouncementBar 
          text={adminSettings.announcementText}
          onTrackOrder={() => setIsTrackingOpen(true)}
        />
      )}

      {/* Main Responsive Luxury Navigation Bar */}
      <Navbar
        activeView={activeView}
        onNavigate={navigateTo}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        isAdmin={false}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-grow">
        {activeView === 'home' && (
          <>
            {/* Luxury Hero Banner with 3D Couture Studio Toggle & Collection Tabs */}
            <HeroBanner
              onShopNow={() => navigateTo('shop')}
              onExploreWomens={() => navigateTo('womens')}
              onExploreMens={() => navigateTo('mens')}
              onExploreCategory={(cat) => navigateTo('shop', cat)}
            />

            {/* Visual Categories Grid */}
            <CategoryGrid
              onSelectCategory={(cat) => navigateTo('shop', cat)}
            />

            {/* Featured Silhouettes with Tabs & Special Offers Countdown */}
            <FeaturedSection
              products={products}
              onQuickView={(p) => setSelectedProductDetail(p)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onViewAll={() => navigateTo('shop')}
            />

            {/* Service Highlights (Quality, bKash/Nagad verification, Delivery, Returns) */}
            <ServiceHighlights />

            {/* Promotional Welcome Voucher Banner */}
            <NewsletterPromo
              onShopNow={() => navigateTo('shop')}
            />
          </>
        )}

        {activeView === 'womens' && (
          <WomensCollectionPage
            products={products}
            initialCategory={selectedCategoryFilter}
            onQuickView={(p) => setSelectedProductDetail(p)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onNavigateToShop={() => navigateTo('shop')}
          />
        )}

        {activeView === 'mens' && (
          <MensCollectionPage
            products={products}
            initialCategory={selectedCategoryFilter}
            onQuickView={(p) => setSelectedProductDetail(p)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onNavigateToShop={() => navigateTo('shop')}
          />
        )}

        {activeView === 'shop' && (
          <ShopPage
            products={products}
            initialCategory={selectedCategoryFilter}
            onQuickView={(p) => setSelectedProductDetail(p)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutPage
            items={cart}
            subtotal={cartSubtotal}
            appliedDiscount={appliedDiscount}
            adminSettings={adminSettings}
            onBackToCart={() => {
              setIsCartOpen(true);
              setActiveView('shop');
            }}
            onOrderPlaced={handleOrderPlaced}
          />
        )}

        {activeView === 'confirmation' && lastPlacedOrder && (
          <OrderConfirmationPage
            order={lastPlacedOrder}
            onContinueShopping={() => navigateTo('shop')}
            onOpenAdminPortal={() => setIsAdminOpen(true)}
          />
        )}

        {activeView === 'about' && (
          <AboutUsPage onShopNow={() => navigateTo('shop')} />
        )}

        {activeView === 'contact' && (
          <ContactUsPage />
        )}

        {activeView === 'policies' && (
          <PoliciesPage />
        )}
      </main>

      {/* Luxury Footer with Showroom Address, bKash Badges & Links */}
      <Footer
        onNavigate={navigateTo}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Shopping Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setActiveView('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onContinueShopping={() => navigateTo('shop')}
        couponCode={couponCode}
        appliedDiscount={appliedDiscount}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        freeDeliveryThreshold={adminSettings.freeDeliveryThreshold}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isWishlisted={selectedProductDetail ? wishlist.includes(selectedProductDetail.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProductDetail(p)}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
      />

      {/* Protected Admin Dashboard Portal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onSaveProducts={handleSaveProducts}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        adminSettings={adminSettings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Global Feedback Toast */}
      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Customer Authentication Modal (Login / Register / Forgot Password) */}
      <CustomerAuthModal />

      {/* Customer Profile & Orders Modal */}
      <CustomerProfileModal
        onOpenTracking={(orderId) => {
          setIsTrackingOpen(true);
        }}
        onContinueShopping={() => navigateTo('shop')}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
