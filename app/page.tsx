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

    // Function to determine which content component to display
    const renderMainContent = () =>
      {
        if (currentView === 'signup')
        {
          return <SignupForm />;
        }
          else if (currentView === 'login')
        {
        return <LoginForm />;
        }
        return <DefaultHomeContent user={null} />;
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