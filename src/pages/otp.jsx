import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyOtp, resendOtp } from "../redux/thunk/auth.thunk";
import { userdetails } from "../redux/thunk/auth.thunk";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import "../css/otp.scss";

export const Otp = ({ email }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    const res = await dispatch(
      verifyOtp({
        email,
        otp,
      }),
    );

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("User verified successfully");

      await dispatch(userdetails());

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      toast.error(res.payload || "Invalid OTP");
    }
  };

  const handleResend = () => {
    dispatch(resendOtp({ email }));
    toast.info("OTP resent");
  };

  return (
    <div className="otp-wrapper">
      <div className="otp-box">
        <h2>Verify OTP</h2>

        <p className="subtitle">Enter the 4 digit OTP sent to your email</p>

        <div className="otp-inputs">
          <OtpInput
            value={otp}
            onChange={(value) => {
              if (/^\d*$/.test(value)) {
                setOtp(value);
              }
            }}
            numInputs={4}
            inputType="tel"
            renderInput={(props) => <input {...props} />}
            inputStyle="otp-input"
          />
        </div>

        <button onClick={handleVerify}>Verify OTP</button>

        <p className="resend">
          Didn't receive OTP?
          <span onClick={handleResend}> Resend</span>
        </p>
      </div>
    </div>
  );
};
