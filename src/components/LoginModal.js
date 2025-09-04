import React, { useState } from 'react';
import Button from './Button';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEmailError('');
        setPasswordError('');
        setError('');

        // Custom email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onLogin(data.user);
                setSuccess(true);
                // onClose(); // Remove this to keep modal open
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (success) {
        return (
            <div className="fixed w-full h-full inset-0 bg-[black]/50 top-[0] flex items-center justify-center z-50" onClick={onClose}>
                <div className="bg-[black] rounded-lg px-[40px] py-[20px] rounded-[20px] text-center" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-[20px] mb-[20px]">🎉 Login successful! 🎉</h2>
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed w-full h-full inset-0 bg-[black]/50 top-[0] flex items-center justify-center z-50" onClick={onClose}>
            <div className="relative bg-[black] rounded-lg px-[40px] py-[20px] rounded-[20px]" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-[12px] right-[15px] text-white text-[24px]">&times;</button>
                <h2 className="text-center text-[20px]">Login</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-[10px] relative">
                        <label htmlFor="email" className="text-[10px]">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border focus:outline-none"
                        />
                        {emailError && <p className="absolute text-[#F44336] text-[10px]">*{emailError}</p>}
                    </div>
                    <div className="mb-[20px] relative">
                        <label htmlFor="password" className="text-[10px]">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border focus:outline-none"
                        />
                        {passwordError && <p className="absolute text-[#F44336] text-[10px]">{passwordError}</p>}
                    </div>
                    <div className="flex justify-around">
                        <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-[20px] h-[20px] border-[2px] border-white border-t-transparent rounded-full loader"></div>
                                </div>
                            ) : (
                                'Login'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;