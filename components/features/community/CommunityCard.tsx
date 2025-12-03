'use client';

import { CommunityData, api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronUp, ChevronDown, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

type CommunityCardProps = {
  community: CommunityData;
  isJoined?: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
};

export default function CommunityCard({ community, isJoined, onJoin, onLeave }: CommunityCardProps) {
  const router = useRouter();
  const [upvotes, setUpvotes] = useState(community.upvotes || 0);
  const [downvotes, setDownvotes] = useState(community.downvotes || 0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (session.isLoggedIn) {
        setUserEmail(session.email);
        if (community.votedBy && community.votedBy[session.email]) {
          setUserVote(community.votedBy[session.email]);
        }
      }
    }
  }, [community]);

  const handleClick = () => {
    router.push(`/community/${community.id}`);
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userEmail) return alert('Login required');

    const success = await api.communities.upvote(community.id, userEmail);
    if (success) {
      if (userVote === 'up') {
        setUpvotes(upvotes - 1);
        setUserVote(null);
      } else if (userVote === 'down') {
        setDownvotes(downvotes - 1);
        setUpvotes(upvotes + 1);
        setUserVote('up');
      } else {
        setUpvotes(upvotes + 1);
        setUserVote('up');
      }
    }
  };

  const handleDownvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userEmail) return alert('Login required');

    const success = await api.communities.downvote(community.id, userEmail);
    if (success) {
      if (userVote === 'down') {
        setDownvotes(downvotes - 1);
        setUserVote(null);
      } else if (userVote === 'up') {
        setUpvotes(upvotes - 1);
        setDownvotes(downvotes + 1);
        setUserVote('down');
      } else {
        setDownvotes(downvotes + 1);
        setUserVote('down');
      }
    }
  };

  const voteScore = upvotes - downvotes;

  return (
    <div
      className="thread-card d-flex mb-3" // Reusing thread-card class for consistent styling
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        padding: '0',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}
    >
      {/* --- LEFT: VOTING COLUMN --- */}
      <div className="d-flex flex-column align-items-center p-2 bg-light border-end" style={{ width: '40px', minWidth: '40px', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>
        <button
          onClick={handleUpvote}
          className={`btn btn-sm p-0 ${userVote === 'up' ? 'text-success' : 'text-muted'}`}
          style={{ border: 'none', background: 'none' }}
        >
          <ChevronUp size={24} />
        </button>
        <span className="fw-bold small my-1">{voteScore}</span>
        <button
          onClick={handleDownvote}
          className={`btn btn-sm p-0 ${userVote === 'down' ? 'text-danger' : 'text-muted'}`}
          style={{ border: 'none', background: 'none' }}
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {/* --- RIGHT: CONTENT --- */}
      <div className="flex-grow-1 p-3 d-flex align-items-center">
        {/* Community Icon */}
        <div className="me-3">
          <Image
            src={community.imageUrl || "https://via.placeholder.com/60"}
            alt={community.name}
            width={60}
            height={60}
            className="rounded-circle border"
            unoptimized
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Info */}
        <div className="flex-grow-1">
          <h5 className="fw-bold mb-1">{community.name}</h5>
          <p className="text-muted small mb-1">
            {community.description || "No description available."}
          </p>
          <div className="d-flex align-items-center text-muted small">
            <Users size={14} className="me-1" />
            <span>{community.members?.length || 0} Members</span>
          </div>
        </div>

        {/* Action Button (Optional, maybe just card click is enough, but keeping a small button is nice) */}
        <div>
          <button className="btn btn-outline-primary btn-sm rounded-pill px-3">
            Lihat
          </button>
        </div>
      </div>
    </div>
  );
}