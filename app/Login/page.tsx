'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginProps {
    onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Simulasi delay untuk UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Cek kredensial
            if (email === 'admin@foma.com' && password === 'admin123') {
                // Login sebagai admin
                localStorage.setItem('userSession', JSON.stringify({
                    email: email,
                    role: 'admin',
                    isLoggedIn: true,
                    fullName: 'Super Admin'
                }));
                router.push('/admin');
            } else if (email && password) {
                // Login sebagai user biasa
                localStorage.setItem('userSession', JSON.stringify({
                    email: email,
                    role: 'user',
                    isLoggedIn: true,
                    fullName: 'User'
                }));

                if (onLoginSuccess) {
                    onLoginSuccess();
                } else {
                    router.push('/');
                }
            } else {
                setError('Email dan password harus diisi!');
            }
        } catch (err: any) {
            console.error(err);
            setError('Terjadi kesalahan saat login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-start min-h-screen pt-20 pb-10 bg-[#c7d6d5]">
            <style jsx global>{`
                .auth-container {
                    background: var(--white-color); padding: 3rem 2.5rem;
                    border-radius: 12px; box-shadow: 0 10px 40px rgba(12, 18, 12, 0.1);
                    width: 97%; max-width: 100%; font-family: var(--main-font);
                }
                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: var(--secondary-color); }
                .form-group input {
                    width: 100%; padding: 0.75rem 1rem; border: 1px solid rgba(12, 18, 12, 0.2);
                    border-radius: 8px; font-family: var(--secondary-font); font-size: 1rem;
                }
                .loginBtn {
                    display: block; width: 100%; padding: 0.9rem 1.5rem; border: none; border-radius: 8px;
                    background-color: var(--error-red); color: var(--white-color); font-weight: 700;
                    margin-top: 1rem; cursor: pointer;
                }
                .adminBtn {
                    display: block; width: 100%; padding: 0.9rem 1.5rem; 
                    border: 2px solid var(--secondary-color); background: transparent; 
                    color: var(--secondary-color); font-weight: 700; border-radius: 8px;
                    margin-top: 1rem; cursor: pointer;
                }
                .error { color: var(--error-red); font-size: 0.9rem; text-align: center; margin-bottom: 1rem; display: block; }
                .info-box {
                    background: #e3f2fd; border-left: 4px solid #2196f3; padding: 1rem;
                    margin-bottom: 1.5rem; border-radius: 4px; font-size: 0.9rem;
                }
            `}</style>

            <div className="auth-container">
                <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome Back</h2>
                <p style={{ color: '#666', marginBottom: '1rem' }}>Log in to continue</p>

                {error && <div className="error">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <button
                        type="submit"
                        className="loginBtn"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;