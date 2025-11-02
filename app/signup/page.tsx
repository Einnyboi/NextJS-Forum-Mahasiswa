'use client';
import React, { useState, useCallback } from 'react';

interface UserData
{
    id: string;
    fullName: string;
    email: string;
    password: string;
    registrationDate: string;
    role: string;
}

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

const getStoredUsers = (): UserData[] =>
{
    if (typeof window !== 'undefined')
    {
        try
        {
            const users = localStorage.getItem('foma_users');
            return users ? JSON.parse(users) : [];
        }
        catch (e)
        {
            console.error("Error parsing users from localStorage:", e);
            return [];
        }
    }
    return [];
};

const saveUsers = (users: UserData[]) =>
{
    if (typeof window !== 'undefined')
    {
        localStorage.setItem('foma_users', JSON.stringify(users));
    }
};

const signup: React.FC = () =>
{
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [errors, setErrors] = useState<ErrorState>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

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

        if (!validateForm())
        {
            return;
        }

        setLoading(true);

        try
        {
            // 1. Get existing users from local storage
            const existingUsers = getStoredUsers();

            // 2. Check if email is already in use
            const emailExists = existingUsers.some(user => user.email === email);

            if (emailExists) {
                setLoading(false);
                // Matches the original Firebase error code check
                setErrors({ email: 'Email sudah terdaftar!' });
                return;
            }

            // 3. Create new user object (using email as a simple ID)
            const newUser: UserData = {
                id: email, 
                fullName: fullName,
                email: email,
                password: password, 
                registrationDate: new Date().toISOString(),
                role: "user",
            };

            // 4. Add new user and save to local storage
            existingUsers.push(newUser);
            saveUsers(existingUsers);

            // Success feedback 
            setSuccessMessage('Pendaftaran akun berhasil! Silakan login.');
            
            // Clear form after successful sign up
            setFullName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            
        }
        catch (error)
        {
            // Handle unexpected local storage errors or parsing issues
            console.error("Sign up error:", error);
            setErrors({ general: 'Pendaftaran gagal. Gagal menyimpan data lokal.' });
        }
        finally
        {
            setLoading(false);
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