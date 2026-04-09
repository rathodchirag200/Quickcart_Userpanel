import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotpassword } from "../redux/thunk/auth.thunk";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "../css/forgotpassword.scss";
import { Otp2 } from "./otp2";

export const ForgotPassword = () => {

  const dispatch = useDispatch();

  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email")
        .required("Email is required"),
    }),

    onSubmit: async (values) => {

      const res = await dispatch(forgotpassword(values));

      if (res.meta.requestStatus === "fulfilled") {

        toast.success("OTP sent to your email");

        setEmail(values.email);

        setShowOtp(true);

      } else {

        toast.error(res.payload || "Failed to send OTP");

      }

    },
  });

  return (

    <section className="forgot-page">

      <div className="forgot-card">

        <h2>Forgot Password</h2>

        <p className="desc">Enter your email address and we'll send you an OTP to reset your password.</p>

        <form onSubmit={formik.handleSubmit}>

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />

            {formik.touched.email && formik.errors.email && (
              <p className="error">{formik.errors.email}</p>
            )}

          </div>

          <button type="submit" className="forgot-btn">
            Send OTP
          </button>

        </form>

        {/* BACK TO LOGIN */}
        <div className="back-login">
          <Link to="/login">← Back to Login</Link>
        </div>

      </div>

      {/* OTP MODAL */}
      {showOtp && (
        <div className="otp-modal">
          <Otp2 email={email} />
        </div>
      )}

    </section>

  );
};