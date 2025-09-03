import React, { useState } from 'react';
import Button from './Button';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const Header = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    return (
        <>
            <div className='flex justify-end border-b border-white/75 mx-[75px] py-[18px] gap-[24px]'>
                <Button onClick={() => setIsLoginOpen(true)}>login</Button>
                <Button onClick={() => setIsSignupOpen(true)}>sign in</Button>
            </div>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
        </>
    );
};
export default Header;