import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const addtocart = createAsyncThunk(
  "cart/add",
  async (data, { rejectWithValue }) => {
    try {
      const guestId = localStorage.getItem("guestId");

      const res = await api.post("/cart/add", data);

      if (res.data.guestId) {
        localStorage.setItem("guestId", res.data.guestId);
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getcart = createAsyncThunk(
  "cart/get",
  async (_, { rejectWithValue }) => {
    try {
      const guestId = localStorage.getItem("guestId");

      const res = await api.get("/cart");

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const removecart = createAsyncThunk(
  "cart/remove",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(`/cart/remove`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const decreasequantity = createAsyncThunk(
  "cart/decrease",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(`/cart/decrease`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const clearcart = createAsyncThunk(
  "cart/clear",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post(`/cart/clear`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
