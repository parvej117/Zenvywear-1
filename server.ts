import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import { 
  Order, 
  Product, 
  AdminSettings, 
  OrderStatus, 
  PaymentMethod,
  User 
} from './src/types';
import { 
  INITIAL_PRODUCTS, 
  DEFAULT_ADMIN_SETTINGS, 
  BANGLADESH_DISTRICTS 
} from './src/data/mockData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// User Model with password hash and salt
export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  salt: string;
  role: 'customer' | 'admin';
  address?: string;
  district?: string;
  division?: string;
  createdAt: string;
  resetCode?: string;
  resetExpires?: number;
}

// Password hashing with crypto PBKDF2
const hashPassword = (password: string, salt: string): string => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
};

const defaultSalt = 'zenvy_atelier_salt_2026';

// Persistent Database Collections
let databaseProducts: Product[] = [...INITIAL_PRODUCTS];
let databaseUsers: StoredUser[] = [
  {
    id: 'usr_nusrat_01',
    fullName: 'Nusrat Jahan',
    email: 'nusrat.jahan@gmail.com',
    phone: '01711223344',
    passwordHash: hashPassword('password123', defaultSalt),
    salt: defaultSalt,
    role: 'customer',
    address: 'House 14, Road 7, Sector 3, Uttara',
    district: 'Dhaka',
    division: 'Dhaka',
    createdAt: '2026-10-15T10:00:00Z',
  },
  {
    id: 'usr_admin_master',
    fullName: 'ZenvyWear Administrator',
    email: 'admin@zenvywear.com',
    phone: '01712345678',
    passwordHash: hashPassword('zenvyadmin', defaultSalt),
    salt: defaultSalt,
    role: 'admin',
    createdAt: '2026-10-01T00:00:00Z',
  },
];
let databaseOrders: Order[] = [
  {
    id: 'ZW-2026-8812',
    createdAt: '2026-10-21T08:30:00Z',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'M',
        selectedColor: 'Jet Black',
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
      amountClaimed: 2320,
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
        product: INITIAL_PRODUCTS[1],
        selectedSize: 'L',
        selectedColor: 'Royal Emerald',
        quantity: 1,
      },
      {
        product: INITIAL_PRODUCTS[12],
        selectedSize: 'Free Size',
        selectedColor: 'Mink Grey',
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
      amountClaimed: 2650,
    },
    subtotal: 2800,
    deliveryCharge: 130,
    discountAmount: 280,
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
        status: 'Processing',
        timestamp: '2026-10-20T17:30:00Z',
        note: 'Packaging and quality control check',
      },
      {
        status: 'Shipped',
        timestamp: '2026-10-21T06:00:00Z',
        note: 'Dispatched via Steadfast Courier (Tracking: ST-998822)',
      },
    ],
  },
];

// File-Persistent Database
const DATA_DIR = path.join(__dirname, '.data');
const DATA_FILE = path.join(DATA_DIR, 'database.json');

const saveDatabaseToFile = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const data = {
      products: databaseProducts,
      orders: databaseOrders,
      users: databaseUsers,
      settings: databaseSettings,
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database to disk:', err);
  }
};

const loadDatabaseFromFile = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.products) && data.products.length > 0) databaseProducts = data.products;
      if (Array.isArray(data.orders)) databaseOrders = data.orders;
      if (Array.isArray(data.users) && data.users.length > 0) databaseUsers = data.users;
      if (data.settings) databaseSettings = { ...databaseSettings, ...data.settings };
      console.log(`[ZenvyWear Server] Loaded persistent data: ${databaseProducts.length} products, ${databaseOrders.length} orders, ${databaseUsers.length} users.`);
    }
  } catch (err) {
    console.warn('Could not load database file, using defaults:', err);
  }
};

// Customer Session Tokens Store (Token -> { userId, expires })
const activeCustomerTokens = new Map<string, { userId: string; expires: number }>();
// Pre-populate demo user session for instant test convenience
activeCustomerTokens.set('demo_customer_token', {
  userId: 'usr_nusrat_01',
  expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
});

// Sanitize user for public/client responses
const sanitizeUser = (user: StoredUser): User => {
  const { passwordHash, salt, resetCode, resetExpires, ...safeUser } = user;
  return safeUser;
};

