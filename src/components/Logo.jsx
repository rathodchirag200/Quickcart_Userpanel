import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';

const LogoIcon = ({ size = 46 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Solid Orange Circle Background */}
    <circle cx="50" cy="50" r="50" fill="#FF6600" />
    
    {/* Group containing all icon parts for precise centering - Adjusted for perfect 50/50 balance */}
    <g transform="translate(15.5, 16.5)">
      {/* Three speed lines on the left, slightly refined for the perfect look */}
      <rect x="0" y="24" width="16" height="6" rx="3" fill="white"/>
      <rect x="6" y="34" width="18" height="6" rx="3" fill="white"/>
      <rect x="3" y="44" width="14" height="6" rx="3" fill="white"/>
      
      {/* Cart Body - it sits centered with the checkmark */}
      <path d="M22 24 H62 C66 24 69 27 69 31 V43 C69 47 66 50 62 50 H22 V24 Z" fill="white" />
      
      {/* Curved Handle arching over the body */}
      <path d="M40 24 V16 C40 10 44 6 52 6 C60 6 64 10 64 16 V24" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      
      {/* Checkmark built into the cart body */}
      <path d="M43 36 L50 43 L63 27" stroke="#FF6600" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      
      {/* Two wheels at the bottom for the cart to roll on */}
      <circle cx="36" cy="62" r="5" fill="white" />
      <circle cx="54" cy="62" r="5" fill="white" />
    </g>
  </svg>
);

const Logo = ({ textWhite = false, className = '' }) => {
  return (
    <Link to="/" className={`logo-container ${className}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <LogoIcon size={38} />
      <h2 className="logo-text" style={{ 
        fontSize: '24px', 
        fontWeight: 'bold', 
        margin: '0', 
        color: textWhite ? '#ffffff' : '#111111',
        letterSpacing: '-0.5px'
      }}>
        Quickcart
      </h2>
    </Link>
  );
};

export default Logo;
