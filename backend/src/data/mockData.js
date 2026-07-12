/**
 * Mock Data for Backend API
 * This file provides mock data that matches the frontend expectations
 * When database becomes available, these can be replaced with real queries
 */

// ============================================
// CATEGORIES
// ============================================
export const mockCategories = [
  {
    categoryId: 1,
    id: 1,
    name: 'Food',
    categoryName: 'Food',
    status: 'Active',
    categoryStatus: 'Active',
  },
  {
    categoryId: 2,
    id: 2,
    name: 'Handicrafts',
    categoryName: 'Handicrafts',
    status: 'Active',
    categoryStatus: 'Active',
  },
  {
    categoryId: 3,
    id: 3,
    name: 'Clothing',
    categoryName: 'Clothing',
    status: 'Active',
    categoryStatus: 'Active',
  },
  {
    categoryId: 4,
    id: 4,
    name: 'Accessories',
    categoryName: 'Accessories',
    status: 'Active',
    categoryStatus: 'Active',
  },
  {
    categoryId: 5,
    id: 5,
    name: 'Souvenirs',
    categoryName: 'Souvenirs',
    status: 'Active',
    categoryStatus: 'Active',
  },
];

// ============================================
// PRODUCTS
// ============================================
export const mockProducts = [
  {
    productId: 1,
    id: 1,
    name: 'Silk Tote',
    productName: 'Silk Tote',
    description: 'Hand-woven and designed for modern daily carry.',
    productDescription: 'Hand-woven and designed for modern daily carry.',
    slug: 'silk-tote',
    price: 42,
    productPrice: 42,
    categoryId: 3,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    salesCount: 15,
    createAt: new Date('2026-06-01'),
    Category: {
      categoryId: 3,
      categoryName: 'Clothing',
    },
  },
  {
    productId: 2,
    id: 2,
    name: 'Ceramic Set',
    productName: 'Ceramic Set',
    description: 'Elegant tableware for warm, everyday rituals.',
    productDescription: 'Elegant tableware for warm, everyday rituals.',
    slug: 'ceramic-set',
    price: 36,
    productPrice: 36,
    categoryId: 5,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    salesCount: 8,
    createAt: new Date('2026-07-01'),
    Category: {
      categoryId: 5,
      categoryName: 'Souvenirs',
    },
  },
  {
    productId: 3,
    id: 3,
    name: 'Herbal Blend',
    productName: 'Herbal Blend',
    description: 'A serene infusion crafted from locally sourced herbs.',
    productDescription: 'A serene infusion crafted from locally sourced herbs.',
    slug: 'herbal-blend',
    price: 19,
    productPrice: 19,
    categoryId: 1,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    salesCount: 28,
    createAt: new Date('2026-05-15'),
    Category: {
      categoryId: 1,
      categoryName: 'Food',
    },
  },
  {
    productId: 4,
    id: 4,
    name: 'Silk Scarf',
    productName: 'Silk Scarf',
    description: 'A lightweight layer with timeless texture.',
    productDescription: 'A lightweight layer with timeless texture.',
    slug: 'silk-scarf',
    price: 29,
    productPrice: 29,
    categoryId: 3,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    salesCount: 19,
    createAt: new Date('2026-04-20'),
    Category: {
      categoryId: 3,
      categoryName: 'Clothing',
    },
  },
  {
    productId: 5,
    id: 5,
    name: 'Lotus Candle',
    productName: 'Lotus Candle',
    description: 'Soft fragrance from hand-poured soy wax.',
    productDescription: 'Soft fragrance from hand-poured soy wax.',
    slug: 'lotus-candle',
    price: 22,
    productPrice: 22,
    categoryId: 5,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    salesCount: 12,
    createAt: new Date('2026-07-05'),
    Category: {
      categoryId: 5,
      categoryName: 'Souvenirs',
    },
  },
  {
    productId: 6,
    id: 6,
    name: 'Tea Collection',
    productName: 'Tea Collection',
    description: 'A herb-forward assortment made for calm evenings.',
    productDescription: 'A herb-forward assortment made for calm evenings.',
    slug: 'tea-collection',
    price: 24,
    productPrice: 24,
    categoryId: 1,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    salesCount: 22,
    createAt: new Date('2026-07-08'),
    Category: {
      categoryId: 1,
      categoryName: 'Food',
    },
  },
];

