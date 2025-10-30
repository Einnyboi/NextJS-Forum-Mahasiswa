import { Community } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

type CommunityCardProps = {
  community: Community;
};

export default function CommunityCard({ community }: CommunityCardProps) {
  const { name, imageUrl } = community;

  // We'll use a placeholder image if one isn't provided
  const displayImage = imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;

  return (
    <Link
      href={`/community/${community.id}`} // Assuming this is the route
      className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <Image
        src={displayImage}
        alt={`${name} community logo`}
        width={40}
        height={40}
        className="rounded-lg"
      />
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
      </div>
    </Link>
  );
}