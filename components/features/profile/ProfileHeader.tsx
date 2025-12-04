'use client';

import { User } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Settings, FileText } from 'lucide-react';

type ProfileHeaderProps = {
  user: User;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { name, avatarUrl, joinDate } = user;

  return (
    <div className="profile-header-card mb-4">
      <div className="profile-header-content">
        <div className="avatar-section">
          <Image
            src={avatarUrl}
            alt={`${name}'s avatar`}
            width={120}
            height={120}
            className="rounded-circle"
            unoptimized 
            style={{ objectFit: 'cover', border: '4px solid #ecebf3' }}
          />
        </div>

        <div className="info-section">
          <h2 className="profile-name">{name}</h2>
          <p className="join-date">Member since {joinDate}</p>
        </div>

        <div className="action-section">
          <a 
            href="/user-details" 
            className="action-button primary"
          >
            <Settings size={18} />
            Edit Profile
          </a>
          <a 
            href="/user-history" 
            className="action-button secondary"
          >
            <FileText size={18} />
            My Posts
          </a>
        </div>
      </div>

      <style jsx>{`
        .profile-header-card {
          background: #ecebf3;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .profile-header-content {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .info-section {
          flex: 1;
          min-width: 200px;
        }

        .profile-name {
          font-size: 2rem;
          font-weight: 800;
          color: #0c120c;
          margin: 0 0 8px 0;
        }

        .join-date {
          color: #6c757d;
          margin: 0;
          font-size: 1rem;
        }

        .action-section {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none !important;
          font-weight: 600;
          transition: all 0.2s;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .action-button.primary {
          background: #c7d6d5;
          color: #0c120c !important;
          box-shadow: 0 2px 8px rgba(199, 214, 213, 0.3);
        }

        .action-button.primary:hover {
          background: #b0c5c4;
          color: #0c120c !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(199, 214, 213, 0.4);
        }

        .action-button.secondary {
          background: white;
          color: #0c120c !important;
          border: 2px solid #c7d6d5;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .action-button.secondary:hover {
          background: #c7d6d5;
          color: #0c120c !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(199, 214, 213, 0.3);
        }

        @media (max-width: 768px) {
          .profile-header-content {
            flex-direction: column;
            text-align: center;
          }

          .action-section {
            width: 100%;
            flex-direction: column;
          }

          .action-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}