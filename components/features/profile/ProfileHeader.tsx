import Image from 'next/image';
import { User } from '@/lib/types'; // Import our new type

// 1. Define the props we expect to receive
type ProfileHeaderProps = {
  user: User;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  // 2. Use the props instead of placeholders
  const { name, avatarUrl, joinDate } = user;

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 sm:flex-row">
      {/* Avatar */}
      <Image
        src={avatarUrl}
        alt={`${name}'s avatar`}
        width={100}
        height={100}
        className="rounded-full border-4 border-gray-200 dark:border-gray-700"
      />

      {/* User Info */}
      <div className="flex-1 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {name}
        </h1>
        <p className="text-md text-gray-500 dark:text-gray-400">
          Joined {joinDate}
        </p>
      </div>

      {/* Edit Profile Button */}
      <div>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}