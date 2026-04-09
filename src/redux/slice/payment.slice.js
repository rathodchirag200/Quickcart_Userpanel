import { createSlice } from "@reduxjs/toolkit";
import { createpayment, verifypayment, refundpayment } from "../thunk/payment.thunk";

const Paymentslice = createSlice({
  name: "payment",

  initialState: {
    payments: [],
    loading: {
      create: false,
      verify: false,
      refund: false,
    },
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(createpayment.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })

      .addCase(createpayment.fulfilled, (state, action) => {
        state.loading.create = false;
        state.payments.push(action.payload);
      })

      .addCase(createpayment.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload;
      })

      .addCase(verifypayment.pending, (state) => {
        state.loading.verify = true;
        state.error = null;
      })

      .addCase(verifypayment.fulfilled, (state) => {
        state.loading.verify = false;
      })

      .addCase(verifypayment.rejected, (state, action) => {
        state.loading.verify = false;
        state.error = action.payload;
      })

      .addCase(refundpayment.pending, (state) => {
        state.loading.refund = true;
        state.error = null;
      })

      .addCase(refundpayment.fulfilled, (state) => {
        state.loading.refund = false;
      })

      .addCase(refundpayment.rejected, (state, action) => {
        state.loading.refund = false;
        state.error = action.payload;
      });
  },
});

export default Paymentslice.reducer;