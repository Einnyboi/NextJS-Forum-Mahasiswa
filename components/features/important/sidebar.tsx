'use client'
import React from 'react';
import Link from 'next/link';
import { Home, Users, Calendar } from 'lucide-react';
import { Card } from "./card";

const Sidebar = () => {
    // Sidebar menu items
    const menuItems = [
        { name: "Home", icon: Home, href: "/", isActive: true },
        { name: "Community", icon: Users, href: "/community", isActive: false },
        { name: "Event", icon: Calendar, href: "#event", isActive: false },
    ];

    return (
        <Card title="" className="sidebar-card">
            <ul className="sidebar-list">
                {menuItems.map(link => (
                    <li key={link.name}>
                        <Link href={link.href} className="sidebar-link">
                            <link.icon size={20} />
                            <span>{link.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default Sidebar;