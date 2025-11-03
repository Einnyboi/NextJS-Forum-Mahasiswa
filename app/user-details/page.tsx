import { getProfileData } from '@/lib/data';
import EditProfileForm from '@/components/features/profile/EditProfileForm';

export default async function UserDetailsPage() {
  // 1. Fetch the current user's data on the server
  const { user } = await getProfileData();

  return (
    <main className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-3xl font-bold text-brand-black dark:text-secondary">
        Edit Your Profile
      </h1>
      
      {/* 2. Pass that data down to the Client Component */}
      <EditProfileForm user={user} />
    </main>
  );
}