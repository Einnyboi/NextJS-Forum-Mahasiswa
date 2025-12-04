'use client';

import { Event } from '@/lib/types';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react'; 

type EventListProps = {
  events: Event[];
};

export default function EventList({ events }: EventListProps) {
  return (
    <div className="profile-card">
      <div className="card-header-custom">
        <Calendar size={20} />
        <h4>My Events</h4>
      </div>
      
      {events.length > 0 ? (
        <div className="events-list">
          {events.map((event) => (
            <Link key={event.id} href={event.href} className="event-item">
              <div className="event-name">{event.name}</div>
              <div className="event-details">
                <div className="detail-item">
                  <Calendar size={14} />
                  <span>{event.date}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={14} />
                  <span>{event.communityName}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty-message">No upcoming events.</p>
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

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .event-item {
          padding: 16px;
          background: white;
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        }

        .event-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .event-name {
          font-weight: 600;
          color: #0c120c;
          margin-bottom: 8px;
        }

        .event-details {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6c757d;
          font-size: 0.875rem;
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