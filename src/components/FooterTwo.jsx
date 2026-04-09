import React from 'react'
import { Link } from 'react-router-dom'
import Logo from "./Logo"

const FooterTwo = () => {
    return (
        <footer className="footer py-80">
            <div className="container container-lg">
                <div className="footer-item-two-wrapper d-flex align-items-start flex-wrap">
                    <div className="footer-item max-w-275">
                        <div className="footer-item__logo">
                            <Logo />
                        </div>
                        <p className="mb-24">
                            Quickcart has become the largest computer parts, gaming pc parts, and
                            other IT related products store.
                        </p>
                        <div className="flex-align gap-16 mb-16">
                            <span className="w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0">
                                <i className="ph-fill ph-phone-call" />
                            </span>
                            <a href="tel:+00123456789" className="text-md text-gray-900 hover-text-main-600">
                                +91 9725391505
                            </a>
                        </div>
                        <div className="flex-align gap-16 mb-16">
                            <span className="w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0">
                                <i className="ph-fill ph-envelope" />
                            </span>
                            <a href="mailto:support24@quickcart.com" className="text-md text-gray-900 hover-text-main-600">
                                support24@quickcart.com
                            </a>
                        </div>
                        <div className="flex-align gap-16 mb-16">
                            <span className="w-32 h-32 flex-center rounded-circle border border-gray-100 text-main-two-600 text-md flex-shrink-0">
                                <i className="ph-fill ph-map-pin" />
                            </span>
                            <span className="text-md text-gray-900 ">
                               4061 , settings infotech , silver buisness point , utran , surat
                            </span>
                        </div>
                    </div>
                    <div className="footer-item">
                        <h6 className="footer-item__title">About us</h6>
                        <ul className="footer-menu">
                            <li className="mb-16">
                                <Link to="/about" className="text-gray-600 hover-text-main-600">
                                    About Us
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/contact" className="text-gray-600 hover-text-main-600">
                                    Contact Us
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/faq" className="text-gray-600 hover-text-main-600">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-item">
                        <h6 className="footer-item__title">Customer Support</h6>
                        <ul className="footer-menu">
                            <li className="mb-16">
                                <Link to="/faq" className="text-gray-600 hover-text-main-600">
                                    Help Center
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/orders" className="text-gray-600 hover-text-main-600">
                                    Track Orders
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Shop Products
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-item">
                        <h6 className="footer-item__title">My Account</h6>
                        <ul className="footer-menu">
                            <li className="mb-16">
                                <Link to="/profile" className="text-gray-600 hover-text-main-600">
                                    My Account
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/orders" className="text-gray-600 hover-text-main-600">
                                    Order History
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/cart" className="text-gray-600 hover-text-main-600">
                                    Shopping Cart
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/wishlist" className="text-gray-600 hover-text-main-600">
                                    Wishlist
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/login" className="text-gray-600 hover-text-main-600">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-item">
                        <h6 className="footer-item__title">Information</h6>
                        <ul className="footer-menu">
                            <li className="mb-16">
                                <Link to="/shop" className="text-gray-600 hover-text-main-600">
                                    Shop
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/product-details/1" className="text-gray-600 hover-text-main-600">
                                    Product Details
                                </Link>
                            </li>
                            <li className="mb-16">
                                <Link to="/cart" className="text-gray-600 hover-text-main-600">
                                    Cart
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-item">
                        <h6 className="">Shop on The Go</h6>
                        <p className="mb-16">Quickcart App is available. Get it now</p>
                        <div className="flex-align gap-8 my-32">
                            <a href="https://www.apple.com/store" target="_blank" rel="noreferrer" className="">
                                <img src="assets/images/thumbs/store-img1.png" alt="" />
                            </a>
                            <a href="https://play.google.com/store/apps?hl=en" target="_blank" rel="noreferrer" className="">
                                <img src="assets/images/thumbs/store-img2.png" alt="" />
                            </a>
                        </div>
                        <ul className="flex-align gap-16">
                            <li>
                                <a
                                    href="https://www.facebook.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white"
                                >
                                    <i className="ph-fill ph-facebook-logo" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.twitter.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white"
                                >
                                    <i className="ph-fill ph-twitter-logo" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white"
                                >
                                    <i className="ph-fill ph-instagram-logo" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.linkedin.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-44 h-44 flex-center bg-main-two-50 text-main-two-600 text-xl rounded-8 hover-bg-main-two-600 hover-text-white"
                                >
                                    <i className="ph-fill ph-linkedin-logo" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>

    )
}

export default FooterTwo