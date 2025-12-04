'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ThreadCard } from "@/components/features/thread/ThreadCard";
import { api, PostData } from "@/lib/api";
import LoginForm from "../Login/page";
import SignupForm from "../signup/page";

export default function EventPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('event');

    useEffect(() => {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            if (session.isLoggedIn) {
                setUser({
                    email: session.email,
                    role: session.role,
                    fullName: session.fullName
                });
            }
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const allPosts = await api.posts.getAll();
            // Filter only 'event' category
            const eventPosts = allPosts.filter(post => post.category === 'event');
            setPosts(eventPosts);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    const handleLoginSuccess = () => {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            setUser({
                email: session.email,
                role: session.role,
                fullName: session.fullName
            });
        }
        setCurrentView('event');
    };

    const renderContent = () => {
        if (currentView === 'login') {
            return <LoginForm onLoginSuccess={handleLoginSuccess} />;
        }
        if (currentView === 'signup') {
            return <SignupForm />;
        }

        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-4 welcome-banner">
                    <div>
                        <h1 className="welcome-title">Events</h1>
                        <p className="welcome-text">Discover upcoming events and activities.</p>
                    </div>
                </div>

                {loading ? (
                    <p className="state-message">Loading events...</p>
                ) : posts.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                        {posts.map(post => (
                            <ThreadCard key={post.id} thread={post} />
                        ))}
                    </div>
                ) : (
                    <div className="state-message">
                        <p>No events found.</p>
                    </div>
                )}
            </>
        );
    };

    return (
        <div>
            <Navbar onNavChange={(view) => {
                if (view === 'home') router.push('/');
                else if (view === 'community') router.push('/community');
                else if (view === 'event') setCurrentView('event');
                else if (view === 'login') setCurrentView('login');
                else if (view === 'signup') setCurrentView('signup');
            }} isLoggedIn={!!user} userRole={user?.role} />

            <div className="main-dashboard-layout">
                <Sidebar activeView="event" onMenuClick={(view) => router.push(view === 'home' ? '/' : `/${view}`)} />

                <div className="main-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
