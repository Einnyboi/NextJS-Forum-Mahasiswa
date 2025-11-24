'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { api } from '@/lib/api';
import { Community } from '@/lib/types';
import CommunityCard from '@/components/features/community/CommunityCard';
import CreateCommunityForm from '@/components/features/community/CreateCommunityForm';

export default function CommunityView() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Hardcoded ID for now (since we don't have full Auth Context yet)
  // In the future, get this from localStorage or Context
  const currentUserId = 'user-1'; 

  const fetchCommunities = async () => {
    try {
      const data = await api.communities.getAll();
      setCommunities(data);
    } catch (error) {
      console.error("Failed to load communities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="danger" /></div>;

  return (
    <Container fluid className="p-0">
      <Row>
        {/* LEFT COLUMN: List of Communities */}
        <Col lg={8}>
          <h3 className="fw-bold mb-4 text-dark">Explore Communities</h3>
          <Row>
            {communities.map((comm) => (
              <Col md={6} key={comm.id} className="mb-4">
                <CommunityCard community={comm} currentUserId={currentUserId} />
              </Col>
            ))}
          </Row>
        </Col>

        {/* RIGHT COLUMN: Create Form */}
        <Col lg={4}>
          <div className="sticky-top" style={{ top: '90px' }}>
            <CreateCommunityForm onSuccess={fetchCommunities} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}