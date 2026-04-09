import { createSlice } from "@reduxjs/toolkit";
import { addreview, editReview, getReviews } from "../thunk/review.thunk";

const Reviewslice = createSlice({
  name: "review",
  initialState: {
    review: null,
    reviews: [],
    summary: {
      averageRating: 0,
      totalReviews: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addreview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addreview.fulfilled, (state, action) => {
        state.loading = false;
        state.review = action.payload.data;
      })
      .addCase(addreview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add review.";
      })
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload?.reviews || action.payload?.data || [];
        state.review = state.reviews;
        state.summary = {
          averageRating: Number(action.payload?.averageRating || 0),
          totalReviews: Number(action.payload?.totalReviews || state.reviews.length || 0),
        };
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch reviews.";
      })
      .addCase(editReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editReview.fulfilled, (state, action) => {
        state.loading = false;
        const updatedReview = action.payload.data;
        const index = state.reviews.findIndex(
          (review) => review.id === updatedReview.id,
        );
        if (index !== -1) {
          state.reviews[index] = updatedReview;
        }
      })
      .addCase(editReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to edit review.";
      });
  },
});

export default Reviewslice.reducer;    
