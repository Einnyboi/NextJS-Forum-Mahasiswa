'use client';

import { CommunityData, api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Users, UserPlus, UserCheck, X } from 'lucide-react';
import { useState, useEffect } from 'react';

type CommunityCardProps = {
  community: CommunityData;
};

export default function CommunityCard({ community }: CommunityCardProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
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
    >
      {/* Banner Background */}
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

      {/* Content with Profile */}
      <div className="card-content">
        {/* Profile Image - Left */}
        <div className="community-profile">
          <Image
            src={community.imageUrl || "https://via.placeholder.com/80"}
            alt={community.name}
            width={60}
            height={60}
            className="profile-image"
            unoptimized
            style={{ objectFit: 'cover', borderRadius: '50%' }}
          />
        </div>

        {/* Info Area */}
        <div className="community-info">
          {/* Header: Name & Members */}
          <div className="info-top">
            <div>
              <h5 className="community-name">{community.name}</h5>
              <div className="community-members">
                <Users size={13} />
                <span>{memberCount} Members</span>
              </div>
            </div>
            
            {/* Join Button - Compact */}
            <button
              onClick={handleJoinToggle}
              className={`join-button ${isJoined ? 'joined' : ''}`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                'Loading...'
              ) : isJoined ? (
                <>
                  <UserCheck size={14} />
                  <span>Joined</span>
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>Join</span>
                </>
              )}
            </button>
          </div>

          {/* Description */}
          {community.description && (
            <p className="community-description">
              {community.description}
            </p>
          )}
        </div>
      </div>

      {/* Modal for full description */}
      {showModal && community.description && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <h3 className="modal-title">{community.name}</h3>
            <div className="modal-body">
              <h4>About this community</h4>
              <p>{community.description}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .community-card-modern {
          position: relative;
          background: #ecebf3;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          height: 180px;
        }

        .community-card-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .community-banner {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          overflow: hidden;
        }

        .banner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(199, 214, 213, 0.3) 0%, rgba(159, 174, 173, 0.4) 100%);
          pointer-events: none;
        }

        .card-content {
          position: relative;
          display: flex;
          gap: 14px;
          padding: 50px 16px 16px;
          height: 100%;
        }

        .community-profile {
          flex-shrink: 0;
          margin-top: -20px;
        }

        .profile-image {
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .community-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }

        .info-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .community-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin: 0 0 4px 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .community-members {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #6c757d;
          font-size: 0.8rem;
        }

        .community-description {
          font-size: 0.85rem;
          color: #555;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .join-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border: 2px solid var(--primary-color);
          background: white;
          color: var(--primary-color);
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          white-space: nowrap;
        }
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

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow: auto;
          padding: 24px;
          position: relative;
          animation: slideUp 0.3s ease;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f0f0f0;
          color: #333;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin: 0 0 20px 0;
          padding-right: 32px;
        }

        .modal-body h4 {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--primary-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 0 12px 0;
        }

        .modal-body p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #444;
          margin: 0;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}