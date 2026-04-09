import { createSlice } from "@reduxjs/toolkit";
import {
  addorder,
  cancelorder,
  getallorder,
  orderbyid,
  orderstatus,
} from "../thunk/order.thunk";

const Orderslice = createSlice({
  name: "order",

  initialState: {
    orders: [],
    orderDetails: null,
    loading: {
      add: false,
      get: false,
      getById: false,
      updateStatus: false,
      cancel: false,
    },
    error: null,
  },

  reducers: {
    updateOrderLocalStatus: (state, action) => {
      const { orderId, orderStatus, paymentStatus } = action.payload || {};
      if (!orderId) return;

      state.orders = state.orders.map((order) => {
        if (order?._id !== orderId) return order;
        return {
          ...order,
          ...(orderStatus ? { orderStatus } : {}),
          ...(paymentStatus ? { paymentStatus } : {}),
        };
      });
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addorder.pending, (state) => {
        state.loading.add = true;
        state.error = null;
      })
      .addCase(addorder.fulfilled, (state, action) => {
        state.loading.add = false;
        state.orders.push(action.payload.data);
      })
      .addCase(addorder.rejected, (state, action) => {
        state.loading.add = false;
        state.error = action.payload;
      })
      .addCase(getallorder.pending, (state) => {
        state.loading.get = true;
        state.error = null;
      })
      .addCase(getallorder.fulfilled, (state, action) => {
        state.loading.get = false;
        state.orders = action.payload.data;
      })
      .addCase(getallorder.rejected, (state, action) => {
        state.loading.get = false;
        state.error = action.payload;
      })
      .addCase(orderbyid.pending, (state) => {
        state.loading.getById = true;
        state.error = null;
      })
      .addCase(orderbyid.fulfilled, (state, action) => {
        state.loading.getById = false;
        state.orders = action.payload.data;
      })
      .addCase(orderbyid.rejected, (state, action) => {
        state.loading.getById = false;
        state.error = action.payload;
      })
      .addCase(orderstatus.pending, (state) => {
        state.loading.updateStatus = true;
        state.error = null;
      })
      .addCase(orderstatus.fulfilled, (state, action) => {
        state.loading.updateStatus = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload.data._id,
        );
        if (index !== -1) {
          state.orders[index] = action.payload.data;
        }
      })
      .addCase(orderstatus.rejected, (state, action) => {
        state.loading.updateStatus = false;
        state.error = action.payload;
      })
      .addCase(cancelorder.pending, (state) => {
        state.loading.cancel = true;
        state.error = null;
      })
      .addCase(cancelorder.fulfilled, (state, action) => {
        state.loading.cancel = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload.data._id,
        );
        if (index !== -1) {
          state.orders[index] = action.payload.data;
        }
      })
      .addCase(cancelorder.rejected, (state, action) => {
        state.loading.cancel = false;
        state.error = action.payload;
      });
  },
});

export default Orderslice.reducer;
export const { updateOrderLocalStatus } = Orderslice.actions;
