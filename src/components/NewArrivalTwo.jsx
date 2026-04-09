import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { addtocart } from "../redux/thunk/cart.thunk";
import { addtowishlist, removewishlist } from "../redux/thunk/wishlist.thunk";
import { toast } from "react-toastify";

const NewArrivalTwo = () => {
  const dispatch = useDispatch();
  const [loadingProductId, setLoadingProductId] = React.useState(null);
  const products = useSelector((state) => state.product.products);


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

 const wishlist = useSelector((state) => state.wishlist.wishlist || []);

  const isWished = (productId) => {
    return wishlist.some(
      (item) =>
        item?.productId === productId || item?.productId?._id === productId,
    );
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
        className={` ${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
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
        className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-600 text-xl hover-bg-main-600 hover-text-white transition-1`}
      >
        <i className="ph ph-caret-left" />
      </button>
    );
  }
  const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 1100,
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
    <section className="new-arrival pb-80">
      <div className="container container-lg">
        <div className="section-heading">
          <div className="flex-between flex-wrap gap-8">
            <h5 className="mb-0">You Might Also Like</h5>
            <div className="flex-align mr-point gap-16">
              <Link
                to="/shop"
                className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
              >
                All Products
              </Link>
            </div>
          </div>
        </div>
        <div className="new-arrival__slider arrow-style-two">
          <Slider {...settings}>
            {products?.slice(8, 16).map((product) => {
              const image = product?.images?.[0]
                ? `${product.images[0].replace(/\\/g, "/")}`
                : "";
              const wished = isWished(product._id);

              return (
                <div key={product._id}>
                  <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 bg-white d-flex flex-column">
                    <button
                        type="button"
                        onClick={() => handleToggleWishlist(product._id)}
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
                      to={`/product-details/${product._id}`}
                      className="product-card__thumb flex-center rounded-12 bg-gray-50 position-relative overflow-hidden"
                    >
                      {product.bestseller && (
                        <span className="product-card__badge bg-main-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                          Best Seller
                        </span>
                      )}

                      <img
                        src={image}
                        alt={product.name}
                        className="w-100 h-100 object-fit-contain p-12"
                      />
                    </Link>

                    <div className="product-card__content mt-16 d-flex flex-column flex-grow-1">
                      <div className="mb-10">
                        <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 d-inline-flex align-self-start mb-6">
                          {product.category?.name}
                        </span>
                        <div className="text-xs text-gray-500 fw-medium">
                          SKU: {product.sku || "N/A"}
                        </div>
                      </div>

                      <h6 className="title text-lg fw-semibold mb-12 mt-0">
                        <Link
                          to={`/product-details/${product._id}`}
                          className="link text-line-2"
                        >
                          {product.name}
                        </Link>
                      </h6>

                      <p className="text-sm text-gray-600 mb-12 text-line-2">
                        {product.description ||
                          "Premium quality product built for reliable performance and daily value."}
                      </p>

                      <div className="product-card__price mt-auto mb-16 pt-10 border-top border-gray-100">
                        <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                          ₹{product.prise}
                        </span>

                        <span className="text-heading text-lg fw-semibold ms-8">
                          ₹{product.offer_prise}
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={loadingProductId === product._id}
                        onClick={() => handleAddToCart(product._id)}
                        className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium w-100"
                      >
                        {loadingProductId === product._id
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
    </section>
  );
};

export default NewArrivalTwo;