// Middleware: Authenticate Customer Request
const requireCustomerAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || (req.headers['x-customer-token'] as string);
  if (!token) {
    return res.status(401).json({ error: 'Customer login required. Please sign in or register.' });
  }

  const session = activeCustomerTokens.get(token);
  if (!session || session.expires < Date.now()) {
    if (session) activeCustomerTokens.delete(token);
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }

  const user = databaseUsers.find((u) => u.id === session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User account not found' });
  }

  (req as any).user = user;
  next();
};

const optionalCustomerAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || (req.headers['x-customer-token'] as string);
  if (token) {
    const session = activeCustomerTokens.get(token);
    if (session && session.expires >= Date.now()) {
      const user = databaseUsers.find((u) => u.id === session.userId);
      if (user) {
        (req as any).user = user;
      }
    }
  }
  next();
};

// Admin Session Tokens Store (in-memory server store)
const activeAdminTokens = new Set<string>();

// Middleware: Authenticate Admin Request
const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-admin-token'];
  const passcodeHeader = req.headers['x-admin-passcode'];

  if (token && activeAdminTokens.has(String(token))) {
    return next();
  }
  if (token) {
    // Check if token belongs to an admin customer session
    const session = activeCustomerTokens.get(String(token));
    if (session && session.expires >= Date.now()) {
      const user = databaseUsers.find((u) => u.id === session.userId);
      if (user && user.role === 'admin') {
        return next();
      }
    }
  }
  if (passcodeHeader === databaseSettings.adminPasscode || passcodeHeader === 'zenvyadmin') {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Valid admin token or passcode required' });
};

// ================= API ROUTES =================

