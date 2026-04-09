import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyOtp, resendOtp } from "../redux/thunk/auth.thunk";
import { toast } from "react-toastify";
import "../css/otp.scss";
import { ResetPassword } from "./ResetPassword";
import OtpInput from "react-otp-input";

export const Otp2 = ({ email }) => {

  const dispatch = useDispatch();

  const [otp, setOtp] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  const handleVerify = async () => {

    const res = await dispatch(
      verifyOtp({
        email,
        otp
      })
    );

    if (res.meta.requestStatus === "fulfilled") {

      toast.success("OTP verified successfully");
      setShowResetModal(true);

    } else {
      toast.error("Invalid OTP");
    }
  };

  const handleResend = () => {
    dispatch(resendOtp({ email }));
    toast.info("OTP resent");
  };

  return (
    <>
      {!showResetModal && (
        <div className="otp-wrapper">
          <div className="otp-box">

            <h2>Verify OTP</h2>

            <p className="subtitle">
              Enter the 4 digit OTP sent to your email
            </p>

            <div className="otp-inputs">
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderInput={(props) => <input {...props} />}
                inputStyle="otp-input"
              />
            </div>

            <button onClick={handleVerify}>
              Verify OTP
            </button>

            <p className="resend">
              Didn't receive OTP?
              <span onClick={handleResend}> Resend</span>
            </p>

          </div>
        </div>
      )}

      {showResetModal && (
        <ResetPassword email={email} />
      )}
    </>
  );
};