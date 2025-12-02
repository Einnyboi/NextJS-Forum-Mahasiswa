'use client';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import setDoc untuk auto-create
import { auth, db } from "@/lib/firebase"; 

const Login: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // --- LOGIKA UTAMA (Satu Fungsi untuk Semua) ---
    const handleLogin = async (e: React.FormEvent, type: 'user' | 'admin') => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Login ke Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Cek apakah Data User ada di Firestore?
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            let role = 'user';

            if (!userDocSnap.exists()) {
                // --- BAGIAN AJAIB: AUTO-FIX ADMIN ---
                // Jika emailnya 'admin@foma.com' tapi datanya belum ada di database,
                // kita buatkan OTOMATIS sekarang juga sebagai ADMIN.
                if (email === 'admin@foma.com') {
                    await setDoc(userDocRef, {
                        email: user.email,
                        role: 'admin', // Paksa jadi admin
                        fullName: 'Super Admin',
                        createdAt: new Date()
                    });
                    role = 'admin';
                    console.log("✅ Akun Admin berhasil dibuat otomatis di Database!");
                } else {
                    // Jika user biasa baru login pertama kali
                    await setDoc(userDocRef, {
                        email: user.email,
                        role: 'user',
                        fullName: 'User Baru',
                        createdAt: new Date()
                    });
                }
            } else {
                // Jika data sudah ada, baca role-nya
                role = userDocSnap.data().role;
            }

            // 3. Pengecekan Pintu Masuk
            if (type === 'admin') {
                // Tombol "Login as Admin" ditekan
                if (role === 'admin') {
                    router.push('/admin'); // Sukses masuk admin
                } else {
                    await signOut(auth); // Tendang keluar
                    setError("Gagal! Akun ini bukan Admin.");
                }
            } else {
                // Tombol "Login" (User) ditekan
                if (role === 'admin') {
                    await signOut(auth); // Tendang keluar
                    setError("Anda Admin! Gunakan tombol 'Login as Admin' di bawah.");
                } else {
                    router.push('/'); // Sukses masuk home
                }
            }

        } catch (err: any) {
            console.error(err);
            setError("Email atau password salah.");
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
            `}</style>

            <div className="auth-container">
                <h2 style={{fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem'}}>Welcome Back</h2>
                <p style={{color: '#666', marginBottom: '2rem'}}>Log in to continue</p>

                {error && <div className="error">{error}</div>}

                <form>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    {/* TOMBOL USER */}
                    <button 
                        className="loginBtn" 
                        onClick={(e) => handleLogin(e, 'user')} 
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Login'}
                    </button>

                    {/* TOMBOL ADMIN */}
                    <button 
                        className="adminBtn" 
                        onClick={(e) => handleLogin(e, 'admin')}
                        disabled={loading}
                    >
                        Login as Admin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;