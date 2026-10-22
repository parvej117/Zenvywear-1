import { Product, Order, AdminSettings, OrderStatus, User } from '../types';
import { 
  getStoredProducts, 
  saveStoredProducts, 
  getStoredOrders, 
  saveStoredOrders, 
  getStoredSettings, 
  saveStoredSettings 
} from '../utils/storage';

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(includeHidden = false): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE}/products${includeHidden ? '?all=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        saveStoredProducts(data.products);
        return data.products;
      }
    } catch (e) {
      console.warn('Backend /api/products offline, using local storage fallback', e);
    }
    return getStoredProducts();
  },

  async createProduct(product: Partial<Product>, adminToken?: string): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const data = await res.json();
        return data.product;
      }
    } catch (e) {
      console.warn('Backend product creation fallback', e);
    }
    // Fallback
    const current = getStoredProducts();
    const newProd = { ...product, id: product.id || `prod-${Date.now()}` } as Product;
    saveStoredProducts([newProd, ...current]);
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<Product>, adminToken?: string): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        return data.product;
      }
    } catch (e) {
      console.warn('Backend product update fallback', e);
    }
    const current = getStoredProducts();
    const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveStoredProducts(updated);
    return updated.find((p) => p.id === id)!;
  },

  async deleteProduct(id: string, hard = false, adminToken?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}${hard ? '?hard=true' : ''}`, {
        method: 'DELETE',
        headers: {
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
      });
      if (res.ok) return true;
    } catch (e) {
      console.warn('Backend product delete fallback', e);
    }
    const current = getStoredProducts();
    if (hard) {
      saveStoredProducts(current.filter((p) => p.id !== id));
    } else {
      saveStoredProducts(current.map((p) => (p.id === id ? { ...p, isHidden: !p.isHidden } : p)));
    }
    return true;
  },

  // Orders
  async createOrder(
    orderPayload: {
      items: any[];
      customer: any;
      payment: any;
      couponCode?: string;
    },
    customerToken?: string
  ): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(customerToken ? { Authorization: `Bearer ${customerToken}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        const data = await res.json();
        const current = getStoredOrders();
        saveStoredOrders([data.order, ...current]);
        return data.order;
      }
      const err = await res.json();
      throw new Error(err.error || 'Failed to place order');
    } catch (e: any) {
      console.warn('Backend order placement fallback to local calculation', e);
      // Local fallback calculation if server is in standalone static mode
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const subtotal = orderPayload.items.reduce((s, i) => s + i.product.price * i.quantity, 0);
      const isDhaka = orderPayload.customer.district?.toLowerCase() === 'dhaka';
      const isFree = subtotal >= 4000;
      const deliveryCharge = isFree ? 0 : isDhaka ? 70 : 130;
      const discount = orderPayload.couponCode === 'ZENVY10' ? Math.round(subtotal * 0.1) : 0;

      const fallbackOrder: Order = {
        id: `ZW-2026-${randomSuffix}`,
        createdAt: new Date().toISOString(),
        items: orderPayload.items,
        customer: orderPayload.customer,
        payment: {
          ...orderPayload.payment,
          status: orderPayload.payment.method === 'Cash on Delivery' ? 'Pending COD' : 'Pending Verification',
        },
        subtotal,
        deliveryCharge,
        discountAmount: discount,
        totalAmount: subtotal - discount + deliveryCharge,
        status: orderPayload.payment.method === 'Cash on Delivery' ? 'Pending' : 'Payment Verification',
        statusHistory: [
          {
            status: 'Pending',
            timestamp: new Date().toISOString(),
            note: 'Order submitted locally',
          },
        ],
      };
      const current = getStoredOrders();
      saveStoredOrders([fallbackOrder, ...current]);
      return fallbackOrder;
    }
  },

  async getOrders(adminToken?: string): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        headers: {
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        saveStoredOrders(data.orders);
        return data.orders;
      }
    } catch (e) {
      console.warn('Backend /api/orders fallback', e);
    }
    return getStoredOrders();
  },

  async updateOrderStatus(
    orderId: string, 
    status: OrderStatus, 
    note?: string,
    paymentStatus?: string,
    rejectionReason?: string,
    adminToken?: string
  ): Promise<Order | null> {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify({ status, note, paymentStatus, rejectionReason }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.order;
      }
    } catch (e) {
      console.warn('Backend order status update fallback', e);
    }
    return null;
  },

  async trackOrder(query: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/orders/track?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        return data.order;
      }
    } catch (e) {
      console.warn('Backend tracking fallback', e);
    }
    const orders = getStoredOrders();
    const cleanQ = query.trim().toLowerCase();
    return orders.find(
      (o) =>
        o.id.toLowerCase() === cleanQ ||
        o.customer.phone.replace(/[^0-9]/g, '') === cleanQ.replace(/[^0-9]/g, '') ||
        o.payment.transactionId?.toLowerCase() === cleanQ
    );
  },

  // Admin Auth
  async loginAdmin(passcode: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (res.ok) return { success: true, token: data.token };
      return { success: false, error: data.error };
    } catch (e) {
      if (passcode === 'zenvyadmin') {
        return { success: true, token: 'offline_token' };
      }
      return { success: false, error: 'Invalid passcode' };
    }
  },

  // Settings
  async getSettings(): Promise<AdminSettings> {
    try {
      const res = await fetch(`${API_BASE}/admin/settings`);
      if (res.ok) {
        const data = await res.json();
        const merged = { ...getStoredSettings(), ...data.settings };
        saveStoredSettings(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Backend settings fallback', e);
    }
    return getStoredSettings();
  },

  async updateSettings(settings: AdminSettings, adminToken?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        saveStoredSettings(settings);
        return true;
      }
    } catch (e) {
      console.warn('Backend settings update fallback', e);
    }
    saveStoredSettings(settings);
    return true;
  },

  getExportOrdersCsvUrl(): string {
    return `${API_BASE}/admin/export/orders.csv`;
  },

  // Customer Authentication API
  async registerCustomer(payload: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    address?: string;
    district?: string;
    division?: string;
  }): Promise<{ success: boolean; token?: string; user?: User; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, token: data.token, user: data.user };
      }
      return { success: false, error: data.error || 'Failed to register account' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Connection to server failed' };
    }
  },

  async loginCustomer(payload: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; token?: string; user?: User; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, token: data.token, user: data.user };
      }
      return { success: false, error: data.error || 'Invalid email or password' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Connection to server failed' };
    }
  },

  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.user;
      }
    } catch (e) {
      console.warn('Failed to retrieve active user session', e);
    }
    return null;
  },

  async updateCustomerProfile(
    updates: Partial<User>,
    token: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (res.ok) return { success: true, user: data.user };
      return { success: false, error: data.error || 'Failed to update profile' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error updating profile' };
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message?: string; verificationCode?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        return {
          success: true,
          message: data.message,
          verificationCode: data.verificationCode,
        };
      }
      return { success: false, error: data.error || 'Failed to request reset' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  },

  async resetPassword(payload: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) return { success: true, message: data.message };
      return { success: false, error: data.error || 'Failed to reset password' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Network error' };
    }
  },

  async logoutCustomer(token: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.warn('Logout network error', e);
    }
    return true;
  },

  async getCustomerOrders(token: string): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE}/customer/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.orders || [];
      }
    } catch (e) {
      console.warn('Failed to load customer orders', e);
    }
    return [];
  },
};
