'use client';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { dbService } from '@/lib/db';

interface UserData {
    id: string;
    fullName: string;
    email: string;
    password: string;
    registrationDate: string;
    role: string;
}

const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

interface ErrorState {
    email?: string;
    password?: string;
    general?: string;
}

const getStoredUsers = (): UserData[] => {
    if (typeof window !== 'undefined') {
        try {
            const users = localStorage.getItem('foma_users');
            return users ? JSON.parse(users) : [];
        } catch (e) {
            console.error("Error parsing users from localStorage:", e);
            return [];
        }
    }
    return [];
};

const Login: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<ErrorState>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const clearErrors = useCallback(() => {
        setErrors({});
        setSuccessMessage('');
        setLoading(false);
    }, []);

    const validateForm = useCallback((): boolean => {
        const newErrors: ErrorState = {};
        let isValid = true;

        if (!email || !validateEmail(email)) {
            newErrors.email = 'Format email tidak valid!';
            isValid = false;
        }

        if (!password || password.length < 8) {
            newErrors.password = 'Password minimal 8 karakter!';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [email, password]);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        if (!validateForm()) return;

        setLoading(true);

        try {
            // ❌ OLD: const users = getStoredUsers();
            // ✅ NEW: Ask Firebase for the user
            const user = await dbService.users.getByEmail(email);

            // 1. Check if user exists in Firebase
            if (!user) {
                setErrors({ email: 'Email tidak ditemukan di database!' });
                setLoading(false);
                return;
            }

            // 2. Check Password
            // (Assuming your user object in Firebase has a 'password' field)
            if (user.password !== password) {
                setErrors({ password: 'Password salah!' });
                setLoading(false);
                return;
            }

            // 3. Login Success
            setSuccessMessage(`Login berhasil! Selamat datang, ${user.fullName || 'User'}.`);
            
            // Save basic info to localStorage so the app "remembers" they are logged in
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Redirect
            setTimeout(() => {
                router.push('/'); // Change to your dashboard URL
            }, 1500);

        } catch (error) {
            console.error("Login error:", error);
            setErrors({ general: 'Terjadi kesalahan sistem.' });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex justify-center items-start min-h-screen pt-20 pb-10 bg-[#c7d6d5]">
            <style jsx global>{`
                .auth-container {
                    background: var(--white-color);
                    padding: 3rem 2.5rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(12, 18, 12, 0.1);
                    width: 97%;
                    max-width: 100%;
                    font-family: var(--main-font);
                }

                .auth-header h2 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--secondary-color);
                    margin-bottom: 0.5rem;
                }

                .auth-header p {
                    color: rgba(12, 18, 12, 0.6);
                    margin-bottom: 2rem;
                    font-family: var(--secondary-font);
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group label {
                    display: block
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--secondary-color);
                }

                .form-group input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid rgba(12, 18, 12, 0.2);
                    border-radius: 8px;
                    font-family: var(--secondary-font);
                    font-size: 1rem;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #0c120c;
                    box-shadow: 0 0 0 3px rgba(12, 18, 12, 0.1);
                }
                
                .loginBtn {
                    display: block;
                    width: 100%;
                    padding: 0.9rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-family: var(--main-font);
                    font-weight: 700;
                    text-align: center;
                    cursor: pointer;
                    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
                    background-color: var(--error-red);
                    color: var(--white-color);
                    box-shadow: 0 4px 15px rgba(194, 1, 20, 0.2);
                    margin-top: 1rem;
                }

                .loginBtn:hover:not(:disabled) {
                    background: #a00110;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(194, 1, 20, 0.3);
                }

                .loginBtn:disabled {
                    background: rgba(12, 18, 12, 0.1);
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                    color: rgba(12, 18, 12, 0.5);
                }

                .error {
                    color: var(--error-red);
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                    display: block;
                    font-family: var(--secondary-font);
                    font-weight: 400;
                }

                .success {
                    color: var(--secondary-color);
                    background-color: #e0f2f1;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    font-weight: 500;
                }

                .auth-footer {
                    text-align: center;
                    margin-top: 2rem;
                    color: rgba(12, 18, 12, 0.6);
                    font-family: var(--secondary-font);
                }

                .auth-footer a {
                    color: var(--secondary-color);
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s;
                }

                .auth-footer a:hover {
                    color: #a00110; 
                }
            `}</style>

            <div className="auth-container">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Log in to continue</p>
                </div>

                {successMessage && <div className="success">{successMessage}</div>}
                {errors.general && <div className="error text-center mb-4">{errors.general}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="loginEmail">Email Address</label>
                        <input
                            type="email"
                            id="loginEmail"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="loginPass">Password</label>
                        <input
                            type="password"
                            id="loginPass"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn loginBtn"
                        disabled={loading}
                    >
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    New to Foma? <a href="#">Create an account</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
