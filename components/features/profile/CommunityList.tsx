import { Community } from '@/lib/types';
import CommunityCard from '@/components/ui/CommunityCard';

type CommunityListProps = {
  communities: Community[];
};

export default function CommunityList({ communities }: CommunityListProps) {
  return (
    <div className="rounded-lg bg-gray-50 p-4 shadow-sm dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Joined Communities
      </h2>
      
      {communities.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {communities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          You haven&apos;t joined any communities yet.
        </p>
      )}
    </div>
  );
}