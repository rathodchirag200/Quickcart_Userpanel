import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";
import Preloader from "../helper/Preloader";
import Breadcrumb from "../components/Breadcrumb";
import ShippingOne from "../components/ShippingOne";
import { getallorder } from "../redux/thunk/order.thunk";

const TRACK_STEPS = ["pending", "processing", "shipped", "delivered"];

const TrackOrderPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const orders = useSelector((state) => state.order?.orders || []);
  const orderLoading = useSelector((state) => state.order?.loading?.get);

  useEffect(() => {
    dispatch(getallorder());
  }, [dispatch]);

  const order = useMemo(() => {
    return orders.find((entry) => entry?._id === id);
  }, [orders, id]);

  const normalizeOrderStatus = (value) => {
    const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    const normalized = String(value || "pending").trim().toLowerCase();
    return allowedStatuses.includes(normalized) ? normalized : "pending";
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  };

  const statusLabel = (value) => {
    const status = normalizeOrderStatus(value);
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const statusClass = (value) => {
    const status = normalizeOrderStatus(value);

    if (status === "delivered") {
      return "bg-success-50 text-success-600";
    }

    if (status === "cancelled") {
      return "bg-danger-50 text-danger-600";
    }

    if (status === "shipped") {
      return "bg-main-50 text-main-600";
    }

    if (status === "processing") {
      return "bg-info-50 text-info-600";
    }

    return "bg-warning-50 text-warning-600";
  };

  const paymentStatusClass = (value) => {
    const status = String(value || "pending").toLowerCase();

    if (status.includes("confirm") || status.includes("deliver") || status.includes("paid")) {
      return "bg-success-50 text-success-600";
    }

    if (status.includes("cancel") || status.includes("fail")) {
      return "bg-danger-50 text-danger-600";
    }

    return "bg-warning-50 text-warning-600";
  };

  const paymentStatusLabel = (value) => {
    const normalized = String(value || "pending")
      .replace(/[_-]+/g, " ")
      .trim();

    if (!normalized) {
      return "Pending";
    }

    return normalized
      .split(" ")
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
      .join(" ");
  };

  const currentStatus = normalizeOrderStatus(order?.orderStatus || order?.status || "pending");
  const statusIndex = TRACK_STEPS.indexOf(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  const productsRaw = order?.products;
  const products = Array.isArray(productsRaw)
    ? productsRaw
    : productsRaw
      ? [productsRaw]
      : [];
  const address = order?.address || {};

  const itemsTotal = products.reduce((sum, item) => {
    const unitPrice = Number(item?.price || 0);
    const qty = Number(item?.quantity || 1);
    return sum + unitPrice * qty;
  }, 0);

  const tax = Number(order?.tax || 0);
  const finalTotal = Number(order?.totalAmount || itemsTotal + tax);

  const deliveryAddress = [address?.address, address?.city, address?.state, address?.pin]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <Breadcrumb title={"Track Order"} />

      <section className="py-80">
        <div className="container container-lg">
          <div className="border border-gray-200 rounded-16 p-20 p-sm-24 bg-white mb-24 flex-between gap-12 flex-wrap">
            <div>
              <h4 className="mb-6">Track Order</h4>
              <p className="text-gray-600 mb-0">Order ID: {id || "-"}</p>
            </div>
            <Link to="/orders" className="btn btn-outline-main rounded-8 py-10 px-16">
              <i className="ph ph-arrow-left me-6" /> Back to Orders
            </Link>
          </div>

          {orderLoading ? (
            <div className="border border-gray-200 rounded-16 p-32 bg-white text-center">
              <p className="text-gray-600 mb-0">Loading order details...</p>
            </div>
          ) : !order ? (
            <div className="border border-gray-200 rounded-16 p-32 bg-white text-center">
              <h6 className="mb-10">Order not found</h6>
              <p className="text-gray-600 mb-20">We could not find an order with this id.</p>
              <Link to="/orders" className="btn btn-main rounded-8 py-10 px-16">
                Go to My Orders
              </Link>
            </div>
          ) : (
            <div className="d-grid gap-20">
              <div className="border border-gray-200 rounded-16 p-20 p-sm-24 bg-white">
                <div className="row g-3">
                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="text-sm text-gray-600 mb-4 fw-medium">Status</p>
                    <span className={`py-4 px-10 rounded-pill text-sm ${statusClass(currentStatus)}`}>
                      {statusLabel(currentStatus)}
                    </span>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="text-sm text-gray-600 mb-4 fw-medium">Order Date</p>
                    <p className="mb-0 fw-medium">{formatDateTime(order?.createdAt)}</p>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="text-sm text-gray-600 mb-4 fw-medium">Payment</p>
                    <span className={`py-4 px-10 rounded-pill text-sm ${paymentStatusClass(order?.paymentStatus)}`}>
                      {paymentStatusLabel(order?.paymentStatus)}
                    </span>
                  </div>
                  <div className="col-lg-3 col-md-6 col-6">
                    <p className="text-sm text-gray-600 mb-4 fw-medium">Total</p>
                    <p className="mb-0 fw-medium">{formatCurrency(finalTotal)}</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-16 p-20 p-sm-24 bg-white">
                <div className="flex-between gap-12 flex-wrap mb-16">
                  <h5 className="mb-0">Tracking Timeline</h5>
                </div>

                {isCancelled ? (
                  <div className="p-14 rounded-12 bg-danger-50 text-danger-700 border border-danger-200 text-sm">
                    This order was cancelled. Contact support if you need help.
                  </div>
                ) : (
                  <div className="row g-3">
                    {TRACK_STEPS.map((step, index) => {
                      const isDone = statusIndex > index;
                      const isActive = statusIndex === index;

                      const stateClass = isDone
                        ? "border-success-200 bg-success-50"
                        : isActive
                          ? "border-main-300 bg-main-50"
                          : "border-gray-200 bg-gray-50";

                      return (
                        <div className="col-lg-3 col-sm-6" key={step}>
                          <div className={`h-100 rounded-14 p-14 border ${stateClass}`}>
                            <p className="text-xs text-gray-500 mb-6">Step {index + 1}</p>
                            <h6 className="mb-4 fw-semibold">{statusLabel(step)}</h6>
                            <p className="mb-0 text-sm text-gray-600">
                              {isDone ? "Completed" : isActive ? "In progress" : "Queued"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="row g-3">
                <div className="col-xl-7">
                  <div className="border border-gray-200 rounded-16 p-20 p-sm-24 bg-white h-100">
                    <h6 className="mb-14">Items</h6>
                    <div className="d-grid gap-12">
                      {products.map((item, index) => {
                        const qty = Number(item?.quantity || 1);
                        const unitPrice = Number(item?.price || 0);
                        const lineTotal = unitPrice * qty;
                        const imagePath = item?.image
                          ? `${String(item.image).replace(/\\/g, "/")}`
                          : "";

                        return (
                          <div
                            key={item?._id || index}
                            className="d-flex gap-14 justify-content-between flex-wrap border border-gray-100 rounded-12 p-12"
                          >
                            <div className="d-flex gap-12 align-items-center">
                              <div
                                className="rounded-8 border border-gray-200 bg-gray-50 flex-center overflow-hidden"
                                style={{ width: "80px", height: "80px", minWidth: "80px" }}
                              >
                                {imagePath ? (
                                  <img
                                    src={imagePath}
                                    alt={item?.name || "Product"}
                                    className="w-100 h-100 object-fit-contain"
                                  />
                                ) : (
                                  <i className="ph ph-image text-xl text-gray-400" />
                                )}
                              </div>

                              <div>
                                <h6 className="mb-6 fw-semibold">{item?.name || "Product"}</h6>
                                <p className="text-gray-600 mb-0 text-sm">
                                  <span className="me-10">Qty: {qty}</span>
                                  <span>{formatCurrency(unitPrice)} each</span>
                                </p>
                              </div>
                            </div>

                            <div className="text-end">
                              <p className="mb-6 fw-semibold">{formatCurrency(lineTotal)}</p>
                              {item?.productId ? (
                                <Link
                                  to={`/product-details/${item.productId}`}
                                  className="btn btn-outline-main rounded-8 py-6 px-12"
                                >
                                  View Product <i className="ph ph-arrow-right ms-4" />
                                </Link>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="col-xl-5">
                  <div className="d-grid gap-20 h-100">
                    <div className="border border-gray-200 rounded-16 p-20 p-sm-24 bg-white">
                      <h6 className="mb-14">Price Summary</h6>

                      <div className="d-grid gap-10">
                        <div className="flex-between gap-8">
                          <p className="mb-0 text-gray-600">Items Total</p>
                          <p className="mb-0 fw-medium">{formatCurrency(itemsTotal)}</p>
                        </div>
                        <div className="flex-between gap-8">
                          <p className="mb-0 text-gray-600">Tax</p>
                          <p className="mb-0 fw-medium">{formatCurrency(tax)}</p>
                        </div>
                        <div className="border-top border-dashed border-gray-200 pt-10 mt-4 flex-between gap-8">
                          <p className="mb-0 fw-semibold">Total</p>
                          <p className="mb-0 fw-semibold">{formatCurrency(finalTotal)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-16 p-20 p-sm-24 bg-white">
                      <h6 className="mb-12">Delivery Address</h6>
                      {address?.fullName ? (
                        <p className="mb-4 fw-medium text-gray-800">{address.fullName}</p>
                      ) : null}
                      <p className="mb-0 text-gray-700">{deliveryAddress || "Address not available"}</p>
                      {address?.phone ? (
                        <p className="mb-0 text-sm text-gray-500 mt-4">{address.phone}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <ShippingOne />
    </>
  );
};

export default TrackOrderPage;
