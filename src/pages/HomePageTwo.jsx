import React, { useEffect } from "react";
import Preloader from "../helper/Preloader";
import HeaderTwo from "../components/HeaderTwo";
import BannerTwo from "../components/BannerTwo";
import PromotionalTwo from "../components/PromotionalTwo";
import CategorySliderTwo from "../components/CategorySliderTwo";
import DealsOne from "../components/DealsOne";
import TopSellingOne from "../components/TopSellingOne";
import TrendingOne from "../components/TrendingOne";
import DiscountOne from "../components/DiscountOne";
import FeaturedOne from "../components/FeaturedOne";
import BigDealOne from "../components/BigDealOne";
import TopSellingTwo from "../components/TopSellingTwo";
import PopularProductsOne from "../components/PopularProductsOne";
import TopVendorsTwo from "../components/TopVendorsTwo";
import DaySaleOne from "../components/DaySaleOne";
import RecentlyViewedOne from "../components/RecentlyViewedOne";
import BrandTwo from "../components/BrandTwo";
import ShippingTwo from "../components/ShippingTwo";
import NewsletterTwo from "../components/NewsletterTwo";
import FooterTwo from "../components/FooterTwo";
import BottomFooter from "../components/BottomFooter";
import ColorInit from "../helper/ColorInit";
import ScrollToTop from "react-scroll-to-top";
import { useDispatch } from "react-redux";
import { allproducts } from "../redux/thunk/products.thunk";

const HomePageTwo = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(allproducts());
  }, [dispatch]);

  return (
    <>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#FA6400" />

      {/* Preloader */}
      <Preloader />

      {/* HeaderTwo */}
      {/* <HeaderTwo category={false} /> */}

      {/* BannerTwo */}
      <BannerTwo />

      {/* PromotionalTwo */}
      <PromotionalTwo />

      {/* CategorySliderTwo */}
      <CategorySliderTwo />

      {/* DealsOne */}
      <DealsOne />

      {/* TopSellingOne */}
      {/* <TopSellingOne /> */}

      {/* TrendingOne */}
      <TrendingOne />

      {/* DiscountOne */}
      <DiscountOne />

      {/* FeaturedOne */}
      {/* <FeaturedOne /> */}

      {/* BigDealOne */}
      {/* <BigDealOne /> */}

      {/* TopSellingTwo */}
      <TopSellingTwo />

      {/* PopularProductsOne */}
      {/* <PopularProductsOne /> */}

      {/* TopVendorsTwo */}
      {/* <TopVendorsTwo /> */}

      {/* DaySaleOne */}
      <DaySaleOne />

      {/* RecentlyViewedOne */}
      <RecentlyViewedOne />

      {/* BrandTwo */}
      <BrandTwo />

      {/* ShippingTwo */}
      <ShippingTwo />

      {/* NewsletterTwo */}
      <NewsletterTwo />

    </>
  );
};

export default HomePageTwo;
