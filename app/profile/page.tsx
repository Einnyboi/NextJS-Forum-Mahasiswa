import ProfileClient from '@/components/features/profile/ProfileClient';
import Navbar from '@/components/features/important/navbar';
import Sidebar from '@/components/features/important/sidebar';

export default function ProfilePage() {
  return (
    <div>
      <Navbar />
      
      <div className="main-container hide-scrollbar">
        <div className="main-dashboard-layout">
          <Sidebar />
          
          <div className="main-content">
            <ProfileClient />
          </div>
        </div>
      </div>
    </div>
  );
}