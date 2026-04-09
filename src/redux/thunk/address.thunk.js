import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// CREATE ADDRESS
export const createAddress = createAsyncThunk(
  "address/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/address", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// GET USER ADDRESS
export const getaddressbyid = createAsyncThunk(
  "address/getById",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/getaddress");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// UPDATE ADDRESS
export const updateAddress = createAsyncThunk(
  "address/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/address/${id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

// DELETE ADDRESS
export const deleteAddress = createAsyncThunk(
  "address/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/address/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);


