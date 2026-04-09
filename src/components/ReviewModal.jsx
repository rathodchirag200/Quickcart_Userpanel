import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addreview, editReview, getReviews } from "../redux/thunk/review.thunk";
import { toast } from "react-toastify";

const ReviewModal = ({
  isOpen,
  onClose,
  orderId,
  productId,
  productName,
  onSubmitSuccess,
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.user);

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [reviewImageFile, setReviewImageFile] = useState(null);
  const [reviewImagePreview, setReviewImagePreview] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [initialExistingImages, setInitialExistingImages] = useState([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState(null);

  const currentUserId = String(
    currentUser?._id || currentUser?.id || currentUser?.user?._id || "",
  );

  const getImageReference = (value) => {
    if (typeof value === "string") {
      return value.trim();
    }

    if (value && typeof value === "object") {
      const candidates = [
        value.url,
        value.path,
        value.src,
        value.secure_url,
        value.image,
        value.location,
        value.public_id,
        value._id,
        value.id,
      ];

      const firstValid = candidates.find(
        (item) => typeof item === "string" && item.trim(),
      );
      return firstValid ? firstValid.trim() : "";
    }

    return "";
  };

  const normalizeImageUrl = (value) => {
    const raw = getImageReference(value);
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    return `${raw.replace(/^\/+/, "").replace(/\\/g, "/")}`;
  };

  const toServerImagePath = (value) => {
    const raw = getImageReference(value);
    if (!raw) return "";

    if (/^https?:\/\//i.test(raw)) {
      try {
        const parsed = new URL(raw);
        return parsed.pathname.replace(/^\/+/, "");
      } catch {
        return raw;
      }
    }

    return raw.replace(/^\/+/, "").replace(/\\/g, "/");
  };

  useEffect(() => {
    if (isOpen && productId) {
      const fetchReview = async () => {
        try {
          const response = await dispatch(getReviews({ productId })).unwrap();
          const reviewList = Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          const matching = reviewList.find((review) => {
            const reviewOrderId = String(
              review?.orderId?._id || review?.orderId || "",
            );
            const reviewProductId = String(
              review?.productId?._id || review?.productId || "",
            );
            const reviewUserId = String(
              review?.userId?._id || review?.userId || "",
            );
            const sameUser = currentUserId
              ? reviewUserId === currentUserId
              : true;

            return (
              reviewOrderId === String(orderId || "") &&
              reviewProductId === String(productId || "") &&
              sameUser
            );
          });

          if (matching) {
            setExistingReview(matching);
            setReviewForm({
              rating: Number(matching?.rating || 5),
              title: matching?.title || "",
              comment: matching?.comment || "",
            });
            setExistingImages(
              Array.isArray(matching?.images) ? matching.images : [],
            );
            setInitialExistingImages(
              Array.isArray(matching?.images) ? matching.images : [],
            );
            setReviewImageFile(null);
            setReviewImagePreview("");
          } else {
            setExistingReview(null);
            setReviewForm({ rating: 5, title: "", comment: "" });
            setExistingImages([]);
            setInitialExistingImages([]);
            setReviewImageFile(null);
            setReviewImagePreview("");
          }
        } catch (error) {
          // Silent fail; user can still add new review
          setExistingReview(null);
          setReviewForm({ rating: 5, title: "", comment: "" });
          setExistingImages([]);
          setInitialExistingImages([]);
          setReviewImageFile(null);
          setReviewImagePreview("");
        }
      };

      fetchReview();
    }
  }, [isOpen, productId, orderId, currentUserId, dispatch]);

  useEffect(() => {
    return () => {
      if (reviewImagePreview) {
        URL.revokeObjectURL(reviewImagePreview);
      }
    };
  }, [reviewImagePreview]);

  const handleReviewImageChange = (event) => {
    const file = event.target.files?.[0] || null;
    setReviewImageFile(file);

    if (reviewImagePreview) {
      URL.revokeObjectURL(reviewImagePreview);
    }

    if (file) {
      const preview = URL.createObjectURL(file);
      setReviewImagePreview(preview);
    } else {
      setReviewImagePreview("");
    }
  };

  const removeSelectedImage = () => {
    if (reviewImagePreview) {
      URL.revokeObjectURL(reviewImagePreview);
    }
    setReviewImageFile(null);
    setReviewImagePreview("");
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!orderId || !productId || !currentUserId) {
      toast.error("Order, product, or user id is missing.");
      return;
    }

    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast.error("Please fill title and comment.");
      return;
    }

    try {
      setReviewSubmitting(true);

      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("productId", productId);
      formData.append("userId", currentUserId);
      formData.append("rating", String(reviewForm.rating));
      formData.append("title", reviewForm.title.trim());
      formData.append("comment", reviewForm.comment.trim());

      if (existingReview?._id) {
        const unique = (arr) => [...new Set(arr.filter(Boolean))];

        const keptImageRefs = unique(existingImages.map(getImageReference));
        const initialImageRefs = unique(
          initialExistingImages.map(getImageReference),
        );
        const removedImageRefs = initialImageRefs.filter(
          (ref) => !keptImageRefs.includes(ref),
        );

        const keptImagePaths = unique(existingImages.map(toServerImagePath));
        const initialImagePaths = unique(
          initialExistingImages.map(toServerImagePath),
        );
        const removedImagePaths = initialImagePaths.filter(
          (ref) => !keptImagePaths.includes(ref),
        );

        // Keep compatibility with common backend payload keys.
        formData.append("existingImagesRaw", JSON.stringify(existingImages));
        formData.append("existingImages", JSON.stringify(keptImageRefs));
        formData.append("existingImageRefs", JSON.stringify(keptImageRefs));
        formData.append("existingImagePaths", JSON.stringify(keptImagePaths));
        formData.append("keptImages", JSON.stringify(keptImageRefs));
        formData.append("removeImages", JSON.stringify(removedImageRefs));
        formData.append("removedImages", JSON.stringify(removedImageRefs));
        formData.append("deletedImages", JSON.stringify(removedImageRefs));

        removedImageRefs.forEach((imageRef) => {
          formData.append("removeImages[]", imageRef);
          formData.append("removedImages[]", imageRef);
          formData.append("deletedImages[]", imageRef);
        });

        removedImagePaths.forEach((imagePath) => {
          formData.append("removeImagePaths[]", imagePath);
          formData.append("deletedImagePaths[]", imagePath);
        });
      }

      if (reviewImageFile) {
        formData.append("images", reviewImageFile);
      }

      let response;
      if (existingReview?._id) {
        response = await dispatch(
          editReview({
            reviewId: existingReview._id,
            data: formData,
          }),
        ).unwrap();
        toast.success("Review updated successfully");
      } else {
        response = await dispatch(addreview({ data: formData })).unwrap();
        toast.success("Review submitted successfully");
      }

      if (onSubmitSuccess) {
        onSubmitSuccess(response?.data || {});
      }

      setReviewForm({ rating: 5, title: "", comment: "" });
      setReviewImageFile(null);
      setReviewImagePreview("");
      setExistingImages([]);
      setInitialExistingImages([]);
      setExistingReview(null);
      onClose();
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to submit review",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        background: "rgba(0, 0, 0, 0.45)",
        zIndex: 9999,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-16 border border-gray-200 w-100"
        style={{ maxWidth: "760px", maxHeight: "92vh", overflowY: "auto" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between border-bottom border-gray-200 p-20 p-sm-24">
          <h4 className="mb-20">
            {existingReview ? "Edit Review" : "Write a Review"}
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border-0 text-2xl text-gray-500"
            aria-label="Close"
          >
            <i className="ph ph-x" />
          </button>
        </div>

        <form onSubmit={handleReviewSubmit} className="p-20 p-sm-24">
          <p className="text-gray-600 mb-20 text-sm">Product: {productName}</p>

          <div className="mb-20">
            <label className="mb-10 fw-medium d-block">Rating *</label>
            <div className="d-flex align-items-center gap-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setReviewForm((prev) => ({ ...prev, rating: star }))
                  }
                  className="bg-transparent border-0 p-0"
                  aria-label={`Rate ${star} star`}
                >
                  <i
                    className={`${reviewForm.rating >= star ? "ph-fill" : "ph"} ph-star text-2xl`}
                    style={{
                      color: reviewForm.rating >= star ? "#fbbf24" : "#d1d5db",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-20">
            <label htmlFor="reviewTitle" className="mb-8 d-block fw-medium">
              Review Title *
            </label>
            <input
              id="reviewTitle"
              type="text"
              className="common-input rounded-8"
              placeholder="Give your review a title"
              value={reviewForm.title}
              onChange={(event) =>
                setReviewForm((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="mb-20">
            <label htmlFor="reviewComment" className="mb-8 d-block fw-medium">
              Review Comment *
            </label>
            <textarea
              id="reviewComment"
              className="common-input rounded-8"
              placeholder="Write your comment here"
              rows={5}
              value={reviewForm.comment}
              onChange={(event) =>
                setReviewForm((prev) => ({
                  ...prev,
                  comment: event.target.value,
                }))
              }
              required
            />
          </div>

          <div className="mb-24">
            <label htmlFor="reviewImage" className="mb-8 d-block fw-medium">
              Add Image (Optional)
            </label>
            <input
              id="reviewImage"
              type="file"
              accept="image/*"
              className="common-input rounded-8"
              onChange={handleReviewImageChange}
            />

            {reviewImagePreview && (
              <div className="mt-12 position-relative d-inline-block">
                <img
                  src={reviewImagePreview}
                  alt="Selected review"
                  className="rounded-8 border border-gray-200"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  onClick={removeSelectedImage}
                  className="position-absolute top-0 end-0 border-0 rounded-circle bg-danger-600 text-white d-flex align-items-center justify-content-center"
                  style={{
                    width: "24px",
                    height: "24px",
                    transform: "translate(30%, -30%)",
                  }}
                  aria-label="Remove selected image"
                >
                  <i className="ph ph-x text-sm" />
                </button>
              </div>
            )}

            {!reviewImagePreview &&
              existingReview &&
              existingImages.length > 0 && (
                <div className="mt-12 d-flex gap-10 flex-wrap">
                  {existingImages.map((img, idx) => {
                    const imageUrl = normalizeImageUrl(img);
                    if (!imageUrl) return null;

                    return (
                      <div
                        key={`${imageUrl}-${idx}`}
                        className="position-relative d-inline-block"
                      >
                        <img
                          src={imageUrl}
                          alt={`Existing review ${idx + 1}`}
                          className="rounded-8 border border-gray-200"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="position-absolute top-0 end-0 border-0 rounded-circle bg-danger-600 text-white d-flex align-items-center justify-content-center"
                          style={{
                            width: "22px",
                            height: "22px",
                            transform: "translate(30%, -30%)",
                          }}
                          aria-label="Remove existing image"
                        >
                          <i className="ph ph-x text-sm" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>

          <div className="d-flex gap-12 justify-content-end flex-wrap">
            <button
              type="submit"
              className="btn btn-main rounded-8 py-10 px-22"
              disabled={reviewSubmitting}
            >
              {reviewSubmitting
                ? "Submitting..."
                : existingReview
                  ? "Update"
                  : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline-main rounded-8 py-10 px-22"
              disabled={reviewSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
