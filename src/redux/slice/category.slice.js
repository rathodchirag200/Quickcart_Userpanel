import { getcategory } from "../thunk/category.thunk";

const { createSlice } = require("@reduxjs/toolkit");

const Categoryslice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: {
      get: false,
    },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getcategory.pending, (state) => {
        state.loading.get = true;
        state.error = null;
      })
      .addCase(getcategory.fulfilled, (state, action) => {
        state.loading.get = false;
        state.categories = action.payload.data;
      })
      .addCase(getcategory.rejected, (state, action) => {
        state.loading.get = false;
        state.error = action.payload;
      });
  },
});

export default Categoryslice.reducer;
