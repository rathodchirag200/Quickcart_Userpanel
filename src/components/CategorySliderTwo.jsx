import React, { useEffect, useRef } from "react";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getcategory } from "../redux/thunk/category.thunk";
import "../css/categoryslider.scss";

const FALLBACK_CATEGORY_IMAGE = "/assets/images/thumbs/product-two-img1.png";

const CategorySliderTwo = () => {
  const sliderRef = useRef(null);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories || []);
  const isLoading = useSelector((state) => state.category.loading.get);

  useEffect(() => {
    if (!categories.length) {
      dispatch(getcategory());
    }
  }, [dispatch, categories.length]);

  const getCategoryImage = (category) => {
    const imagePath =
      category?.image || category?.icon || category?.thumbnail || category?.photo;

    if (!imagePath) {
      return FALLBACK_CATEGORY_IMAGE;
    }

    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }

    if (imagePath.startsWith("/")) {
      return `${imagePath}`;
    }

    return `${imagePath}`;
  };

  const settings = {
    dots: false,
    arrows: false,
    infinite: categories.length > 5,
    speed: 700,
    slidesToShow: 6,
    slidesToScroll: 2,
    autoplay: categories.length > 6,
    autoplaySpeed: 2800,
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (isLoading && !categories.length) {
    return null;
  }

  return (
    <section className="py-40 category-slider-two">
      <div className="container container-lg">
        <div className="border border-gray-100 rounded-24 p-20 p-sm-24 category-slider-two__wrapper">
          <div className="section-heading mb-24">
            <div className="flex-between flex-wrap gap-8">
              <div>
                <h5 className="mb-0">Shop by Category</h5>
                <p className="text-sm text-gray-600 mb-0 mt-6">
                  Pick a category to view all matching products.
                </p>
              </div>

              <div className="category-slider-two__controls d-flex gap-10">
                <button
                  type="button"
                  className="category-slider-two__btn"
                  onClick={() => sliderRef.current?.slickPrev()}
                  aria-label="Previous categories"
                >
                  <i className="ph ph-caret-left" /> Prev
                </button>
                <button
                  type="button"
                  className="category-slider-two__btn"
                  onClick={() => sliderRef.current?.slickNext()}
                  aria-label="Next categories"
                >
                  Next <i className="ph ph-caret-right" />
                </button>
              </div>
            </div>
          </div>

          {categories.length ? (
            <Slider ref={sliderRef} {...settings}>
              {categories.map((category) => (
                <div key={category._id || category.name} className="px-8">
                  <Link
                    to={category?._id ? `/category/${category._id}` : "/shop"}
                    className="d-flex flex-column align-items-center text-center gap-12 py-12 category-slider-two__item"
                  >
                    <span
                      className="d-flex align-items-center justify-content-center overflow-hidden bg-white shadow-sm category-slider-two__circle"
                      style={{
                        width: "118px",
                        height: "118px",
                      }}
                    >
                      <img
                        src={getCategoryImage(category)}
                        alt={category.name}
                        className="w-100 h-100"
                        style={{
                          objectFit: "contain",
                          padding: "14px",
                        }}
                        onError={(e) => {
                          if (e.currentTarget.src !== window.location.origin + FALLBACK_CATEGORY_IMAGE) {
                            e.currentTarget.src = FALLBACK_CATEGORY_IMAGE;
                          }
                        }}
                      />
                    </span>
                    <span className="text-gray-900 fw-semibold text-15 text-line-1 category-slider-two__name">
                      {category.name}
                    </span>
                  </Link>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-gray-500 mb-0">No categories found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategorySliderTwo;