// Application constants

export const APP_NAME = 'OrganicStore'
export const APP_DESCRIPTION = 'Fresh & Natural Organic Products'
export const APP_VERSION = '1.0.0'

// API Configuration
export const API_BASE_URL = '/api/v1'
export const API_TIMEOUT = 10000

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'organic_token',
  CART_ITEMS: 'organic_cart',
  USER_PREFERENCES: 'organic_prefs',
  RECENT_SEARCHES: 'organic_searches',
}

// Product Constants
export const PRODUCT_CONSTANTS = {
  MAX_IMAGES: 5,
  MIN_PRICE: 0.01,
  MAX_PRICE: 9999.99,
  MIN_STOCK: 0,
  MAX_STOCK: 9999,
  CATEGORIES: [
    'Veg',
    'Non-Veg',
    'Sambar Powder',
    'Turmeric Powder',
    'Ginger Powder',
    'Chiken Masala',
    'Mutton Masala',
    'Rasam Powder',
    'Curry Leaf Powder',
    'Moring Idly Powder',
    'Idly Powder',
    'Organic',
  ],
  RATINGS: [1, 2, 3, 4, 5],
}

// Order Constants
export const ORDER_CONSTANTS = {
  STATUS: {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  },
  PAYMENT_METHODS: {
    CARD: 'Credit/Debit Card',
    UPI: 'UPI',
    NETBANKING: 'Net Banking',
    COD: 'Cash on Delivery',
    WHATSAPP: 'Order via WhatsApp',
  },
  SHIPPING_COST: 5.99,
  FREE_SHIPPING_THRESHOLD: 50,
  TAX_RATE: 0.08, // 8%
}

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
}

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  CREDIT_CARD: /^\d{16}$/,
  CVV: /^\d{3,4}$/,
  EXPIRY_DATE: /^(0[1-9]|1[0-2])\/\d{2}$/,
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  TIME: 'hh:mm A',
  DATETIME: 'MMM DD, YYYY hh:mm A',
  API: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
}

// Local Storage Defaults
export const DEFAULT_PREFERENCES = {
  theme: 'light',
  currency: 'USD',
  language: 'en',
  notifications: true,
  newsletter: true,
}

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
}

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  SERVER: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission.',
  VALIDATION: 'Please check your input.',
  DEFAULT: 'Something went wrong.',
}