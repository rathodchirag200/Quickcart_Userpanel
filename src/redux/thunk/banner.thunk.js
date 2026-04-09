import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const getbanner = createAsyncThunk(
  "banner/get",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/banner/get", { params });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
