import React from "react";
import { useDispatch } from "react-redux";
import { resetpassword } from "../redux/thunk/auth.thunk";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "../css/resetpassword.scss";
import { useNavigate, Link } from "react-router-dom";

export const ResetPassword = ({ email }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },

    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "Minimum 6 characters")
        .required("New password required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password required"),
    }),

    onSubmit: async (values) => {
      const payload = {
        email,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };

      const res = await dispatch(resetpassword(payload));

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Password reset successfully");
        navigate("/login");
      } else {
        toast.error(res.payload || "Failed to reset password");
      }
    },
  });

  return (
    <section className="forgot-page">
      <div className="forgot-card">
        <h2 className="forgot-title">Reset Password</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>
              New Password <span>*</span>
            </label>

            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.newPassword}
            />

            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="error">{formik.errors.newPassword}</p>
            )}
          </div>

          <div className="form-group">
            <label>
              Confirm Password <span>*</span>
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />

            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="error">{formik.errors.confirmPassword}</p>
              )}
          </div>

          <button className="reset-btn" type="submit">
            Reset Password
          </button>
        </form>
      </div>
    </section>
  );
};
