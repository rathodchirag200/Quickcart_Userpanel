import React from "react";
import { useDispatch } from "react-redux";
import { login, userdetails } from "../redux/thunk/auth.thunk";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import "../css/register.scss";
import { toast } from "react-toastify";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().min(6).required("Password required"),
    }),

    onSubmit: async (values) => {
      const res = await dispatch(login(values));

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Login successful");
        localStorage.removeItem("guestId");
        await dispatch(userdetails());
        navigate("/");
      } else {
        toast.error(res.payload || "Invalid email or password");
      }
    },
  });

  return (
    <section className="signup-page">
      <div className="signup-card">
        <h2 className="signup-title">Login</h2>

        <form onSubmit={formik.handleSubmit}>
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

          <div className="forgot-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button className="register-btn" type="submit">
            Login
          </button>
        </form>

        <p className="login-link">
          Not have an account? <Link to="/register">register</Link>
        </p>
      </div>
    </section>
  );
};
