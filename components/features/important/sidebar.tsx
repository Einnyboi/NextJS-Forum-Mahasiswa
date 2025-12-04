'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Users, Calendar, Menu, X } from 'lucide-react';
import { Card } from "./card";

const Sidebar = () => {
    // 1. State untuk mengontrol status menu (terbuka atau tertutup)
    const [isOpen, setIsOpen] = useState(false);

    // Fungsi untuk mengganti status menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Sidebar menu items (tetap sama)
    const menuItems = [
        { name: "Home", icon: Home, href: "/", isActive: true },
        { name: "Community", icon: Users, href: "/community", isActive: false },
        { name: "Event", icon: Calendar, href: "#event", isActive: false },
    ];

    return (
        // Menggunakan fragmen untuk membungkus tombol dan sidebar
        <>
            {/* 2. Tombol Hamburger (Hanya terlihat di layar kecil via CSS) */}
            <button className="hamburger-button " onClick={toggleMenu}>
                {/* Menampilkan ikon X jika menu terbuka, dan ikon Menu jika tertutup */}
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* 3. Sidebar Container */}
            {/* Class 'is-open' digunakan untuk mengontrol tampilan menu via CSS */}
            <Card title="" className={`sidebar-card ${isOpen ? 'is-open' : ''}`}>
                <ul className="sidebar-list">
                    {menuItems.map(link => (
                        <li key={link.name} onClick={() => setIsOpen(false)}> {/* Menutup menu setelah klik */}
                            <Link href={link.href} className="sidebar-link">
                                <link.icon size={20} />
                                <span>{link.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Card>
        </>
    );
};

export default Sidebar;