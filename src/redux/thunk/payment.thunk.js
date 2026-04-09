import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const createpayment = createAsyncThunk(
  "payment/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/payment/create", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create payment",
      );
    }
  },
);

export const verifypayment = createAsyncThunk(
  "payment/verify",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/payment/verify", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify payment",
      );
    }
  },
);

export const refundpayment = createAsyncThunk(
  "payment/refund",
  async (payload, { rejectWithValue }) => {
    try {
      const isObjectPayload = payload && typeof payload === "object";
      const orderId = isObjectPayload ? payload.orderId : payload;
      const refundAmount = isObjectPayload ? payload.refundAmount : undefined;

      const response = await api.post(
        `/payment/refund/${orderId}`,
        refundAmount !== undefined ? { refundAmount } : undefined,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to refund payment",
      );
    }
  },
);
