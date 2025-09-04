import React, { useState } from 'react';
import Button from './Button';

const SignupModal = ({ isOpen, onClose, onSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');

        // Custom email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        // Check if password is entered
        if (!password.trim()) {
            setPasswordError('Password is required');
            setLoading(false);
            return;
        }

        // Check password length
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        // Check if confirm password is entered
        if (!confirmPassword.trim()) {
            setConfirmPasswordError('Please confirm your password');
            setLoading(false);
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                onSignup(data.user);
                setSuccess(true);
            } else {
                setEmailError(data.message || 'Signup failed');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setEmailError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (success) {
        return (
            <div className="fixed w-full h-full inset-0 bg-[black]/50 top-[0] flex items-center justify-center z-50" onClick={onClose}>
                <div className="bg-[black] rounded-lg px-[40px] py-[20px] rounded-[20px] text-center" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-[20px] mb-[20px]">🎉 Your account has been successfully created! 🎉</h2>
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed w-full h-full inset-0 bg-[black]/50 top-[0] flex items-center justify-center z-50" onClick={onClose}>
            <div className="relative bg-[black] rounded-lg px-[40px] py-[20px] rounded-[20px]" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-[12px] right-[15px] text-white text-[24px]">&times;</button>
                <h2 className="text-center text-[20px]">Create Account</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-[10px] relative">
                        <label htmlFor="signup-email" className="text-[10px]">
                            Email
                        </label>
                        <input
                            type="email"
                            id="signup-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border focus:outline-none"
                        />
                        {emailError && <p className="absolute text-[#F44336] text-[10px]">*{emailError}</p>}
                    </div>
                    <div className="mb-[10px] relative">
                        <label htmlFor="signup-password" className="text-[10px]">
                            Password
                        </label>
                        <input
                            type="password"
                            id="signup-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border focus:outline-none"
                        />
                        {passwordError && <p className="absolute text-[#F44336] text-[10px]">{passwordError}</p>}
                    </div>
                    <div className="mb-[20px] relative">
                        <label htmlFor="confirm-password" className="text-[10px]">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border focus:outline-none"
                        />
                        {confirmPasswordError && <p className="absolute text-[#F44336] text-[10px]">{confirmPasswordError}</p>}
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
                                'Sign Up'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupModal;