import { configureStore } from "@reduxjs/toolkit";
import BannerReducer from "./slice/banner.slice";
import CategoryReducer from "./slice/category.slice";
import ProductReducer from "./slice/products.slice";
import UserReducer from "./slice/auth.slice";
import AddressReducer from "./slice/address.slice";
import CartReducer from "./slice/cart.slice";
import WishlistReducer from "./slice/wishlist.slice"
import OrderReducer from "./slice/order.slice"
import PaymentReducer from "./slice/payment.slice"
import ContactReducer from "./slice/contact.slice"
import FaqReducer from "./slice/faqs.slice"
import ReviewReducer from "./slice/review.slice";

export const store = configureStore({
  reducer: {
    banner: BannerReducer,
    category: CategoryReducer,
    product: ProductReducer,
    user: UserReducer,
    address: AddressReducer,
    cart: CartReducer,
    wishlist : WishlistReducer,
    order : OrderReducer,
    payment : PaymentReducer,
    contact : ContactReducer,
    faqs : FaqReducer,
    review : ReviewReducer
  },
});
