export type ProductCategory = 
  // Women's Categories
  | 'Three Piece'
  | 'Two Piece'
  | 'Saree'
  | 'Kurti'
  | 'Hijab Collection'
  | 'Western Wear'
  // Men's Categories
  | 'Royal Panjabi'
  | 'Kabli Suit'
  | 'Embroidered Waistcoat'
  | 'Sherwani & Kurta'
  | 'Men Silk Set';

export type ProductGender = 'women' | 'men' | 'unisex';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size' | '38' | '40' | '42' | '44' | '46';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  gender?: ProductGender;
  price: number; // in BDT (৳) - strictly 0 to 5000
  originalPrice?: number; // for discount display
  description: string;
  fabricDetails: {
    kameezFabric: string;
    salwarFabric?: string;
    dupattaFabric?: string;
    workType: string;
    careInstructions: string;
  };
  sizes: ProductSize[];
  colors: string[]; // e.g. ['Jet Black', 'Antique Gold', 'Emerald']
  inStock: boolean;
  stockCount: number;
  images: string[];
  featured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSpecialOffer?: boolean;
  discountPercentage?: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  isHidden?: boolean; // Admin can temporarily hide products
}

export interface CartItem {
  product: Product;
  selectedSize: ProductSize;
  selectedColor?: string;
  quantity: number;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Payment Verification' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled';

export type PaymentMethod = 
  | 'bKash' 
  | 'Nagad' 
  | 'Rocket' 
  | 'Upay' 
  | 'tap' 
  | 'Visa' 
  | 'Mastercard' 
  | 'Bank Transfer' 
  | 'Bangla QR' 
  | 'Cash on Delivery';

export type PaymentCategory = 'mfs' | 'card' | 'bank' | 'qr' | 'cod';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  fullAddress: string;
  district: string;
  division: string;
  deliveryNotes?: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  senderNumber?: string;
  transactionId?: string;
  bankName?: string;
  accountReference?: string;
  status: 'Pending Verification' | 'Verified' | 'Pending COD' | 'Rejected' | 'Refunded';
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  shopNumberUsed?: string;
  amountClaimed?: number;
}

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
  district?: string;
  division?: string;
  createdAt: string;
}

export interface Order {
  id: string; // e.g. ZW-2026-94821
  userId?: string; // Linked customer ID
  customerEmail?: string;
  createdAt: string;
  updatedAt?: string;
  items: CartItem[];
  customer: CustomerInfo;
  payment: PaymentDetails;
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface AdminSettings {
  shopOwnerBkashNumber: string;
  bkashType: 'Personal' | 'Merchant';
  shopOwnerNagadNumber: string;
  nagadType: 'Personal' | 'Merchant';
  shopOwnerRocketNumber: string;
  rocketType: 'Personal' | 'Merchant';
  shopOwnerUpayNumber: string;
  upayType: 'Personal' | 'Merchant';
  shopOwnerTapNumber: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    branchName: string;
    routingNumber: string;
  };
  banglaQrActive: boolean;
  banglaQrInstructions: string;
  cardPaymentMode: 'manual_pos' | 'sandbox_gateway';
  enableCod: boolean;
  freeDeliveryThreshold: number; // in BDT, e.g. 4000
  dhakaDeliveryFee: number; // in BDT, e.g. 70
  outsideDhakaDeliveryFee: number; // in BDT, e.g. 130
  announcementText: string;
  showAnnouncement: boolean;
  adminPasscode: string; // default 'zenvyadmin'
}
