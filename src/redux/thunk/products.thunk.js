import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const allproducts = createAsyncThunk(
  "product/getall",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/allproducts", {
        params: params,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const singleproduct = createAsyncThunk(
  "product/getsingle",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const paginationproduct = createAsyncThunk(
  "product/getpagination",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/products", {
        params: params,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
