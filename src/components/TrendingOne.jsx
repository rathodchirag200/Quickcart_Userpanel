import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addtocart } from "../redux/thunk/cart.thunk";
import { addtowishlist, removewishlist } from "../redux/thunk/wishlist.thunk";
import { toast } from "react-toastify";

const CATEGORY_TABS = [
  { key: "all", label: "All", value: "all" },
  { key: "mobile", label: "Mobile", value: "Latest Smartphones" },
  { key: "speakers", label: "Speakers", value: "Speakers" },
  { key: "ac", label: "Air Conditioner", value: "Air Conditioner" },
  { key: "laptop", label: "Laptop", value: "Laptops" },
  { key: "tv", label: "Smart TV", value: "Smart TVs" },
];

const TrendingOne = () => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);

  const [activeCategory, setActiveCategory] = useState("all");
  const [loadingProductId, setLoadingProductId] = useState(null);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products?.filter(
        (item) =>
          item.category?.name ===
          CATEGORY_TABS.find((tab) => tab.key === activeCategory)?.value,
      );

  const displayProducts =
    activeCategory === "all" ? filteredProducts?.slice(0, 6) : filteredProducts;

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

  return (
    <section className="trending-productss pt-80">
      <div className="container container-lg">
        <div className="border border-gray-100 p-24 rounded-16 bg-white">
          <div className="section-heading mb-24 pb-16 border-bottom border-gray-100">
            <div className="flex-between flex-wrap gap-8">
              <div>
                <h5 className="mb-6">Trending Products</h5>
                <p className="text-sm text-gray-500 mb-0">
                  Handpicked products customers love right now.
                </p>
              </div>

              <Link
                to="/shop"
                className="text-sm fw-medium text-gray-700 hover-text-main-600 hover-text-decoration-underline"
              >
                View All Products
              </Link>

              <ul className="nav common-tab style-two nav-pills">
                {CATEGORY_TABS.map((tab) => (
                  <li className="nav-item" key={tab.key}>
                    <button
                      className={`nav-link ${activeCategory === tab.key ? "active" : ""}`}
                      onClick={() => setActiveCategory(tab.key)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row g-12">
            {displayProducts?.length === 0 && (
              <div className="col-12">
                <div className="text-center py-48 border border-gray-100 rounded-12 bg-gray-50">
                  <h6 className="mb-6">No products found</h6>
                  <p className="text-gray-600 mb-0">
                    Try another category to view more products.
                  </p>
                </div>
              </div>
            )}

            {displayProducts?.map((item) => {
              const imagePath = item.images?.[0]?.replace(/\\/g, "/");

              return (
                <div
                  className="col-xxl-2 col-xl-3 col-lg-4 col-sm-6"
                  key={item._id}
                >
                  {(() => {
                    const wished = isWished(item._id);

                    return (
                      <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 bg-white d-flex flex-column">
                        <button
                          type="button"
                          onClick={() => handleToggleWishlist(item._id)}
                          className={`w-40 h-40 border rounded-circle flex-center position-absolute z-2 shadow-sm ${wished
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
                          {item.bestseller && (
                            <span className="product-card__badge bg-tertiary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                              Best Seller
                            </span>
                          )}

                          <img
                            src={`${imagePath}`}
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
                              to={`/product/${item._id}`}
                              className="link text-line-2"
                            >
                              {item.name}
                            </Link>
                          </h6>

                          <p className="text-sm text-gray-600 mb-14 text-line-2">
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
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingOne;
