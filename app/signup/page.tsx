'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, Auth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, Firestore } from 'firebase/firestore';

declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

const validateName = (name: string): boolean =>
{
    return /^[a-zA-Z\s]{3,32}$/.test(name);
};

const validateEmail = (email: string): boolean =>
{
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

interface ErrorState
{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

const signup: React.FC = () =>
{
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [errors, setErrors] = useState<ErrorState>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const [auth, setAuth] = useState<Auth | null>(null);
    const [db, setDb] = useState<Firestore | null>(null);

    useEffect(() =>
    {
        try
        {
            const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
            if (Object.keys(firebaseConfig).length === 0)
            {
                console.error("Firebase config is missing.");
                return;
            }

            const initializedApp = initializeApp(firebaseConfig);
            const authInstance = getAuth(initializedApp);
            const dbInstance = getFirestore(initializedApp);

            setAuth(authInstance);
            setDb(dbInstance);

            const authenticate = async () =>
            {
                try
                {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token)
                    {
                        await signInWithCustomToken(authInstance, __initial_auth_token);
                    }
                    else
                    {
                        await signInAnonymously(authInstance);
                    }
                    console.log("Firebase Auth initialized and user session established.");
                }
                catch (error)
                {
                    console.error("Firebase Authentication failed:", error);
                }
            };
            authenticate();

        }
        catch (error)
        {
            console.error("Error initializing Firebase:", error);
        }
    }, []);

    const clearErrors = useCallback(() =>
    {
        setErrors({});
        setSuccessMessage('');
        setLoading(false);
    }, []);

    const validateForm = useCallback((): boolean =>
    {
        const newErrors: ErrorState = {};
        let isValid = true;

        if (!fullName || !validateName(fullName))
        {
            newErrors.fullName = 'Format nama tidak valid!';
            isValid = false;
        }

        if (!email || !validateEmail(email))
        {
            newErrors.email = 'Format email tidak valid!';
            isValid = false;
        }

        if (!password || password.length < 8)
        {
            newErrors.password = 'Password minimal 8 karakter!';
            isValid = false;
        }

        if (password !== confirmPassword)
        {
            newErrors.confirmPassword = 'Konfirmasi Password tidak sesuai!';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [fullName, email, password, confirmPassword]);


    const handleSignUp = async (e: React.FormEvent) =>
    {
        e.preventDefault();
        clearErrors();

        if (!auth || !db)
        {
            setErrors({ general: 'Sistem tidak siap. Coba lagi.' });
            return;
        }

        if (!validateForm())
        {
            return;
        }

        setLoading(true);

        try
        {
            // FIREBASE AUTH: Replaces the local findUserByEmail check and array push/saveToStorage
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userId = user.uid;

            // FIRESTORE: Store additional user profile data (Mandatory for the environment)
            const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
            const profileRef = doc(db, `artifacts/${appId}/users/${userId}/profiles`, userId);

            const newUserProfile = {
                name: fullName,
                email: email,
                registrationDate: new Date().toISOString(),
                role: "user",
            };

            await setDoc(profileRef, newUserProfile);

            // Success feedback (Replaces alert('Pendaftaran akun berhasil! Silakan login.'))
            setSuccessMessage('Pendaftaran akun berhasil! Silakan login.');
            setLoading(false);
            
            // Clear form after successful sign up
            setFullName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            
        }
        catch (error: any)
        {
            setLoading(false);
            let errorMessage = 'Pendaftaran gagal. Silakan coba lagi.';

            if (error.code === 'auth/email-already-in-use')
            {
                // Matches the original logic's check: "Email sudah terdaftar!"
                setErrors({ email: 'Email sudah terdaftar!' });
                return;
            }
            else if (error.code === 'auth/invalid-email')
            {
                setErrors({ email: 'Format email tidak valid!' });
                return;
            }
            else
            {
                console.error("Sign up error:", error);
            }
            setErrors({ general: errorMessage });
        }
    };

    return (
        // The background color from signup.css is applied globally via the style block
        <div className="flex justify-center items-start min-h-screen pt-20 pb-10 bg-[#c7d6d5]">
            <style jsx global>
            {`
                .auth-container
                {
                    background: var(--white-color);
                    padding: 3rem 2.5rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(12, 18, 12, 0.1);
                    width: 97%;
                    max-width: 100%;
                    font-family: var(--main-font);
                }

                .auth-header h2
                {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--secondary-color);
                    margin-bottom: 0.5rem;
                }

                .auth-header p
                {
                    color: rgba(12, 18, 12, 0.6);
                    margin-bottom: 2rem;
                    font-family: var(--secondary-font);
                }

                .form-group
                {
                    margin-bottom: 1.5rem;
                }

                .form-group label
                {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    color: var(--secondary-color);
                }

                .form-group input
                {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: 1px solid rgba(12, 18, 12, 0.2);
                    border-radius: 8px;
                    font-family: var(--secondary-font);
                    font-size: 1rem;
                    transition: border-color 0.2s, box-shadow 0.2s;
                }

                .form-group input:focus
                {
                    outline: none;
                    border-color: #0c120c;
                    box-shadow: 0 0 0 3px rgba(12, 18, 12, 0.1);
                }
                
                .signupBtn
                {
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

                .signupBtn:hover:not(:disabled)
                {
                    background: #a00110;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(194, 1, 20, 0.3);
                }

                .signupBtn:disabled
                {
                    background: rgba(12, 18, 12, 0.1);
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                    color: rgba(12, 18, 12, 0.5);
                }

                .error
                {
                    color: var(--error-red);
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                    display: block;
                    font-family: var(--secondary-font);
                    font-weight: 400;
                }

                .success
                {
                    color: var(--secondary-color);
                    background-color: #e0f2f1;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    text-align: center;
                    font-weight: 500;
                }
                
                .auth-footer
                {
                    text-align: center;
                    margin-top: 2rem;
                    color: rgba(12, 18, 12, 0.6);
                    font-family: var(--secondary-font);
                }
                
                .auth-footer a
                {
                    color: var(--secondary-color);
                    font-weight: 600;
                    text-decoration: none;
                    transition: color 0.2s;
                }
                
                .auth-footer a:hover
                {
                    color: #a00110; 
                }
            `}
            </style>
            
            <div className="auth-container">
                <div className="auth-header">
                    <h2>Join Foma Community</h2>
                    <p>Create your account to start discussions</p>
                </div>

                {successMessage && <div className="success">{successMessage}</div>}
                {errors.general && <div className="error text-center mb-4">{errors.general}</div>}

                <form onSubmit={handleSignUp}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        {errors.fullName && <span className="error">{errors.fullName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="signupEmail">Email Address</label>
                        <input
                            type="email"
                            id="signupEmail"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="signupPass">Password</label>
                        <input
                            type="password"
                            id="signupPass"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPass">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPass"
                            name="confirmPassword"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn signupBtn"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <a href="#">Log in here</a>
                </div>
            </div>
        </div>
    );
};

export default signup;