"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { pageContainer, cardStyle } from "../../lib/style_login"; 


export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    useEffect(() => {
        const remembered = localStorage.getItem("rememberUser");
        if (remembered) {
            setEmail(remembered);
        }
    }, []);

    function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        const savedEmail = localStorage.getItem("userEmail");
        const savedPassword = localStorage.getItem("userPassword");

        if (email === savedEmail && password === savedPassword) {
            if (remember) {
                localStorage.setItem("rememberUser", email);
            } else {
                localStorage.removeItem("rememberUser");
            }

            router.push("/dashboard");
        } else {
            alert("Wrong email or password");
        }
    }

    return (
        <div style={pageContainer}>
            <div style={cardStyle} className="card p-4 shadow">
                <h3 className="mb-3">Login</h3>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Email"
                        className="form-control mb-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="form-control mb-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <label htmlFor="remember" className="form-check-label">
                            Remember me
                        </label>
                    </div>

                    <button className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        </div>
    );
}