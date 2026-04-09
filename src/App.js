import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import PhosphorIconInit from "./helper/PhosphorIconInit";

import { useDispatch } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import HomePageTwo from "./pages/HomePageTwo";
import ShopPage from "./pages/ShopPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import ProductDetailsPageTwo from "./pages/ProductDetailsPageTwo";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AccountPage from "./pages/AccountPage";
import ContactPage from "./pages/ContactPage";
import WishlistPage from "./pages/WishlistPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import FaqPage from "./pages/FaqPage";
import AboutPage from "./pages/AboutPage";

import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { useEffect } from "react";
import { userdetails } from "./redux/thunk/auth.thunk";
import { logout } from "./redux/slice/auth.slice";
import { Profile } from "./pages/profile";
import { ForgotPassword } from "./pages/forgotpassword";
import { ResetPassword } from "./pages/ResetPassword";
import { getcart } from "./redux/thunk/cart.thunk";
import { getwishlist } from "./redux/thunk/wishlist.thunk";
import ProtectedRoute from "./utils/ProtectedRoute";
import TrackOrderPage from "./pages/TrackOrderPage";

const TOKEN_EXPIRES_AT_KEY = "tokenExpiresAt";

const SessionExpiryWatcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const currentToken = localStorage.getItem("token");
      const expiresAtRaw = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
      const expiresAt = Number(expiresAtRaw);

      if (!currentToken || !Number.isFinite(expiresAt)) {
        return;
      }

      if (Date.now() >= expiresAt) {
        dispatch(logout());
        toast.error("Your session expired. Login again.", {
          toastId: "session-expired",
        });

        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      }
    };

    checkTokenExpiry();
    const intervalId = setInterval(checkTokenExpiry, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, navigate, location.pathname]);

  return null;
};

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(userdetails());
    }

    dispatch(getcart());
    dispatch(getwishlist());
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <SessionExpiryWatcher />
      <RouteScrollToTop />
      <PhosphorIconInit />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePageTwo />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
          <Route
            path="/product-details/:id"
            element={<ProductDetailsPageTwo />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders/track/:id" element={<TrackOrderPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
