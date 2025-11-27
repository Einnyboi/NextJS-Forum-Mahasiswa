'use client';

import { User } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

type ProfileHeaderProps = {
  user: User;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { name, avatarUrl, joinDate } = user;

  return (
    <Card className="card-default mb-4 border-0">
      <Card.Body>
        <Row className="align-items-center">
          <Col xs={12} md={3} className="text-center mb-3 mb-md-0">
            <Image
              src={avatarUrl}
              alt={`${name}'s avatar`}
              width={100}
              height={100}
              className="rounded-circle border border-3"
              style={{ borderColor: 'var(--secondary-color)' }}
              unoptimized 
            />
          </Col>

          <Col xs={12} md={6} className="text-center text-md-start mb-3 mb-md-0">
            <h2 className="fw-bold mb-1">{name}</h2>
            <p className="text-muted mb-0">Joined {joinDate}</p>
          </Col>

          <Col xs={12} md={3} className="text-center text-md-end">
            {/* FIX: Remove Button component, apply classes to Link directly */}
            <Link 
              href="/user-details" 
              className="btn btn-primary text-white text-decoration-none"
            >
              Edit Profile
            </Link>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}