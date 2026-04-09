import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAddress,
  deleteAddress,
  getaddressbyid,
  updateAddress,
} from "../redux/thunk/address.thunk";
import { changePassword, userupdate } from "../redux/thunk/auth.thunk";
import "../css/profile.scss";
import { toast } from "react-toastify";

export const Profile = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user?.user);
  const userLoading = useSelector((state) => state.user?.loading);
  const addressState = useSelector((state) => state.address);

  const addresses = addressState?.addresses || [];
  const addressLoading = addressState?.loading || {};

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    pin: "",
    address: "",
    city: "",
    state: "",
  });

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [addressMessage, setAddressMessage] = useState("");

  useEffect(() => {
    if (user?._id) {
      dispatch(getaddressbyid());
      setProfileForm({
        username: user?.username || user?.name || "",
        email: user?.email || "",
      });
    }
  }, [dispatch, user?._id]);

  const initials = useMemo(() => {
    const source =
      profileForm.username || user?.username || user?.name || "User";
    return source
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profileForm.username, user?.name, user?.username]);

  const avatarSrc = profileImagePreview
    ? profileImagePreview
    : user?.image
      ? `${user.image}`
      : "";
  const handleProfileInput = (event) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordInput = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressInput = (event) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);

    const preview = URL.createObjectURL(file);
    setProfileImagePreview(preview);
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage("");

    try {
      let payload = {
        username: profileForm.username,
        name: profileForm.username,
        email: profileForm.email,
      };

      if (profileImageFile) {
        const formData = new FormData();
        formData.append("username", profileForm.username || "");
        formData.append("name", profileForm.username || "");
        formData.append("email", profileForm.email || "");
        formData.append("image", profileImageFile);
        payload = formData;
      }

      await dispatch(userupdate(payload)).unwrap();
      toast.success("Profile updated successfully.");
      setIsEditingProfile(false);
    } catch (error) {
      setProfileMessage(
        typeof error === "string" ? error : "Unable to update profile.",
      );
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage("New password and confirm password must match.");
      return;
    }

    try {
      await dispatch(
        changePassword({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }),
      ).unwrap();

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password changed successfully.");
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Unable to change password.",
      );
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      title: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      country: "India",
    });
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const startAddAddress = () => {
    setAddressMessage("");
    setEditingAddressId(null);
    setAddressForm({
      fullName: "",
      phone: "",
      pin: "",
      address: "",
      city: "",
      state: "",
    });
    setShowAddressForm(true);
  };

  const startEditAddress = (item) => {
    setAddressMessage("");
    setEditingAddressId(item?._id || item?.id);
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

  const handleAddressSubmit = async (event) => {
    event.preventDefault();
    setAddressMessage("");

    const payload = {
      fullName: addressForm.fullName,
      phone: addressForm.phone,
      pin: addressForm.pin,
      address: addressForm.address,
      city: addressForm.city,
      state: addressForm.state,
    };

    try {
      if (editingAddressId) {
        await dispatch(
          updateAddress({ id: editingAddressId, data: payload }),
        ).unwrap();
        setAddressMessage("Address updated successfully.");
      } else {
        await dispatch(createAddress(payload)).unwrap();
        setAddressMessage("Address added successfully.");
      }

      await dispatch(getaddressbyid()).unwrap();
      resetAddressForm();
    } catch (error) {
      setAddressMessage(
        typeof error === "string" ? error : "Unable to save address.",
      );
    }
  };

  const handleDeleteAddress = async (id) => {
    setAddressMessage("");
    try {
      await dispatch(deleteAddress(id)).unwrap();
      await dispatch(getaddressbyid()).unwrap();
      setAddressMessage("Address deleted successfully.");
    } catch (error) {
      setAddressMessage(
        typeof error === "string" ? error : "Unable to delete address.",
      );
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-tabs" role="tablist" aria-label="Profile Tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "address" ? "active" : ""}`}
            onClick={() => setActiveTab("address")}
          >
            Address
          </button>
        </div>

        {!user && !userLoading ? (
          <div className="empty-box">
            Please log in to view your profile details.
          </div>
        ) : null}

        {activeTab === "profile" && user ? (
          <section className="profile-section">
            <div className="section-head section-head-inline">
              <div>
                <h3>Profile Details</h3>
                <p>
                  Fetched from your account data. Phone is not available in your
                  API response.
                </p>
              </div>
              {!isEditingProfile ? (
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => {
                    setProfileForm({
                      username: user?.username || user?.name || "",
                      email: user?.email || "",
                    });
                    setIsEditingProfile(true);
                    setProfileMessage("");
                  }}
                >
                  Edit Profile
                </button>
              ) : null}
            </div>

            <div className="profile-card">
              <div className="profile-top">
                <div className="avatar-wrap">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt="Profile"
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-fallback">{initials}</div>
                  )}
                </div>

                <div className="identity-block">
                  <h4>{user?.username || user?.name || "User"}</h4>
                  <p>{user?.email || "No email added"}</p>
                </div>
              </div>

              {!isEditingProfile ? (
                <div className="details-grid">
                  <div className="detail-item">
                    <span>User ID</span>
                    <p>{user?._id || "-"}</p>
                  </div>
                  <div className="detail-item">
                    <span>Username</span>
                    <p>{user?.username || user?.name || "-"}</p>
                  </div>
                  <div className="detail-item">
                    <span>Email</span>
                    <p>{user?.email || "-"}</p>
                  </div>
                  <div className="detail-item">
                    <span>Role</span>
                    <p>{user?.role || "user"}</p>
                  </div>
                  <div className="detail-item">
                    <span>Verified</span>
                    <p>{user?.isverified ? "Yes" : "No"}</p>
                  </div>
                  <div className="detail-item">
                    <span>Created</span>
                    <p>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
              ) : (
                <form className="profile-form" onSubmit={handleProfileSubmit}>
                  <div className="form-grid">
                    <div className="field">
                      <label>Name</label>
                      <input
                        name="username"
                        type="text"
                        value={profileForm.username}
                        onChange={handleProfileInput}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileInput}
                        disabled
                      />
                    </div>
                    <div className="field full">
                      <label>Profile Image</label>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                  <div className="action-row">
                    <button
                      className="primary-btn"
                      type="submit"
                      disabled={userLoading}
                    >
                      {userLoading ? "Saving..." : "Save Profile"}
                    </button>
                    <button
                      className="ghost-btn"
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileImageFile(null);
                        setProfileImagePreview("");
                        setProfileMessage("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {profileMessage ? (
                <p className="status-text">{profileMessage}</p>
              ) : null}
            </div>
          </section>
        ) : null}

        {activeTab === "password" && user ? (
          <section className="profile-section">
            <div className="section-head">
              <h3>Change Password</h3>
              <p>Update your account password securely.</p>
            </div>
            <div className="profile-card">
              <form className="password-form" onSubmit={handlePasswordSubmit}>
                <div className="field">
                  <label>Current Password</label>
                  <input
                    name="oldPassword"
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordInput}
                    placeholder="Current password"
                    required
                  />
                </div>
                <div className="form-grid">
                  <div className="field">
                    <label>New Password</label>
                    <input
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInput}
                      placeholder="New password"
                      required
                    />
                  </div>
                  <div className="field">
                    <label>Confirm Password</label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInput}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
                <button
                  className="primary-btn1"
                  type="submit"
                  disabled={userLoading}
                >
                  Update Password
                </button>
                {passwordMessage ? (
                  <p className="status-text">{passwordMessage}</p>
                ) : null}
              </form>
            </div>
          </section>
        ) : null}

        {activeTab === "address" && user ? (
          <section className="address-section">
            <div className="section-head section-head-inline">
              <h3>Address</h3>
              <button
                className="secondary-btn"
                type="button"
                onClick={startAddAddress}
              >
                Add Address
              </button>
            </div>

            {showAddressForm ? (
              <form className="address-form" onSubmit={handleAddressSubmit}>
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
                    disabled={addressLoading.create || addressLoading.update}
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
            ) : null}

         <div className="address-list">
  {addresses?.length ? (
    addresses.map((item) => {
      const id = item?._id || item?.id;

      return (
        <article className="address-item" key={id}>
          
          <div className="address-info">

            <h4 className="address-name">
              {item?.fullName || "Customer"}
            </h4>

            <p className="address-line">
              {item?.address || "-"}
            </p>

            <p className="address-location">
              {item?.city || "-"}, {item?.state || "-"} {item?.pin || ""}
            </p>

            <p className="address-phone">
              Phone: {item?.phone || "No phone"}
            </p>

          </div>

          <div className="item-actions">
            <button
              type="button"
              className="link-btn"
              onClick={() => startEditAddress(item)}
            >
              Edit
            </button>

            <button
              type="button"
              className="link-btn danger"
              onClick={() => handleDeleteAddress(id)}
              disabled={addressLoading.delete}
            >
              Delete
            </button>
          </div>

        </article>
      );
    })
  ) : (
    <div className="empty-box">
      No addresses found. Add your first address.
    </div>
  )}
</div>

            {addressMessage ? (
              <p className="status-text">{addressMessage}</p>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
};
