'use client'
import React, { useState } from 'react';
import { Search, Github as User, LogOut, History } from 'lucide-react';

interface AppNavbarProps
{
    onNavChange: (view: string) => void;
    isLoggedIn: boolean;
}

function AppNavbar({ onNavChange , isLoggedIn }: AppNavbarProps) 
{
    const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.preventDefault();
        onNavChange('login'); 
    }

    const handleSignupClick = (e: React.MouseEvent<HTMLButtonElement>) =>
    {
        e.preventDefault();
        onNavChange('signup');
    }

    const checking = () =>
    {
        if (isLoggedIn)
        {
            return (<div>hi</div>)
        }
    }

}


export default AppNavbar;
