import ProfileHeader from '@/components/features/profile/ProfileHeader';
import CommunityList from '@/components/features/profile/CommunityList';
import EventList from '@/components/features/profile/EventList';
import { getProfileData } from '@/lib/data';

export default async function ProfilePage() {
  const { user, communities, events } = await getProfileData();

  return (
    <main className="container mx-auto p-4">
      {/* disini nanti call navbar nya naomi */}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className = "flex flex-col gap-8 lg:col-span-2">
            <ProfileHeader user={user}/>
            <div className = "rounded-lg bg-gray-50 p-4 shadow-sm dark:bg-gray-800">
                <h2 className = "mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    My Posts
                </h2>
                <p className = "text-gray-500 dark:text-gray-400">
                    (post history later disini)
                </p>
            </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-1">
          <CommunityList communities={communities} />
          <EventList events={events} />
        </div>
       </div>
    </main>
  );
}