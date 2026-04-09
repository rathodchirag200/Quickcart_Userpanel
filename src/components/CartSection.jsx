import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  removecart,
  decreasequantity,
  clearcart,
  addtocart,
} from "../redux/thunk/cart.thunk";
import { toast } from "react-toastify";

const CartSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);

  const cart = useSelector((state) => state.cart.cart);
  const cartItems = cart?.items || [];
  const isCartEmpty = cartItems.length === 0;

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );
  const estimatedTax = subtotal * 0.04;
  const total = subtotal + estimatedTax;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const handleremovecart = async (productId) => {
    const res = await dispatch(removecart({ productId }));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Product removed successfully");
    } else {
      toast.error("Failed to remove product");
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    const res = await dispatch(decreasequantity({ productId }));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Quantity decreased");
    }
  };

  const handleClearCart = async () => {
    const res = await dispatch(clearcart());

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Cart cleared successfully");
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    const res = await dispatch(addtocart({ productId }));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Quantity increased");
    }
  };

  const handleProceedToCheckout = () => {
    if (!agreedToTerms) {
      setShowTermsError(true);
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setShowTermsError(false);
    navigate("/checkout");
  };

  return (
    <section className="cart py-80">
      <div className="container container-lg">
        <div className={`row gy-4 ${isCartEmpty ? "justify-content-center" : ""}`}>
          <div className={isCartEmpty ? "col-12" : "col-xl-9 col-lg-8"}>
            <div
              className={`cart-table border border-gray-100 rounded-8 px-40 py-48 ${
                isCartEmpty ? "mx-auto" : ""
              }`}
              style={isCartEmpty ? { maxWidth: "980px" } : undefined}
            >
              {!isCartEmpty ? (
                <div className="overflow-x-auto scroll-sm scroll-sm-horizontal">
                  <table className="table style-three">
                    <thead>
                      <tr>
                        <th className="h6 mb-0 text-lg fw-bold">Delete</th>
                        <th className="h6 mb-0 text-lg fw-bold">Product Name</th>
                        <th className="h6 mb-0 text-lg fw-bold">Price</th>
                        <th className="h6 mb-0 text-lg fw-bold">Quantity</th>
                        <th className="h6 mb-0 text-lg fw-bold">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.productId}>
                          <td>
                            <button
                              type="button"
                              className="remove-tr-btn flex-align gap-12 hover-text-danger-600"
                              onClick={() => handleremovecart(item.productId)}
                            >
                              Remove
                            </button>
                          </td>

                          <td>
                            <div className="table-product d-flex align-items-center gap-24">
                              <Link
                                to={`/product-details/${item.productId}`}
                                className="table-product__thumb border border-gray-100 rounded-8 flex-center"
                              >
                                <img
                                  src={`${item.image}`}
                                  alt={item.name}
                                />
                              </Link>

                              <div className="table-product__content text-start">
                                <h6 className="title text-lg fw-semibold mb-8">
                                  {item.name}
                                </h6>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="text-lg h6 mb-0 fw-semibold">
                              {formatCurrency(item.price)}
                            </span>
                          </td>

                          <td>
                            <div className="d-flex rounded-4 overflow-hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDecreaseQuantity(item.productId)
                                }
                                className="quantity__minus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
                              >
                                <i className="ph ph-minus" />
                              </button>
                              <input
                                type="number"
                                className="quantity__input flex-grow-1 border border-gray-100 border-start-0 border-end-0 text-center w-32 px-4"
                                value={item.quantity}
                                min={1}
                                readOnly
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleIncreaseQuantity(item.productId)
                                }
                                className="quantity__plus border border-end border-gray-100 flex-shrink-0 h-48 w-48 text-neutral-600 flex-center hover-bg-main-600 hover-text-white"
                              >
                                <i className="ph ph-plus" />
                              </button>
                            </div>
                          </td>

                          <td>
                            <span className="text-lg h6 mb-0 fw-semibold">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-64">
                  <div className="w-64 h-64 rounded-circle bg-main-50 text-main-600 d-inline-flex align-items-center justify-content-center mb-20">
                    <i className="ph ph-shopping-cart text-2xl" />
                  </div>
                  <h5 className="mb-12">Your cart is empty</h5>
                  <p className="text-gray-600 mb-24">
                    Looks like you have not added anything yet. Start shopping to
                    fill your cart.
                  </p>
                  <Link to="/shop" className="btn btn-main rounded-8 px-32 py-14">
                    Continue Shopping
                  </Link>
                </div>
              )}

              {!isCartEmpty && (
                <div className="flex-between flex-wrap gap-16 mt-16">
                  <button
                    onClick={handleClearCart}
                    className="text-lg text-black hover-text-main-600"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>
          </div>
          {!isCartEmpty && (
            <div className="col-xl-3 col-lg-4">
              <div className="cart-sidebar border border-gray-100 rounded-8 px-24 py-40">
                <h6 className="text-xl mb-32">Cart Totals</h6>
                <div className="bg-color-three rounded-8 p-24">
                  <div className="mb-32 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two">
                      Subtotal
                    </span>
                    <span className="text-gray-900 fw-semibold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="mb-32 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two">
                      Estimated Tax
                    </span>
                    <span className="text-gray-900 fw-semibold">
                      {formatCurrency(estimatedTax)}
                    </span>
                  </div>
                </div>
                <div className="bg-color-three rounded-8 p-24 mt-24">
                  <div className="flex-between gap-8">
                    <span className="text-gray-900 text-xl fw-semibold">
                      Total
                    </span>
                    <span className="text-gray-900 text-xl fw-semibold">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
                <div className="mt-24">
                  <div className="form-check common-check d-flex align-items-start gap-8">
                    <input
                      id="cartTermsCheck"
                      type="checkbox"
                      className="form-check-input mt-4"
                      checked={agreedToTerms}
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (e.target.checked) {
                          setShowTermsError(false);
                        }
                      }}
                    />
                    <label
                      htmlFor="cartTermsCheck"
                      className="form-check-label text-gray-700 text-sm"
                    >
                      I agree to the{" "}
                      <Link to="#" className="text-main-600 text-decoration-underline">
                        terms and conditions
                      </Link>
                    </label>
                  </div>

                  {showTermsError && (
                    <p className="text-danger-600 text-sm mt-8 mb-0">
                      Please agree to terms and conditions before checkout.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="btn btn-main mt-40 py-18 w-100 rounded-8"
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CartSection;
