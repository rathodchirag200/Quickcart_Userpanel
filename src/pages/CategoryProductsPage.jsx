import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Preloader from "../helper/Preloader";
import Breadcrumb from "../components/Breadcrumb";
import ColorInit from "../helper/ColorInit";
import ScrollToTop from "react-scroll-to-top";
import CategoryProductsSection from "../components/CategoryProductsSection";
import ShippingTwo from "../components/ShippingTwo";
import { getcategory } from "../redux/thunk/category.thunk";

const CategoryProductsPage = () => {
  const dispatch = useDispatch();
  const { categoryId } = useParams();
  const categories = useSelector((state) => state.category.categories || []);

  useEffect(() => {
    if (!categories.length) {
      dispatch(getcategory());
    }
  }, [dispatch, categories.length]);

  const selectedCategoryName = useMemo(() => {
    return categories.find((item) => item._id === categoryId)?.name || "Category Products";
  }, [categories, categoryId]);

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />

      <Breadcrumb title={selectedCategoryName} />

      <CategoryProductsSection
        categoryId={categoryId}
        categoryName={selectedCategoryName}
      />

      <ShippingTwo />
    </>
  );
};

export default CategoryProductsPage;
