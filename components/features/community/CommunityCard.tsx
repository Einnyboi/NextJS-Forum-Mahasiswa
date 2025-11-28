'use client';

import { Community } from '@/lib/types';
import { Card, Button } from 'react-bootstrap';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useState } from 'react';

type CommunityCardProps = {
  community: Community;
  currentUserId: string;
};

export default function CommunityCard({ community, currentUserId }: CommunityCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false); // Simple local state for demo

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      await api.communities.join(currentUserId, community.id);
      setIsJoined(true);
      alert(`You joined ${community.name}!`);
    } catch (error) {
      console.error(error);
      alert("Failed to join.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="card-default border-0 h-100 shadow-sm">
      <Card.Body className="d-flex flex-column align-items-center text-center p-4">
        <Image
          src={community.imageUrl}
          alt={community.name}
          width={80}
          height={80}
          className="rounded-circle mb-3 border"
          unoptimized
        />
        
        <h5 className="fw-bold mb-1">{community.name}</h5>
        
        <p className="text-muted small mb-3 flex-grow-1">
          {community.description || "No description available."}
        </p>

        <Button 
          variant={isJoined ? "outline-success" : "primary"} 
          className="w-100 rounded-pill"
          onClick={handleJoin}
          disabled={isLoading || isJoined}
        >
          {isLoading ? 'Joining...' : (isJoined ? 'Joined' : 'Join Community')}
        </Button>
      </Card.Body>
    </Card>
  );
}