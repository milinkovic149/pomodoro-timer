import React from 'react';

const Button = ({ children, onClick, className }) => {
    return (
        <button
            type='button'
            onClick={onClick}
            className={`px-[25px] py-[15px] bg-white hover:bg-x/30 rounded-full text-white font-medium transition-all ${className || ''}`}        >
            {children}
        </button>
    );
};

export default Button;