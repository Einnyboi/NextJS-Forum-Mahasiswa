'use client'

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import SignupForm from "./signup/page";
import LoginForm from "./Login/page";

// --- IMPORT FIREBASE ---
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Sesuaikan path import ini

// Tipe data untuk User
interface UserSession {
    uid: string;
    email: string | null;
    role: string; // 'admin' atau 'user'
}

// Komponen konten default
const DefaultHomeContent = ({ user }: { user: UserSession | null }) => (
  <div className="card-default" style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
      <h3 className="card-title text-xl font-bold">Welcome Back{user?.email ? `, ${user.email}` : ''}!</h3>
      <p className="mb-4">Select an option from the sidebar to view your dashboard.</p>
      
      {/* Pesan khusus jika Admin (Opsional) */}
      {user?.role === 'admin' && (
        <div style={{ padding: '1rem', background: '#d1fae5', color: '#065f46', borderRadius: '8px', marginTop: '1rem' }}>
            <strong>Status: Admin Access Active</strong>
        </div>
      )}
  </div>
);

export default function Home() {
    const [currentView, setCurrentView] = useState('home');
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);

    // --- BAGIAN UPDATE UTAMA DI SINI ---
    useEffect(() => {
        // Listener: Setiap kali status login berubah (login/logout/refresh)
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Jika user login, kita cek role-nya di Firestore
                try {
                    const docRef = doc(db, "users", firebaseUser.uid);
                    const docSnap = await getDoc(docRef);
                    
                    let role = 'user'; // Default role
                    if (docSnap.exists()) {
                        // Ambil role dari database
                        role = docSnap.data().role || 'user';
                    }

                    // Simpan ke state
                    setUser({
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        role: role
                    });
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            } else {
                // Jika user logout
                setUser(null);
            }
            setLoading(false);
        });

        // Bersihkan listener saat komponen di-unmount
        return () => unsubscribe();
    }, []);

    // Fungsi render konten
    const renderMainContent = () => {
        if (loading) return <div className="p-10">Loading session...</div>;
        if (currentView === 'signup') return <SignupForm />;
        if (currentView === 'login') return <LoginForm />;
        return <DefaultHomeContent user={user} />;
    };

    return (
      <div>
          {/* Kirim data role ke Navbar agar tombol Admin bisa muncul */}
          <Navbar 
            onNavChange={setCurrentView} 
            isLoggedIn={!!user} 
            userRole={user?.role} 
          />
          
          <div className="main-container">
              <div className="main-dashboard-layout">
                <Sidebar></Sidebar>
                
                <div className="main-content">
                    {renderMainContent()}
                </div>
              </div>
          </div>
      </div>
    )
}