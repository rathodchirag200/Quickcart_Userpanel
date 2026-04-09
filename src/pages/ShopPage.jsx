import React, { useEffect } from "react";
import Preloader from "../helper/Preloader";
import HeaderTwo from "../components/HeaderTwo";
import Breadcrumb from "../components/Breadcrumb";
import ShopSection from "../components/ShopSection";
import ShippingTwo from "../components/ShippingTwo";
import FooterTwo from "../components/FooterTwo";
import ColorInit from "../helper/ColorInit";
import ScrollToTop from "react-scroll-to-top";
import { useDispatch } from "react-redux";
import { paginationproduct } from "../redux/thunk/products.thunk";
import { getcategory } from "../redux/thunk/category.thunk";

const ShopPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      paginationproduct({
        page: 1,
        limit: 10,
      }),
    );
    dispatch(getcategory());
  }, [dispatch]);

  return (
    <>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#FA6400" />

      {/* Preloader */}
      <Preloader />

      {/* Breadcrumb */}
      <Breadcrumb title={"Shop"} />

      {/* ShopSection */}
      <ShopSection />

      {/* ShippingTwo */}
      <ShippingTwo />
    </>
  );
};

export default ShopPage;
