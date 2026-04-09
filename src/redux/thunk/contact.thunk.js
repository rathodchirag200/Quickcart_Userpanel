import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const addquery = createAsyncThunk(
  "contact/addquery",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/contact", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit query",
      );
    }
  },
);

export const getqueries = createAsyncThunk(
  "contact/getqueries",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/contact");
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch queries",
      );
    }
  },
);

export const deletequery = createAsyncThunk(
  "contact/deletequery",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/contact/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete query",
      );
    }
  },
);
