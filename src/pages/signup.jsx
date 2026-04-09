import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../redux/thunk/auth.thunk";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Otp } from "./otp";
import "../css/register.scss";

export const Signup = () => {

  const dispatch = useDispatch();
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: ""
    },

    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6).required("Password required")
    }),

    onSubmit: async (values) => {

      const res = await dispatch(register(values));

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Registration successful. Please verify OTP.");
        setEmail(values.email);
        setShowOtp(true);
      } else {
        toast.error(res.payload || "Registration failed. Please try again.");
      }

    }
  });

  return (
    <section className="signup-page">

      <div className="signup-card">

        <h2 className="signup-title">
          Create Account
        </h2>

        <form onSubmit={formik.handleSubmit}>

          {/* Username */}
          <div className="form-group">
            <label>
              Username <span>*</span>
            </label>

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />

            {formik.touched.username && formik.errors.username && (
              <p className="error">{formik.errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>
              Email Address <span>*</span>
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />

            {formik.touched.email && formik.errors.email && (
              <p className="error">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>
              Password <span>*</span>
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />

            {formik.touched.password && formik.errors.password && (
              <p className="error">{formik.errors.password}</p>
            )}
          </div>

          <button className="register-btn" type="submit">
            Register
          </button>

        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>

      </div>

      {showOtp && <Otp email={email} />}

    </section>
  );
};