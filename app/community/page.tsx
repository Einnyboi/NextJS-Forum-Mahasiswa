'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/features/important/navbar";
import Sidebar from "@/components/features/important/sidebar";
import CommunityCard from "@/components/features/community/CommunityCard";
import CreateCommunityForm from "@/components/features/community/CreateCommunityForm";
import { api, CommunityData } from '@/lib/api';
import { Plus } from 'lucide-react';
import LoginForm from "../Login/page";
import SignupForm from "../signup/page";

const CommunityPage = () => {
    const router = useRouter();
    const [communities, setCommunities] = useState<CommunityData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [currentView, setCurrentView] = useState('community');

    useEffect(() => {
        // Get current user from localStorage
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

        // Fetch all communities
        const fetchCommunities = async () => {
            try {
                const data = await api.communities.getAll();
                setCommunities(data);
            } catch (error) {
                console.error('Error fetching communities:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    const handleCreateSuccess = () => {
        // Refresh communities list
        api.communities.getAll().then(data => setCommunities(data));
    };

    return (
        <div>
            <Navbar onNavChange={(view) => {
                if (view === 'home') router.push('/');
                else if (view === 'community') router.push('/community');
                // Add other routes if needed
            }} isLoggedIn={!!user} userRole={user?.role} />

            <div className="main-dashboard-layout">
                <Sidebar activeView="community" onMenuClick={(view) => {
                    if (view === 'home') router.push('/');
                    else if (view === 'community') router.push('/community');
                }} />

                <div className="main-content">
                    <div className="community-header">
                        <div className="header-content">
                            <h1>Explore Communities</h1>
                            <p>Find and join communities that match your interests</p>
                        </div>

                        {user && (
                            <button
                                className="create-community-btn"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <Plus size={20} />
                                Create Community
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <p className="state-message">Memuat komunitas...</p>
                    ) : communities.length === 0 ? (
                        <div className="state-message">
                            <p>Belum ada komunitas.</p>
                        </div>
                    ) : (
                        <div className="communities-grid">
                            {communities.map((community) => (
                                <CommunityCard
                                    key={community.id}
                                    community={community}
                                />
                            ))}
                        </div>
                    )}

                    <style jsx>{`
                        .main-content {
                            padding-top: 28px;
                        }

                        .community-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 40px;
                        }

                        .header-content h1 {
                            font-size: 2.5rem;
                            font-weight: 800;
                            color: #1a202c;
                            margin: 0 0 8px 0;
                            letter-spacing: -0.5px;
                        }

                        .header-content p {
                            color: #718096;
                            margin: 0;
                            font-size: 1rem;
                            font-weight: 400;
                        }

                        .create-community-btn {
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            padding: 12px 24px;
                            background: #dc3545;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-weight: 600;
                            font-size: 1rem;
                            cursor: pointer;
                            transition: all 0.2s;
                            box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
                        }

                        .create-community-btn:hover {
                            background: #c82333;
                            transform: translateY(-2px);
                            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
                        }

                        .communities-grid {
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 24px;
                        }

                        @media (max-width: 1200px) {
                            .communities-grid {
                                grid-template-columns: repeat(2, 1fr);
                            }
                        }

                        @media (max-width: 768px) {
                            .community-header {
                                flex-direction: column;
                                align-items: flex-start;
                                gap: 16px;
                            }

                            .communities-grid {
                                grid-template-columns: 1fr;
                            }
                        }
                    `}</style>
                </div>
            </div>

            <CreateCommunityForm
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default CommunityPage;