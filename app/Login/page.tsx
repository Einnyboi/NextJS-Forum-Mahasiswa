'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dbService } from '@/lib/db';

interface LoginProps {
    onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Hardcoded credentials
    const ADMIN_EMAIL = 'admin@foma.com';
    const ADMIN_PASSWORD = 'admin123';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validasi input
            if (!email || !password) {
                setError('Email dan password harus diisi!');
                setLoading(false);
                return;
            }

            // Check admin first
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                localStorage.setItem('userSession', JSON.stringify({
                    id: 'admin-1',
                    email: email,
                    role: 'admin',
                    isLoggedIn: true,
                    fullName: 'Super Admin'
                }));
                // Force full page reload to update navbar
                window.location.href = '/admin';
                return;
            }

            // Check regular user in Firebase
            const user = await dbService.users.getByEmail(email);
            
            if (!user) {
                setError('Email tidak ditemukan!');
                setLoading(false);
                return;
            }

            // Check password
            if (user.password !== password) {
                setError('Password salah!');
                setLoading(false);
                return;
            }

            // Login success - save complete user data
            localStorage.setItem('userSession', JSON.stringify({
                id: user.id,
                email: user.email,
                role: user.role || 'user',
                isLoggedIn: true,
                fullName: user.fullName || user.name || 'User',
                avatarUrl: user.avatarUrl || '/default-avatar.png',
                joinDate: user.registrationDate || user.joinDate
            }));
            
            // Force full page reload to update navbar
            window.location.href = '/';

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
                    font-family: var(--main-font);
                    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
                    box-shadow: 0 4px 15px rgba(194, 1, 20, 0.2);
                }
                .loginBtn:hover:not(:disabled) {
                    background: #a00110;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(194, 1, 20, 0.3);
                    color: var(--white-color);
                }
                .loginBtn:disabled {
                    background: rgba(12, 18, 12, 0.1);
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                    color: rgba(12, 18, 12, 0.5);
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

                    {/* SATU TOMBOL UNTUK SEMUA */}
                    <button
                        type="submit"
                        className="loginBtn"
                        onClick={handleLogin}
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