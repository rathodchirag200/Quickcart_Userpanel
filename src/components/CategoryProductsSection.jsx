import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { paginationproduct } from "../redux/thunk/products.thunk";
import { addtocart } from "../redux/thunk/cart.thunk";
import { addtowishlist, removewishlist } from "../redux/thunk/wishlist.thunk";

const CategoryProductsSection = ({ categoryId, categoryName }) => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.products);
  const pagination = useSelector((state) => state.product.pagination);
  const wishlist = useSelector((state) => state.wishlist.wishlist || []);

  const [page, setPage] = useState(1);
  const [loadingProductId, setLoadingProductId] = useState(null);

  useEffect(() => {
    setPage(1);
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;

    dispatch(
      paginationproduct({
        page,
        limit: 12,
        category: categoryId,
      }),
    );
  }, [dispatch, page, categoryId]);

  const totalPages = useMemo(() => {
    return Math.ceil((pagination?.total || 0) / (pagination?.pageSize || 1));
  }, [pagination]);

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

  return (
    <section className="shop py-80">
      <div className="container container-lg">
        <div className="flex-between gap-16 flex-wrap mb-32">
          <div>
            <h5 className="mb-6">{categoryName || "Category Products"}</h5>
            <p className="text-gray-600 mb-0">
              Showing {products.length} of {pagination?.total || 0} products
            </p>
          </div>

          <Link
            to="/shop"
            className="btn btn-outline-main rounded-pill px-20 py-10"
          >
            View All Categories
          </Link>
        </div>

        <div className="row g-24">
          {products?.length > 0 ? (
            products.map((product) => {
              const wished = isWished(product._id);

              return (
                <div
                  key={product._id}
                  className="col-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2"
                >
                  <div className="product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 bg-white d-flex flex-column">
                    <button
                      type="button"
                      onClick={() => handleToggleWishlist(product._id)}
                      className={`w-40 h-40 border rounded-circle flex-center position-absolute z-2 shadow-sm ${
                        wished
                          ? "border-main-600 bg-main-50 text-main-600"
                          : "border-gray-100 bg-white text-gray-700 hover-bg-main-600 hover-text-white"
                      }`}
                      style={{ top: "10px", right: "10px" }}
                    >
                      <i className={`${wished ? "ph-fill" : "ph"} ph-heart text-lg`} />
                    </button>

                    <Link
                      to={`/product-details/${product._id}`}
                      className="product-card__thumb flex-center rounded-12 bg-gray-50 position-relative overflow-hidden"
                      style={{ minHeight: "180px" }}
                    >
                      {product.bestseller && (
                        <span className="product-card__badge bg-tertiary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                          Best Seller
                        </span>
                      )}

                      <img
                        src={`${product.images?.[0]?.replace(/\\/g, "/")}`}
                        alt={product.name}
                        className="w-100 h-100 object-fit-contain p-14"
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
                          <span className="text-gray-500 fw-normal"> /Qty</span>
                        </span>
                      </div>

                      <button
                        disabled={loadingProductId === product._id}
                        onClick={() => handleAddToCart(product._id)}
                        className="product-card__cart btn bg-gray-50 text-heading hover-bg-main-600 hover-text-white py-11 px-24 rounded-8 flex-center gap-8 fw-medium w-100"
                      >
                        {loadingProductId === product._id ? "Adding..." : "Add To Cart"}{" "}
                        <i className="ph ph-shopping-cart" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-100 py-40 text-center border border-gray-100 rounded-16">
              <h6 className="text-lg mb-8">No product found</h6>
              <p className="text-gray-600 mb-0">
                No products are available in this category right now.
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <ul className="pagination flex-center flex-wrap gap-16 mt-40">
            <li className="page-item">
              <button
                disabled={page === 1}
                className="page-link h-64 w-64 flex-center border border-gray-100"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                <i className="ph-bold ph-arrow-left" />
              </button>
            </li>

            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${page === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link h-64 w-64 flex-center border border-gray-100"
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li className="page-item">
              <button
                disabled={page >= totalPages}
                className="page-link h-64 w-64 flex-center border border-gray-100"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              >
                <i className="ph-bold ph-arrow-right" />
              </button>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
};

export default CategoryProductsSection;
