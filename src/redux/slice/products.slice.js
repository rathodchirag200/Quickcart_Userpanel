import { createSlice } from "@reduxjs/toolkit";
import {
  allproducts,
  paginationproduct,
  singleproduct,
} from "../thunk/products.thunk";

const Productslice = createSlice({
  name: "product",
  initialState: {
    products: [],
    pagination: {
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    },
    single: null,
    loading: {
      getall: false,
    },
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(allproducts.pending, (state) => {
        state.loading.getall = true;
        state.error = null;
      })
      .addCase(allproducts.fulfilled, (state, action) => {
        state.loading.getall = false;
        state.products = action.payload.data;
      })
      .addCase(allproducts.rejected, (state, action) => {
        state.loading.getall = false;
        state.error = action.payload;
      })

      .addCase(paginationproduct.pending, (state) => {
        state.loading.getall = true;
        state.error = null;
      })
      .addCase(paginationproduct.fulfilled, (state, action) => {
        state.loading.getall = false;

        const incomingProducts = action.payload?.data || [];
        const currentPage = Number(
          action.payload?.pagination?.currentPage ?? action.meta?.arg?.page ?? 1,
        );

        if (currentPage <= 1) {
          state.products = incomingProducts;
        } else {
          const seen = new Set();
          const mergedProducts = [...state.products, ...incomingProducts];

          state.products = mergedProducts.filter((item) => {
            const key = item?._id || item?.id;

            if (!key || seen.has(key)) {
              return false;
            }

            seen.add(key);
            return true;
          });
        }

        state.pagination = {
          total: action.payload.pagination.totalItems,
          pageIndex: action.payload.pagination.currentPage,
          pageSize: action.payload.pagination.limit,
        };
      })
      .addCase(paginationproduct.rejected, (state, action) => {
        state.loading.getall = false;
        state.error = action.payload;
      })

      .addCase(singleproduct.pending, (state) => {
        state.loading.single = true;
        state.error = null;
      })
      .addCase(singleproduct.fulfilled, (state, action) => {
        state.loading.single = false;
        state.single = action.payload.data;
      })
      .addCase(singleproduct.rejected, (state, action) => {
        state.loading.single = false;
        state.error = action.payload;
      });
  },
});

export default Productslice.reducer;
