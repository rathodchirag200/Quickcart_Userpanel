import { createSlice } from "@reduxjs/toolkit";
import {
  addtocart,
  clearcart,
  decreasequantity,
  getcart,
  removecart,
} from "../thunk/cart.thunk";

const Cartslice = createSlice({
  name: "cart",
  initialState: {
    cart: null, // ✅ FIX
    loading: {
      add: false,
      get: false,
      remove: false,
      decrease: false,
      clear: false,
    },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(addtocart.pending, (state) => {
        state.loading.add = true;
        state.error = null;
      })
      .addCase(addtocart.fulfilled, (state, action) => {
        state.loading.add = false;
        state.cart = action.payload.data;
      })
      .addCase(addtocart.rejected, (state, action) => {
        state.loading.add = false;
        state.error = action.payload;
      })

      .addCase(getcart.pending, (state) => {
        state.loading.get = true;
        state.error = null;
      })
      .addCase(getcart.fulfilled, (state, action) => {
        state.loading.get = false;
        state.cart = action.payload.data;
      })
      .addCase(getcart.rejected, (state, action) => {
        state.loading.get = false;
        state.error = action.payload;
      })

      .addCase(removecart.pending, (state) => {
        state.loading.remove = true;
        state.error = null;
      })
      .addCase(removecart.fulfilled, (state, action) => {
        state.loading.remove = false;
        state.cart = action.payload.data;
      })
      .addCase(removecart.rejected, (state, action) => {
        state.loading.remove = false;
        state.error = action.payload;
      })

      .addCase(decreasequantity.pending, (state) => {
        state.loading.decrease = true;
        state.error = null;
      })
      .addCase(decreasequantity.fulfilled, (state, action) => {
        state.loading.decrease = false;
        state.cart = action.payload.data;
      })
      .addCase(decreasequantity.rejected, (state, action) => {
        state.loading.decrease = false;
        state.error = action.payload;
      })

      .addCase(clearcart.pending, (state) => {
        state.loading.clear = true;
        state.error = null;
      })
      .addCase(clearcart.fulfilled, (state) => {
        state.loading.clear = false;
        state.cart = { items: [] }; // ✅ FIX
      })
      .addCase(clearcart.rejected, (state, action) => {
        state.loading.clear = false;
        state.error = action.payload;
      });
  },
});

export default Cartslice.reducer;