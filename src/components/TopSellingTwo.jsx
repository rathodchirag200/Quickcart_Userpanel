import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { toast } from "react-toastify";
import { addtocart } from "../redux/thunk/cart.thunk";
import { addtowishlist, removewishlist } from "../redux/thunk/wishlist.thunk";

const TopSellingTwo = () => {
  const dispatch = useDispatch();
  const [loadingProductId, setLoadingProductId] = useState(null);

  const products = useSelector((state) => state.product.products);
  const wishlist = useSelector((state) => state.wishlist.wishlist || []);

  const isWished = (productId) => {
    return wishlist.some(
      (item) =>
        item?.productId === productId || item?.productId?._id === productId,
    );
  };

  const handleAddToCart = (productId) => {
    setLoadingProductId(productId);
    dispatch(addtocart({ productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success("Product added to cart");
        setLoadingProductId(null);
      })
      .catch((err) => {
        toast.error(err || "Failed to add to cart");
        setLoadingProductId(null);
      });
  };

  const handleToggleWishlist = (productId) => {
    const wished = isWished(productId);
    if (wished) {
      dispatch(removewishlist({ productId }))
        .unwrap()
        .then(() => toast.success("Removed from wishlist"))
        .catch(() => toast.error("Failed to remove wishlist"));
    } else {
      dispatch(addtowishlist({ productId }))
        .unwrap()
        .then(() => toast.success("Added to wishlist"))
        .catch(() => toast.error("Failed to add wishlist"));
    }
  };

  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={` ${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}
      >
        <i className="ph ph-caret-right" />
      </button>
    );
  }

  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-neutral-600 text-xl hover-bg-neutral-600 hover-text-white transition-1`}
      >
        <i className="ph ph-caret-left" />
      </button>
    );
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="recommended py-80">
      <div className="container container-lg">
        <div className="row g-12">
          <div className="col-xxl-4">
            <div className="position-relative rounded-16 bg-light-purple overflow-hidden p-28 z-1 text-center h-100">
              <img
                src="assets/images/bg/recommended-bg.png"
                alt=""
                className="position-absolute inset-block-start-0 inset-inline-start-0 z-n1 w-100 h-100 cover-img"
              />
              <div className="py-xl-4 text-center">
                <span className="h6 mb-20 text-white">
                  Insta360 GO 3S Action Camera - White
                </span>
                <div className="flex-center gap-12 text-white">
                  <span className="">FROM</span>
                  <h4 className="mb-8 text-white">$430</h4>
                  <span className="badge-style-two position-relative me-8 bg-main-two-600 text-white text-sm py-2 px-8 rounded-4">
                    20% off
                  </span>
                </div>
              </div>
              <img
                src="assets/images/thumbs/recommended-img.png"
                alt=""
                className="mt-48 d-xxl-block d-none"
              />
            </div>
          </div>
          <div className="col-xxl-8">
            <div className="border border-gray-100 p-24 rounded-16 h-100">
              <div className="section-heading mb-24">
                <div className="flex-between flex-wrap gap-8">
                  <h5 className="mb-0">Recommended For You</h5>
                  <div className="flex-align mr-point gap-16">
                    <Link
                      to="/shop"
                      className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              </div>
              <div className="recommended-slider arrow-style-two">
                <Slider {...settings}>
                  {products?.map((item) => {
                    const wished = isWished(item._id);
                    return (
                      <div key={item._id}>
                        <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 bg-white d-flex flex-column">
                          <button
                            type="button"
                            onClick={() => handleToggleWishlist(item._id)}
                            className={`w-40 h-40 border rounded-circle flex-center position-absolute z-2 shadow-sm ${
                              wished
                                ? "border-main-600 bg-main-50 text-main-600"
                                : "border-gray-100 bg-white text-gray-700 hover-bg-main-600 hover-text-white"
                            }`}
                            style={{ top: "12px", right: "12px" }}
                          >
                            <i
                              className={`${wished ? "ph-fill" : "ph"} ph-heart text-lg`}
                            />
                          </button>

                          <Link
                            to={`/product-details/${item._id}`}
                            className="product-card__thumb flex-center rounded-12 bg-gray-50 position-relative overflow-hidden"
                          >
                            <span className="product-card__badge bg-warning-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                              New
                            </span>

                            <img
                              src={`${item.images?.[0]?.replace(/\\/g, "/")}`}
                              alt={item.name}
                              className="w-100 h-100 object-fit-contain p-12"
                              style={{ height: "160px" }}
                            />
                          </Link>

                          <div className="product-card__content mt-16 d-flex flex-column flex-grow-1">
                            <div className="mb-10">
                              <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 d-inline-flex align-self-start mb-6">
                                {item.category?.name || "Category"}
                              </span>
                            </div>

                            <h6 className="title text-lg fw-semibold mt-12 mb-8">
                              <Link
                                to={`/product-details/${item._id}`}
                                className="link text-line-2"
                              >
                                {item.name}
                              </Link>
                            </h6>

                            <div className="product-card__price mt-auto mb-16 pt-10 border-top border-gray-100">
                              <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                                ₹{item.prise}
                              </span>

                              <span className="text-heading text-lg fw-semibold ms-8">
                                ₹{item.offer_prise}
                                <span className="text-gray-500 fw-normal">
                                  {" "}
                                  /Qty
                                </span>
                              </span>
                            </div>

                            <button
                              disabled={loadingProductId === item._id}
                              onClick={() => handleAddToCart(item._id)}
                              className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium w-100"
                            >
                              {loadingProductId === item._id
                                ? "Adding..."
                                : "Add To Cart"}{" "}
                              <i className="ph ph-shopping-cart" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellingTwo;

