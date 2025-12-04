'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/features/important/navbar";
import Sidebar from "@/components/features/important/sidebar";
import CommunityCard from "@/components/features/community/CommunityCard";
import CreateCommunityForm from "@/components/features/community/CreateCommunityForm";
import { api, CommunityData } from '@/lib/api';
import { Plus } from 'lucide-react';

const CommunityPage = () => {
    const router = useRouter();
    const [communities, setCommunities] = useState<CommunityData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

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
                    <div className="d-flex justify-content-between align-items-center mb-4 welcome-banner">
                        <div>
                            <h1 className="welcome-title">Temukan Komunitas</h1>
                            <p className="welcome-text">Bergabunglah dengan komunitas yang sesuai minatmu.</p>
                        </div>

                        {user && (
                            <button
                                className="btn-create-test"
                                onClick={() => setShowCreateModal(true)}
                            >
                                + Buat Komunitas
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
                        <div className="d-flex flex-column gap-3">
                            {communities.map((community) => (
                                <CommunityCard
                                    key={community.id}
                                    community={community}
                                    isJoined={false}
                                />
                            ))}
                        </div>
                    )}
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