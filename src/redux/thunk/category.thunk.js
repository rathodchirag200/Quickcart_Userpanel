import { createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/axios"

export const getcategory = createAsyncThunk(
    'category/get',
    async (params, { rejectWithValue }) => {
        try {
            const res = await api.get('/category/get', { params })
            return res.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message
            )
        }
    }
)
