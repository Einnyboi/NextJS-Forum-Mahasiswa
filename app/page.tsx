'use client'

import React, { useState } from "react";
import Image from "next/image";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import SignupForm from "./signup/page";
// import LoginForm from "./login/page";

const DefaultHomeContent = () =>
(
  <div className="rounded-lg bg-secondary p-6 shadow-sm">
      <h3 className="mb-4 text-2xl font-bold text-brand-black">Welcome Back!</h3>
      <p className="text-gray-600">Select an option from the sidebar to view your dashboard.</p>
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
        }
        // else if (currentView === 'login')
        // {
        //   return <LoginForm />;
        // }
        return <DefaultHomeContent />;
    };

    return (
      <div>
          <Navbar onNavChange={setCurrentView} isLoggedIn={false}></Navbar>
          
          <div className="container mx-auto px-4 py-8">
              <div className="flex min-h-screen gap-4">
                <Sidebar />
                
                <div className="flex-1 px-6">
                    {renderMainContent()}
                </div>
              </div>
          </div>
      </div>
    )
}
