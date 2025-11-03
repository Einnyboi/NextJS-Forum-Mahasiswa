import { Event } from '@/lib/types';
import Link from 'next/link';
import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline'; // Using icons

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  const { name, date, communityName, href } = event;

  return (
    <Link
      href={href}
      className="block rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
        {name}
      </h3>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <CalendarIcon className="h-4 w-4" />
        <span>{date}</span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <MapPinIcon className="h-4 w-4" />
        <span>{communityName}</span>
      </div>
    </Link>
  );
}