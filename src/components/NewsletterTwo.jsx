import React from "react";
import "../css/newslettertwo.scss";

const NewsletterTwo = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="newsletter-two-block">
      <div className="newsletter-two-inner">
        <div className="newsletter-two-left">
          <div className="newsletter-two-icon" aria-hidden="true">
            <img src="assets/images/icon/envelop.png" alt="" />
          </div>
          <div>
            <h3>Join Our Newsletter, Get 10% Off</h3>
            <p>Get all latest information on events, sales and offers</p>
          </div>
        </div>

        <form className="newsletter-two-form" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Enter your email address"
            aria-label="Email address"
          />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterTwo;