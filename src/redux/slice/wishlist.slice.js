import { createSlice } from "@reduxjs/toolkit";
import {
  addtowishlist,
  getwishlist,
  removewishlist,
} from "../thunk/wishlist.thunk";

const Wishlistslice = createSlice({
  name: "wishlist",

  initialState: {
    wishlist: [],
    loading: {
      add: false,
      get: false,
      remove: false,
    },
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(addtowishlist.pending, (state) => {
        state.loading.add = true;
        state.error = null;
      })
      .addCase(addtowishlist.fulfilled, (state, action) => {
        state.loading.add = false;

        if (action.payload?.data) {
          state.wishlist.push(action.payload.data);
        }
      })
      .addCase(addtowishlist.rejected, (state, action) => {
        state.loading.add = false;
        state.error = action.payload;
      })

      .addCase(getwishlist.pending, (state) => {
        state.loading.get = true;
        state.error = null;
      })
      .addCase(getwishlist.fulfilled, (state, action) => {
        state.loading.get = false;
        state.wishlist = Array.isArray(action.payload.data)
          ? action.payload.data
          : [];
      })
      .addCase(getwishlist.rejected, (state, action) => {
        state.loading.get = false;
        state.error = action.payload;
      })

      .addCase(removewishlist.pending, (state) => {
        state.loading.remove = true;
        state.error = null;
      })
      .addCase(removewishlist.fulfilled, (state, action) => {
        state.loading.remove = false;

        const productId = action.meta.arg.productId;

        state.wishlist = state.wishlist.filter(
          (item) =>
            item.productId !== productId && item.productId?._id !== productId,
        );
      })
      .addCase(removewishlist.rejected, (state, action) => {
        state.loading.remove = false;
        state.error = action.payload;
      });
  },
});

export default Wishlistslice.reducer;
