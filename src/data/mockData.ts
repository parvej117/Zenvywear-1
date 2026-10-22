import { Product, AdminSettings } from '../types';

export const BANGLADESH_DISTRICTS = [
  // Dhaka Division
  { name: 'Dhaka', division: 'Dhaka', isDhakaZone: true },
  { name: 'Gazipur', division: 'Dhaka', isDhakaZone: false },
  { name: 'Narayanganj', division: 'Dhaka', isDhakaZone: false },
  { name: 'Tangail', division: 'Dhaka', isDhakaZone: false },
  { name: 'Narsingdi', division: 'Dhaka', isDhakaZone: false },
  { name: 'Faridpur', division: 'Dhaka', isDhakaZone: false },
  { name: 'Manikganj', division: 'Dhaka', isDhakaZone: false },
  { name: 'Munshiganj', division: 'Dhaka', isDhakaZone: false },
  { name: 'Kishoreganj', division: 'Dhaka', isDhakaZone: false },
  { name: 'Madaripur', division: 'Dhaka', isDhakaZone: false },
  { name: 'Gopalganj', division: 'Dhaka', isDhakaZone: false },
  { name: 'Rajbari', division: 'Dhaka', isDhakaZone: false },
  { name: 'Shariatpur', division: 'Dhaka', isDhakaZone: false },

  // Chattogram Division
  { name: 'Chattogram', division: 'Chattogram', isDhakaZone: false },
  { name: "Cox's Bazar", division: 'Chattogram', isDhakaZone: false },
  { name: 'Cumilla', division: 'Chattogram', isDhakaZone: false },
  { name: 'Feni', division: 'Chattogram', isDhakaZone: false },
  { name: 'Noakhali', division: 'Chattogram', isDhakaZone: false },
  { name: 'Lakshmipur', division: 'Chattogram', isDhakaZone: false },
  { name: 'Chandpur', division: 'Chattogram', isDhakaZone: false },
  { name: 'Brahmanbaria', division: 'Chattogram', isDhakaZone: false },
  { name: 'Rangamati', division: 'Chattogram', isDhakaZone: false },
  { name: 'Bandarban', division: 'Chattogram', isDhakaZone: false },
  { name: 'Khagrachari', division: 'Chattogram', isDhakaZone: false },

  // Sylhet Division
  { name: 'Sylhet', division: 'Sylhet', isDhakaZone: false },
  { name: 'Moulvibazar', division: 'Sylhet', isDhakaZone: false },
  { name: 'Habiganj', division: 'Sylhet', isDhakaZone: false },
  { name: 'Sunamganj', division: 'Sylhet', isDhakaZone: false },

  // Rajshahi Division
  { name: 'Rajshahi', division: 'Rajshahi', isDhakaZone: false },
  { name: 'Bogura', division: 'Rajshahi', isDhakaZone: false },
  { name: 'Pabna', division: 'Rajshahi', isDhakaZone: false },
  { name: 'Sirajganj', division: 'Rajshahi', isDhakaZone: false },
  { name: 'Naogaon', division: 'Rajshahi', isDhakaZone: false },
  { name: 'Natore', division: 'Rajshahi', isDhakaZone: false },
  { name: 'Chapai Nawabganj', division: 'Rajshahi', isDhakaZone: false },
  { name: 'Joypurhat', division: 'Rajshahi', isDhakaZone: false },

  // Khulna Division
  { name: 'Khulna', division: 'Khulna', isDhakaZone: false },
  { name: 'Jashore', division: 'Khulna', isDhakaZone: false },
  { name: 'Kushtia', division: 'Khulna', isDhakaZone: false },
  { name: 'Satkhira', division: 'Khulna', isDhakaZone: false },
  { name: 'Bagerhat', division: 'Khulna', isDhakaZone: false },
  { name: 'Jhenaidah', division: 'Khulna', isDhakaZone: false },
  { name: 'Chuadanga', division: 'Khulna', isDhakaZone: false },
  { name: 'Magura', division: 'Khulna', isDhakaZone: false },
  { name: 'Meherpur', division: 'Khulna', isDhakaZone: false },
  { name: 'Narail', division: 'Khulna', isDhakaZone: false },

  // Barishal Division
  { name: 'Barishal', division: 'Barishal', isDhakaZone: false },
  { name: 'Patuakhali', division: 'Barishal', isDhakaZone: false },
  { name: 'Bhola', division: 'Barishal', isDhakaZone: false },
  { name: 'Pirojpur', division: 'Barishal', isDhakaZone: false },
  { name: 'Barguna', division: 'Barishal', isDhakaZone: false },
  { name: 'Jhalokathi', division: 'Barishal', isDhakaZone: false },

  // Rangpur Division
  { name: 'Rangpur', division: 'Rangpur', isDhakaZone: false },
  { name: 'Dinajpur', division: 'Rangpur', isDhakaZone: false },
  { name: 'Kurigram', division: 'Rangpur', isDhakaZone: false },
  { name: 'Gaibandha', division: 'Rangpur', isDhakaZone: false },
  { name: 'Nilphamari', division: 'Rangpur', isDhakaZone: false },
  { name: 'Lalmonirhat', division: 'Rangpur', isDhakaZone: false },
  { name: 'Panchagarh', division: 'Rangpur', isDhakaZone: false },
  { name: 'Thakurgaon', division: 'Rangpur', isDhakaZone: false },

  // Mymensingh Division
  { name: 'Mymensingh', division: 'Mymensingh', isDhakaZone: false },
  { name: 'Jamalpur', division: 'Mymensingh', isDhakaZone: false },
  { name: 'Netrokona', division: 'Mymensingh', isDhakaZone: false },
  { name: 'Sherpur', division: 'Mymensingh', isDhakaZone: false },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Luxury Black Three Piece',
    slug: 'luxury-black-three-piece',
    category: 'Three Piece',
    price: 2250,
    originalPrice: 2800,
    discountPercentage: 20,
    description: 'An ode to timeless royalty. Tailored from jet-black premium organza silk with intricate antique champagne zardozi and thread embroidery across the neckline and cuffs. Accompanied by a heavy digital jacquard dupatta and pure silk trouser.',
    fabricDetails: {
      kameezFabric: 'Pure Premium Organza Silk with Zardozi Work',
      salwarFabric: 'Semi-Silk Cigarette Pants with Hem Detailing',
      dupattaFabric: 'Jacquard Organza Dupatta (2.5 Yards)',
      workType: 'Fine Threadwork, Mukaish & Champagne Zari',
      careInstructions: 'Dry Clean Recommended. Low Steam Iron on Reverse.'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Jet Black', 'Antique Gold Trim'],
    inStock: true,
    stockCount: 14,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 38,
    tags: ['Festive', 'Silk', 'Black', 'Handcrafted']
  },
  {
    id: 'prod-002',
    name: 'Emerald Green Three Piece',
    slug: 'emerald-green-three-piece',
    category: 'Three Piece',
    price: 2150,
    originalPrice: 2650,
    discountPercentage: 19,
    description: 'A regal emerald green masterpiece crafted on ultra-soft pure chanderi cotton. Adorned with delicate gold tilla embroidery along the daaman and sheer organza sleeve cuffs. Finished with an embroidered silk chiffon dupatta.',
    fabricDetails: {
      kameezFabric: 'Premium Chanderi Cotton Silk',
      salwarFabric: 'Dyed Cotton Satin Straight Pant',
      dupattaFabric: 'Embroidered Chiffon Dupatta with Tassels',
      workType: 'Gold Tilla & Sequin Embroidery',
      careInstructions: 'Hand wash gently in cold water or dry clean.'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Royal Emerald', 'Tilla Gold'],
    inStock: true,
    stockCount: 18,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733975-2980993510c4?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 29,
    tags: ['Festive', 'Emerald', 'New Arrival']
  },
  {
    id: 'prod-003',
    name: 'Maroon Embroidery Three Piece',
    slug: 'maroon-embroidery-three-piece',
    category: 'Three Piece',
    price: 2300,
    originalPrice: 2900,
    discountPercentage: 21,
    description: 'Deep crimson maroon suit with heavy needlecraft detailing inspired by Mughal court textiles. Features rich golden thread accents on fine swiss lawn, complemented with an opulent organza bordered dupatta.',
    fabricDetails: {
      kameezFabric: 'Fine Swiss Lawn with Needlecraft Motif',
      salwarFabric: 'Dyed Cambric Trouser with Embroidered Border',
      dupattaFabric: 'Scalloped Cutwork Organza Dupatta',
      workType: 'Heavy Resham and Golden Dori Work',
      careInstructions: 'Dry clean only to maintain gold thread lustre.'
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Crimson Maroon', 'Mughal Gold'],
    inStock: true,
    stockCount: 11,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1610030469668-932d0c2620f4?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isSpecialOffer: true,
    rating: 4.9,
    reviewsCount: 44,
    tags: ['Bridal Guest', 'Maroon', 'Mughal']
  },
  {
    id: 'prod-004',
    name: 'Elegant Cream Three Piece',
    slug: 'elegant-cream-three-piece',
    category: 'Three Piece',
    price: 2100,
    originalPrice: 2500,
    discountPercentage: 16,
    description: 'Serene, minimalist luxury in ivory cream. Tailored from airy Egyptian slub cotton with tonal pearl embroidery and delicate lace appliques. Comes with a featherweight organza floral printed dupatta.',
    fabricDetails: {
      kameezFabric: 'Egyptian Slub Lawn with Pearl Embellishment',
      salwarFabric: 'Lawn Trouser with Lace Insertion',
      dupattaFabric: 'Monochrome Digital Printed Silk Dupatta',
      workType: 'Subtle Pearl & Cutwork Lace Finishing',
      careInstructions: 'Mild liquid detergent wash. Dry in shade.'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Ivory Cream', 'Pearl White'],
    inStock: true,
    stockCount: 22,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isBestSeller: true,
    rating: 4.7,
    reviewsCount: 31,
    tags: ['Minimalist', 'Cream', 'Lawn']
  },
  {
    id: 'prod-005',
    name: 'Royal Navy Embroidered Three Piece',
    slug: 'royal-navy-embroidered-three-piece',
    category: 'Three Piece',
    price: 2450,
    originalPrice: 3100,
    discountPercentage: 21,
    description: 'Striking midnight navy hue elevated by metallic silver and champagne embroidery. Includes a scalloped dupatta with celestial starry motifs, ideal for evening galas and wedding receptions.',
    fabricDetails: {
      kameezFabric: 'Midnight Navy Raw Silk',
      salwarFabric: 'Matching Tailored Silk Trousers',
      dupattaFabric: 'Organza with Metallic Star Scallops',
      workType: 'Silver Zari & Pearl Beadwork',
      careInstructions: 'Dry Clean Only.'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Midnight Navy', 'Silver Zari'],
    inStock: true,
    stockCount: 8,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=900&auto=format&fit=crop'
    ],
    isNewArrival: true,
    rating: 5.0,
    reviewsCount: 19,
    tags: ['Evening', 'Navy', 'Exclusive']
  },
  {
    id: 'prod-006',
    name: 'Crimson Zari Jamdani Saree',
    slug: 'crimson-zari-jamdani-saree',
    category: 'Saree',
    price: 3800,
    originalPrice: 4500,
    discountPercentage: 15,
    description: 'Authentic 84-count pure handloom Jamdani saree woven by master artisans in Narayanganj. Features traditional floral kalka motifs in pure gold-dipped zari across a vibrant crimson background with unstitched blouse piece.',
    fabricDetails: {
      kameezFabric: 'Pure 84-Count Handloom Cotton & Gold Zari',
      workType: 'Authentic Traditional Jamdani Weave',
      careInstructions: 'Dry clean only. Roll wrap in muslin cloth.'
    },
    sizes: ['Free Size'],
    colors: ['Crimson Red', 'Gold Zari Weave'],
    inStock: true,
    stockCount: 6,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 52,
    tags: ['Jamdani', 'Heritage', 'Handloom', 'Saree']
  },
  {
    id: 'prod-007',
    name: 'Black Velvet Party Saree',
    slug: 'black-velvet-party-saree',
    category: 'Saree',
    price: 4500,
    originalPrice: 4950,
    discountPercentage: 9,
    description: 'An elite statement drape for luxury winter evenings. Luxurious micro-velvet pallu seamlessly transitioning into fluid georgette pleats with cutdana and mirror hand-embroidery along the border.',
    fabricDetails: {
      kameezFabric: 'Heavy Micro Velvet & Silk Georgette',
      workType: 'Hand Cutdana, Resham and Mirror Work',
      careInstructions: 'Strictly Professional Dry Clean.'
    },
    sizes: ['Free Size'],
    colors: ['Obsidian Black', 'Metallic Cutdana'],
    inStock: true,
    stockCount: 5,
    images: [
      'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop'
    ],
    isSpecialOffer: true,
    rating: 4.8,
    reviewsCount: 22,
    tags: ['Velvet', 'Luxury', 'Party Wear']
  },
  {
    id: 'prod-008',
    name: 'Mustard Gold Handloom Saree',
    slug: 'mustard-gold-handloom-saree',
    category: 'Saree',
    price: 3200,
    originalPrice: 3800,
    discountPercentage: 15,
    description: 'Warm turmeric mustard handwoven saree with rich antique copper and champagne zari pallu. A vibrant, auspicious hue beloved for wedding haldi rituals and festive celebrations.',
    fabricDetails: {
      kameezFabric: 'Tussar Handloom Silk Blend',
      workType: 'Woven Copper Zari Geometric Borders',
      careInstructions: 'Dry clean recommended.'
    },
    sizes: ['Free Size'],
    colors: ['Haldi Mustard', 'Copper Zari'],
    inStock: true,
    stockCount: 9,
    images: [
      'https://images.unsplash.com/photo-1610030469668-932d0c2620f4?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=900&auto=format&fit=crop'
    ],
    isNewArrival: true,
    rating: 4.7,
    reviewsCount: 16,
    tags: ['Haldi', 'Saree', 'Festive']
  },
  {
    id: 'prod-009',
    name: 'Olive Embroidered Linen Two Piece',
    slug: 'olive-embroidered-linen-two-piece',
    category: 'Two Piece',
    price: 1750,
    originalPrice: 2200,
    discountPercentage: 20,
    description: 'Contemporary chic two-piece ensemble in earth-toned olive linen. Includes a relaxed silhouette tunic with white cross-stitch needlework and matching tapered cropped trousers.',
    fabricDetails: {
      kameezFabric: 'Pure Breathable Slub Linen',
      salwarFabric: 'Tailored Ankle-Length Linen Pants',
      workType: 'Artisanal White Cross-Stitch Embroidery',
      careInstructions: 'Machine wash gentle cold with similar colors.'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Earth Olive', 'Ivory Stitch'],
    inStock: true,
    stockCount: 16,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 35,
    tags: ['Two Piece', 'Linen', 'Comfort']
  },
  {
    id: 'prod-010',
    name: 'Floral Chiffon Two Piece Set',
    slug: 'floral-chiffon-two-piece-set',
    category: 'Two Piece',
    price: 1650,
    originalPrice: 1950,
    discountPercentage: 15,
    description: 'Breezy botanical elegance with vintage rose motifs on airy chiffon. Comes with comfortable inner lining and matching palazzo trousers with elasticated waist for effortless daytime outings.',
    fabricDetails: {
      kameezFabric: 'Printed Georgette Chiffon with Malmal Inner',
      salwarFabric: 'Crepe Flowing Palazzo',
      workType: 'Digital Floral Print with Lace Cuffs',
      careInstructions: 'Delicate hand wash.'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Vintage Rose', 'Sage Petal'],
    inStock: true,
    stockCount: 20,
    images: [
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop'
    ],
    isNewArrival: true,
    rating: 4.6,
    reviewsCount: 21,
    tags: ['Casual', 'Floral', 'Two Piece']
  },
  {
    id: 'prod-011',
    name: 'Kashmiri Threadwork Silk Kurti',
    slug: 'kashmiri-threadwork-silk-kurti',
    category: 'Kurti',
    price: 1250,
    originalPrice: 1500,
    discountPercentage: 17,
    description: 'Vibrant single kurti in royal sapphire raw silk. Rich floral Aari Kashmiri threadwork across the neckline, placket, and side slits. Pairs effortlessly with jeans, leggings, or palazzos.',
    fabricDetails: {
      kameezFabric: 'Raw Art Silk Tunic (42 Inch Length)',
      workType: 'Traditional Kashmiri Aari Needlework',
      careInstructions: 'Dry clean recommended.'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Sapphire Blue', 'Multicolor Aari'],
    inStock: true,
    stockCount: 25,
    images: [
      'https://images.unsplash.com/photo-1583391733975-2980993510c4?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 42,
    tags: ['Kurti', 'Kashmiri', 'Office Wear']
  },
  {
    id: 'prod-012',
    name: 'Indigo Block Print Cotton Kurti',
    slug: 'indigo-block-print-cotton-kurti',
    category: 'Kurti',
    price: 950,
    originalPrice: 1200,
    discountPercentage: 21,
    description: 'Everyday comfort crafted in 100% combed Bangladeshi organic cotton. Hand-stamped indigo dabu block prints with wooden button details. Breathable and soft for warm Dhaka weather.',
    fabricDetails: {
      kameezFabric: '100% Combed Organic Cotton',
      workType: 'Natural Indigo Hand Woodblock Print',
      careInstructions: 'First wash separate. Cold water wash.'
    },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Deep Indigo', 'Natural Ecru'],
    inStock: true,
    stockCount: 30,
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=900&auto=format&fit=crop'
    ],
    isSpecialOffer: true,
    rating: 4.7,
    reviewsCount: 56,
    tags: ['Cotton', 'Daily', 'Affordable']
  },
  {
    id: 'prod-013',
    name: 'Turkish Chiffon Hijab & Cap Set',
    slug: 'turkish-chiffon-hijab-and-cap-set',
    category: 'Hijab Collection',
    price: 650,
    originalPrice: 850,
    discountPercentage: 24,
    description: 'Ultra-luxurious textured Medina chiffon scarf paired with an organic bamboo non-slip undercap. Non-sheer, non-slip, and effortlessly drapable for all-day modest sophistication.',
    fabricDetails: {
      kameezFabric: 'Imported Turkish Medina Chiffon (75 x 190 cm)',
      salwarFabric: 'Organic Bamboo Breathable Undercap',
      workType: 'Rolled Baby Hem Stitching',
      careInstructions: 'Hand wash cold. Pin-friendly fabric.'
    },
    sizes: ['Free Size'],
    colors: ['Mink Grey', 'Espresso Brown'],
    inStock: true,
    stockCount: 40,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 68,
    tags: ['Hijab', 'Turkish', 'Modest']
  },
  {
    id: 'prod-014',
    name: 'Silk Georgette Pleated Hijab',
    slug: 'silk-georgette-pleated-hijab',
    category: 'Hijab Collection',
    price: 550,
    originalPrice: 700,
    discountPercentage: 21,
    description: 'Fine accordion micro-pleats in rich champagne gold tone. Adds instant dimension and couture drama to festive outfits without requiring complicated styling or styling pins.',
    fabricDetails: {
      kameezFabric: 'Micro-Pleated Silk Georgette',
      workType: 'Permanent Heat Pleating with Laser Edge',
      careInstructions: 'Do not iron directly. Hand wash gently.'
    },
    sizes: ['Free Size'],
    colors: ['Champagne Gold', 'Dusty Rose'],
    inStock: true,
    stockCount: 35,
    images: [
      'https://images.unsplash.com/photo-1610030469668-932d0c2620f4?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=900&auto=format&fit=crop'
    ],
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 39,
    tags: ['Pleated', 'Champagne', 'Hijab']
  },
  {
    id: 'prod-015',
    name: 'Champagne Satin Co-ord Western Set',
    slug: 'champagne-satin-co-ord-western-set',
    category: 'Western Wear',
    price: 2950,
    originalPrice: 3500,
    discountPercentage: 16,
    description: 'Modern luxury lounge & evening set crafted in heavyweight hammered satin. Features a relaxed collared button-down shirt with mother-of-pearl buttons and matching wide-leg trousers.',
    fabricDetails: {
      kameezFabric: 'Premium Heavy Hammered Satin Silk',
      salwarFabric: 'Matching High-Waist Wide-Leg Pants',
      workType: 'Mother-of-Pearl Button Closures & Contrast Piping',
      careInstructions: 'Dry clean or delicate steam.'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Champagne Silk', 'Pearl Blush'],
    inStock: true,
    stockCount: 12,
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 27,
    tags: ['Western', 'Satin', 'Co-ord']
  },
  {
    id: 'prod-016',
    name: 'Tailored Midnight Blazer & Trouser',
    slug: 'tailored-midnight-blazer-and-trouser',
    category: 'Western Wear',
    price: 3600,
    originalPrice: 4200,
    discountPercentage: 14,
    description: 'Empowering luxury tailoring designed for the contemporary woman. Double-breasted blazer with satin peak lapels and gold-rimmed crest buttons paired with precision-pressed straight trousers.',
    fabricDetails: {
      kameezFabric: 'Italian Crepe Poly-Viscose with Satin Lapel',
      salwarFabric: 'Tailored Trouser with Front Crease',
      workType: 'Double-Breasted Gold Crest Shank Buttons',
      careInstructions: 'Dry Clean Recommended.'
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Midnight Black', 'Gold Crest Buttons'],
    inStock: true,
    stockCount: 7,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop'
    ],
    isSpecialOffer: true,
    rating: 4.9,
    reviewsCount: 18,
    tags: ['Suit', 'Power Dressing', 'Blazer']
  },
  // ==========================================
  // MEN'S LUXURY COUTURE COLLECTION (৳0 - ৳5,000)
  // ==========================================
  {
    id: 'prod-m001',
    name: 'Imperial Black Silk Panjabi Set',
    slug: 'imperial-black-silk-panjabi-set',
    category: 'Royal Panjabi',
    gender: 'men',
    price: 2450,
    originalPrice: 2950,
    discountPercentage: 17,
    description: 'An iconic silhouette for royal occasions. Crafted from fine jet-black Tussar art silk with intricate antique champagne zardozi embroidery across the bandhgala collar, placket, and cuffs. Accompanied by a tailored white combed cotton pyjama.',
    fabricDetails: {
      kameezFabric: 'Pure Tussar Art Silk with Zardozi Work',
      salwarFabric: 'Soft Combed Cotton Pyjama (Churidar/Straight)',
      workType: 'Antique Gold Zardozi, Fine Needlecraft & Engraved Metallic Buttons',
      careInstructions: 'Dry Clean Recommended. Low steam iron on reverse.'
    },
    sizes: ['38', '40', '42', '44', '46'],
    colors: ['Jet Black', 'Antique Gold Accent'],
    inStock: true,
    stockCount: 16,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 34,
    tags: ['Men', 'Panjabi', 'Eid', 'Silk', 'Festive']
  },
  {
    id: 'prod-m002',
    name: 'Embroidered Royal Kabli Suit',
    slug: 'embroidered-royal-kabli-suit',
    category: 'Kabli Suit',
    gender: 'men',
    price: 2850,
    originalPrice: 3400,
    discountPercentage: 16,
    description: 'Tailored luxury Pathani Kabli two-piece set in charcoal grey slub linen. Features structured shoulder epaulets, double flap chest pockets, contrast topstitching, and a matched Pathani shalwar with cuffed hem.',
    fabricDetails: {
      kameezFabric: 'Premium Heavy Slub Linen',
      salwarFabric: 'Matching Pathani Pleated Shalwar',
      workType: 'Contrast Saddle Stitching & Engraved Metallic Crest Buttons',
      careInstructions: 'Dry Clean or Gentle Cold Hand Wash'
    },
    sizes: ['38', '40', '42', '44'],
    colors: ['Charcoal Grey', 'Obsidian Black'],
    inStock: true,
    stockCount: 12,
    images: [
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 28,
    tags: ['Kabli', 'Men', 'Pathani', 'Signature']
  },
  {
    id: 'prod-m003',
    name: 'Heritage Banarasi Brocade Waistcoat',
    slug: 'heritage-banarasi-brocade-waistcoat',
    category: 'Embroidered Waistcoat',
    gender: 'men',
    price: 1950,
    originalPrice: 2400,
    discountPercentage: 19,
    description: 'Royal Mughal-inspired Banarasi brocade waistcoat (Prince Coat) with woven gold floral kalka motifs. Tailored with a stiff mandarin collar, welt pockets, and antique brass crested shank buttons.',
    fabricDetails: {
      kameezFabric: 'Banarasi Woven Brocade with Satin Inner Lining',
      workType: 'Hand-woven Kalka Zari & Antique Brass Buttons',
      careInstructions: 'Dry Clean Only. Store in garment cover.'
    },
    sizes: ['38', '40', '42', '44', '46'],
    colors: ['Royal Gold', 'Deep Maroon Accent'],
    inStock: true,
    stockCount: 20,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isSpecialOffer: true,
    rating: 4.9,
    reviewsCount: 39,
    tags: ['Waistcoat', 'Men', 'Wedding', 'Brocade', 'Festive']
  },
  {
    id: 'prod-m004',
    name: 'Emerald Green Tussar Silk Panjabi',
    slug: 'emerald-green-tussar-silk-panjabi',
    category: 'Royal Panjabi',
    gender: 'men',
    price: 2350,
    originalPrice: 2800,
    discountPercentage: 16,
    description: 'Regal jewel-tone emerald green panjabi crafted from slub raw tussar silk. Features minimalist gold thread geometric kantha stitch along the neckline and cuffs. Paired with ivory churidar.',
    fabricDetails: {
      kameezFabric: 'Slub Raw Tussar Silk',
      salwarFabric: 'Pure Cotton Churidar Pajama',
      workType: 'Kantha Geometric Stitching & Concealed Placket',
      careInstructions: 'Dry Clean Recommended.'
    },
    sizes: ['38', '40', '42', '44'],
    colors: ['Royal Emerald', 'Ivory Accent'],
    inStock: true,
    stockCount: 14,
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop'
    ],
    isNewArrival: true,
    rating: 4.8,
    reviewsCount: 22,
    tags: ['Emerald', 'Men', 'Silk', 'Panjabi']
  },
  {
    id: 'prod-m005',
    name: 'Ivory Handcrafted Sherwani Kurta Set',
    slug: 'ivory-handcrafted-sherwani-kurta-set',
    category: 'Sherwani & Kurta',
    gender: 'men',
    price: 3450,
    originalPrice: 4200,
    discountPercentage: 18,
    description: 'Celebration-ready cream ivory raw silk sherwani kurta set. Features tone-on-tone resham floral lattice embroidery, subtle mukaish sparkle, and natural mother-of-pearl buttons. Paired with stretch cotton silk churidar.',
    fabricDetails: {
      kameezFabric: 'Heavy Raw Silk with Resham Embroidery',
      salwarFabric: 'Churidar Trouser in Stretch Cotton Silk',
      workType: 'Resham Floral Jaal & Mukaish Detailing',
      careInstructions: 'Professional Dry Clean Only'
    },
    sizes: ['38', '40', '42', '44', '46'],
    colors: ['Ivory Cream', 'Champagne Glow'],
    inStock: true,
    stockCount: 9,
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=900&auto=format&fit=crop'
    ],
    featured: true,
    isSpecialOffer: true,
    rating: 5.0,
    reviewsCount: 17,
    tags: ['Sherwani', 'Groom', 'Men', 'Ivory', 'Royal']
  },
  {
    id: 'prod-m006',
    name: 'Navy Blue Jamdani Weave Panjabi',
    slug: 'navy-blue-jamdani-weave-panjabi',
    category: 'Royal Panjabi',
    gender: 'men',
    price: 2150,
    originalPrice: 2600,
    discountPercentage: 17,
    description: 'Authentic handloom Jamdani woven panjabi in deep midnight navy. Woven with heritage floral motifs along the collar and chest panel by master weavers of Sonargaon. Lightweight and breathable.',
    fabricDetails: {
      kameezFabric: '100% Fine Handloom Cotton with Jamdani Yoke',
      salwarFabric: 'Straight Cut Cotton Pajama',
      workType: 'Traditional Handloom Jamdani Motif & Shell Buttons',
      careInstructions: 'Gentle Hand Wash with Mild Detergent'
    },
    sizes: ['38', '40', '42', '44', '46'],
    colors: ['Midnight Navy', 'White Jamdani Motif'],
    inStock: true,
    stockCount: 18,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=900&auto=format&fit=crop'
    ],
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 31,
    tags: ['Jamdani', 'Men', 'Handloom', 'Navy']
  }
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  shopOwnerBkashNumber: '01712-345678',
  bkashType: 'Personal',
  shopOwnerNagadNumber: '01911-889900',
  nagadType: 'Personal',
  shopOwnerRocketNumber: '01712-345678-9',
  rocketType: 'Personal',
  shopOwnerUpayNumber: '01811-223344',
  upayType: 'Personal',
  shopOwnerTapNumber: '01799-556677',
  bankDetails: {
    bankName: 'City Bank PLC',
    accountName: 'ZenvyWear Atelier Ltd',
    accountNumber: '1102938475001',
    branchName: 'Banani Branch, Dhaka',
    routingNumber: '225270845',
  },
  banglaQrActive: true,
  banglaQrInstructions: 'Scan with bKash, Nagad, Rocket, Upay, or any Bangladeshi bank app supporting Bangla QR.',
  cardPaymentMode: 'sandbox_gateway',
  enableCod: true,
  freeDeliveryThreshold: 4000,
  dhakaDeliveryFee: 70,
  outsideDhakaDeliveryFee: 130,
  announcementText: '✨ Eid & Festive Luxury Collection is LIVE — Free Nationwide Delivery on Orders over ৳4,000!',
  showAnnouncement: true,
  adminPasscode: 'zenvyadmin'
};
