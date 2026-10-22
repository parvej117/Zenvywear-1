import React from 'react';
import { Sparkles, Gem, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutUsPageProps {
  onShopNow: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onShopNow }) => {
  return (
    <div className="min-h-screen bg-[#080808] text-white py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#161616] border border-[#D4AF66]/40 text-[#D4AF66] text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              The Story of ZenvyWear
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-cinzel font-bold text-white tracking-tight">
            Elegance in Every Wear
          </h1>

          <div className="w-20 h-0.5 bg-[#D4AF66] mx-auto" />

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
            Founded in the heart of Dhaka, ZenvyWear was conceived with a single, resolute vision: to elevate contemporary Bangladeshi modest and festive couture to world-class refinement without compromising on craftsmanship or comfort.
          </p>
        </div>

        {/* Narrative & Atelier Imagery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-2xl overflow-hidden border border-[#D4AF66]/30 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop"
              alt="Artisanal Embroidery"
              className="w-full h-[440px] object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs uppercase tracking-widest text-[#D4AF66] font-semibold block mb-1">
                Atelier Craftsmanship
              </span>
              <p className="text-sm font-cinzel font-bold text-white">
                Hand-Guided Zardozi, Resham & Gota Work
              </p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
            <h2 className="text-2xl font-cinzel font-bold text-white">
              Rooted in Bengal's Textile Heritage
            </h2>

            <p>
              From the historic looms of Narayanganj weaving legendary Jamdani patterns to master karigars in Old Dhaka meticulously threading antique champagne zardozi, each ZenvyWear piece reflects generations of artistry.
            </p>

            <p>
              We reject fleeting fast-fashion mass production. Every Three-Piece silhouette undergoes 48 hours of artisanal hand-embroidery, followed by rigorous quality checks for thread tension, fabric drape, and seam durability.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-[#121212] p-4 rounded-xl border border-neutral-800">
                <span className="text-2xl font-cinzel font-bold text-[#D4AF66] block">100%</span>
                <span className="text-xs text-neutral-400">Pure Organza, Swiss Lawn & Silk</span>
              </div>
              <div className="bg-[#121212] p-4 rounded-xl border border-neutral-800">
                <span className="text-2xl font-cinzel font-bold text-[#D4AF66] block">18+</span>
                <span className="text-xs text-neutral-400">Master Artisan Karigars</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-[#121212] p-6 rounded-2xl border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b1710] border border-[#D4AF66]/40 flex items-center justify-center text-[#D4AF66]">
              <Gem className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel font-bold text-white text-base">Uncompromising Fabrics</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We exclusively source featherweight breathable cottons, raw silks, and imported Turkish Medina chiffon that withstand multiple seasons of wear.
            </p>
          </div>

          <div className="bg-[#121212] p-6 rounded-2xl border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b1710] border border-[#D4AF66]/40 flex items-center justify-center text-[#D4AF66]">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel font-bold text-white text-base">Fair Living Wages</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Every master artisan, tailor, and finishing worker receives fair compensation, dignified working conditions, and healthcare support.
            </p>
          </div>

          <div className="bg-[#121212] p-6 rounded-2xl border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1b1710] border border-[#D4AF66]/40 flex items-center justify-center text-[#D4AF66]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel font-bold text-white text-base">The Banani Flagship</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Experience the fabrics in person at our luxury consultation studio in Banani, Dhaka, complete with custom tailoring and styling advisors.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={onShopNow}
            className="px-8 py-3.5 bg-gold-gradient text-black font-cinzel font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:scale-[1.02] transition inline-flex items-center space-x-2"
          >
            <span>Explore The Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
