import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

export const getfaqs = createAsyncThunk(
    "faqs/getfaqs",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/faqs/get");
            return res.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
        }
)
