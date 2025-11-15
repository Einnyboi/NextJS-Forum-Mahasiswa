'use client';

// 1. Import 'useTransition' for pending states
import { useTransition } from 'react';
import { User } from '@/lib/types';
import Link from 'next/link';
// 2. Import our new Server Action
import { updateUser } from '@/app/action';

type EditProfileFormProps = {
  user: User;
};

export default function EditProfileForm({ user }: EditProfileFormProps) {
  // 3. Set up a transition for pending UI
  const [isPending, startTransition] = useTransition();

  return (
    // 4. Hook the 'action' prop to our Server Action
    <form
      action={(formData) => {
        // 5. Wrap the action call in startTransition
        startTransition(() => updateUser(formData));
      }}
      className="rounded-lg bg-secondary p-6 shadow-sm dark:bg-brand-black"
    >
      {/* 6. Add a hidden input to send the user's ID */}
      <input type="hidden" name="id" value={user.id} />

      <div className="space-y-6">
        {/* Full Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-brand-black"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name" // <-- 7. Add 'name' attribute
            defaultValue={user.name} // <-- 8. Use 'defaultValue'
            className="mt-1 block w-full rounded-md border-gray-300 p-2 text-brand-black shadow-sm focus:border-brand-red focus:ring-brand-red"
          />
        </div>

        {/* Avatar URL Input */}
        <div>
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-brand-black"
          >
            Avatar URL
          </label>
          <input
            type="text"
            id="avatar"
            name="avatar" // <-- 7. Add 'name' attribute
            defaultValue={user.avatarUrl} // <-- 8. Use 'defaultValue'
            className="mt-1 block w-full rounded-md border-gray-300 p-2 text-brand-black shadow-sm focus:border-brand-red focus:ring-brand-red"
          />
        </div>

        {/* Join Date (Unchanged) */}
        <div>
          <label
            htmlFor="joinDate"
            className="block text-sm font-medium text-brand-black"
          >
            Join Date
          </label>
          <input
            type="text"
            id="joinDate"
            defaultValue={user.joinDate}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2 text-gray-500 shadow-sm"
          />
        </div>

        {/* --- Action Buttons --- */}
        <div className="flex justify-end gap-4">
          <Link
            href="/profile"
            className="rounded-lg bg-gray-500 px-4 py-2 font-semibold text-white transition-opacity hover:opacity-90"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending} // <-- 9. Disable button when pending
            className="rounded-lg bg-brand-red px-4 py-2 font-semibold text-secondary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {/* 10. Show a pending message */}
            {isPending ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </form>
  );
}