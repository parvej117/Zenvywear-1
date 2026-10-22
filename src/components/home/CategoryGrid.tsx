import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Crown, UserCheck } from 'lucide-react';
import { ProductCategory } from '../../types';

interface CategoryGridProps {
  onSelectCategory: (category: ProductCategory) => void;
}

interface CategoryCardItem {
  category: ProductCategory;
  title: string;
  subtitle: string;
  priceStart: string;
  imageUrl: string;
  badge: string;
}

const WOMENS_CATEGORIES: CategoryCardItem[] = [
  {
    category: 'Three Piece',
    title: 'Three Piece Luxury',
    subtitle: 'Organza, Chanderi & Swiss Lawn Sets',
    priceStart: 'From ৳2,100',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop',
    badge: 'Signature',
  },
  {
    category: 'Saree',
    title: 'Heritage Sarees',
    subtitle: 'Narayanganj Jamdani & Micro-Velvet',
    priceStart: 'From ৳3,200',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop',
    badge: 'Artisanal',
  },
  {
    category: 'Two Piece',
    title: 'Two Piece Sets',
    subtitle: 'Pure Linen & Chiffon Co-Ords',
    priceStart: 'From ৳1,650',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
    badge: 'Contemporary',
  },
  {
    category: 'Kurti',
    title: 'Designer Kurtis',
    subtitle: 'Kashmiri Threadwork & Indigo Dabu',
    priceStart: 'From ৳950',
    imageUrl: 'https://images.unsplash.com/photo-1583391733975-2980993510c4?q=80&w=900&auto=format&fit=crop',
    badge: 'Daily Luxury',
  },
  {
    category: 'Hijab Collection',
    title: 'Hijabs & Modest Caps',
    subtitle: 'Turkish Medina Chiffon & Pleated Silk',
    priceStart: 'From ৳550',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=900&auto=format&fit=crop',
    badge: 'Modest Couture',
  },
  {
    category: 'Western Wear',
    title: 'Western Luxe',
    subtitle: 'Tailored Crepe Blazers & Satin Pants',
    priceStart: 'From ৳2,950',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop',
    badge: 'New Trend',
  },
];

const MENS_CATEGORIES: CategoryCardItem[] = [
  {
    category: 'Royal Panjabi',
    title: 'Royal Silk Panjabi',
    subtitle: 'Tussar Silk, Jamdani Weaves & Kantha Work',
    priceStart: 'From ৳2,150',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop',
    badge: 'Eid Heritage',
  },
  {
    category: 'Kabli Suit',
    title: 'Structured Kabli Suits',
    subtitle: 'Slub Linen Pathani Sets with Flap Pockets',
    priceStart: 'From ৳2,850',
    imageUrl: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=900&auto=format&fit=crop',
    badge: 'Masculine Form',
  },
  {
    category: 'Embroidered Waistcoat',
    title: 'Brocade Waistcoats',
    subtitle: 'Banarasi Kalka Zari & Brass Crest Buttons',
    priceStart: 'From ৳1,950',
    imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=900&auto=format&fit=crop',
    badge: 'Wedding Guest',
  },
  {
    category: 'Sherwani & Kurta',
    title: 'Sherwani & Kurta Sets',
    subtitle: 'Mukaish Work & Resham Embroidery with Churidar',
    priceStart: 'From ৳3,450',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop',
    badge: 'Royal Celebrations',
  },
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const [activeTab, setActiveTab] = useState<'womens' | 'mens'>('womens');

  const categories = activeTab === 'womens' ? WOMENS_CATEGORIES : MENS_CATEGORIES;

  return (
    <section className="py-16 sm:py-24 bg-[#0a0a0a] border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#D4AF66] mb-2 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Silhouettes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white tracking-tight">
            Explore By Collection
          </h2>
          <div className="w-16 h-0.5 bg-[#D4AF66] mx-auto mt-3 mb-4" />
          <p className="text-xs sm:text-sm text-neutral-400">
            From traditional Eid couture to effortless everyday elegance, discover tailored artisan craft for women and men.
          </p>

          {/* Department Tabs */}
          <div className="inline-flex items-center p-1 rounded-xl bg-[#141414] border border-neutral-800 mt-6 shadow-xl">
            <button
              onClick={() => setActiveTab('womens')}
              className={`px-5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition flex items-center space-x-1.5 ${
                activeTab === 'womens'
                  ? 'bg-gold-gradient text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Women's Atelier</span>
            </button>
            <button
              onClick={() => setActiveTab('mens')}
              className={`px-5 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition flex items-center space-x-1.5 ${
                activeTab === 'mens'
                  ? 'bg-gold-gradient text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Men's Couture</span>
            </button>
          </div>
        </div>

        {/* Dynamic Category Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${activeTab === 'womens' ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6 sm:gap-8`}>
          {categories.map((item) => (
            <div
              key={item.category}
              onClick={() => onSelectCategory(item.category)}
              className="group relative h-96 rounded-2xl overflow-hidden border border-neutral-800 hover:border-[#D4AF66]/60 cursor-pointer transition-all duration-500 shadow-xl"
            >
              {/* Category Image */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

              {/* Top Badge */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 border border-[#D4AF66]/40 text-[#D4AF66] font-semibold">
                  {item.badge}
                </span>
              </div>

              {/* Content at Bottom */}
              <div className="absolute bottom-6 left-6 right-6 space-y-1">
                <span className="text-[11px] text-[#D4AF66] font-medium tracking-wide">
                  {item.priceStart}
                </span>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-cinzel font-bold text-white group-hover:text-[#D4AF66] transition-colors">
                    {item.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#D4AF66] group-hover:text-black flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-white group-hover:text-black transition-colors" />
                  </div>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
