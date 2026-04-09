import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { paginationproduct } from "../redux/thunk/products.thunk";
import { addtocart } from "../redux/thunk/cart.thunk";
import { addtowishlist, removewishlist } from "../redux/thunk/wishlist.thunk";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroll-component";


const ShopSection = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const products = useSelector((state) => state.product.products);
  const pagination = useSelector((state) => state.product.pagination);
  const isProductsLoading = useSelector((state) => state.product.loading.getall);
  const categories = useSelector((state) => state.category.categories);
  const wishlist = useSelector((state) => state.wishlist.wishlist || []);

  const [grid, setGrid] = useState(false);
  const [active, setActive] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(null);

  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inputMinPrice, setInputMinPrice] = useState("");
  const [inputMaxPrice, setInputMaxPrice] = useState("");

  const [isLoadMorePending, setIsLoadMorePending] = useState(false);
  const loadMoreTimeoutRef = useRef(null);

  const sidebarController = () => {
    setActive(!active);
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

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");

    if (categoryParam) {
      setSelectedCategories(categoryParam.split(","));
    }

    if (searchParam) {
      setSearch(searchParam);
    }

    if (minPriceParam) {
      setMinPrice(minPriceParam);
      setInputMinPrice(minPriceParam);
    }
    
    if (maxPriceParam) {
      setMaxPrice(maxPriceParam);
      setInputMaxPrice(maxPriceParam);
    }
  }, []);

  /* Fetch Products */

  useEffect(() => {
    const params = {
      page,
      limit: 10,
      category: selectedCategories.join(","),
      search: search,
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    };

    dispatch(paginationproduct(params));
  }, [dispatch, page, selectedCategories, search, minPrice, maxPrice]);

  useEffect(() => {
    const currentParams = {};
    if (selectedCategories.length) currentParams.category = selectedCategories.join(",");
    if (search) currentParams.search = search;
    if (minPrice) currentParams.minPrice = minPrice;
    if (maxPrice) currentParams.maxPrice = maxPrice;
    
    setSearchParams(currentParams);
  }, [selectedCategories, search, minPrice, maxPrice, setSearchParams]);

  useEffect(() => {
    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (loadMoreTimeoutRef.current) {
      clearTimeout(loadMoreTimeoutRef.current);
      loadMoreTimeoutRef.current = null;
      setIsLoadMorePending(false);
    }
  }, [selectedCategories, search, minPrice, maxPrice]);

  /* Category Checkbox */

  const handleCategory = (catId) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }

    setPage(1);
  };

  const hasMoreProducts = products.length < (pagination?.total || 0);

  const handleLoadMore = () => {
    if (!isProductsLoading && hasMoreProducts && !isLoadMorePending) {
      setIsLoadMorePending(true);

      loadMoreTimeoutRef.current = setTimeout(() => {
        setPage((prev) => prev + 1);
        setIsLoadMorePending(false);
        loadMoreTimeoutRef.current = null;
      }, 2000);
    }
  };

  return (
    <section className="shop py-80">
      <div 
        className={`side-overlay ${active && "show"}`}
        onClick={sidebarController}
      ></div>

      <div className="container container-lg">
        <div className="row">
          {/* Sidebar */}

          <div className="col-lg-3">
            <div className={`shop-sidebar ${active && "active"}`}>
              <button
                onClick={sidebarController}
                type="button"
                className="shop-sidebar__close d-lg-none d-flex w-32 h-32 flex-center border border-gray-100 rounded-circle position-absolute inset-inline-end-0 me-10 mt-8"
              >
                <i className="ph ph-x" />
              </button>

              {/* Price Filter */}
              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Filter by Price
                </h6>

                {/* Active price badge */}
                {(minPrice || maxPrice) && (
                  <div className="d-flex align-items-center gap-8 mb-16 py-8 px-12 rounded-8 bg-main-50 border border-main-200">
                    <i className="ph ph-funnel text-main-600" />
                    <span className="text-sm text-main-600 fw-medium">
                      ₹{minPrice || "0"} — ₹{maxPrice || "∞"}
                    </span>
                    <button
                      onClick={() => {
                        setInputMinPrice("");
                        setInputMaxPrice("");
                        setMinPrice("");
                        setMaxPrice("");
                        setPage(1);
                        setActive(false);
                      }}
                      className="ms-auto w-20 h-20 flex-center rounded-circle bg-main-600 text-white border-0"
                      style={{ fontSize: "11px", flexShrink: 0 }}
                    >
                      <i className="ph ph-x" />
                    </button>
                  </div>
                )}

                <div className="mb-16">
                  <label className="text-gray-600 text-sm fw-medium mb-6 d-block">
                    Min Price (₹)
                  </label>
                  <div className="position-relative">
                    <span
                      className="position-absolute text-gray-500 fw-semibold d-flex align-items-center h-100 ps-12"
                      style={{ top: 0, left: 0, pointerEvents: "none" }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      className="form-control border border-gray-100 rounded-8 py-10 w-100"
                      style={{ paddingLeft: "28px" }}
                      placeholder="0"
                      value={inputMinPrice}
                      onChange={(e) => setInputMinPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-24">
                  <label className="text-gray-600 text-sm fw-medium mb-6 d-block">
                    Max Price (₹)
                  </label>
                  <div className="position-relative">
                    <span
                      className="position-absolute text-gray-500 fw-semibold d-flex align-items-center h-100 ps-12"
                      style={{ top: 0, left: 0, pointerEvents: "none" }}
                    >
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      className="form-control border border-gray-100 rounded-8 py-10 w-100"
                      style={{ paddingLeft: "28px" }}
                      placeholder="Any"
                      value={inputMaxPrice}
                      onChange={(e) => setInputMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMinPrice(inputMinPrice);
                    setMaxPrice(inputMaxPrice);
                    setPage(1);
                    setActive(false);
                  }}
                  className="btn bg-main-600 text-white hover-bg-main-700 w-100 py-12 rounded-8 fw-semibold flex-center gap-8"
                >
                  <i className="ph ph-funnel" />
                  Apply Filter
                </button>
              </div>

              {/* Category Filter */}

              <div className="shop-sidebar__box border border-gray-100 rounded-8 p-32 mb-32">
                <h6 className="text-xl border-bottom border-gray-100 pb-24 mb-24">
                  Product Category
                </h6>

                <ul className="max-h-540 overflow-y-auto scroll-sm">
                  {categories?.map((cat) => (
                    <li key={cat._id} className="mb-24">
                      <div className="form-check common-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedCategories.includes(cat._id)}
                          onChange={() => handleCategory(cat._id)}
                        />

                        <label className="form-check-label">{cat.name}</label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Products */}

          <div className="col-lg-9">
            {/* Search Bar */}

            <div className="mb-24 flex gap-10">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-200 rounded-8 px-16 py-10 w-full"
              />
              <button
                onClick={sidebarController}
                type="button"
                className="d-lg-none w-44 h-44 flex-center border border-gray-200 rounded-8 flex-shrink-0"
                title="Toggle Filters"
              >
                <i className="ph ph-funnel text-lg" />
              </button>
            </div>

            <div className="flex-between gap-16 flex-wrap mb-40">
              <span className="text-gray-900">
                Showing {products.length} of {pagination?.total || 0}
              </span>

              <div className="list-grid-btns flex-align gap-16">
                <button
                  onClick={() => setGrid(true)}
                  className={`w-44 h-44 flex-center border rounded-6 ${grid && "border-main-600 text-white bg-main-600"}`}
                >
                  <i className="ph-bold ph-list-dashes" />
                </button>

                <button
                  onClick={() => setGrid(false)}
                  className={`w-44 h-44 flex-center border rounded-6 ${!grid && "border-main-600 text-white bg-main-600"}`}
                >
                  <i className="ph ph-squares-four" />
                </button>
              </div>
            </div>

            {/* Product Cards */}

           <InfiniteScroll
  dataLength={products.length}
  next={handleLoadMore}
  hasMore={hasMoreProducts}
  loader={
    <div className="text-center py-20">
      <span
        className="spinner-border text-main-600"
        role="status"
        aria-label="Loading more products"
      />
    </div>
  }
>

<div
  className={`list-grid-wrapper ${grid && "list-view"} ${
    products?.length === 1 ? "flex justify-center" : ""
  }`}
>
              {products?.length > 0 ? (
                products?.map((product) => (
                (() => {
                  const wished = isWished(product._id);

                  return (
                    <div
                      key={product._id}
                      className={`product-card h-100 p-16 border border-gray-100 hover-border-main-600 rounded-16 position-relative transition-2 bg-white d-flex flex-column ${
                        products?.length === 1 ? "max-w-[320px]" : ""
                      }`}
                    >
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
                          <span className="product-card__badge bg-tertiary-600 px-8 py-4 text-sm text-white position-absolute inset-inline-start-0 inset-block-start-0">
                            Best Seller
                          </span>
                        )}

                        <img
                          src={`${product.images?.[0]?.replace(/\\/g, "/")}`}
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
                            <span className="text-gray-500 fw-normal"> /Qty</span>
                          </span>
                        </div>

                        <button
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
                  );
                })()
                ))
              ) : (
                <div className="w-100 py-40 text-center border border-gray-100 rounded-16">
                  <h6 className="text-lg mb-8">No product found</h6>
                  <p className="text-gray-600 mb-0">
                    Try changing search text or category filters.
                  </p>
                </div>
              )}
            </div>

            </InfiniteScroll>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;
