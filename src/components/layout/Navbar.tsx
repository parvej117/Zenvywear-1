import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Menu, 
  X, 
  Shield, 
  User, 
  Compass, 
  Sparkles,
  PhoneCall,
  Clock,
  UserCheck
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Taka } from '../common/Taka';

interface NavbarProps {
  activeView: string;
  onNavigate: (view: string, filterCategory?: ProductCategory) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenTracking: () => void;
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenSearch,
  onOpenTracking,
  isAdmin,
  onOpenAdmin,
}) => {
  const { currentUser, openAuthModal, openProfileModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; view: string; category?: ProductCategory }[] = [
    { label: 'Home', view: 'home' },
    { label: "Women's Atelier", view: 'womens' },
    { label: "Men's Couture", view: 'mens' },
    { label: 'Three Piece', view: 'womens', category: 'Three Piece' },
    { label: 'Panjabi & Kabli', view: 'mens', category: 'Royal Panjabi' },
    { label: 'All Catalog', view: 'shop' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080808]/95 border-b border-[#D4AF66]/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-300 hover:text-[#D4AF66] transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center sm:items-start cursor-pointer group"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-cinzel tracking-[0.22em] font-bold text-white group-hover:text-[#D4AF66] transition-colors">
                ZENVY<span className="text-[#D4AF66]">WEAR</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF66] shadow-[0_0_8px_#D4AF66]" />
            </div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF66]/90 font-light hidden sm:block">
              Elegance in Every Wear
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = activeView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => onNavigate(link.view, link.category)}
                  className={`text-xs uppercase tracking-widest font-medium transition-colors relative py-1 ${
                    isActive 
                      ? 'text-[#D4AF66]' 
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D4AF66] shadow-[0_0_6px_#D4AF66]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Currency Pill */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#151515] border border-neutral-800 text-[11px] text-neutral-300">
              <Taka className="w-3.5 h-3.5 text-[#D4AF66]" />
              <span>BDT</span>
            </div>

            {/* Live Search Trigger */}
            <button
              onClick={onOpenSearch}
              title="Search Collection"
              className="p-2 text-neutral-300 hover:text-[#D4AF66] transition relative"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Track Order */}
            <button
              onClick={onOpenTracking}
              title="Track Order Status"
              className="hidden sm:flex items-center space-x-1 p-2 text-neutral-300 hover:text-[#D4AF66] transition text-xs"
            >
              <Compass className="w-4 h-4 text-[#D4AF66]" />
              <span className="hidden xl:inline">Track</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => onNavigate('shop')}
              title="Wishlist"
              className="p-2 text-neutral-300 hover:text-[#D4AF66] transition relative hidden sm:block"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF66] text-black text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Customer Account Button */}
            {currentUser ? (
              <button
                onClick={() => openProfileModal('profile')}
                title="Customer Profile & Orders"
                className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-[#181510] border border-[#D4AF66]/50 hover:border-[#D4AF66] text-white flex items-center space-x-1.5 transition text-xs group"
              >
                <div className="w-5 h-5 rounded-full bg-gold-gradient text-black font-bold flex items-center justify-center text-[10px]">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline text-neutral-200 group-hover:text-white max-w-[80px] truncate">
                  {currentUser.fullName.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                title="Sign In / Register"
                className="p-2 text-neutral-300 hover:text-[#D4AF66] transition flex items-center space-x-1 text-xs"
              >
                <User className="w-4 h-4 text-[#D4AF66]" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              title="Shopping Bag"
              className="p-2 text-neutral-100 hover:text-[#D4AF66] transition relative flex items-center space-x-1.5 bg-[#151515] border border-neutral-800 hover:border-[#D4AF66]/40 rounded-full px-3 py-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#D4AF66]" />
              <span className="text-xs font-semibold">
                {cartCount}
              </span>
            </button>

            {/* Admin Dashboard Trigger */}
            <button
              onClick={onOpenAdmin}
              title="Admin Portal"
              className={`p-2 rounded-lg border text-xs flex items-center space-x-1 transition ${
                isAdmin
                  ? 'bg-[#221c12] border-[#D4AF66] text-[#D4AF66]'
                  : 'bg-[#121212] border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              <Shield className="w-4 h-4 text-[#D4AF66]" />
              <span className="hidden md:inline font-mono text-[11px]">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0c0c] border-b border-[#D4AF66]/30 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  onNavigate(link.view, link.category);
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm uppercase tracking-wider text-neutral-200 hover:text-[#D4AF66] py-2 border-b border-neutral-900"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Customer Profile / Sign In */}
          <div className="p-3 bg-[#161616] rounded-xl border border-neutral-800 flex items-center justify-between">
            {currentUser ? (
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-gradient text-black font-bold flex items-center justify-center text-xs">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{currentUser.fullName}</div>
                  <div className="text-[10px] text-neutral-400 font-mono">{currentUser.email}</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-neutral-300 text-xs">
                <User className="w-4 h-4 text-[#D4AF66]" />
                <span>Patron Account</span>
              </div>
            )}

            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openProfileModal('profile');
                }}
                className="px-3 py-1 bg-gold-gradient text-black font-semibold text-[11px] rounded-lg min-h-[32px]"
              >
                My Account
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="px-3 py-1 bg-gold-gradient text-black font-semibold text-[11px] rounded-lg min-h-[32px]"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="pt-2 flex flex-col space-y-2 text-xs text-neutral-400">
            <button
              onClick={() => {
                onOpenTracking();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-[#D4AF66] py-1"
            >
              <Compass className="w-4 h-4" />
              <span>Track Your Order (bKash/Nagad/COD)</span>
            </button>
            <div className="flex items-center space-x-2 py-1 text-neutral-300">
              <PhoneCall className="w-4 h-4 text-[#D4AF66]" />
              <span>Hotline & WhatsApp: +880 1712-345678</span>
            </div>
            <div className="flex items-center space-x-2 py-1 text-neutral-400">
              <Clock className="w-4 h-4 text-[#D4AF66]" />
              <span>Gulshan & Banani Showroom: 10 AM - 9 PM</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
