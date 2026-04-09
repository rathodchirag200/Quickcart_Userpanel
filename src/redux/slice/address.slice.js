import { createSlice } from "@reduxjs/toolkit";
import {
  createAddress,
  getaddressbyid,
  updateAddress,
  deleteAddress,
} from "../thunk/address.thunk";

const Addressslice = createSlice({
  name: "address",

  initialState: {
    addresses: [],
    loading: {
      create: false,
      get: false,
      update: false,
      delete: false,
    },
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(createAddress.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })

      .addCase(createAddress.fulfilled, (state, action) => {
        state.loading.create = false;
        state.addresses.push(action.payload.data);
      })

      .addCase(createAddress.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      .addCase(getaddressbyid.pending, (state) => {
        state.loading.get = true;
        state.error = null;
      })

      .addCase(getaddressbyid.fulfilled, (state, action) => {
        state.loading.get = false;
        state.addresses = action.payload.data;
      })

      .addCase(getaddressbyid.rejected, (state, action) => {
        state.loading.get = false;
        state.error = action.payload;
      })

      .addCase(updateAddress.pending, (state) => {
        state.loading.update = true;
      })

      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading.update = false;

        const index = state.addresses.findIndex(
          (addr) => addr._id === action.payload.data._id,
        );

        if (index !== -1) {
          state.addresses[index] = action.payload.data;
        }
      })

      .addCase(updateAddress.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      .addCase(deleteAddress.pending, (state) => {
        state.loading.delete = true;
      })

      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading.delete = false;

        state.addresses = state.addresses.filter(
          (addr) => addr._id !== action.payload,
        );
      })

      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      });
  },
});

export default Addressslice.reducer;
