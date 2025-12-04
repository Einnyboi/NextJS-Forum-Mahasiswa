'use client'
import React from 'react';
import Link from 'next/link';
import { Home, Users, Calendar, Settings, Info, HelpCircle } from 'lucide-react';
import { Card } from "./card";

const Sidebar = () => {
    // Main sidebar menu items
    const mainMenuItems = [
        { name: "Home", icon: Home, href: "/", isActive: true },
        { name: "Community", icon: Users, href: "/community", isActive: false },
        { name: "Event", icon: Calendar, href: "#event", isActive: false },
        { name: "Settings", icon: Settings, href: "/settings", isActive: false },
    ];

    // Footer menu items
    const footerMenuItems = [
        { name: "Support", icon: HelpCircle, href: "/support", isActive: false },
        { name: "About Us", icon: Info, href: "/about", isActive: false },
    ];

    return (
        <Card title="" className="sidebar-card">
            <div className="sidebar-container">
                <ul className="sidebar-list">
                    {mainMenuItems.map(link => (
                        <li key={link.name}>
                            <Link href={link.href} className="sidebar-link">
                                <link.icon size={20} />
                                <span>{link.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="sidebar-footer-section">
                    <div className="sidebar-divider"></div>
                    <ul className="sidebar-list">
                        {footerMenuItems.map(link => (
                            <li key={link.name}>
                                <Link href={link.href} className="sidebar-link">
                                    <link.icon size={20} />
                                    <span>{link.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <style jsx>{`
                .sidebar-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    min-height: calc(100vh - 200px);
                }

                .sidebar-footer-section {
                    margin-top: auto;
                }

                .sidebar-divider {
                    height: 1px;
                    background: rgba(199, 214, 213, 0.3);
                    margin: 16px 0;
                }
            `}</style>
        </Card>
    );
};

export default Sidebar;