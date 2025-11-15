'use client';

import { Event } from '@/lib/types';
import Link from 'next/link';
import Card from 'react-bootstrap/Card';
import { Calendar, MapPin } from 'lucide-react';

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={event.href} className="text-decoration-none">
      <Card className="border-0 shadow-sm mb-2 hover-effect">
        <Card.Body>
          <h6 className="fw-bold text-dark mb-2">{event.name}</h6>
          
          <div className="d-flex align-items-center text-muted small gap-3">
            <div className="d-flex align-items-center gap-1">
              <Calendar size={14} />
              <span>{event.date}</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <MapPin size={14} />
              <span>{event.communityName}</span>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
}