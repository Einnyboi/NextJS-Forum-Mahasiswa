import Image from 'next/image';
import { User } from '@/lib/types';
import Link from 'next/link'

type ProfileHeaderProps = {
  user: User;
};

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { name, avatarUrl, joinDate } = user;

  return (
    // Use your 'secondary' color for the light-mode card background
    // Use a standard dark gray for dark mode
    <div className="flex flex-col items-center gap-4 rounded-[8px] bg-secondary p-6 shadow-sm dark:bg-brand-black sm:flex-row">
      <Image
        src={avatarUrl}
        alt={`${name}'s avatar`}
        width={100}
        height={100}
        className="rounded-full border-4 border-gray-200 dark:border-gray-700"
        unoptimized
      />

      <div className="flex-1 text-center sm:text-left">
        {/* Use 'brand-black' for text on light mode */}
        <h1 className="text-3xl font-bold text-brand-black dark:brand-black">
          {name}
        </h1>
        {/* Use your 'font-lato' and a standard gray for subtext */}
        <p className="font-lato text-md text-gray-500 dark:text-gray-400">
          Joined {joinDate}
        </p>
      </div>

      <div>
        <Link
          href = "/user-details"
          className = "rounded-lg bg-brand-red px-4 py-2 font-semibold text-secondary transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
          >
            Edit Profile
          </Link>
      </div>
    </div>
  );
}