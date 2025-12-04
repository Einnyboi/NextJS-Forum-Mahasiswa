'use client';

import { CommunityData, api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Users, UserPlus, UserCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

type CommunityCardProps = {
  community: CommunityData;
};

export default function CommunityCard({ community }: CommunityCardProps) {
  const router = useRouter();
  const [showDescription, setShowDescription] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [memberCount, setMemberCount] = useState(community.memberCount || community.members?.length || 0);

  useEffect(() => {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (session.isLoggedIn && session.email) {
        setUserEmail(session.email);
        // Check if user is already a member
        if (community.members && community.members.includes(session.email)) {
          setIsJoined(true);
        }
      }
    }
  }, [community.members]);

  const handleClick = () => {
    router.push(`/community/${community.id}`);
  };

  const handleJoinToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userEmail) {
      alert('Please login first');
      return;
    }
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (isJoined) {
        const success = await api.communities.leave(community.id, userEmail);
        if (success) {
          setIsJoined(false);
          setMemberCount(prev => Math.max(0, prev - 1));
        }
      } else {
        const success = await api.communities.join(community.id, userEmail);
        if (success) {
          setIsJoined(true);
          setMemberCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling membership:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="community-card-modern"
      onClick={handleClick}
      onMouseEnter={() => setShowDescription(true)}
      onMouseLeave={() => setShowDescription(false)}
    >
      {/* Banner Image */}
      <div className="community-banner">
        <Image
          src={community.bannerUrl || community.imageUrl || "https://via.placeholder.com/400x150"}
          alt={`${community.name} banner`}
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
        <div className="banner-overlay"></div>
      </div>

      {/* Profile Image - Overlapping Banner */}
      <div className="community-profile">
        <Image
          src={community.imageUrl || "https://via.placeholder.com/80"}
          alt={community.name}
          width={80}
          height={80}
          className="rounded-circle border border-3"
          unoptimized
          style={{ objectFit: 'cover', borderColor: '#ecebf3' }}
        />
      </div>

      {/* Community Info */}
      <div className="community-info">
        <h5 className="community-name">{community.name}</h5>
        <div className="community-members">
          <Users size={14} className="me-1" />
          <span>{memberCount} Members</span>
        </div>
        <button
          onClick={handleJoinToggle}
          className={`join-button ${isJoined ? 'joined' : ''}`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            'Loading...'
          ) : isJoined ? (
            <>
              <UserCheck size={16} className="me-1" />
              Joined
            </>
          ) : (
            <>
              <UserPlus size={16} className="me-1" />
              Join
            </>
          )}
        </button>
      </div>

      {/* Description Overlay on Hover */}
      {showDescription && community.description && (
        <div className="community-description-overlay">
          <p>{community.description}</p>
        </div>
      )}

      <style jsx>{`
        .community-card-modern {
          position: relative;
          background: #ecebf3;
          border-radius: 12px;
          overflow: visible;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          height: 320px;
        }

        .community-card-modern:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          z-index: 10;
        }

        .community-banner {
          position: relative;
          width: 100%;
          height: 140px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px 12px 0 0;
          overflow: hidden;
        }

        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(199, 214, 213, 0.4) 0%, rgba(159, 174, 173, 0.5) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .community-profile {
          position: absolute;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .community-info {
          padding: 50px 16px 16px;
          text-align: center;
        }

        .community-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .community-members {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-size: 0.875rem;
          margin-bottom: 12px;
        }

        .join-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 20px;
          border: 2px solid var(--primary-color);
          background: white;
          color: var(--primary-color);
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .join-button:hover:not(:disabled) {
          background: var(--primary-color);
          color: white;
        }

        .join-button.joined {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .join-button.joined:hover:not(:disabled) {
          background: white;
          color: var(--primary-color);
        }

        .join-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .community-description-overlay {
          position: absolute;
          top: 50%;
          left: calc(100% + 12px);
          transform: translateY(-50%);
          background: #ecebf3;
          backdrop-filter: blur(8px);
          color: #0c120c;
          padding: 16px;
          border-radius: 8px;
          min-width: 250px;
          max-width: 300px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          z-index: 100;
          pointer-events: none;
          animation: slideInRight 0.2s ease;
        }

        .community-description-overlay::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -8px;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 8px 8px 8px 0;
          border-color: transparent #ecebf3 transparent transparent;
        }

        .community-description-overlay p {
          margin: 0;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }

        /* Handle edge case when card is on the right side */
        @media (max-width: 1400px) {
          .community-description-overlay {
            left: auto;
            right: calc(100% + 12px);
          }

          .community-description-overlay::before {
            left: auto;
            right: -8px;
            border-width: 8px 0 8px 8px;
            border-color: transparent transparent transparent #ecebf3;
          }
        }
      `}</style>
    </div>
  );
}