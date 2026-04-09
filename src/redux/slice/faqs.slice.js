import { createSlice } from "@reduxjs/toolkit";
import { getfaqs } from "../thunk/faqs.thunk";

const Faqslice = createSlice({
  name: "faqs",
  initialState: {
    faqs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getfaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getfaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload.data;
      })
      .addCase(getfaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export default Faqslice.reducer;