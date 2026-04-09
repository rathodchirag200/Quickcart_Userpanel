import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const login = createAsyncThunk(
  "admin/login",
  async (data, { rejectWithValue }) => {
    try {
      const guestId = localStorage.getItem("guestId");
      const res = await api.post("/login", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const register = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/register", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const userdetails = createAsyncThunk(
  "user/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/currentuser");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/verifyotp", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const resendOtp = createAsyncThunk(
  "user/resendOtp",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/resend-otp", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const userupdate = createAsyncThunk(
  "user/edit",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.put(`/editprofile`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(`/change-password`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const forgotpassword = createAsyncThunk(
  "user/forgotpassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(`/forgot-password`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const resetpassword = createAsyncThunk(
  "user/resetpassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post(`/reset-password`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);