// ============================================
// USERS (for cart/order tracking)
// ============================================
export const mockUsers = [
  {
    userId: 1,
    id: 1,
    fullName: 'Demo User',
    email: 'demo@khmerpride.com',
    password: '$2b$10$...', // password123 hashed
    role: 'customer',
    isVerified: true,
    createdAt: new Date('2026-01-01'),
  },
  {
    userId: 2,
    id: 2,
    fullName: 'Admin User',
    email: 'admin@khmerpride.com',
    password: '$2b$10$...', // password123 hashed
    role: 'admin',
    isVerified: true,
    createdAt: new Date('2026-01-01'),
  },
];

// ============================================
// CARTS (per user)
// ============================================
export const mockCarts = {
  // userId: { cartId, userId, items: [] }
};

// ============================================
// ORDERS (per user)
// ============================================
export const mockOrders = {
  // userId: [{ orderId, userId, items, total, status, createdAt }]
  1: [
    {
      orderId: 'order-1001',
      id: 'order-1001',
      userId: 1,
      items: [
        { productId: 1, quantity: 1, unitPrice: 42, subTotal: 42 },
        { productId: 3, quantity: 1, unitPrice: 19, subTotal: 19 },
      ],
      total: 84,
      totalAmount: 84,
      status: 'Delivered',
      orderStatus: 'Delivered',
      createdAt: new Date('2026-07-01'),
      orderDate: new Date('2026-07-01'),
    },
    {
      orderId: 'order-1002',
      id: 'order-1002',
      userId: 1,
      items: [{ productId: 5, quantity: 2, unitPrice: 22, subTotal: 44 }],
      total: 58,
      totalAmount: 58,
      status: 'Processing',
      orderStatus: 'Processing',
      createdAt: new Date('2026-07-08'),
      orderDate: new Date('2026-07-08'),
    },
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getCategoryById(id) {
  return mockCategories.find((cat) => cat.categoryId === Number(id) || cat.id === Number(id)) || null;
}

export function getProductById(id) {
  return mockProducts.find((prod) => prod.productId === Number(id) || prod.id === Number(id)) || null;
}

export function getProductsByCategory(categoryId) {
  return mockProducts.filter((prod) => prod.categoryId === Number(categoryId));
}

export function searchProducts(query) {
  if (!query) return mockProducts;
  const normalized = query.toLowerCase();
  return mockProducts.filter(
    (prod) =>
      prod.productName?.toLowerCase().includes(normalized) ||
      prod.productDescription?.toLowerCase().includes(normalized)
  );
}

export function getFeaturedProducts() {
  return mockProducts.filter((prod) => prod.isFeatured).slice(0, 6);
}

export function getNewArrivals() {
  return mockProducts.filter((prod) => prod.isNewArrival).slice(0, 6);
}

export function getBestSellers() {
  return mockProducts.filter((prod) => prod.isBestSeller).slice(0, 6);
}

export function getUserCart(userId) {
  if (!mockCarts[userId]) {
    mockCarts[userId] = {
      cartId: `cart-${userId}`,
      userId,
      items: [],
    };
  }
  return mockCarts[userId];
}

export function getUserOrders(userId) {
  return mockOrders[userId] || [];
}

export function getOrderById(orderId) {
  for (const userOrders of Object.values(mockOrders)) {
    const order = userOrders.find((o) => o.orderId === orderId || o.id === orderId);
    if (order) return order;
  }
  return null;
}

export function createOrder(userId, orderData) {
  const orderId = `order-${Date.now()}`;
  const order = {
    orderId,
    id: orderId,
    userId,
    items: orderData.items,
    total: orderData.total,
    totalAmount: orderData.total,
    status: 'Pending',
    orderStatus: 'Pending',
    createdAt: new Date(),
    orderDate: new Date(),
  };

  if (!mockOrders[userId]) {
    mockOrders[userId] = [];
  }
  mockOrders[userId].unshift(order); // Add to beginning for reverse chronological order

  return order;
}
