import React, { useEffect } from "react";
import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import CartSection from "../components/CartSection";
import ShippingOne from "../components/ShippingOne";
import ScrollToTop from "react-scroll-to-top";
import { useDispatch } from "react-redux";
import { getcart } from "../redux/thunk/cart.thunk";

const CartPage = () => {

  const dispatch = useDispatch();
  useEffect(() =>{
      dispatch(getcart());
  } , [dispatch]);

  return (
    <>
      <ColorInit color={true} />

      <ScrollToTop smooth color="#FA6400" />

      {/* Preloader */}
      <Preloader />

      <Breadcrumb title={"Cart"} />

      <CartSection />

      <ShippingOne />
    </>
  );
};

export default CartPage;
