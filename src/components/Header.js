import React, { useState, useEffect } from 'react';
import Button from './Button';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { useUser } from '../contexts/UserContext';

const Header = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);
    const [isReturning, setIsReturning] = useState(false);
    const { user, handleLogin, handleLogout } = useUser();

    const handleLoginInternal = (userData) => {
        if (localStorage.getItem('hasLoggedInBefore')) {
            setIsReturning(true);
        } else {
            localStorage.setItem('hasLoggedInBefore', 'true');
        }
        handleLogin(userData);
        setIsLoginOpen(false);
    };

    const handleSignup = (userData) => {
        handleLogin(userData); // Reuse handleLogin for signup as well
        setIsSignupOpen(false);
    };

    const handleLogoutInternal = () => {
        handleLogout();
        setIsReturning(false);
    };

    return (
        <>
            <div className='flex justify-between items-center border-b border-white/75 mx-[16px] md:mx-[75px] py-[18px] md:flex-row flex-col gap-[10px] md:gap-0'>
                {user ? (
                    <div className='text-white'>
                        Hi {user.email}{isReturning ? ' welcome back!' : '!'}
                    </div>
                ) : (
                    <div></div>
                )}
                <div className='flex gap-[24px]'>
                    {user ? (
                        <Button onClick={handleLogoutInternal}>Log out</Button>
                    ) : (
                        <>
                            <Button onClick={() => { setIsLoginOpen(true); setIsSignupOpen(false); }}>login</Button>
                            <Button onClick={() => { setIsSignupOpen(true); setIsLoginOpen(false); }}>sign up</Button>
                        </>
                    )}
                </div>
            </div>
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLoginInternal} />
            <SignupModal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)} onSignup={handleSignup} />
        </>
    );
};

export default Header;