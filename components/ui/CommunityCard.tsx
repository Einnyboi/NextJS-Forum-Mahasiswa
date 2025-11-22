'use client';

import { Community } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import Card from 'react-bootstrap/Card';

type CommunityCardProps = {
  community: Community;
};

export default function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link href={`/community/${community.id}`} className="text-decoration-none">
      <Card className="border-0 shadow-sm mb-2 hover-effect h-100">
        <Card.Body className="d-flex align-items-center gap-3">
          <Image
            src={community.imageUrl}
            alt={community.name}
            width={50}
            height={50}
            className="rounded"
            unoptimized
          />
          <div>
            <h6 className="mb-0 fw-bold text-dark">{community.name}</h6>
            <small className="text-muted">View Community</small>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}