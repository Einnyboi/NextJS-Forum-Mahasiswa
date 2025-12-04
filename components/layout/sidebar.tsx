'use client';
import React from 'react';
import { Home, Users, Calendar } from 'lucide-react';
import { Card } from "@/components/features/important/card";

interface SidebarProps {
    onMenuClick: (view: string) => void;
    activeView: string;
}

const Sidebar = ({ onMenuClick, activeView }: SidebarProps) => {
    
    const menuItems = [
        { id: "home", name: "Home", icon: Home },
        { id: "community", name: "Community", icon: Users },
        { id: "event", name: "Event", icon: Calendar },
    ];

    return (
        // Class 'sidebar-card' sekarang diambil dari globals.css
        <Card title="" className="sidebar-card">
            <ul className="sidebar-list">
                {menuItems.map(item => {
                    const isActive = activeView === item.id;
                    
                    return (
                        <li key={item.id}>
                            <div 
                                onClick={() => onMenuClick(item.id)} 
                                // Class 'sidebar-link' dan 'active' diambil dari globals.css
                                className={`sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
};

export default Sidebar;