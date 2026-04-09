import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  createAddress,
  deleteAddress,
  getaddressbyid,
  updateAddress,
} from "../redux/thunk/address.thunk";
import "../css/profile.scss";
import { addorder } from "../redux/thunk/order.thunk";
import { createpayment, verifypayment } from "../redux/thunk/payment.thunk";
import { clearcart, getcart } from "../redux/thunk/cart.thunk";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    pin: "",
    address: "",
    city: "",
    state: "",
  });

  const user = useSelector((state) => state.user?.user);
  const cart = useSelector((state) => state.cart.cart);
  const addressState = useSelector((state) => state.address);
  const addresses = addressState?.addresses || [];
  const addressLoading = addressState?.loading || {};

  const cartItems = cart?.items || [];
  const isCartEmpty = cartItems.length === 0;

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (item.price) * (item.quantity ),
    0,
  );
  const estimatedTax = subtotal * 0.04;
  const total = subtotal + estimatedTax;


  console.log(total , "total");

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);

  useEffect(() => {
    if (user?._id) {
      dispatch(getaddressbyid());
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0]?._id || "");
    }
  }, [addresses, selectedAddressId]);

  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };

  const handleAddressInput = (event) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      phone: "",
      pin: "",
      address: "",
      city: "",
      state: "",
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleEditAddress = (item) => {
    setEditingAddressId(item?._id || item?.id || null);
    setAddressForm({
      fullName: item?.fullName || "",
      phone: item?.phone || "",
      pin: item?.pin || "",
      address: item?.address || "",
      city: item?.city || "",
      state: item?.state || "",
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id) => {
    try {
      await dispatch(deleteAddress(id)).unwrap();
      const refreshed = await dispatch(getaddressbyid()).unwrap();
      const nextAddresses = refreshed?.data || [];

      if (selectedAddressId === id) {
        setSelectedAddressId(nextAddresses[0]?._id || "");
      }

      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to delete address",
      );
    }
  };

  const handleCreateAddress = async (event) => {
    event.preventDefault();

    try {
      let savedId = editingAddressId;

      if (editingAddressId) {
        const updated = await dispatch(
          updateAddress({ id: editingAddressId, data: addressForm }),
        ).unwrap();
        savedId = updated?.data?._id || editingAddressId;
        toast.success("Address updated successfully");
      } else {
        const created = await dispatch(createAddress(addressForm)).unwrap();
        savedId = created?.data?._id || "";
        toast.success("Address added successfully");
      }

      await dispatch(getaddressbyid()).unwrap();
      setSelectedAddressId(savedId);
      resetAddressForm();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to save address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select or add an address");
      return;
    }

    try {
      const orderRes = await dispatch(
        addorder({
          addressId: selectedAddressId,
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          totalAmount: total,
          paymentMethod: selectedPayment === "cod" ? "COD" : "Razorpay",
          tax : estimatedTax,
        }),
      ).unwrap();

      const createdOrders = Array.isArray(orderRes?.data)
        ? orderRes.data
        : orderRes?.data
          ? [orderRes.data]
          : [];

      const orderId =
        createdOrders[0]?.orderid ||
        orderRes?.orderid ||
        orderRes?.data?.orderid;

      if (!orderId) {
        throw "Order id missing in create order response";
      }

      if (selectedPayment === "razorpay") {
        const paymentRes = await dispatch(
          createpayment({
            amount: total,
            orderId,
          }),
        ).unwrap();
        
        

        const options = {
          key: paymentRes.key,
          amount: total * 100,
          currency: "INR",
          order_id: paymentRes.razorpayOrderId,

          handler: async function (response) {
            try {
              await dispatch(
                verifypayment({
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  amount: total,
                  currency: "INR",
                }),
              ).unwrap();

              await dispatch(clearcart()).unwrap();
              toast.success("Payment successful");
              navigate(`/orders?orderId=${encodeURIComponent(orderId)}`);
            } catch (err) {
              toast.error("Payment verification failed");
            }
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await dispatch(clearcart()).unwrap();
        toast.success("Order placed successfully with COD");
        navigate(`/orders?orderId=${encodeURIComponent(orderId)}`);
      }
    } catch (err) {
      toast.error(err || "Failed to place order");
    }
  };

  return (
    <section className="checkout py-80">
      <div className="container container-lg">
        <div className="mb-40 text-center">
          <h2 className="mb-8">Checkout</h2>
          <p className="text-gray-600 mb-0">
            Review your address, payment method, and order details before
            placing your order.
          </p>
        </div>
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <div className="pe-xl-5">
              <div className="border border-gray-100 rounded-12 p-24 p-sm-32 mb-24">
                <div className="flex-between gap-12 flex-wrap mb-24 pb-20 border-bottom border-gray-100">
                  <h5 className="mb-0">Shipping Address</h5>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="btn btn-main py-10 px-20 rounded-8"
                  >
                    {showAddressForm ? "Close Form" : "Add Address"}
                  </button>
                </div>

                {addressLoading.get ? (
                  <p className="text-gray-600 mb-0">Loading address...</p>
                ) : addresses.length > 0 ? (
                  <div className="address-list checkout-address-list">
                    {addresses.map((item) => {
                      const currentId = item?._id || "";
                      const isSelected = selectedAddressId === currentId;

                      return (
                        <article
                          className={`address-item checkout-address-card ${
                            isSelected ? "checkout-address-card--active" : ""
                          }`}
                          key={currentId}
                        >
                          <div className="address-info checkout-address-info">
                            <label
                              className="checkout-address-selector"
                              htmlFor={`checkout-address-${currentId}`}
                            >
                              <input
                                id={`checkout-address-${currentId}`}
                                type="radio"
                                name="selectedAddress"
                                checked={isSelected}
                                onChange={() => setSelectedAddressId(currentId)}
                              />
                              <span className="checkout-address-radio" />
                              <span className="checkout-address-labels">
                                <span className="address-name checkout-address-name">
                                  {item?.fullName || "Customer"}
                                </span>
                                {isSelected && (
                                  <span className="checkout-address-badge">
                                    Selected
                                  </span>
                                )}
                              </span>
                            </label>

                            <p className="address-line">
                              {item?.address || "-"}
                            </p>
                            <p className="address-location">
                              {item?.city || "-"}, {item?.state || "-"}{" "}
                              {item?.pin || ""}
                            </p>
                            <p className="address-phone">
                              Phone: {item?.phone || "No phone"}
                            </p>
                          </div>

                          <div className="item-actions">
                            <button
                              type="button"
                              className="link-btn"
                              onClick={() => handleEditAddress(item)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="link-btn danger"
                              onClick={() => handleDeleteAddress(currentId)}
                              disabled={addressLoading.delete}
                            >
                              Delete
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-12 p-24 text-center">
                    <h6 className="mb-8">Address not found</h6>
                    <p className="text-gray-600 mb-0">
                      Please click Add Address to continue checkout.
                    </p>
                  </div>
                )}

                {showAddressForm && (
                  <form
                    className="address-form mt-24 pt-24 border-top border-gray-100"
                    onSubmit={handleCreateAddress}
                  >
                    <div className="form-grid">
                      <div className="field">
                        <label>Full Name</label>
                        <input
                          name="fullName"
                          type="text"
                          value={addressForm.fullName}
                          onChange={handleAddressInput}
                          placeholder="Enter full name"
                          required
                        />
                      </div>

                      <div className="field">
                        <label>Phone</label>
                        <input
                          name="phone"
                          type="text"
                          value={addressForm.phone}
                          onChange={handleAddressInput}
                          placeholder="Contact number"
                          required
                        />
                      </div>

                      <div className="field">
                        <label>Pincode</label>
                        <input
                          name="pin"
                          type="text"
                          value={addressForm.pin}
                          onChange={handleAddressInput}
                          placeholder="Pincode"
                          required
                        />
                      </div>

                      <div className="field full">
                        <label>Full Address</label>
                        <input
                          name="address"
                          type="text"
                          value={addressForm.address}
                          onChange={handleAddressInput}
                          placeholder="Flat, area, street"
                          required
                        />
                      </div>

                      <div className="field">
                        <label>City</label>
                        <input
                          name="city"
                          type="text"
                          value={addressForm.city}
                          onChange={handleAddressInput}
                          placeholder="City"
                          required
                        />
                      </div>

                      <div className="field">
                        <label>State</label>
                        <input
                          name="state"
                          type="text"
                          value={addressForm.state}
                          onChange={handleAddressInput}
                          placeholder="State"
                          required
                        />
                      </div>
                    </div>

                    <div className="action-row">
                      <button
                        className="primary-btn"
                        type="submit"
                        disabled={
                          addressLoading.create || addressLoading.update
                        }
                      >
                        {editingAddressId ? "Update Address" : "Save Address"}
                      </button>

                      <button
                        className="ghost-btn"
                        type="button"
                        onClick={resetAddressForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
                <div className="mt-24 rounded-12 bg-main-50 border border-main-100 p-18">
                  <div className="flex-align gap-10 mb-8">
                    <span className="w-32 h-32 rounded-circle bg-main-600 text-white flex-center">
                      <i className="ph ph-map-pin-line" />
                    </span>
                    <h6 className="mb-0 text-md">Billing Address</h6>
                  </div>
                  <p className="text-gray-700 mb-0 text-sm">
                    The selected address above will be used for both shipping
                    and billing.
                  </p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-12 p-24 p-sm-32">
                <div className="mb-24 pb-20 border-bottom border-gray-100">
                  <h5 className="mb-8">Payment Method</h5>
                  <p className="text-gray-600 mb-0 text-sm">
                    Choose how you want to pay for this order.
                  </p>
                </div>

                <div className="payment-item">
                  <div className="form-check common-check common-radio py-16 mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      id="paymentCOD"
                      value="cod"
                      checked={selectedPayment === "cod"}
                      onChange={handlePaymentChange}
                    />
                    <label
                      className="form-check-label fw-semibold text-neutral-600"
                      htmlFor="paymentCOD"
                    >
                      Cash on delivery
                    </label>
                  </div>
                  {selectedPayment === "cod" && (
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                      <p className="text-gray-800 mb-0">
                        Pay in cash when your order is delivered to your
                        address.
                      </p>
                    </div>
                  )}
                </div>

                <div className="payment-item">
                  <div className="form-check common-check common-radio py-16 mb-0">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="payment"
                      id="paymentRazorpay"
                      value="razorpay"
                      checked={selectedPayment === "razorpay"}
                      onChange={handlePaymentChange}
                    />
                    <label
                      className="form-check-label fw-semibold text-neutral-600"
                      htmlFor="paymentRazorpay"
                    >
                      Razorpay
                    </label>
                  </div>
                  {selectedPayment === "razorpay" && (
                    <div className="payment-item__content px-16 py-24 rounded-8 bg-main-50 position-relative d-block">
                      <p className="text-gray-800 mb-0">
                        Complete your payment securely using Razorpay after
                        confirming the order.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4">
            <div className="checkout-sidebar">
              <div className="bg-color-three rounded-8 p-24 text-center">
                <span className="text-gray-900 text-xl fw-semibold">
                  Your Orders
                </span>
              </div>
              <div className="border border-gray-100 rounded-8 px-24 py-40 mt-24">
                <div className="mb-32 pb-32 border-bottom border-gray-100 flex-between gap-8">
                  <span className="text-gray-900 fw-medium text-xl font-heading-two">
                    Product
                  </span>
                  <span className="text-gray-900 fw-medium text-xl font-heading-two">
                    Subtotal
                  </span>
                </div>
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex-between gap-16 mb-20"
                    >
                      <div className="flex-align gap-10">
                        <img
                          src={`${item.image}`}
                          alt={item.name}
                          className="w-48 h-48 rounded-8 border border-gray-100 object-fit-contain"
                        />
                        <div>
                          <span
                            className="text-gray-900 fw-normal text-sm d-block text-line-2"
                            style={{ maxWidth: "140px" }}
                          >
                            {item.name}
                          </span>
                          <span className="text-gray-600 text-xs">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="text-gray-900 fw-bold text-sm font-heading-two">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 mb-24">No products in cart</p>
                )}

                <div className="border-top border-gray-100 pt-30  mt-30">
                  <div className="mb-32 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                      Subtotal
                    </span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="mb-32 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                      Estimated Tax
                    </span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">
                      {formatCurrency(estimatedTax)}
                    </span>
                  </div>
                  <div className="mb-0 flex-between gap-8">
                    <span className="text-gray-900 font-heading-two text-xl fw-semibold">
                      Total
                    </span>
                    <span className="text-gray-900 font-heading-two text-md fw-bold">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-32 pt-32 border-top border-gray-100">
                <p className="text-gray-500">
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our{" "}
                  <Link
                    to="#"
                    className="text-main-600 text-decoration-underline"
                  >
                    {" "}
                    privacy policy
                  </Link>{" "}
                  .
                </p>
              </div>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="btn btn-main mt-56 py-18 w-100 rounded-8"
                disabled={isCartEmpty}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
