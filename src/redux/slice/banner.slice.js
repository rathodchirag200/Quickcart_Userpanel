import { getbanner } from "../thunk/banner.thunk";
const { createSlice } = require("@reduxjs/toolkit");

const Bannerslice = createSlice({
  name: "banner",
  initialState: {
    banners: [],
    loading: {
      get: false,
    },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getbanner.pending, (state, action) => {
        state.loading.get = true;
        state.error = null;
      })
      .addCase(getbanner.fulfilled, (state, action) => {
        state.loading.get = false;
        state.banners = action.payload.data;
      })
      .addCase(getbanner.rejected, (state, action) => {
        state.loading.get = false;
        state.error = action.payload;
      });
  },
});

export const {
  toggleDeleteConfirmation,
  setSelectedBanner,
  toggleAddBannerModal,
  setEditMode,
} = Bannerslice.actions;

export default Bannerslice.reducer;
