import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const addorder = createAsyncThunk(
  "order/add",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/orders/create", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

export const getallorder = createAsyncThunk(
  "order/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders/allorders");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

export const orderbyid = createAsyncThunk(
  "order/getById",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders/getbyid");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

export const orderstatus = createAsyncThunk(
  "order/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/orders/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order",
      );
    }
  },
);

export const cancelorder = createAsyncThunk(
  "order/cancel",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/cancel/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel order",
      );
    }
  },
);
