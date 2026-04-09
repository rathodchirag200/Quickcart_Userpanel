import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import Preloader from "../helper/Preloader";
import ColorInit from "../helper/ColorInit";
import Breadcrumb from "../components/Breadcrumb";
import ShippingOne from "../components/ShippingOne";
import { getfaqs } from "../redux/thunk/faqs.thunk";
import "../css/faqpage.scss";

const getFaqContent = (item, index) => {
  if (typeof item === "string") {
    return {
      id: index,
      category: "General",
      question: `Question ${index + 1}`,
      answer: item,
      status: "active",
    };
  }

  const id = item?._id || item?.id || index;
  const category = item?.category || item?.group || item?.type || "General";
  const question =
    item?.question || item?.title || item?.name || `Question ${index + 1}`;
  const answer =
    item?.answer ||
    item?.description ||
    item?.content ||
    item?.body ||
    "Answer will be updated soon.";
  const status = String(item?.status || "active").toLowerCase().trim();

  return { id, category, question, answer, status };
};

const FaqPage = () => {
  const dispatch = useDispatch();
  const { faqs: faqList, loading, error } = useSelector((state) => state.faqs);
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");

  useEffect(() => {
    dispatch(getfaqs());
  }, [dispatch]);

  const normalizedFaqs = useMemo(() => {
    if (!Array.isArray(faqList)) return [];
    return faqList.map((item, index) => getFaqContent(item, index));
  }, [faqList]);

  const activeFaqs = useMemo(() => {
    return normalizedFaqs.filter((item) => item.status === "active");
  }, [normalizedFaqs]);

  const categories = useMemo(() => {
    return [...new Set(activeFaqs.map((item) => item.category).filter(Boolean))];
  }, [activeFaqs]);

  useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const filteredFaqs = useMemo(() => {
    if (!activeCategory) return activeFaqs;
    return activeFaqs.filter((item) => item.category === activeCategory);
  }, [activeFaqs, activeCategory]);

  return (
    <>
      <ColorInit color={true} />
      <ScrollToTop smooth color="#FA6400" />
      <Preloader />

      <Breadcrumb title={"Frequently Asked Questions"} />

      <section className="faq-page py-80">
        <div className="container container-lg">
          <div className="faq-intro">
            <div className="faq-intro__title-wrap">
              <h2 className="faq-intro__title">Frequently Asked Questions</h2>
            </div>
            <div className="faq-intro__text-wrap">
              <p className="mb-0 text-gray-600">
                Find quick answers about orders, shipping, returns, payments, and
                account support. If you still need help, our team is ready to
                assist you.
              </p>
            </div>
          </div>

          <div className="faq-divider" />

          <div className="faq-layout">
            <aside className="faq-sidebar">
              <div className="faq-help-card bg-main-two-50">
                <h3 className="faq-help-card__title">Can&apos;t find your answer?</h3>
                <p className="text-gray-700 mb-24">
                  If your question is not listed here, our customer support team
                  can help with order updates, refunds, and account issues.
                </p>
                <ul className="faq-help-card__meta">
                  <li>Average response time: under 24 hours</li>
                  <li>Support hours: Monday to Saturday</li>
                </ul>
                <Link to="/contact" className="btn btn-main-two rounded-0 w-100">
                  Contact Us
                </Link>
              </div>
            </aside>

            <div className="faq-content">
              {!loading && !error && categories.length > 1 && (
                <div className="faq-categories mb-24">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`faq-chip ${
                        activeCategory === category ? "active" : ""
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              <div className="faq-content__head">
                <h3 className="mb-0">{activeCategory || "General"}</h3>
                {!loading && !error && activeFaqs.length > 0 && (
                  <p className="faq-content__meta mb-0 text-gray-500">
                    {filteredFaqs.length} question(s) in this section
                  </p>
                )}
              </div>

              {loading && (
                <p className="mb-0 text-main-600">
                  Loading frequently asked questions...
                </p>
              )}

              {!loading && error && (
                <div className="faq-feedback">
                  <p className="mb-12">
                    We could not load FAQs right now. Please try again in a moment.
                  </p>
                  <button
                    type="button"
                    className="btn btn-main"
                    onClick={() => dispatch(getfaqs())}
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && activeFaqs.length === 0 && (
                <div className="faq-feedback">
                  <p className="mb-0 text-gray-600">
                    No FAQs are available at the moment. Please check back soon.
                  </p>
                </div>
              )}

              {!loading && !error && activeFaqs.length > 0 && (
                <div className="faq-accordion">
                  {filteredFaqs.map((faq, index) => {
                    const isOpen = openId === faq.id;

                    return (
                      <div
                        key={faq.id}
                        className={`faq-item ${isOpen ? "open" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenId((prev) => (prev === faq.id ? null : faq.id))
                          }
                          className="faq-question"
                          aria-expanded={isOpen}
                        >
                          <div className="faq-question__main">
                            <h6>
                              {index + 1}. {faq.question}
                            </h6>
                          </div>
                          <i className="ph ph-plus" />
                        </button>

                        {isOpen && (
                          <div className="faq-answer">
                            <p className="mb-0 text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {filteredFaqs.length === 0 && (
                    <div className="faq-feedback">
                      <p className="mb-0 text-gray-600">
                        No questions are available in this category yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ShippingOne />
    </>
  );
};

export default FaqPage;
