'use client';

import { Community } from '@/lib/types';
import Card from 'react-bootstrap/Card';
import CommunityCard from '@/components/ui/CommunityCard'; // Import the new component

type CommunityListProps = {
  communities: Community[];
};

export default function CommunityList({ communities }: CommunityListProps) {
  return (
    <Card className="card-default mb-4 border-0">
      <Card.Body>
        <h4 className="card-title mb-3">Joined Communities</h4>
        
        {communities.length > 0 ? (
          <div className="d-flex flex-column gap-2">
            {communities.map((community) => (
              // Use the new Card component here
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <p className="text-muted">You havent joined any communities yet.</p>
        )}
      </Card.Body>
    </Card>
  );
}