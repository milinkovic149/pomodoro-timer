import React from 'react';

const Button = ({ children, onClick, className }) => {
    return (
        <button
            type='button'
            onClick={onClick}
            className={`font-sora px-[25px] py-[2px] hover:opacity-80 rounded-[4px] text-white font-medium transition-all ${className || ''}`}
        >
            {children}
        </button>
    );
};

export default Button;