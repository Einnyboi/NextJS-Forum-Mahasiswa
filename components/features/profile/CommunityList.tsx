'use client';

import { Community } from '@/lib/types';
import CommunityCard from '@/components/ui/CommunityCard';
import { Users } from 'lucide-react';

type CommunityListProps = {
  communities: Community[];
};

export default function CommunityList({ communities }: CommunityListProps) {
  return (
    <div className="profile-card">
      <div className="card-header-custom">
        <Users size={20} />
        <h4>Joined Communities</h4>
      </div>
      
      {communities.length > 0 ? (
        <div className="d-flex flex-column gap-2">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <p className="empty-message">You haven't joined any communities yet.</p>
      )}

      <style jsx>{`
        .profile-card {
          background: #ecebf3;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .card-header-custom {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .card-header-custom h4 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0c120c;
        }

        .empty-message {
          color: #6c757d;
          margin: 0;
          text-align: center;
          padding: 20px 0;
        }
      `}</style>
    </div>
  );
}