import React from "react";
import "../css/contactpage.scss";
import { useDispatch, useSelector } from "react-redux";
import { addquery } from "../redux/thunk/contact.thunk";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Contact = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.contact);

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      phone_number: "",
      subject: "",
      message: "",
    },

    validationSchema: Yup.object({
      fullname: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone_number: Yup.string()
        .matches(/^[0-9]{10}$/, "Enter valid 10 digit number")
        .required("Phone number is required"),
      subject: Yup.string().required("Subject is required"),
      message: Yup.string().required("Message is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await dispatch(addquery(values)).unwrap();
        toast.success(res?.message || "Query submitted successfully");
        resetForm();
      } catch (err) {
        const errorMessage =
          typeof err === "string"
            ? err
            : err?.message || "Something went wrong";
        toast.error(errorMessage);
      }
    },
  });

  const isSending = loading || formik.isSubmitting;

  return (
    <section className="contact-page py-80">
      <div className="container container-lg">
        <div className="contact-page__title text-center mb-32">
          <h4 className="mb-10">Contact Us</h4>
          <p className="text-gray-600 mb-0">
            Have a question about products, orders, or returns? Our support
            specialists are ready to help with fast and reliable assistance.
          </p>
        </div>

        <div className="contact-page__top-map-wrap mb-36">
          <div className="contact-page__top-map">
            <iframe
              title="India map"
              src="https://www.google.com/maps?q=India&z=4&output=embed"
              loading="lazy"
            />
          </div>
        </div>

        <div className="row g-4 align-items-start contact-page__content">
          <div className="col-lg-4">
            <div className="contact-info-panel">
              <div className="contact-info-card">
                <h5 className="mb-14">Visit Our Store</h5>
                <p className="text-gray-600 mb-18">
                  Reach us for product support, order help and quick assistance.
                </p>

                <div className="contact-info-row">
                  <span className="contact-info-row__icon">
                    <i className="ph-fill ph-map-pin" />
                  </span>
                  <span className="contact-info-row__text">
                    MarketPro HQ, Mumbai, Maharashtra, India
                  </span>
                </div>

                <div className="contact-info-row">
                  <span className="contact-info-row__icon">
                    <i className="ph-fill ph-envelope" />
                  </span>
                  <a href="mailto:support@marketpro.com" className="contact-info-row__text">
                    support@marketpro.com
                  </a>
                </div>

                <div className="contact-info-row mb-0">
                  <span className="contact-info-row__icon">
                    <i className="ph-fill ph-phone-call" />
                  </span>
                  <a href="tel:+919876543210" className="contact-info-row__text">
                    +91 98765 43210
                  </a>
                </div>

                <div className="contact-page__hours mt-18">
                  <span>Support Hours</span>
                  <strong>Mon - Sat: 09:00 AM to 09:00 PM</strong>
                  <strong>Sun: 10:00 AM to 06:00 PM</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="contact-form-panel">
              <div className="contact-form-panel__head mb-18">
                <h5 className="mb-8">Get In Touch</h5>
                <p className="text-gray-600 mb-0">
                  Please fill in your details and share your message. We usually
                  respond within one business day.
                </p>
              </div>

              <form
                onSubmit={formik.handleSubmit}
                className="contact-page__form"
              >
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="contact-page__label">
                      Full Name <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      className="common-input px-16"
                      placeholder="Enter your full name"
                      value={formik.values.fullname}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.fullname && formik.errors.fullname && (
                      <small className="text-danger">
                        {formik.errors.fullname}
                      </small>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="contact-page__label">
                      Email Address <span>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="common-input px-16"
                      placeholder="you@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <small className="text-danger">
                        {formik.errors.email}
                      </small>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="contact-page__label">
                      Phone Number <span>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      className="common-input px-16"
                      placeholder="+91 98765 43210"
                      value={formik.values.phone_number}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone_number &&
                      formik.errors.phone_number && (
                        <small className="text-danger">
                          {formik.errors.phone_number}
                        </small>
                      )}
                  </div>

                  <div className="col-md-6">
                    <label className="contact-page__label">
                      Subject <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      className="common-input px-16"
                      placeholder="How can we help?"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <small className="text-danger">
                        {formik.errors.subject}
                      </small>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="contact-page__label">
                      Message <span>*</span>
                    </label>
                    <textarea
                      name="message"
                      className="common-input px-16"
                      rows={5}
                      placeholder="Write your message"
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.message && formik.errors.message && (
                      <small className="text-danger">
                        {formik.errors.message}
                      </small>
                    )}
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-main py-14 px-32 rounded-8"
                      disabled={isSending}
                    >
                      {isSending ? "Sending..." : "Send Message"}
                    </button>
                    <p className="contact-page__submit-note mb-0 mt-10">
                      By submitting this form, you agree to be contacted by our
                      customer care team regarding your request.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;