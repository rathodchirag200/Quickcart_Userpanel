import { createSlice } from "@reduxjs/toolkit";
import { addquery, deletequery, getqueries } from "../thunk/contact.thunk";

const Contactslice = createSlice({
  name: "contact",
  initialState: {
    queries: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addquery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addquery.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.queries.push(action.payload.data);
        }
      })
      .addCase(addquery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getqueries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getqueries.fulfilled, (state, action) => {
        state.loading = false;
        state.queries = action.payload.data;
      })
      .addCase(getqueries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletequery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletequery.fulfilled, (state, action) => {
        state.loading = false;
        state.queries = state.queries.filter(
          (query) => query._id !== action.payload.data._id,
        );
      })
      .addCase(deletequery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default Contactslice.reducer;