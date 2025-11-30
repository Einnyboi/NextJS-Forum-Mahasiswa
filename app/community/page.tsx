'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/features/important/navbar";
import Sidebar from "@/components/features/important/sidebar";
import CommunityCard from "@/components/features/community/CommunityCard";
import CreateCommunityForm from "@/components/features/community/CreateCommunityForm";
import { Community } from '@/lib/types';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Plus } from 'lucide-react';

const CommunityPage = () => {
    const router = useRouter();
    const [communities, setCommunities] = useState<Community[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string>('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        // Get current user from localStorage
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) {
            router.push('/login');
            return;
        }

        const user = JSON.parse(userStr);
        setCurrentUserId(user.id || user.uid || user.userId);

        // Fetch all communities
        const fetchCommunities = async () => {
            try {
                const response = await fetch('/api/communities');
                if (response.ok) {
                    const data = await response.json();
                    // API returns array directly, not { communities: [] }
                    setCommunities(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error('Error fetching communities:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCommunities();
    }, [router]);

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="main-dashboard-layout">
                    <div className="left-sidebar">
                        <Sidebar />
                    </div>
                    <div className="main-content">
                        <div className="main-container">
                            <p>Loading communities...</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="main-dashboard-layout">
                <div className="left-sidebar">
                    <Sidebar />
                </div>
                <div className="main-content">
                    <div className="main-container">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h1 className="mb-0">Discover Communities</h1>
                            <Button 
                                variant="primary" 
                                onClick={() => setShowCreateModal(true)}
                                className="d-flex align-items-center gap-2"
                            >
                                <Plus size={20} />
                                Create Community
                            </Button>
                        </div>
                        
                        {communities.length === 0 ? (
                            <p className="text-muted">No communities available yet.</p>
                        ) : (
                            <Container fluid>
                                <Row xs={1} md={2} lg={3} className="g-4">
                                    {communities.map((community) => (
                                        <Col key={community.id}>
                                            <CommunityCard 
                                                community={community} 
                                                currentUserId={currentUserId}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
                        )}
                    </div>
                </div>
            </div>
            
            <CreateCommunityForm 
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onSuccess={() => {
                    // Refresh communities list
                    fetch('/api/communities')
                        .then(res => res.json())
                        .then(data => setCommunities(Array.isArray(data) ? data : []));
                }}
            />
        </>
    );
};

export default CommunityPage;