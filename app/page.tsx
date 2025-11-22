'use client'

import React, { useState , useCallback, use } from "react";
import Image from "next/image";

import styles from "./page.module.css"
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import SignupForm from "./signup/page";
import LoginForm from "./Login/page";

const DefaultHomeContent = () =>
(
  <div className="card-default">
      <h3 className="card-title">Welcome Back!</h3>
      <p>Select an option from the sidebar to view your dashboard.</p>
  </div>
);


export default function Home()
{
    const [currentView, setCurrentView] = useState('home');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = useCallback(() => {
      setIsLoggedIn(true);
      setCurrentView('home');
    }, []);

    // Function to determine which content component to display
    const renderMainContent = () =>
      {
        if (currentView === 'signup')
        {
          return <SignupForm />;
        }
        else if (currentView === 'login')
        {
          return <LoginForm onLoginSuccess={handleLoginSuccess} />;
        }

        if (isLoggedIn)
        {
          return <div className="card-default"> <h3 className="card-title">Welcome Back User!</h3><p>This is a user only dashboard.</p></div>;
        }

        return <DefaultHomeContent />;
    };

    return (
      <div>
          <Navbar onNavChange={setCurrentView} isLoggedIn={isLoggedIn}></Navbar>
          
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