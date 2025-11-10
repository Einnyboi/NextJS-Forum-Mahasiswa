import { Event } from '@/lib/types';
import EventCard from '@/components/ui/EventCard';

type EventListProps = {
  events: Event[];
};

export default function EventList({ events }: EventListProps) {
  return (
    <div className="rounded-[8px] bg-secondary p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-brand-black">
        My Events
      </h2>
      
      {events.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          You haven&apos;t RSVP&apos;d to any events yet.
        </p>
      )}
    </div>
  );
}