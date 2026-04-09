import React from "react";
import ScrollToTop from "react-scroll-to-top";
import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import Breadcrumb from "../components/Breadcrumb";
import ShippingOne from "../components/ShippingOne";

const AboutPage = () => {
  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />

      <Breadcrumb title={"About Us"} />

      <section className="py-80">
        <div className="container container-lg">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-7">
              <div className="p-24 p-md-32 rounded-16 border border-gray-100 h-100 bg-white">
                <span className="badge bg-main-600 text-white mb-16">Our Story</span>
                <h3 className="mb-16">
                  Building a smarter and more trusted online shopping experience
                </h3>
                <p className="text-gray-600 mb-16">
                  Marketpro was created to make shopping faster, easier, and more
                  reliable for everyone. We bring together high-quality products,
                  transparent pricing, and responsive customer service in one
                  modern platform.
                </p>
                <p className="text-gray-600 mb-0">
                  From daily essentials to the latest tech, we focus on curated
                  selection, secure checkout, and dependable delivery so customers
                  can shop with complete confidence.
                </p>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-24 p-md-32 rounded-16 border border-gray-100 h-100 bg-main-two-50">
                <h5 className="mb-20">Why customers choose us</h5>

                <div className="d-flex gap-12 mb-16 align-items-start">
                  <i className="ph-fill ph-seal-check text-main-600 text-2xl" />
                  <div>
                    <h6 className="mb-6">Verified Quality</h6>
                    <p className="mb-0 text-gray-600">
                      Every product is selected with quality and reliability checks.
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-12 mb-16 align-items-start">
                  <i className="ph-fill ph-truck text-main-600 text-2xl" />
                  <div>
                    <h6 className="mb-6">Fast Delivery</h6>
                    <p className="mb-0 text-gray-600">
                      Optimized shipping network for quick and safe delivery.
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-12 align-items-start">
                  <i className="ph-fill ph-headset text-main-600 text-2xl" />
                  <div>
                    <h6 className="mb-6">Real Human Support</h6>
                    <p className="mb-0 text-gray-600">
                      Friendly support team available when you need help.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="row g-3">
                <div className="col-sm-6 col-lg-3">
                  <div className="p-20 rounded-12 border border-gray-100 text-center h-100">
                    <h3 className="text-main-600 mb-6">50K+</h3>
                    <p className="mb-0 text-gray-600">Happy Customers</p>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="p-20 rounded-12 border border-gray-100 text-center h-100">
                    <h3 className="text-main-600 mb-6">10K+</h3>
                    <p className="mb-0 text-gray-600">Products Available</p>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="p-20 rounded-12 border border-gray-100 text-center h-100">
                    <h3 className="text-main-600 mb-6">120+</h3>
                    <p className="mb-0 text-gray-600">Trusted Brands</p>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="p-20 rounded-12 border border-gray-100 text-center h-100">
                    <h3 className="text-main-600 mb-6">24/7</h3>
                    <p className="mb-0 text-gray-600">Customer Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ShippingOne />
    </>
  );
};

export default AboutPage;