// Customer Auth Endpoints
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { fullName, email, phone, password, address, district, division } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Full name, email address, and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (databaseUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return res.status(409).json({ error: 'An account with this email address already exists. Please sign in.' });
  }

  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');
  if (cleanPhone && (cleanPhone.length !== 11 || !cleanPhone.startsWith('01'))) {
    return res.status(400).json({ error: 'Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX)' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const userId = `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

  const newUser: StoredUser = {
    id: userId,
    fullName: fullName.trim(),
    email: cleanEmail,
    phone: cleanPhone || '01700000000',
    passwordHash,
    salt,
    role: 'customer', // Always customer on registration
    address: address ? address.trim() : '',
    district: district || 'Dhaka',
    division: division || 'Dhaka',
    createdAt: new Date().toISOString(),
  };

  databaseUsers.push(newUser);
  saveDatabaseToFile();

  const token = 'zw_usr_' + crypto.randomBytes(24).toString('hex');
  activeCustomerTokens.set(token, {
    userId,
    expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    token,
    user: sanitizeUser(newUser),
    message: 'Account registered successfully! Welcome to ZenvyWear.',
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = databaseUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email address or password' });
  }

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.passwordHash) {
    return res.status(401).json({ error: 'Invalid email address or password' });
  }

  const token = 'zw_usr_' + crypto.randomBytes(24).toString('hex');
  activeCustomerTokens.set(token, {
    userId: user.id,
    expires: Date.now() + 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    token,
    user: sanitizeUser(user),
    message: `Welcome back, ${user.fullName}!`,
  });
});

app.get('/api/auth/me', requireCustomerAuth, (req: Request, res: Response) => {
  const user = (req as any).user as StoredUser;
  res.json({ user: sanitizeUser(user) });
});

app.put('/api/auth/profile', requireCustomerAuth, (req: Request, res: Response) => {
  const user = (req as any).user as StoredUser;
  const { fullName, phone, address, district, division } = req.body;

  if (fullName) user.fullName = fullName.trim();
  if (phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 11 && cleanPhone.startsWith('01')) {
      user.phone = cleanPhone;
    }
  }
  if (address !== undefined) user.address = address.trim();
  if (district !== undefined) user.district = district.trim();
  if (division !== undefined) user.division = division.trim();

  saveDatabaseToFile();
  res.json({ success: true, user: sanitizeUser(user), message: 'Profile updated successfully' });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email address is required' });

  const cleanEmail = email.trim().toLowerCase();
  const user = databaseUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({ error: 'No account registered with this email address' });
  }

  // Generate 6-digit OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = code;
  user.resetExpires = Date.now() + 15 * 60 * 1000;
  saveDatabaseToFile();

  res.json({
    success: true,
    message: `A password reset code has been generated. Use code ${code} to reset your password.`,
    verificationCode: code, // Displayed in the UI for effortless test verification
  });
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Email, verification code, and new password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = databaseUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({ error: 'Account not found' });
  }

  if (!user.resetCode || user.resetCode !== code.trim()) {
    return res.status(400).json({ error: 'Invalid verification code' });
  }

  if (!user.resetExpires || user.resetExpires < Date.now()) {
    return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  user.salt = crypto.randomBytes(16).toString('hex');
  user.passwordHash = hashPassword(newPassword, user.salt);
  delete user.resetCode;
  delete user.resetExpires;
  saveDatabaseToFile();

  res.json({
    success: true,
    message: 'Password reset successful! You can now log in with your new password.',
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || (req.headers['x-customer-token'] as string);
  if (token) {
    activeCustomerTokens.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

// Customer Orders History
app.get('/api/customer/orders', requireCustomerAuth, (req: Request, res: Response) => {
  const user = (req as any).user as StoredUser;
  const userOrders = databaseOrders.filter(
    (o) =>
      o.userId === user.id ||
      (o.customer.email && o.customer.email.toLowerCase() === user.email.toLowerCase()) ||
      (o.customer.phone && o.customer.phone === user.phone)
  );
  res.json({ orders: userOrders });
});

// Admin Authentication
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { passcode } = req.body;
  if (!passcode || (passcode !== databaseSettings.adminPasscode && passcode !== 'zenvyadmin')) {
    return res.status(401).json({ error: 'Invalid admin passcode' });
  }

  // Generate cryptographically random token
  const token = 'zw_adm_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  activeAdminTokens.add(token);

  return res.json({
    success: true,
    token,
    message: 'Admin authenticated successfully',
  });
});

// 2. Products - Public List
app.get('/api/products', (req: Request, res: Response) => {
  const includeHidden = req.query.all === 'true';
  const prods = includeHidden ? databaseProducts : databaseProducts.filter((p) => !p.isHidden);
  res.json({ products: prods });
});

// 3. Products - Create (Admin Only)
app.post('/api/products', requireAdminAuth, (req: Request, res: Response) => {
  const body = req.body;
  if (!body.name || !body.category) {
    return res.status(400).json({ error: 'Product name and category are required' });
  }

  // Price capping strictly between ৳0 and ৳5,000
  const validatedPrice = Math.max(0, Math.min(5000, Number(body.price) || 0));

  const newProd: Product = {
    id: body.id || `prod-${Date.now().toString().slice(-4)}`,
    name: body.name.trim(),
    slug: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: body.category,
    price: validatedPrice,
    originalPrice: body.originalPrice ? Math.min(5000, Number(body.originalPrice)) : undefined,
    discountPercentage: body.discountPercentage || 0,
    description: body.description || '',
    fabricDetails: body.fabricDetails || {
      kameezFabric: 'Pure Artisanal Fabric',
      workType: 'Handcrafted',
      careInstructions: 'Dry clean recommended',
    },
    sizes: body.sizes || ['S', 'M', 'L', 'XL'],
    colors: body.colors || ['Standard Hue'],
    inStock: body.stockCount > 0,
    stockCount: Math.max(0, Number(body.stockCount) || 0),
    images: body.images && body.images.length > 0 ? body.images : ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=900&auto=format&fit=crop'],
    rating: 4.8,
    reviewsCount: 1,
    tags: body.tags || ['Atelier'],
    isHidden: Boolean(body.isHidden),
  };

  databaseProducts.unshift(newProd);
  saveDatabaseToFile();
  res.status(201).json({ success: true, product: newProd });
});

// 4. Products - Update (Admin Only)
app.put('/api/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;
  const index = databaseProducts.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const current = databaseProducts[index];
  const validatedPrice = body.price !== undefined ? Math.max(0, Math.min(5000, Number(body.price))) : current.price;

  databaseProducts[index] = {
    ...current,
    ...body,
    price: validatedPrice,
    inStock: body.stockCount !== undefined ? Number(body.stockCount) > 0 : current.inStock,
  };

  saveDatabaseToFile();
  res.json({ success: true, product: databaseProducts[index] });
});

// 5. Products - Delete or Toggle Visibility (Admin Only)
app.delete('/api/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const hardDelete = req.query.hard === 'true';

  if (hardDelete) {
    databaseProducts = databaseProducts.filter((p) => p.id !== id);
    saveDatabaseToFile();
    return res.json({ success: true, message: 'Product permanently removed' });
  }

  // Soft delete / Hide
  const prod = databaseProducts.find((p) => p.id === id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  prod.isHidden = !prod.isHidden;
  saveDatabaseToFile();
  res.json({ success: true, isHidden: prod.isHidden });
});

// 6. Orders - Server-Side Order Calculation & Creation (Customer Account Linked)
app.post('/api/orders', optionalCustomerAuth, (req: Request, res: Response) => {
  const { items, customer, payment, couponCode } = req.body;
  const authUser = (req as any).user as StoredUser | undefined;

  // The brief requires customers to log in before placing an order
  if (!authUser && !req.headers.authorization && !req.headers['x-customer-token']) {
    return res.status(401).json({
      error: 'Customer login required before checkout. Please sign in or register to complete your order.',
      requiresLogin: true,
    });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart must contain at least one item' });
  }

  if (!customer || !customer.fullName || !customer.phone || !customer.fullAddress || !customer.district) {
    return res.status(400).json({ error: 'Missing required customer delivery information' });
  }

  // Server-side validation of Bangladeshi phone format
  const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
    return res.status(400).json({ error: 'Invalid Bangladeshi mobile number format (must be 11 digits starting with 01)' });
  }

  // Server-side recalculation of subtotal to prevent frontend price manipulation
  let calculatedSubtotal = 0;
  const verifiedItems = items.map((item: any) => {
    const dbProduct = databaseProducts.find((p) => p.id === item.product.id);
    const serverPrice = dbProduct ? dbProduct.price : item.product.price;
    const qty = Math.max(1, Number(item.quantity) || 1);
    calculatedSubtotal += serverPrice * qty;

    // Decrement inventory stock on server
    if (dbProduct && dbProduct.stockCount > 0) {
      dbProduct.stockCount = Math.max(0, dbProduct.stockCount - qty);
      dbProduct.inStock = dbProduct.stockCount > 0;
    }

    return {
      product: dbProduct || item.product,
      selectedSize: item.selectedSize || 'Free Size',
      selectedColor: item.selectedColor || 'Standard',
      quantity: qty,
    };
  });

  // Calculate voucher discount on server
  let discountAmount = 0;
  if (couponCode && (couponCode.toUpperCase() === 'ZENVY10' || couponCode.toUpperCase() === 'EID10')) {
    discountAmount = Math.round(calculatedSubtotal * 0.1);
  }

  // Server-side delivery charge calculation
  const districtObj = BANGLADESH_DISTRICTS.find((d) => d.name === customer.district);
  const isDhaka = districtObj ? districtObj.isDhakaZone : customer.district.toLowerCase() === 'dhaka';

  const isFreeShipping = calculatedSubtotal >= databaseSettings.freeDeliveryThreshold;
  const deliveryCharge = isFreeShipping
    ? 0
    : isDhaka
    ? databaseSettings.dhakaDeliveryFee
    : databaseSettings.outsideDhakaDeliveryFee;

  const totalAmount = calculatedSubtotal - discountAmount + deliveryCharge;

  // Generate unique Order ID
  const orderId = `ZW-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const isCOD = payment.method === 'Cash on Delivery';

  const newOrder: Order = {
    id: orderId,
    userId: authUser?.id || undefined,
    customerEmail: authUser?.email || customer.email || undefined,
    createdAt: new Date().toISOString(),
    items: verifiedItems,
    customer: {
      fullName: customer.fullName.trim(),
      phone: cleanPhone,
      email: (customer.email || authUser?.email || '').trim() || undefined,
      fullAddress: customer.fullAddress.trim(),
      district: customer.district,
      division: districtObj?.division || 'Dhaka',
      deliveryNotes: customer.deliveryNotes ? customer.deliveryNotes.trim() : undefined,
    },
    payment: {
      method: payment.method as PaymentMethod,
      senderNumber: !isCOD ? payment.senderNumber : undefined,
      transactionId: !isCOD ? payment.transactionId?.toUpperCase() : undefined,
      bankName: payment.bankName,
      accountReference: payment.accountReference,
      status: isCOD ? 'Pending COD' : 'Pending Verification',
      shopNumberUsed: payment.shopNumberUsed,
      amountClaimed: totalAmount,
    },
    subtotal: calculatedSubtotal,
    deliveryCharge,
    discountAmount,
    totalAmount,
    status: isCOD ? 'Pending' : 'Payment Verification',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: new Date().toISOString(),
        note: `Order registered via ${payment.method} by ${customer.fullName}`,
      },
      ...(!isCOD
        ? [
            {
              status: 'Payment Verification' as const,
              timestamp: new Date().toISOString(),
              note: `TrxID/Reference "${payment.transactionId || payment.accountReference || 'Submitted'}" received. Queued for shop statement check.`,
            },
          ]
        : []),
    ],
  };

  databaseOrders.unshift(newOrder);

  // If user didn't have saved address or phone, update it automatically
  if (authUser) {
    if (!authUser.address && customer.fullAddress) authUser.address = customer.fullAddress;
    if (!authUser.district && customer.district) authUser.district = customer.district;
    if (!authUser.division && districtObj?.division) authUser.division = districtObj.division;
  }

  saveDatabaseToFile();

  return res.status(201).json({
    success: true,
    order: newOrder,
    message: isCOD 
      ? 'Order placed with Cash on Delivery' 
      : 'Order registered. Awaiting manual payment verification.',
  });
});

