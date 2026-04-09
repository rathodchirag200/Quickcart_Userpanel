import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { allproducts } from "../redux/thunk/products.thunk";

const FeaturedOne = () => {

  const products = useSelector((state) => state.product.products);


  // Next Arrow
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100`}
      >
        <i className="ph ph-caret-right" />
      </button>
    );
  }

  // Prev Arrow
  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100`}
      >
        <i className="ph ph-caret-left" />
      </button>
    );
  }

  // Slider Settings
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  // Convert products → slides (4 products per slide)
  const chunkProducts = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  };

  const productSlides = chunkProducts(products || [], 4);

  return (
    <section className="featured-products">
      <div className="container container-lg">
        <div className="row g-4 flex-wrap-reverse">

          {/* LEFT PRODUCT SLIDER */}
          <div className="col-xxl-8">
            <div className="border border-gray-100 p-24 rounded-16">

              <div className="section-heading mb-24">
                <div className="flex-between flex-wrap gap-8">
                  <h5 className="mb-0">Featured Products</h5>

                  <Link
                    to="/shop"
                    className="text-sm fw-medium text-gray-700 hover-text-main-600"
                  >
                    View All Deals
                  </Link>
                </div>
              </div>

              <div className="featured-product-slider">

                <Slider {...settings}>

                  {productSlides.map((slide, index) => (
                    <div key={index}>

                      <div className="row gy-4">

                        {slide.map((item) => {
                          const itemRating = Number(
                            item?.averageRating ?? item?.ratings ?? item?.rating ?? 0,
                          );
                          const displayRating = Number.isFinite(itemRating)
                            ? itemRating.toFixed(1)
                            : "0.0";

                          return (
                          <div className="col-md-6" key={item._id}>

                            <div className="product-card d-flex gap-16 p-16 border border-gray-100 rounded-16">

                              <Link
                                to={`/product-details/${item._id}`}
                                className="product-card__thumb flex-center rounded-8 bg-gray-50 p-24 flex-shrink-0"
                              >
                                <img
                                  src={`${item.images?.[0]}`}
                                  alt={item.name}
                                  className="w-auto"
                                />
                              </Link>

                              <div className="product-card__content flex-grow-1">

                                <h6 className="title text-lg fw-semibold mb-12">
                                  <Link
                                    to={`/product-details/${item._id}`}
                                    className="link text-line-2"
                                  >
                                    {item.name}
                                  </Link>
                                </h6>

                                <div className="flex-align gap-6 mb-12">
                                  <span className="text-xs fw-medium text-gray-500">
                                    {displayRating}
                                  </span>
                                  <span className="text-warning-600">
                                    <i className="ph-fill ph-star" />
                                  </span>
                                </div>

                                <div className="product-card__price my-20">

                                  <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                    ${item.prise}
                                  </span>

                                  <span className="text-heading text-md fw-semibold">
                                    ${item.offer_prise}
                                  </span>

                                </div>

                                <Link
                                  to="/cart"
                                  className="product-card__cart btn bg-gray-50 hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium"
                                >
                                  Add To Cart
                                </Link>

                              </div>
                            </div>

                          </div>
                          );
                        })}

                      </div>

                    </div>
                  ))}

                </Slider>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE BANNER */}
          <div className="col-xxl-4">

            <div className="position-relative rounded-16 bg-light-purple overflow-hidden p-28 pb-0 text-center h-100">

              <img
                src="assets/images/bg/featured-product-bg.png"
                alt=""
                className="position-absolute w-100 h-100 cover-img"
              />

              <div className="py-xl-4 text-center">

                <span className="h6 mb-20 text-white">
                  iPhone Smart Phone - Red
                </span>

                <div className="flex-center gap-12 text-white">
                  <span>FROM</span>
                  <h4 className="mb-8 text-white">$890</h4>

                  <span className="badge-style-two bg-main-two-600 text-white text-sm py-2 px-8 rounded-4">
                    20% off
                  </span>
                </div>

                <Link
                  to="/shop"
                  className="mt-16 mb-24 btn btn-main-two fw-medium rounded-pill"
                >
                  Shop Now
                </Link>

              </div>

              <img
                src="assets/images/thumbs/featured-product-img.png"
                alt=""
                className="d-xxl-inline-flex d-none"
              />

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedOne;