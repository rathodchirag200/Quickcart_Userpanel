import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  register,
  userdetails,
  verifyOtp,
  resendOtp,
  userupdate,
  changePassword,
  forgotpassword,
  resetpassword,
} from "../thunk/auth.thunk";
const Cookies = require("js-cookie");

const TOKEN_EXPIRES_AT_KEY = "tokenExpiresAt";

const parseExpiryToMs = (expiresat) => {
  if (typeof expiresat !== "string") {
    return null;
  }

  const match = expiresat.trim().toLowerCase().match(/^(\d+)([smhd])$/);

  if (!match) {
    return null;
  }

  const amount = Number(match[1]);
  const unit = match[2];

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  const unitMs = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * unitMs[unit];
};

const Userslice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
    expiresat: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.expiresat = null;
      localStorage.removeItem("token");
      localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
      Cookies.remove("token");
      Cookies.remove("expiresat");
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.expiresat = action.payload.expiresat || null;

        localStorage.setItem("token", action.payload.token);

        const expiryMs = parseExpiryToMs(action.payload.expiresat);

        if (expiryMs) {
          const expiresAt = Date.now() + expiryMs;
          const expiresAtDate = new Date(expiresAt);

          localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(expiresAt));
          Cookies.set("token", action.payload.token, { expires: expiresAtDate });
          Cookies.set("expiresat", String(expiresAt), { expires: expiresAtDate });
        } else {
          Cookies.set("token", action.payload.token, { expires: 7 });
          localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
          Cookies.remove("expiresat");
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.expiresat = action.payload.expiresat || null;

        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        } else {
          localStorage.removeItem("token");
        }

        const expiryMs = parseExpiryToMs(action.payload.expiresat);

        if (expiryMs && action.payload.token) {
          const expiresAt = Date.now() + expiryMs;
          const expiresAtDate = new Date(expiresAt);

          localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(expiresAt));
          Cookies.set("token", action.payload.token, { expires: expiresAtDate });
          Cookies.set("expiresat", String(expiresAt), { expires: expiresAtDate });
        } else {
          localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
          Cookies.remove("expiresat");

          if (action.payload.token) {
            Cookies.set("token", action.payload.token, { expires: 7 });
          } else {
            Cookies.remove("token");
          }
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // USER DETAILS
      .addCase(userdetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userdetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(userdetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data || action.payload;
        state.expiresat = action.payload.expiresat || null;

        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }

        const expiryMs = parseExpiryToMs(action.payload.expiresat);

        if (expiryMs && action.payload.token) {
          const expiresAt = Date.now() + expiryMs;
          const expiresAtDate = new Date(expiresAt);

          localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(expiresAt));
          Cookies.set("token", action.payload.token, { expires: expiresAtDate });
          Cookies.set("expiresat", String(expiresAt), { expires: expiresAtDate });
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(userupdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userupdate.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(userupdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(forgotpassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotpassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(forgotpassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(resetpassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetpassword.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(resetpassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = Userslice.actions;
export default Userslice.reducer;
