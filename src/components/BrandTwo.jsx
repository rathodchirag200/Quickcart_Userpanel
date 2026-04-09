import React from 'react';
import Slider from 'react-slick';

const BrandTwo = () => {
    // Custom Arrow Components
    function SampleNextArrow(props) {
        const { className, onClick } = props;
        return (
            <button
                type="button" onClick={onClick}
                className={`${className} slick-next slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-two-600 text-xl hover-bg-main-two-600 hover-text-white transition-1`}
            >
                <i className="ph ph-caret-right" />
            </button>
        );
    }

    function SamplePrevArrow(props) {
        const { className, onClick } = props;
        return (
            <button
                type="button"
                onClick={onClick}
                className={`${className} slick-prev slick-arrow flex-center rounded-circle border border-gray-100 hover-border-main-two-600 text-xl hover-bg-main-two-600 hover-text-white transition-1`}
            >
                <i className="ph ph-caret-left" />
            </button>
        );
    }

    const brands = [
        { name: "Apple", img: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
        { name: "Sony", img: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
        { name: "Xiaomi", img: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg" },
        { name: "Bosch", img: "https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg" },
        { name: "Dell", img: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg" },
        { name: "HP", img: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg" },
        { name: "Microsoft", img: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
        { name: "Nvidia", img: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
        { name: "Logitech", img: "https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg" },
        { name: "Google", img: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
        { name: "Nintendo", img: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg" },
    ];

    const settings = {
        dots: false,
        arrows: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 8,
        slidesToScroll: 2, // Changed to 2 for better UX with 20 items
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            { breakpoint: 1599, settings: { slidesToShow: 7 } },
            { breakpoint: 1199, settings: { slidesToShow: 5 } },
            { breakpoint: 768, settings: { slidesToShow: 3 } },
            { breakpoint: 424, settings: { slidesToShow: 2 } },
        ],
    };

    return (
        <div className="top-brand py-80">
            <div className="container container-lg">
                <div className="border border-gray-100 p-24 rounded-16">
                    <div className="section-heading mb-24">
                        <div className="flex-between flex-wrap gap-8">
                            <h5 className="mb-0">Top Brands: TV, Mobile & Appliances</h5>
                        </div>
                    </div>
                    <div className="top-brand__slider">
                        <Slider {...settings}>
                            {brands.map((brand, index) => (
                                <div key={index} className="px-8">
                                    <div className="top-brand__item flex-center rounded-8 border border-gray-100 hover-border-main-two-600 transition-1 p-16" style={{ height: '80px' }}>
                                        <img 
                                            src={brand.img} 
                                            alt={brand.name} 
                                            className="w-100 h-100"
                                            style={{ objectFit: 'contain', filter: 'grayscale(100%) brightness(0.5)' }} 
                                            onMouseOver={(e) => e.currentTarget.style.filter = 'none'}
                                            onMouseOut={(e) => e.currentTarget.style.filter = 'grayscale(100%) brightness(0.5)'}
                                        />
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BrandTwo;