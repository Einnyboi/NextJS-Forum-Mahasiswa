'use client'

import React, { useState } from "react";
import Image from "next/image";

import styles from "./page.module.css"
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import SignupForm from "./signup/page";
import LoginForm from "./Login/page";
import CommunityView from "@/components/views/CommunityView";

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

    // Function to determine which content component to display
    const renderMainContent = () =>
      {
        if (currentView === 'signup')
        {
          return <SignupForm />;
        } else if (currentView === 'login') {
          return <LoginForm />;
        } else if (currentView === 'community') {
          return <CommunityView />;
        }
        return <DefaultHomeContent />;
    };

    return (
      <div>
          <Navbar onNavChange={setCurrentView} isLoggedIn={false}></Navbar>
          
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
