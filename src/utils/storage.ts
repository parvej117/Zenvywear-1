import { Product, Order, AdminSettings, CartItem } from '../types';
import { INITIAL_PRODUCTS, DEFAULT_ADMIN_SETTINGS } from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'zenvywear_products_v2',
  CART: 'zenvywear_cart_v1',
  ORDERS: 'zenvywear_orders_v1',
  SETTINGS: 'zenvywear_settings_v1',
  WISHLIST: 'zenvywear_wishlist_v1',
  ADMIN_AUTH: 'zenvywear_admin_auth_v1',
};

const SEED_ORDERS: Order[] = [
  {
    id: 'ZW-2026-8812',
    createdAt: '2026-10-21T08:30:00Z',
    items: [
      {
        product: INITIAL_PRODUCTS[0], // Luxury Black Three Piece ৳2250
        selectedSize: 'M',
        quantity: 1,
      },
    ],
    customer: {
      fullName: 'Nusrat Jahan',
      phone: '01711223344',
      email: 'nusrat.jahan@gmail.com',
      fullAddress: 'House 14, Road 7, Sector 3, Uttara',
      district: 'Dhaka',
      division: 'Dhaka',
      deliveryNotes: 'Please ring bell 3 times upon arrival.',
    },
    payment: {
      method: 'bKash',
      senderNumber: '01711223344',
      transactionId: 'BK9A7X502M',
      status: 'Pending Verification',
      shopNumberUsed: '01712-345678',
    },
    subtotal: 2250,
    deliveryCharge: 70,
    discountAmount: 0,
    totalAmount: 2320,
    status: 'Payment Verification',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: '2026-10-21T08:30:00Z',
        note: 'Order placed by customer via bKash',
      },
      {
        status: 'Payment Verification',
        timestamp: '2026-10-21T08:31:00Z',
        note: 'TrxID BK9A7X502M submitted. Awaiting merchant statement verification.',
      },
    ],
  },
  {
    id: 'ZW-2026-8794',
    createdAt: '2026-10-20T14:15:00Z',
    items: [
      {
        product: INITIAL_PRODUCTS[1], // Emerald Green Three Piece ৳2150
        selectedSize: 'L',
        quantity: 1,
      },
      {
        product: INITIAL_PRODUCTS[12], // Turkish Chiffon Hijab ৳650
        selectedSize: 'Free Size',
        quantity: 1,
      },
    ],
    customer: {
      fullName: 'Farhana Ahmed',
      phone: '01819556677',
      email: 'farhana.ahmed@yahoo.com',
      fullAddress: 'Nasirabad Housing Society, Road 4, House 22',
      district: 'Chattogram',
      division: 'Chattogram',
    },
    payment: {
      method: 'Nagad',
      senderNumber: '01819556677',
      transactionId: 'NG77190AB',
      status: 'Verified',
      verifiedAt: '2026-10-20T16:00:00Z',
      shopNumberUsed: '01911-889900',
    },
    subtotal: 2800,
    deliveryCharge: 130,
    discountAmount: 280, // Coupon applied
    totalAmount: 2650,
    status: 'Shipped',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: '2026-10-20T14:15:00Z',
      },
      {
        status: 'Payment Verification',
        timestamp: '2026-10-20T14:17:00Z',
      },
      {
        status: 'Confirmed',
        timestamp: '2026-10-20T16:00:00Z',
        note: 'Payment verified manually by shop owner',
      },
      {
        status: 'Shipped',
        timestamp: '2026-10-21T06:00:00Z',
        note: 'Dispatched via Steadfast Courier (Tracking: ST-998822)',
      },
    ],
  },
  {
    id: 'ZW-2026-8750',
    createdAt: '2026-10-19T11:40:00Z',
    items: [
      {
        product: INITIAL_PRODUCTS[2], // Maroon Embroidery ৳2300
        selectedSize: 'S',
        quantity: 1,
      },
    ],
    customer: {
      fullName: 'Ayesha Siddiqua',
      phone: '01923445566',
      email: 'ayesha.s@outlook.com',
      fullAddress: 'Flat 5B, Green View Tower, Zindabazar',
      district: 'Sylhet',
      division: 'Sylhet',
    },
    payment: {
      method: 'Cash on Delivery',
      status: 'Pending COD',
    },
    subtotal: 2300,
    deliveryCharge: 130,
    discountAmount: 0,
    totalAmount: 2430,
    status: 'Confirmed',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: '2026-10-19T11:40:00Z',
        note: 'Cash on Delivery selected',
      },
      {
        status: 'Confirmed',
        timestamp: '2026-10-19T12:10:00Z',
        note: 'Customer confirmed via phone call',
      },
    ],
  },
];

export const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    const parsed: Product[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : INITIAL_PRODUCTS;
  } catch (err) {
    console.error('Error reading products from storage:', err);
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Error saving products:', err);
  }
};

export const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
      return SEED_ORDERS;
    }
    const parsed: Order[] = JSON.parse(raw);
    return parsed;
  } catch (err) {
    console.error('Error reading orders:', err);
    return SEED_ORDERS;
  }
};

export const saveStoredOrders = (orders: Order[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (err) {
    console.error('Error saving orders:', err);
  }
};

export const addStoredOrder = (order: Order) => {
  const current = getStoredOrders();
  const updated = [order, ...current];
  saveStoredOrders(updated);
  return updated;
};

export const updateStoredOrderStatus = (
  orderId: string, 
  newStatus: Order['status'], 
  note?: string,
  isPaymentVerified?: boolean
): Order[] => {
  const current = getStoredOrders();
  const updated = current.map(o => {
    if (o.id === orderId) {
      const historyEntry = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${newStatus}`,
      };
      
      const paymentUpdate = { ...o.payment };
      if (isPaymentVerified) {
        paymentUpdate.status = 'Verified' as const;
        paymentUpdate.verifiedAt = new Date().toISOString();
      }

      return {
        ...o,
        status: newStatus,
        payment: paymentUpdate,
        statusHistory: [...o.statusHistory, historyEntry],
      };
    }
    return o;
  });
  saveStoredOrders(updated);
  return updated;
};

export const getStoredCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error reading cart:', err);
    return [];
  }
};

export const saveStoredCart = (cart: CartItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (err) {
    console.error('Error saving cart:', err);
  }
};

export const getStoredWishlist = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

export const saveStoredWishlist = (ids: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(ids));
  } catch (err) {
    console.error('Error saving wishlist:', err);
  }
};

export const getStoredSettings = (): AdminSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_ADMIN_SETTINGS));
      return DEFAULT_ADMIN_SETTINGS;
    }
    return { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_ADMIN_SETTINGS;
  }
};

export const saveStoredSettings = (settings: AdminSettings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
};

export const isAdminAuthenticated = (): boolean => {
  return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
};

export const setAdminAuthenticated = (val: boolean) => {
  if (val) {
    sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }
};