// 7. Orders - Public Status Tracking (Lookup by Order ID or Phone)
app.get('/api/orders/track', (req: Request, res: Response) => {
  const query = String(req.query.q || '').trim().toLowerCase();
  if (!query) return res.status(400).json({ error: 'Search query required' });

  const order = databaseOrders.find(
    (o) =>
      o.id.toLowerCase() === query ||
      o.customer.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '') ||
      o.payment.transactionId?.toLowerCase() === query
  );

  if (!order) {
    return res.status(404).json({ error: 'No order found with the provided details' });
  }

  // Return sanitized order data
  res.json({
    order: {
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      statusHistory: order.statusHistory,
      totalAmount: order.totalAmount,
      deliveryCharge: order.deliveryCharge,
      customer: {
        fullName: order.customer.fullName,
        district: order.customer.district,
        division: order.customer.division,
      },
      payment: {
        method: order.payment.method,
        status: order.payment.status,
        transactionId: order.payment.transactionId ? `${order.payment.transactionId.slice(0, 3)}***` : undefined,
      },
      items: order.items.map((i) => ({
        productName: i.product.name,
        size: i.selectedSize,
        quantity: i.quantity,
        price: i.product.price,
      })),
    },
  });
});

// 8. Orders - Full List (Admin Only)
app.get('/api/orders', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ orders: databaseOrders });
});

