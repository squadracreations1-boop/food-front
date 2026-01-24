import { Home, ShoppingBag, ClipboardList, UserCircle, Grid, Boxes, LogIn, UserPlus } from 'lucide-react';

// Route configuration for the entire application
export const routes = {
  // Public routes
  home: '/',
  products: '/products',
  productDetails: '/product/:id',
  login: '/login',
  register: '/register',
  forgotPassword: '/password/forgot',
  resetPassword: '/password/reset/:token',
  paymentSuccess: '/payment-success',
  paymentGateway: '/payment-gateway',
  privacyPolicy: '/privacy-policy',
  returnPolicy: '/return-policy',
  termsAndConditions: '/terms-and-conditions',
  // Protected user routes
  cart: '/cart',
  checkout: '/checkout',
  orders: '/orders',
  orderDetails: '/order/:id',
  profile: '/profile',
  wishlist: '/wishlist',

  // Admin routes
  admin: {
    dashboard: '/admin/dashboard',
    products: '/admin/products',
    addProduct: '/admin/product/new',
    editProduct: '/admin/product/:id/edit',
    orders: '/admin/orders',
    orderDetails: '/admin/order/:id',
    users: '/admin/users',
    userDetails: '/admin/user/:id',
  },
};

// Route protection types
export const RouteProtection = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  ADMIN: 'admin',
};

// Navigation configuration
export const navigation = {
  public: [
    { name: 'Home', path: routes.home, icon: Home },
    { name: 'Products', path: routes.products, icon: Boxes },
    { name: 'Login', path: routes.login, icon: LogIn },
    { name: 'Register', path: routes.register, icon: UserPlus },
  ],
  user: [
    { name: 'Home', path: routes.home, icon: Home },
    { name: 'Products', path: routes.products, icon: Boxes },
    { name: 'Cart', path: routes.cart, icon: ShoppingBag },
    { name: 'Orders', path: routes.orders, icon: ClipboardList },
    { name: 'Profile', path: routes.profile, icon: UserCircle },
  ],
  admin: [
    { name: 'Dashboard', path: routes.admin.dashboard, icon: Grid },
    { name: 'Products', path: routes.admin.products, icon: Boxes },
    { name: 'Orders', path: routes.admin.orders, icon: ShoppingBag },
    { name: 'Users', path: routes.admin.users, icon: UserCircle },
    { name: 'Store', path: routes.home, icon: Home },
  ],
};

// Product categories for filtering
export const categories = [
  'Veg',
  'Non-Veg',
  'Veg Masala',
  'Non-Veg Masala',
  'Food ingredients',
  'Bakery',
  'Bakery Masala',
  'Bakery Ingredients',
  'Bakery Spices',
];

// Order status options
export const orderStatus = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// Payment methods
export const paymentMethods = {
  CARD: 'Credit/Debit Card',
  UPI: 'UPI',
  NETBANKING: 'Net Banking',
  COD: 'Cash on Delivery',
};