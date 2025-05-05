import React from 'react';
import Button from './Button';

const Header = () => {
    return (
        <div className='flex justify-end border-b border-white/75 mx-[75px] py-[18px]'>
            <Button className='bg-gradient-to-r from-[#2523D5] to-[#FA3C91]'>login</Button>
        </div>
    );
};
export default Header;