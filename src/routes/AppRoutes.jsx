import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { routes } from './routeConfig'
import AdminRoutes from './AdminRoutes'

// User pages
import Home from '../pages/user/Home'
import Products from '../pages/user/Products'
import ProductDetails from '../pages/user/ProductDetails'
import Cart from '../pages/user/Cart'
import Checkout from '../pages/user/Checkout'
import Orders from '../pages/user/Orders'
import OrderDetails from '../pages/user/OrderDetails'
import Profile from '../pages/user/Profile'
import Wishlist from '../pages/user/Wishlist'
import Login from '../pages/user/Auth/Login'
import Register from '../pages/user/Auth/Register'
import ForgotPassword from '../pages/user/Auth/ForgotPassword'
import ResetPassword from '../pages/user/Auth/ResetPassword'
import PaymentSuccess from '../pages/user/PaymentSuccess'
import LegalPrivacy from '../components/policies/LegalPrivacy'
import ReturnPolicy from '../components/policies/ReturnPolicy'
import TermsAndConditions from '../components/policies/TermsOfService'
// Admin pages
import AdminDashboard from '../pages/admin/Dashboard'
import AdminProducts from '../pages/admin/Products/AdminProducts'
import AddProduct from '../pages/admin/Products/AddProduct'
import EditProduct from '../pages/admin/Products/EditProduct'
import AdminOrders from '../pages/admin/Orders/AdminOrders'
import AdminOrderDetails from '../pages/admin/Orders/OrderDetails'
import AdminUsers from '../pages/admin/Users/AdminUsers'
import AdminUserDetails from '../pages/admin/Users/UserDetails'

// Protected route components
import RequireAuth from '../features/auth/RequireAuth'
import RequireAdmin from '../features/admin/RequireAdmin'
import CartGuard from '../features/cart/CartGuard'
import Payment from '../pages/payment/payment'

function AppRoutes() {
  const { isAuthenticated } = useSelector(state => state.auth)

  return (
    <Routes>
      {/* Public routes */}
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.products} element={<Products />} />
      <Route path={routes.productDetails} element={<ProductDetails />} />
      <Route path={routes.paymentGateway} element={<Payment />} />
      <Route path={routes.privacyPolicy} element={<LegalPrivacy />} />
      <Route path={routes.returnPolicy} element={<ReturnPolicy />} />
      <Route path={routes.termsAndConditions} element={<TermsAndConditions />} />

      <Route path={routes.login} element={
        isAuthenticated ? <Navigate to={routes.home} replace /> : <Login />
      } />
      <Route path={routes.register} element={
        isAuthenticated ? <Navigate to={routes.home} replace /> : <Register />
      } />
      <Route path={routes.forgotPassword} element={<ForgotPassword />} />
      <Route path={routes.resetPassword} element={<ResetPassword />} />

      {/* Protected user routes */}
      <Route element={<RequireAuth />}>
        <Route path={routes.cart} element={<Cart />} />
        <Route path={routes.paymentSuccess} element={<PaymentSuccess />} />
        <Route path={routes.orders} element={<Orders />} />
        <Route path={routes.orderDetails} element={<OrderDetails />} />
        <Route path={routes.profile} element={<Profile />} />
        <Route path={routes.wishlist} element={<Wishlist />} />

        {/* Checkout with cart guard */}
        <Route element={<CartGuard />}>
          <Route path={routes.checkout} element={<Checkout />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireAdmin />}>
          <Route element={<AdminRoutes />}>
            <Route path={routes.admin.dashboard} element={<AdminDashboard />} />
            <Route path={routes.admin.products} element={<AdminProducts />} />
            <Route path={routes.admin.addProduct} element={<AddProduct />} />
            <Route path={routes.admin.editProduct} element={<EditProduct />} />
            <Route path={routes.admin.orders} element={<AdminOrders />} />
            <Route path={routes.admin.orderDetails} element={<AdminOrderDetails />} />
            <Route path={routes.admin.users} element={<AdminUsers />} />
            <Route path={routes.admin.userDetails} element={<AdminUserDetails />} />
          </Route>
        </Route>
      </Route>

      {/* 404 redirect */}
      <Route path="*" element={<Navigate to={routes.home} replace />} />
    </Routes>
  )
}

export default AppRoutes