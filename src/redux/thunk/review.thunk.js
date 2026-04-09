import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const getErrorPayload = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message ||
    fallback
  );
};

const getReviewerName = (review) => {
  return (
    review?.userId?.username ||
    review?.userId?.userName ||
    review?.userId?.name ||
    review?.userId?.fullname ||
    review?.username ||
    review?.userName ||
    review?.name ||
    ""
  );
};

const getReviewerImage = (review) => {
  return (
    review?.userId?.image ||
    review?.userId?.avatar ||
    review?.userId?.profileImage ||
    review?.image ||
    ""
  );
};

const normalizeReviewItem = (review) => ({
  ...review,
  reviewerName: getReviewerName(review),
  reviewerImage: getReviewerImage(review),
});

const normalizeReviewPayload = (payload) => {
  const rawReviews = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  const reviews = rawReviews.map(normalizeReviewItem);

  const ratingFromPayload = Number(
    payload?.averageRating ?? payload?.rating ?? payload?.avgRating,
  );

  const averageFromReviews =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review?.rating || 0), 0) /
        reviews.length
      : 0;

  const averageRating = Number.isFinite(ratingFromPayload)
    ? ratingFromPayload
    : averageFromReviews;

  const totalReviews = Number(
    payload?.totalReviews ?? payload?.count ?? reviews.length,
  ) || 0;

  return {
    ...(payload && typeof payload === "object" && !Array.isArray(payload)
      ? payload
      : {}),
    data: reviews,
    reviews,
    averageRating,
    totalReviews,
  };
};

export const addreview = createAsyncThunk(
  "review/add",
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/review/add`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, "Failed to add review"));
    }
  },
);

export const getReviews = createAsyncThunk(
  "review/get",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`review/product/${productId}`);
      return normalizeReviewPayload(response?.data);
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, "Failed to fetch reviews"));
    }
  },
);

export const editReview = createAsyncThunk(
  "review/edit",
  async ({ reviewId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/review/update/${reviewId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, "Failed to edit review"));
    }
  },
);


