import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LuUserRound } from "react-icons/lu";
import { VscAccount } from "react-icons/vsc";
import { FaRegHeart } from "react-icons/fa";
import { FiShoppingCart, FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import "../css/header.scss";
import { logout } from "../redux/slice/auth.slice";
import Logo from "./Logo";

const HeaderTwo = () => {
  const user = useSelector((state) => state.user?.user);
  const cartItems = useSelector((state) => state.cart.cart?.items || []);
  const cartCount = cartItems.length;

  const wishlistItems = useSelector((state) => state.wishlist.wishlist || []);
  const wishlistCount = wishlistItems.length;

  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <div className={`mobile-sidebar ${sidebar ? "active" : ""}`}>
        <div className="sidebar-header">
          <IoClose onClick={() => setSidebar(false)} />
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shop">Shop</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/faq">FAQ</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>

      {sidebar && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebar(false)}
        ></div>
      )}

      {/* HEADER */}
      <header className="header-top">
        <div className="container header-wrapper">
          {/* LOGO */}
          <div className="logo">
            <Logo textWhite={true} />
          </div>

          <nav className="navbar">
            <ul className="menu">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          <div className="header-icons">
            <div className="icon-item profile">
              <div
                className="profile-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {user ? (
                  <VscAccount />
                ) : (
                  <Link to="/login" className="text-white">
                    <LuUserRound />
                  </Link>
                )}
              </div>

              {user && showDropdown && (
                <div className="profile-dropdown">
                  <div className="dropdown-username text-black text-[16px] pl-[20px] pb-[10px]">
                    {user?.email}
                  </div>

                  <Link to="/orders" onClick={() => setShowDropdown(false)}>
                    My Orders
                  </Link>

                  <Link to="/profile" onClick={() => setShowDropdown(false)}>
                    My Details
                  </Link>

                  <button
                    className="logout-btn"
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <Link to="/wishlist" className="icon-item desktop-only">
              <FaRegHeart />
              <span className="wishlist-badge">{wishlistCount}</span>
            </Link>

            <Link to="/cart" className="icon-item desktop-only cart-icon">
              <FiShoppingCart />
              <span className="cart-badge">{cartCount}</span>{" "}
            </Link>

            {/* MOBILE MENU */}
            <div className="mobile-menu-btn" onClick={() => setSidebar(true)}>
              <FiMenu />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderTwo;