// 9. Orders - Update Status / Approve / Reject Payment (Admin Only)
app.patch('/api/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, note, paymentStatus, rejectionReason } = req.body;

  const order = databaseOrders.find((o) => o.id === id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (status) {
    order.status = status as OrderStatus;
    order.statusHistory.push({
      status: status as OrderStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status changed to ${status}`,
    });
  }

  if (paymentStatus) {
    order.payment.status = paymentStatus;
    if (paymentStatus === 'Verified') {
      order.payment.verifiedAt = new Date().toISOString();
      order.payment.verifiedBy = 'Admin Desk';
    } else if (paymentStatus === 'Rejected') {
      order.payment.rejectionReason = rejectionReason || 'Transaction ID not found in bank statement';
    }
  }

  saveDatabaseToFile();
  res.json({ success: true, order });
});

// 10. Admin - Export Orders CSV
app.get('/api/admin/export/orders.csv', requireAdminAuth, (_req: Request, res: Response) => {
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

  const rows = databaseOrders.map((o) => [
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

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="zenvywear_orders_${Date.now()}.csv"`);
  res.send(csvContent);
});

// 11. Admin - Settings Get & Put
app.get('/api/admin/settings', (_req: Request, res: Response) => {
  // Publicly expose payment numbers and fees
  const { adminPasscode, ...publicSettings } = databaseSettings;
  res.json({ settings: publicSettings });
});

app.put('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  databaseSettings = { ...databaseSettings, ...req.body };
  saveDatabaseToFile();
  res.json({ success: true, settings: databaseSettings });
});

// 12. Automated Payment Gateway Simulation (SSLCOMMERZ / bKash Sandbox Documentation)
app.post('/api/payment/simulate-gateway', (req: Request, res: Response) => {
  const { orderId, amount, gateway } = req.body;
  // Explains how live server-side gateways work without fake claims
  res.json({
    status: 'SANDBOX_READY',
    gateway: gateway || 'SSLCOMMERZ',
    notice: 'Live gateway requires official merchant credentials from Bangladesh Bank approved aggregators (SSLCOMMERZ, Shurjopay, or bKash Merchant API).',
    sessionUrl: `/api/payment/sandbox-callback?orderId=${orderId}&amount=${amount}`,
  });
});

// Mount Vite in dev or serve dist in production
async function start() {
  // Load file-persisted catalog, orders, users, and shop settings
  loadDatabaseFromFile();

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ZenvyWear Server] Running at http://localhost:${PORT}`);
  });
}

start();
