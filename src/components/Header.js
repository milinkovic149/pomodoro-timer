import React from 'react';
import Button from './Button';

const Header = () => {
    return (
        <div className='flex justify-end border-b border-white/75 mx-[75px] py-[18px]'>
            <Button>Login</Button>
        </div>
    );
};
export default Header;