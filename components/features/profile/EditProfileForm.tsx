'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';
import Link from 'next/link';

type EditProfileFormProps = {
  user: User;
};

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatarUrl);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Call our new API route
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          name: name,
          avatarUrl: avatar,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // 2. Refresh the page data so the new name shows up immediately
      alert("Success! Profile updated in Firebase.");
      router.push('/profile'); 
      router.refresh(); 

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Check the console.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="rounded-lg bg-secondary p-6 shadow-sm dark:bg-secondary"
    >
      <div className="space-y-6">
        {/* Full Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-black">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 text-brand-black shadow-sm focus:border-brand-red focus:ring-brand-red"
            required
          />
        </div>

        {/* Avatar Input */}
        <div>
          <label htmlFor="avatar" className="block text-sm font-medium text-brand-black">
            Avatar URL
          </label>
          <input
            type="text"
            id="avatar"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 p-2 text-brand-black shadow-sm focus:border-brand-red focus:ring-brand-red"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <Link
            href="/profile"
            className="rounded-lg bg-gray-500 px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-brand-red px-4 py-2 font-semibold text-secondary transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </form>
  );
}