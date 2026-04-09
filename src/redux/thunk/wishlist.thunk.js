import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const addtowishlist = createAsyncThunk(
  "wishlist/add",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/add", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getwishlist = createAsyncThunk(
  "wishlist/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/mywishlist");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removewishlist = createAsyncThunk(
  "wishlist/remove",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/remove", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);