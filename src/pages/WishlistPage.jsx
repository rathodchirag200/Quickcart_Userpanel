import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";
import Preloader from "../helper/Preloader";
import Breadcrumb from "../components/Breadcrumb";
import ShippingTwo from "../components/ShippingTwo";
import { addtocart } from "../redux/thunk/cart.thunk";
import { getwishlist, removewishlist } from "../redux/thunk/wishlist.thunk";
import { toast } from "react-toastify";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist || []);

  const [cartLoadingId, setCartLoadingId] = useState(null);
  const [removeLoadingId, setRemoveLoadingId] = useState(null);

  useEffect(() => {
    dispatch(getwishlist());
  }, [dispatch]);

  const wishlistProducts = useMemo(() => {
    const seen = new Set();

    return wishlist
      .map((item) => item?.productId || item)
      .filter((product) => product && product._id)
      .filter((product) => {
        const key = String(product._id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [wishlist]);

  const handleRemoveWishlist = (productId) => {
    setRemoveLoadingId(productId);

    dispatch(removewishlist({ productId }))
      .unwrap()
      .then(() => {
        toast.success("Removed from wishlist");
        setRemoveLoadingId(null);
      })
      .catch((err) => {
        toast.error(err || "Failed to remove from wishlist");
        setRemoveLoadingId(null);
      });
  };

  const handleAddToCart = (productId) => {
    setCartLoadingId(productId);

    dispatch(addtocart({ productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success("Product added to cart");
        setCartLoadingId(null);
      })
      .catch((err) => {
        toast.error(err || "Failed to add to cart");
        setCartLoadingId(null);
      });
  };

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <Breadcrumb title={"Wishlist"} />

      <section className="py-80">
        <div className="container container-lg">
          {wishlistProducts.length === 0 ? (
            <div className="border border-gray-100 rounded-16 p-40 text-center bg-white">
              <div className="w-64 h-64 rounded-circle bg-main-50 text-main-600 d-inline-flex align-items-center justify-content-center mb-16">
                <i className="ph ph-heart text-2xl" />
              </div>
              <h5 className="mb-10">Your wishlist is empty</h5>
              <p className="text-gray-600 mb-24">
                Save products you love and they will appear here.
              </p>
              <Link to="/shop" className="btn btn-main rounded-8 px-28 py-12">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="row g-12">
              {wishlistProducts.map((item) => {
                const imagePath = item.images?.[0]
                  ? `${item.images[0].replace(/\\/g, "/")}`
                  : "";

                return (
                  <div
                    className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6"
                    key={item._id}
                  >
                    <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 bg-white d-flex flex-column">
                      <button
                        type="button"
                        disabled={removeLoadingId === item._id}
                        onClick={() => handleRemoveWishlist(item._id)}
                        className="w-40 h-40 border border-main-600 rounded-circle bg-main-50 text-main-600 flex-center position-absolute z-2 shadow-sm"
                        style={{ top: "12px", right: "12px" }}
                        aria-label="Remove from wishlist"
                      >
                        <i className="ph-fill ph-heart text-lg" />
                      </button>

                      <Link
                        to={`/product-details/${item._id}`}
                        className="product-card__thumb flex-center rounded-12 bg-gray-50 position-relative overflow-hidden"
                      >
                        {item.bestseller && (
                          <span className="product-card__badge bg-main-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                            Best Seller
                          </span>
                        )}

                        <img
                          src={imagePath}
                          alt={item.name}
                          className="w-100 h-100 object-fit-contain p-12"
                        />
                      </Link>

                      <div className="product-card__content mt-16 d-flex flex-column flex-grow-1">
                        <div className="mb-10">
                          <span className="py-2 px-8 text-xs rounded-pill text-main-two-600 bg-main-two-50 d-inline-flex align-self-start mb-6">
                            {item.category?.name}
                          </span>
                          <div className="text-xs text-gray-500 fw-medium">
                            SKU: {item.sku || "N/A"}
                          </div>
                        </div>

                        <h6 className="title text-lg fw-semibold mb-12 mt-0">
                          <Link
                            to={`/product-details/${item._id}`}
                            className="link text-line-2"
                          >
                            {item.name}
                          </Link>
                        </h6>

                        <p className="text-sm text-gray-600 mb-12 text-line-2">
                          {item.description ||
                            "Premium quality product built for reliable performance and daily value."}
                        </p>

                        <div className="product-card__price mt-auto mb-16 pt-10 border-top border-gray-100">
                          <span className="text-gray-400 text-md fw-semibold text-decoration-line-through">
                            ₹{item.prise}
                          </span>

                          <span className="text-heading text-lg fw-semibold ms-8">
                            ₹{item.offer_prise}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={cartLoadingId === item._id}
                          onClick={() => handleAddToCart(item._id)}
                          className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium w-100"
                        >
                          {cartLoadingId === item._id
                            ? "Adding..."
                            : "Add To Cart"}{" "}
                          <i className="ph ph-shopping-cart" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <ShippingTwo />
    </>
  );
};

export default WishlistPage;
