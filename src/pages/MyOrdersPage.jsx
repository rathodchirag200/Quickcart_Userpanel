import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ScrollToTop from "react-scroll-to-top";
import ColorInit from "../helper/ColorInit";
import Preloader from "../helper/Preloader";
import Breadcrumb from "../components/Breadcrumb";
import ShippingOne from "../components/ShippingOne";
import ReviewModal from "../components/ReviewModal";
import {
  cancelorder,
  orderbyid,
} from "../redux/thunk/order.thunk";
import { refundpayment } from "../redux/thunk/payment.thunk";
import { getReviews } from "../redux/thunk/review.thunk";
import { updateOrderLocalStatus } from "../redux/slice/order.slice";
import { toast } from "react-toastify";

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const latestOrderId = searchParams.get("orderId") || "";

  const orders = useSelector((state) => state.order?.orders || []);
  console.log(orders , "orders") ;
  
  const orderLoading = useSelector((state) => state.order?.loading?.get);
  const currentUser = useSelector((state) => state.user?.user);
  const [existingReviewMap, setExistingReviewMap] = useState({});

  const [reviewModal, setReviewModal] = useState({
    open: false,
    orderId: "",
    productId: "",
    productName: "",
  });
  const [cancelModal, setCancelModal] = useState({
    open: false,
    order: null,
    loading: false,
  });

  useEffect(() => {
    dispatch(orderbyid());
  }, [dispatch]);

  const currentUserId = String(
    currentUser?._id || currentUser?.id || currentUser?.user?._id || "",
  );

  const getReviewKey = (orderId, productId) =>
    `${String(orderId || "")}_${String(productId || "")}`;

  useEffect(() => {
    const deliveredEntries = orders.flatMap((order) => {
      const status = String(order?.orderStatus || "").toLowerCase().trim();
      if (status !== "delivered") return [];

      const productsRaw = order?.products;
      const products = Array.isArray(productsRaw)
        ? productsRaw
        : productsRaw
          ? [productsRaw]
          : [];

      return products
        .filter((item) => item?.productId)
        .map((item) => ({
          orderId: String(order?._id || ""),
          productId: String(item?.productId || ""),
        }));
    });

    if (deliveredEntries.length === 0) {
      setExistingReviewMap({});
      return;
    }

    const deliveredKeySet = new Set(
      deliveredEntries.map((entry) => getReviewKey(entry.orderId, entry.productId)),
    );
    const uniqueProductIds = [...new Set(deliveredEntries.map((entry) => entry.productId))];

    const fetchExistingReviews = async () => {
      const reviewMap = {};

      for (const productId of uniqueProductIds) {
        try {
          const response = await dispatch(getReviews({ productId })).unwrap();
          const reviewList = Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response)
              ? response
              : [];

          reviewList.forEach((review) => {
            const reviewOrderId = String(review?.orderId?._id || review?.orderId || "");
            const reviewProductId = String(review?.productId?._id || review?.productId || "");
            const reviewUserId = String(review?.userId?._id || review?.userId || "");
            const sameUser = currentUserId ? reviewUserId === currentUserId : true;
            const key = getReviewKey(reviewOrderId, reviewProductId);

            if (sameUser && deliveredKeySet.has(key)) {
              reviewMap[key] = true;
            }
          });
        } catch (error) {
          // Ignore per-product failures and continue with others.
        }
      }

      setExistingReviewMap(reviewMap);
    };

    fetchExistingReviews();
  }, [orders, dispatch, currentUserId]);

  // Group orders by orderid; within each group sort by createdAt desc
  const groupedOrders = useMemo(() => {
    const map = new Map();
    [...orders]
      .sort((a, b) => {
        const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      })
      .forEach((order) => {
        const groupKey = order?.orderid || order?._id;
        if (!map.has(groupKey)) {
          map.set(groupKey, []);
        }
        map.get(groupKey).push(order);
      });
    return Array.from(map.entries());
  }, [orders]);

  const handlecancelorder = async (order) => {
    const docId = order?._id;
    const paymentMethod = String(order?.paymentMethod || "COD")
      .trim()
      .toLowerCase();
    const productsRaw = order?.products;
    const products = Array.isArray(productsRaw)
      ? productsRaw
      : productsRaw
        ? [productsRaw]
        : [];
    const refundAmount = products.reduce((sum, item) => {
      return sum + Number(item?.price || 0) * Number(item?.quantity || 1);
    }, 0);
    const currentOrderStatus = normalizeOrderStatus(order?.orderStatus);

    if (!docId) {
      toast.error("Order id is missing");
      return;
    }

    if (currentOrderStatus === "cancelled") {
      toast.info("Order is already cancelled");
      return;
    }

    if (currentOrderStatus === "shipped") {
      toast.info("Shipped orders cannot be cancelled");
      return;
    }

    try {
      setCancelModal((prev) => ({ ...prev, loading: true }));

      if (paymentMethod === "cod") {
        await dispatch(
          cancelorder({
            id: docId,
            data: { orderStatus: "cancelled" },
          }),
        ).unwrap();
        dispatch(
          updateOrderLocalStatus({
            orderId: docId,
            orderStatus: "cancelled",
            paymentStatus: "cancelled",
          }),
        );
        toast.success("Order cancelled successfully");
      } else if (paymentMethod === "razorpay") {
        await dispatch(refundpayment({
          orderId: docId,
          refundAmount,
        })).unwrap();
        dispatch(
          updateOrderLocalStatus({
            orderId: docId,
            orderStatus: "cancelled",
            paymentStatus: "refunded",
          }),
        );
        toast.success("Refund request submitted successfully");
      } else {
        toast.error("Unsupported payment method");
        setCancelModal((prev) => ({ ...prev, loading: false }));
        return;
      }

      setCancelModal({
        open: false,
        order: null,
        loading: false,
      });

    } catch (error) {
      setCancelModal((prev) => ({ ...prev, loading: false }));
      toast.error(
        typeof error === "string" ? error : "Failed to cancel this order",
      );
    }
  };

  const openCancelModal = (order) => {
    setCancelModal({
      open: true,
      order,
      loading: false,
    });
  };

  const closeCancelModal = () => {
    if (cancelModal.loading) return;

    setCancelModal({
      open: false,
      order: null,
      loading: false,
    });
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const normalizeOrderStatus = (value) => {
    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    const normalized = String(value || "pending")
      .trim()
      .toLowerCase();
    return allowedStatuses.includes(normalized) ? normalized : "pending";
  };

  const orderStatusClass = (value) => {
    const status = normalizeOrderStatus(value);
    if (status === "delivered") return "bg-success-50 text-success-600";
    if (status === "cancelled") return "bg-danger-50 text-danger-600";
    if (status === "shipped") return "bg-main-50 text-main-600";
    if (status === "processing") return "bg-info-50 text-info-600";
    return "bg-warning-50 text-warning-600";
  };

  const orderStatusLabel = (value) => {
    const status = normalizeOrderStatus(value);
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const statusClass = (value) => {
    const status = String(value || "pending").toLowerCase();
    if (status.includes("paid") || status.includes("confirm") || status.includes("deliver"))
      return "bg-success-50 text-success-600";
    if (status.includes("refund"))
      return "bg-info-50 text-info-600";
    if (status.includes("cancel") || status.includes("fail"))
      return "bg-danger-50 text-danger-600";
    return "bg-warning-50 text-warning-600";
  };

  const statusLabel = (value) => {
    const normalized = String(value || "pending")
      .replace(/[_-]+/g, " ")
      .trim();
    if (!normalized) return "Pending";
    return normalized
      .split(" ")
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
      .join(" ");
  };

  const openReviewModal = (order, item) => {
    if (!order?._id || !item?.productId) {
      toast.error("Order or product id is missing for review.");
      return;
    }

    setReviewModal({
      open: true,
      orderId: order._id,
      productId: item.productId,
      productName: item?.name || "Product",
    });
  };

  const closeReviewModal = () => {
    setReviewModal({
      open: false,
      orderId: "",
      productId: "",
      productName: "",
    });
  };

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />
      <Breadcrumb title={"My Orders"} />

      <section className="py-80">
        <div className="container container-lg">
          <div className="border border-gray-200 rounded-16 p-24 p-sm-32 bg-white mb-24">
            <h4 className="mb-0">Order History</h4>
          </div>

          {orderLoading ? (
            <div className="border border-gray-200 rounded-16 p-32 bg-white text-center">
              <p className="text-gray-600 mb-0">Loading orders...</p>
            </div>
          ) : groupedOrders.length === 0 ? (
            <div className="border border-gray-200 rounded-16 p-32 bg-white text-center">
              <h6 className="mb-10">No orders found</h6>
              <p className="text-gray-600 mb-20">
                Place an order from checkout and it will appear here.
              </p>
              <Link to="/shop" className="btn btn-main rounded-8 px-28 py-12">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="d-grid gap-24">
              {groupedOrders.map(([groupKey, groupItems]) => {
                const isLatest = latestOrderId && groupItems.some((o) => o._id === latestOrderId || o.orderid === latestOrderId);
                const groupDate = groupItems[0]?.createdAt;
                const groupTotal = groupItems.reduce(
                  (sum, o) => sum + Number(o?.totalAmount || 0),
                  0,
                );

                return (
                  <article
                    key={groupKey}
                    className={`border rounded-16 bg-white overflow-hidden ${
                      isLatest ? "border-main-600" : "border-gray-200"
                    }`}
                  >
                    {/* Group header */}
                    <div className="p-20 p-sm-24 border-bottom border-gray-200 flex-between gap-16 flex-wrap"
                      style={{ background: "#fff8f3" }}
                    >
                      <div>
                        <h6
                          className="mb-8 flex-align gap-8 fw-semibold"
                          style={{ fontSize: "1.18rem" }}
                        >
                          <i className="ph ph-package text-main-600" />
                          {groupKey}
                        </h6>
                        <p className="text-gray-600 text-sm mb-0 flex-align gap-8">
                          <i className="ph ph-calendar-blank" />
                          {groupDate
                            ? new Date(groupDate).toLocaleString()
                            : "-"}
                        </p>
                      </div>
                      <div className="text-end">
                        <h5 className="mb-8 fw-semibold" style={{ fontSize: "1.35rem" }}>
                          Total: {formatCurrency(groupTotal)}
                        </h5>
                        <span className="py-6 px-12 rounded-pill bg-main-50 text-main-600 text-sm">
                          {groupItems.length} item{groupItems.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Individual sub-orders */}
                    <div className="d-grid gap-0">
                      {groupItems.map((order, idx) => {
                        const docId = order?._id;
                        const productsRaw = order?.products;
                        const products = Array.isArray(productsRaw)
                          ? productsRaw
                          : productsRaw
                            ? [productsRaw]
                            : [];
                        const address = order?.address || {};
                        const currentOrderStatus = order?.orderStatus || "pending";
                        const isOrderDelivered =
                          normalizeOrderStatus(currentOrderStatus) === "delivered";
                        const isOrderShipped =
                          normalizeOrderStatus(currentOrderStatus) === "shipped";
                        const isOrderCancelled =
                          normalizeOrderStatus(currentOrderStatus) === "cancelled";

                        const itemsTotal = products.reduce((sum, item) => {
                          return sum + Number(item?.price || 0) * Number(item?.quantity || 1);
                        }, 0);
                        const tax = Number(order?.tax || 0);
                        const finalTotal = Number(order?.totalAmount || itemsTotal + tax);

                        const deliveryAddress = [
                          address?.address,
                          address?.city,
                          address?.state,
                          address?.pin,
                        ]
                          .filter(Boolean)
                          .join(", ");

                        return (
                          <div
                            key={docId || idx}
                            className={`p-20 p-sm-24 ${idx < groupItems.length - 1 ? "border-bottom border-gray-200" : ""}`}
                          >
                            {/* Products */}
                            <div className="d-grid gap-12 mb-16">
                              {products.map((item, pIdx) => {
                                const imagePath = item?.image
                                  ? `${String(item.image).replace(/\\/g, "/")}`
                                  : "";
                                const unitPrice = Number(item?.price || 0);
                                const qty = Number(item?.quantity || 1);
                                const lineTotal = unitPrice * qty;

                                return (
                                  <div
                                    key={item?._id || pIdx}
                                    className="d-flex gap-16 justify-content-between flex-wrap border border-gray-100 rounded-12 p-12"
                                  >
                                    <div className="d-flex gap-12 align-items-center">
                                      <div
                                        className="rounded-8 border border-gray-200 bg-gray-50 flex-center overflow-hidden"
                                        style={{ width: "84px", height: "84px", minWidth: "84px" }}
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
                                        <h6 className="mb-6 fw-semibold text-line-2" style={{ fontSize: "1rem" }}>
                                          {item?.name || "Product"}
                                        </h6>
                                        <p className="text-gray-600 mb-0 text-sm">
                                          <span className="me-10">Qty: {qty}</span>
                                          <span>{formatCurrency(unitPrice)} each</span>
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-end d-flex flex-column align-items-end justify-content-center gap-6">
                                      <p className="mb-0 fw-semibold">{formatCurrency(lineTotal)}</p>
                                      {item?.productId ? (
                                        <Link
                                          to={`/product-details/${item.productId}`}
                                          className="btn btn-outline-main rounded-8 py-6 px-12 text-sm"
                                        >
                                          View Product <i className="ph ph-arrow-right ms-4" />
                                        </Link>
                                      ) : null}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Order summary row */}
                            <div className="border border-gray-200 rounded-12 p-16 mb-14">
                              <div className="row g-3">
                                <div className="col-lg-2 col-md-4 col-6">
                                  <p className="text-sm text-gray-600 mb-4 fw-medium">Item Price:</p>
                                  <p className="mb-0">{formatCurrency(itemsTotal)}</p>
                                </div>
                                <div className="col-lg-2 col-md-4 col-6">
                                  <p className="text-sm text-gray-600 mb-4 fw-medium">Tax:</p>
                                  <p className="mb-0">{formatCurrency(tax)}</p>
                                </div>
                                <div className="col-lg-2 col-md-4 col-6">
                                  <p className="text-sm text-gray-600 mb-4 fw-medium">Total:</p>
                                  <p className="mb-0 fw-semibold">{formatCurrency(finalTotal)}</p>
                                </div>
                                <div className="col-lg-2 col-md-4 col-6">
                                  <p className="text-sm text-gray-600 mb-4 fw-medium">Payment Method:</p>
                                  <p className="mb-0 text-uppercase">{order?.paymentMethod || "COD"}</p>
                                </div>
                                <div className="col-lg-2 col-md-4 col-6">
                                  <p className="text-sm text-gray-600 mb-4 fw-medium">Order Status:</p>
                                  <span className={`py-4 px-10 rounded-pill text-sm ${orderStatusClass(currentOrderStatus)}`}>
                                    {orderStatusLabel(currentOrderStatus)}
                                  </span>
                                </div>
                                <div className="col-lg-2 col-md-4 col-6">
                                  <p className="text-sm text-gray-600 mb-4 fw-medium">Payment Status:</p>
                                  <span className={`py-4 px-10 rounded-pill text-sm ${statusClass(order?.paymentStatus)}`}>
                                    {statusLabel(order?.paymentStatus || "Pending")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Delivery address */}
                            <div className="border border-gray-200 rounded-12 p-14 mb-16">
                              <p className="text-sm fw-medium mb-4 flex-align gap-6">
                                <i className="ph ph-map-pin text-main-600" /> Delivery Address
                              </p>
                              <p className="text-gray-700 mb-0 text-sm">
                                {address?.fullName ? (
                                  <span className="fw-medium me-8">{address.fullName}</span>
                                ) : null}
                                {deliveryAddress || "Address not available"}
                                {address?.phone ? (
                                  <span className="ms-8 text-gray-500">· {address.phone}</span>
                                ) : null}
                              </p>
                            </div>

                            {/* Per-order actions */}
                            <div className="d-flex gap-10 justify-end flex-wrap pt-4 align-items-center">
                              {!isOrderCancelled ? (
                                <button
                                  type="button"
                                  className="btn btn-main rounded-8 py-10 px-16"
                                  onClick={() => docId && navigate(`/orders/track/${docId}`)}
                                  disabled={!docId}
                                >
                                  <i className="ph ph-map-pin me-6" /> Track Order
                                </button>
                              ) : null}
                              
                              {isOrderDelivered && products.length > 0 ? (
                                <div className="d-flex gap-10 flex-wrap">
                                  {products.map((item) => (
                                    item?.productId ? (
                                      <button
                                        key={`review-${item?.productId}`}
                                        type="button"
                                        onClick={() => openReviewModal(order, item)}
                                        className="btn btn-main rounded-8 py-10 px-16"
                                      >
                                        <i className="ph ph-star me-6" />
                                        {existingReviewMap[getReviewKey(order?._id, item?.productId)]
                                          ? "Edit Review"
                                          : "Add Review"}
                                      </button>
                                    ) : null
                                  ))}
                                </div>
                              ) : null}
                              
                              {isOrderCancelled ? (
                                <button
                                  type="button"
                                  className="rounded-8 py-10 px-16 bg-danger-50 text-danger-600 border border-danger-100"
                                  disabled
                                >
                                  <i className="ph ph-x-circle me-6" /> Order Cancelled
                                </button>
                              ) : !isOrderDelivered && !isOrderShipped ? (
                                <button
                                  onClick={() => openCancelModal(order)}
                                  type="button"
                                  className="rounded-8 py-10 px-16 bg-red-600 text-white border border-red-600"
                                >
                                  <i className="ph ph-trash me-6" /> Cancel Order
                                </button>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <ReviewModal
        isOpen={reviewModal.open}
        onClose={closeReviewModal}
        orderId={reviewModal.orderId}
        productId={reviewModal.productId}
        productName={reviewModal.productName}
        onSubmitSuccess={(savedReview) => {
          const orderId = String(savedReview?.orderId?._id || savedReview?.orderId || reviewModal.orderId || "");
          const productId = String(savedReview?.productId?._id || savedReview?.productId || reviewModal.productId || "");
          if (orderId && productId) {
            const key = getReviewKey(orderId, productId);
            setExistingReviewMap((prev) => ({ ...prev, [key]: true }));
          }
        }}
      />

      {cancelModal.open ? (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: 1060 }}
        >
          <div className="bg-white rounded-16 p-24 w-100" style={{ maxWidth: "520px" }}>
            <h5 className="mb-10">Confirm Cancellation</h5>
            <p className="text-gray-700 mb-16">Are you sure you want to cancel this order?</p>
            <div className="border border-gray-200 rounded-12 p-12 mb-18">
              <p className="mb-6 text-sm text-gray-600">Order ID</p>
              <p className="mb-0 fw-semibold">
                {cancelModal.order?.orderid || cancelModal.order?._id || "-"}
              </p>
            </div>
            <div className="d-flex justify-content-end gap-10">
              <button
                type="button"
                className="btn rounded-8 px-18 py-10"
                style={{ backgroundColor: "#6b7280", borderColor: "#6b7280", color: "#fff" }}
                onClick={closeCancelModal}
                disabled={cancelModal.loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger rounded-8 px-18 py-10"
                onClick={() => handlecancelorder(cancelModal.order)}
                disabled={cancelModal.loading}
              >
                {cancelModal.loading ? "Cancelling..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ShippingOne />
    </>
  );
};

export default MyOrdersPage;
