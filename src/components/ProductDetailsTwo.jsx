import React, { useEffect, useState } from "react";
import { useParams , useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useDispatch, useSelector } from "react-redux";
import { singleproduct } from "../redux/thunk/products.thunk";
import { addtowishlist, removewishlist } from "../redux/thunk/wishlist.thunk";
import { toast } from "react-toastify";
import { addtocart } from "../redux/thunk/cart.thunk";
import { getReviews } from "../redux/thunk/review.thunk";


const ProductDetailsTwo = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const product = useSelector((state) => state.product.single);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [productReviews, setProductReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    dispatch(singleproduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!id) return;

    const fetchProductReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await dispatch(getReviews({ productId: id })).unwrap();
        const reviews = Array.isArray(response?.reviews)
          ? response.reviews
          : Array.isArray(response?.data)
            ? response.data
            : [];

        setProductReviews(reviews);
        setAverageRating(Number(response?.averageRating || 0));
        setTotalReviews(Number(response?.totalReviews || reviews.length || 0));
      } catch (error) {
        setProductReviews([]);
        setAverageRating(0);
        setTotalReviews(0);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProductReviews();
  }, [dispatch, id]);

    const handleAddToCart = (productId) => {
  
      dispatch(addtocart({ productId, quantity: 1 }))
        .unwrap()
        .then(() => {
          toast.success("Product added to cart");
        })
        .catch((err) => {
          toast.error(err || "Failed to add to cart");
        });
    };

    const handleBuyNow = (productId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login to access this feature");
    navigate("/login");
    return;
  }

  dispatch(addtocart({ productId, quantity }))
    .unwrap()
    .then(() => {
      navigate("/checkout");
    })
    .catch(() => {
      toast.error("Failed to process order");
    });
};

  const productImages = product?.images
    ? product.images.map(
        (img) => `${img.replace(/\\/g, "/")}`,
      )
    : [];

  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    if (productImages.length > 0) {
      setMainImage(productImages[0]);
    }
  }, [product]);

  const settingsThumbs = {
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () =>
    setQuantity(quantity > 1 ? quantity - 1 : quantity);

  const wishlist = useSelector((state) => state.wishlist.wishlist || []);

  const isWished = (productId) => {
    return wishlist.some(
      (item) =>
        item?.productId === productId || item?.productId?._id === productId,
    );
  };

  const isWishlisted = isWished(product?._id);

  const formattedRating = Number(averageRating || 0).toFixed(1);
  const roundedRating = Math.round(Number(averageRating || 0));
  const effectiveTotalReviews = Number(totalReviews || productReviews.length || 0);

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = productReviews.filter(
      (review) => Math.round(Number(review?.rating || 0)) === star,
    ).length;
    const percent = effectiveTotalReviews
      ? Math.round((count / effectiveTotalReviews) * 100)
      : 0;

    return { star, count, percent };
  });

  const getReviewUserName = (review) => {
    return (
      review?.reviewerName ||
      review?.userId?.username ||
      review?.userId?.userName ||
      review?.userId?.name ||
      review?.userId?.fullname ||
      review?.username ||
      review?.userName ||
      review?.name ||
      "User"
    );
  };

  const getReviewUserImage = (review) => {
    return normalizeImageUrl(
      review?.reviewerImage ||
      review?.userId?.image ||
      review?.userId?.avatar ||
      review?.userId?.profileImage ||
      "",
    );
  };

  const getInitials = (name) => {
    const normalized = String(name || "Customer Name").trim();
    const chunks = normalized.split(/\s+/).filter(Boolean);
    if (chunks.length === 0) return "CU";
    if (chunks.length === 1) return chunks[0].slice(0, 2).toUpperCase();
    return `${chunks[0].charAt(0)}${chunks[1].charAt(0)}`.toUpperCase();
  };

  const normalizeImageUrl = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    return `${raw.replace(/^\/+/, "").replace(/\\/g, "/")}`;
  };

  const handleToggleWishlist = (productId) => {
    setWishlistLoading(true);

    const wished = isWished(productId);

    if (wished) {
      dispatch(removewishlist({ productId }))
        .unwrap()
        .then(() => toast.success("Removed from wishlist"))
        .catch(() => toast.error("Failed to remove wishlist"))
        .finally(() => setWishlistLoading(false));
    } else {
      dispatch(addtowishlist({ productId }))
        .unwrap()
        .then(() => toast.success("Added to wishlist"))
        .catch(() => toast.error("Failed to add wishlist"))
        .finally(() => setWishlistLoading(false));
    }
  };

  if (!product) {
    return <h2 className="text-center py-80">Loading product...</h2>;
  }

  return (
    <section className="product-details py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-lg-6">
            <div className="border border-gray-100 rounded-16 p-20">
              <div
                className="flex-center border border-gray-100 rounded-12 mb-20"
                style={{ height: "420px", overflow: "hidden" }}
              >
                <img
                  src={mainImage}
                  alt={product?.name}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <Slider {...settingsThumbs}>
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className="p-6"
                    onClick={() => setMainImage(image)}
                  >
                    <div className="border border-gray-100 rounded-12 p-8 flex-center">
                      <img
                        src={image}
                        alt=""
                        style={{
                          height: "70px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="product-details__content">
              <h2 className="fw-semibold mb-8">{product?.name}</h2>

              <div className="flex-align gap-6 mb-14">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`${star <= roundedRating ? "ph-fill text-warning" : "ph text-gray-300"} ph-star`}
                  ></i>
                ))}

                <span className="text-sm text-gray-600 ms-8">{formattedRating}</span>
                <span className="text-sm text-gray-500">({totalReviews} Reviews)</span>
              </div>

              <div className="mb-8 text-gray-600">
                Category :
                <span className="fw-medium ms-1">
                  {product?.category?.name}
                </span>
              </div>

              <div className="mb-8 text-gray-600">
                SKU :<span className="fw-medium ms-1">{product?.sku}</span>
              </div>

              <div className="mb-20 text-gray-600">
                Brand :
                <span className="fw-medium ms-1">{product?.compny_name}</span>
              </div>

              <div className="flex-align gap-16 mb-20">
                <h3 className="text-main-600 mb-0">₹{product?.offer_prise}</h3>

                <span className="text-gray-400">
                  <del>₹{product?.prise}</del>
                </span>
              </div>

              <p className="text-gray-700 mb-24">{product?.description}</p>

              <div className="flex-align gap-12 flex-wrap">
                <button 
                onClick={() => handleAddToCart(product._id)}
                className="btn btn-main px-28 py-12">
                  Add To Cart
                </button>

                <button 
                 onClick={() => handleBuyNow(product._id)}
                className="btn btn-outline-main px-28 py-12">
                  Buy Now
                </button>

                <button
                  type="button"
                  disabled={wishlistLoading}
                  onClick={() => handleToggleWishlist(product._id)}
                  className={`flex-center border rounded-8 ${
                    isWishlisted
                      ? "border-main-600 bg-main-50 text-main-600"
                      : "border-gray-200"
                  }`}
                  style={{
                    width: "48px",
                    height: "44px",
                    background: isWishlisted ? "" : "#fff",
                  }}
                >
                  <i
                    className={`${isWishlisted ? "ph-fill" : "ph"} ph-heart text-xl`}
                  ></i>
                </button>
              </div>

              <div className="mt-32">
                <span className="fw-medium text-gray-900">
                  100% Guarantee Safe Checkout
                </span>

                <div className="mt-10 flex-align gap-12 flex-wrap">
                  <img src="/assets/images/thumbs/payment-method.png" alt="" />

                  <div className="flex-align gap-6 border border-gray-200 rounded-6 px-10 py-4">
                    <i className="ph ph-lock"></i>
                    Secure Payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-48">
          <div className="border border-gray-200 rounded-16 p-20 p-sm-24 bg-white">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-12 mb-20">
              <div>
                <h4 className="mb-6">Customer Reviews</h4>
                <p className="text-sm text-gray-600 mb-0">
                  Verified customer feedback and ratings
                </p>
              </div>
              <div className="d-flex align-items-center gap-8 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-pill px-12 py-6">
                <span className="fw-semibold text-gray-900">{formattedRating}</span>
                <div className="d-flex align-items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={`header-review-star-${star}`}
                      className={`${star <= roundedRating ? "ph-fill text-warning" : "ph text-gray-300"} ph-star text-sm`}
                    ></i>
                  ))}
                </div>
                <span>({effectiveTotalReviews})</span>
              </div>
            </div>

            <div className="row g-3 mb-20">
              <div className="col-lg-4">
                <div className="h-100 border border-gray-200 rounded-12 p-16 d-flex flex-column align-items-center justify-content-center bg-gray-50">
                  <h2 className="mb-4" style={{ fontSize: "2.2rem", lineHeight: 1 }}>
                    {formattedRating}
                  </h2>
                  <div className="d-flex align-items-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={`summary-star-${star}`}
                        className={`${star <= roundedRating ? "ph-fill text-warning" : "ph text-gray-300"} ph-star`}
                      ></i>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-0">
                    Based on {effectiveTotalReviews} review{effectiveTotalReviews === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="h-100 border border-gray-200 rounded-12 p-16">
                  {ratingDistribution.map((item) => (
                    <div key={`dist-${item.star}`} className="d-flex align-items-center gap-10 mb-10">
                      <span className="text-sm text-gray-700" style={{ minWidth: "56px" }}>
                        {item.star} Star
                      </span>
                      <div className="flex-grow-1 bg-gray-100 rounded-pill overflow-hidden" style={{ height: "8px" }}>
                        <div
                          className="bg-main-600 rounded-pill"
                          style={{ width: `${item.percent}%`, height: "100%", transition: "width 0.3s ease" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600" style={{ minWidth: "22px", textAlign: "right" }}>
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="text-gray-600">Loading reviews...</div>
            ) : productReviews.length === 0 ? (
              <div className="rounded-12 border border-dashed border-gray-300 bg-gray-50 p-20 text-center text-gray-600">
                No reviews yet for this product.
              </div>
            ) : (
              <div className="d-grid gap-10">
                {productReviews.map((review) => {
                  const reviewImages = Array.isArray(review?.images) ? review.images : [];
                  const reviewRating = Number(review?.rating || 0);
                  const reviewerName = getReviewUserName(review);
                  const reviewerImage = getReviewUserImage(review);

                  return (
                    <div
                      key={review?._id || `${review?.userId || "user"}-${review?.createdAt || "time"}`}
                      className="border border-gray-200 rounded-12 p-14 bg-white"
                    >
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-8 mb-10">
                        <div className="d-flex align-items-center gap-10">
                          {reviewerImage ? (
                            <img
                              src={reviewerImage}
                              alt={reviewerName}
                              className="rounded-circle border border-gray-200"
                              style={{ width: "40px", height: "40px", objectFit: "cover" }}
                            />
                          ) : (
                            <div
                              className="rounded-circle border border-gray-200 bg-main-50 text-main-600 fw-semibold d-flex align-items-center justify-content-center"
                              style={{ width: "40px", height: "40px", fontSize: "11px" }}
                            >
                              {getInitials(reviewerName)}
                            </div>
                          )}

                          <div>
                            <h6 className="mb-2 fw-semibold">{reviewerName}</h6>
                            <p className="text-xs text-gray-500 mb-0">
                              {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex-align gap-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`${star <= reviewRating ? "ph-fill text-warning" : "ph text-gray-300"} ph-star`}
                            ></i>
                          ))}
                        </div>
                      </div>

                      {review?.title ? (
                        <p className="fw-medium text-gray-900 mb-6">{review.title}</p>
                      ) : null}

                      <p className="text-gray-700 mb-0">
                        {review?.comment || ""}
                      </p>

                      {reviewImages.length > 0 ? (
                        <div className="d-flex gap-8 flex-wrap mt-10">
                          {reviewImages.map((img, index) => (
                            <img
                              key={`${review?._id || "review"}-img-${index}`}
                              src={normalizeImageUrl(img)}
                              alt={`Review ${index + 1}`}
                              className="rounded-8 border border-gray-200"
                              style={{ width: "58px", height: "58px", objectFit: "cover" }}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsTwo;
