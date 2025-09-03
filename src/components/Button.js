import React from 'react';

const Button = ({ children, onClick, className, type = 'button' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`bg-gradient-to-r from-[#2523D5] to-[#FA3C91] font-sora px-[25px] py-[6px] rounded-[4px] text-white font-medium transition-all ${className || ''}`}
        >
            {children}
        </button>
    );
};

export default Button;