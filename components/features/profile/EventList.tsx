'use client';

import { Event } from '@/lib/types';
import { Card, ListGroup } from 'react-bootstrap';
import Link from 'next/link';
// Pastikan sudah install lucide-react: npm install lucide-react
import { Calendar, MapPin } from 'lucide-react'; 

type EventListProps = {
  events: Event[];
};

export default function EventList({ events }: EventListProps) {
  return (
    <Card className="card-default border-0">
      <Card.Body>
        <h4 className="card-title mb-3">My Events</h4>
        
        {events.length > 0 ? (
          <ListGroup variant="flush">
            {events.map((event) => (
              <ListGroup.Item 
                key={event.id} 
                className="border-0 px-0 bg-transparent mb-2"
              >
                <Link href={event.href} className="text-decoration-none text-dark">
                  <div className="fw-bold mb-1">{event.name}</div>
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
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-muted">No upcoming events.</p>
        )}
      </Card.Body>
    </Card>
  );
}