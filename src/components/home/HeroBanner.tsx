import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Box, 
  Layers, 
  ShieldCheck, 
  CheckCircle, 
  Compass, 
  ShoppingBag,
  Star,
  Crown,
  UserCheck
} from 'lucide-react';
import { CoutureModelScene } from '../3d/CoutureModelScene';
import { Taka } from '../common/Taka';

interface HeroBannerProps {
  onShopNow: () => void;
  onExploreWomens: () => void;
  onExploreMens: () => void;
  onExploreCategory: (category: any) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onShopNow, 
  onExploreWomens,
  onExploreMens,
  onExploreCategory 
}) => {
  const [collectionTab, setCollectionTab] = useState<'womens' | 'mens' | '3d'>('womens');

  return (
    <section className="relative bg-[#080808] border-b border-[#D4AF66]/20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF66]/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#4A0E17]/20 blur-[120px] pointer-events-none rounded-full" />

      {/* Collection Switcher Bar in Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="inline-flex items-center p-1 rounded-2xl bg-[#141414] border border-[#D4AF66]/30 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setCollectionTab('womens')}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-xs uppercase tracking-widest font-semibold transition-all flex items-center space-x-2 ${
              collectionTab === 'womens'
                ? 'bg-gold-gradient text-black shadow-[0_0_20px_rgba(212,175,102,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Women's Atelier</span>
          </button>

          <button
            onClick={() => setCollectionTab('mens')}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-xs uppercase tracking-widest font-semibold transition-all flex items-center space-x-2 ${
              collectionTab === 'mens'
                ? 'bg-gold-gradient text-black shadow-[0_0_20px_rgba(212,175,102,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Men's Couture</span>
          </button>

          <button
            onClick={() => setCollectionTab('3d')}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-xs uppercase tracking-widest font-semibold transition-all flex items-center space-x-2 ${
              collectionTab === '3d'
                ? 'bg-gold-gradient text-black shadow-[0_0_20px_rgba(212,175,102,0.4)]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-[#D4AF66]" />
            <span>Interactive 3D Studio</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D4AF66]/40 text-[#D4AF66] text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">
                {collectionTab === 'mens' 
                  ? 'Royal Heritage Atelier • Men’s Couture'
                  : 'The Haute Couture Atelier • Dhaka'}
              </span>
            </div>

            {/* Main Heading based on Tab */}
            {collectionTab === 'mens' ? (
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-white tracking-tight leading-[1.15]">
                  Royal Silk Panjabi & <span className="text-gold-gradient block sm:inline">Kabli Couture</span>
                </h1>
                <p className="text-xl sm:text-2xl font-playfair italic text-[#D4AF66] font-normal tracking-wide">
                  Masculine Heritage Craftsmanship
                </p>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl mx-auto lg:mx-0 pt-2">
                  Indulge in royal Tussar silk panjabis, structured linen Pathani Kabli suits, Banarasi brocade prince waistcoats, and hand-loomed Jamdani weaves tailored for distinguished presence.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-white tracking-tight leading-[1.15]">
                  Discover Your <span className="text-gold-gradient block sm:inline">Elegance</span>
                </h1>
                <p className="text-xl sm:text-2xl font-playfair italic text-[#D4AF66] font-normal tracking-wide">
                  Premium Three-Piece & Festive Silhouettes
                </p>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl mx-auto lg:mx-0 pt-2">
                  Immerse yourself in royal Bangladeshi artistry. From delicate zardozi needlework on pure organza silk to opulent hand-loomed Jamdani weaves — curated for the discerning woman.
                </p>
              </div>
            )}

            {/* Price Range Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs text-neutral-400">
              <div className="flex items-center space-x-1.5 bg-[#121212] px-3 py-1.5 rounded-lg border border-neutral-800">
                <span className="text-[#D4AF66] font-bold flex items-center">
                  <Taka className="w-3 h-3 mr-0.5 inline" />1,950 — <Taka className="w-3 h-3 mx-0.5 inline" />4,500
                </span>
                <span>Affordable Luxury (৳0–৳5,000)</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-[#121212] px-3 py-1.5 rounded-lg border border-neutral-800">
                <CheckCircle className="w-3.5 h-3.5 text-[#D4AF66]" />
                <span>bKash & Nagad Verified</span>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              {collectionTab === 'mens' ? (
                <>
                  <button
                    onClick={onExploreMens}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-gradient text-black font-cinzel font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(212,175,102,0.3)] hover:shadow-[0_0_35px_rgba(212,175,102,0.5)] hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center space-x-3"
                  >
                    <span>Explore Men's Collection</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <button
                    onClick={() => onExploreCategory('Royal Panjabi')}
                    className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] text-neutral-200 border border-[#D4AF66]/40 hover:border-[#D4AF66] font-cinzel text-xs tracking-wider uppercase transition flex items-center justify-center space-x-2"
                  >
                    <span>Shop Royal Panjabi</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onExploreWomens}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-gradient text-black font-cinzel font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(212,175,102,0.3)] hover:shadow-[0_0_35px_rgba(212,175,102,0.5)] hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center space-x-3"
                  >
                    <span>Explore Women's Atelier</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>

                  <button
                    onClick={() => onExploreCategory('Three Piece')}
                    className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] text-neutral-200 border border-[#D4AF66]/40 hover:border-[#D4AF66] font-cinzel text-xs tracking-wider uppercase transition flex items-center justify-center space-x-2"
                  >
                    <span>View Three-Piece</span>
                  </button>
                </>
              )}
            </div>

            {/* Trust stats */}
            <div className="pt-6 border-t border-neutral-900 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-xl font-bold font-cinzel text-white">100%</div>
                <div className="text-[11px] text-neutral-400">Pure Silk & Lawn</div>
              </div>
              <div>
                <div className="text-xl font-bold font-cinzel text-[#D4AF66]">64</div>
                <div className="text-[11px] text-neutral-400">Districts Delivered</div>
              </div>
              <div>
                <div className="text-xl font-bold font-cinzel text-white">4.9 ★</div>
                <div className="text-[11px] text-neutral-400">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual OR Interactive 3D Couture Studio */}
          <div className="lg:col-span-6 z-10">
            {collectionTab === '3d' ? (
              <div className="relative">
                <CoutureModelScene onExploreCatalog={onShopNow} />
                <div className="mt-2 text-center">
                  <button
                    onClick={() => setCollectionTab('womens')}
                    className="text-xs text-neutral-400 hover:text-[#D4AF66] underline transition"
                  >
                    ← Switch back to editorial campaign photo
                  </button>
                </div>
              </div>
            ) : collectionTab === 'mens' ? (
              <div className="relative group">
                <div className="relative rounded-2xl overflow-hidden border border-[#D4AF66]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                  <img
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop"
                    alt="ZenvyWear Royal Men's Panjabi Collection"
                    className="w-full h-[500px] sm:h-[580px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/30" />

                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-[#0f0f0f]/90 border border-[#D4AF66]/50 rounded-xl p-4 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF66]" />
                          <span className="text-[10px] uppercase tracking-wider text-[#D4AF66] font-semibold">
                            Men's Editorial Feature
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-cinzel font-bold text-white">
                          Imperial Black Silk Panjabi Set
                        </h3>
                        <p className="text-xs text-neutral-400">
                          Tussar Art Silk with Antique Gold Zardozi Collar & Pyjama
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-cinzel font-bold text-[#D4AF66] flex items-center justify-end">
                          <Taka className="w-4 h-4 mr-0.5 inline" />2,450
                        </span>
                        <span className="text-xs text-neutral-500 line-through flex items-center justify-end">
                          <Taka className="w-3 h-3 mr-0.5 inline text-neutral-500" />2,950
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3D Switch Overlay Pill */}
                  <button
                    onClick={() => setCollectionTab('3d')}
                    className="absolute top-5 right-5 bg-black/80 hover:bg-black border border-[#D4AF66] text-[#D4AF66] px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-lg transition"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Mannequin Studio</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="relative rounded-2xl overflow-hidden border border-[#D4AF66]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                  <img
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop"
                    alt="ZenvyWear Luxury Three Piece Collection"
                    className="w-full h-[500px] sm:h-[580px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/30" />

                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-[#0f0f0f]/90 border border-[#D4AF66]/50 rounded-xl p-4 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF66]" />
                          <span className="text-[10px] uppercase tracking-wider text-[#D4AF66] font-semibold">
                            Women's Editorial Feature
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-cinzel font-bold text-white">
                          Luxury Black Three Piece
                        </h3>
                        <p className="text-xs text-neutral-400">
                          Pure Organza Silk with Antique Zardozi Work & Jacquard Dupatta
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-cinzel font-bold text-[#D4AF66] flex items-center justify-end">
                          <Taka className="w-4 h-4 mr-0.5 inline" />2,250
                        </span>
                        <span className="text-xs text-neutral-500 line-through flex items-center justify-end">
                          <Taka className="w-3 h-3 mr-0.5 inline text-neutral-500" />2,800
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3D Switch Overlay Pill */}
                  <button
                    onClick={() => setCollectionTab('3d')}
                    className="absolute top-5 right-5 bg-black/80 hover:bg-black border border-[#D4AF66] text-[#D4AF66] px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-lg transition"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>3D Mannequin Studio</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
