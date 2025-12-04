'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/features/important/navbar';
import Sidebar from '@/components/features/important/sidebar';
import Image from 'next/image';
import { Target, Eye, Users as UsersIcon } from 'lucide-react';

export default function AboutPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Check user session
  useState(() => {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (session.isLoggedIn) {
        setUser(session);
      }
    }
  });

  const teamMembers = [
    {
      name: "Cathrine",
      avatar: "/images/pompurin.png"
    },
    {
      name: "Naomi",
      avatar: "/images/pochaco.png"
    },
    {
      name: "Cornelius",
      avatar: "/images/onel.png"
    },
    {
      name: "Vanesa",
      avatar: "/images/mymelo.png"
    },
    {
      name: "Jessica",
      avatar: "/images/keroppi.png"
    }
  ];

  return (
    <div>
      <Navbar 
        onNavChange={(view) => {
          if (view === 'home') router.push('/');
          else if (view === 'community') router.push('/community');
        }}
        isLoggedIn={!!user}
      />

      <div className="main-dashboard-layout">
        <Sidebar />

        <div className="main-content">
          <div className="about-container">
            {/* Hero Section */}
            <div className="hero-section">
              <h1>About FoMa</h1>
              <p className="hero-subtitle">Forum Mahasiswa - Connecting Students, Building Communities</p>
            </div>

            {/* Mission Section */}
            <div className="mission-vision-grid">
              <div className="mv-card">
                <div className="mv-icon">
                  <Target size={40} />
                </div>
                <h2>Our Mission</h2>
                <p>
                  To create a vibrant digital space where students can connect, collaborate, and share knowledge. 
                  We aim to foster meaningful discussions, build supportive communities, and empower students 
                  to learn from each other's experiences and perspectives.
                </p>
              </div>

              <div className="mv-card">
                <div className="mv-icon">
                  <Eye size={40} />
                </div>
                <h2>Our Vision</h2>
                <p>
                  To become the leading platform for student engagement and collaboration, where every student 
                  has access to a supportive network that enhances their educational journey. We envision a 
                  future where learning extends beyond the classroom through community-driven interaction.
                </p>
              </div>
            </div>

            {/* Team Section */}
            <div className="team-section">
              <div className="team-header">
                <UsersIcon size={32} />
                <h2>Meet Our Team</h2>
                <p>The passionate individuals behind FoMa</p>
              </div>

              <div className="team-grid">
                {teamMembers.map((member, index) => (
                  <div key={index} className="team-card">
                    <div className="member-avatar">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={100}
                        height={100}
                        unoptimized
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <h3>{member.name}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="cta-section">
              <h2>Join Our Community</h2>
              <p>Be part of the growing network of students sharing knowledge and building connections.</p>
              <button 
                className="cta-button"
                onClick={() => router.push('/community')}
              >
                Explore Communities
              </button>
            </div>
          </div>

          <style jsx>{`
            .main-content {
              padding-top: 28px;
            }

            .about-container {
              max-width: 1000px;
              margin: 0 auto;
            }

            .hero-section {
              text-align: center;
              padding: 64px 24px;
              background: linear-gradient(135deg, #c7d6d5 0%, #b0c5c4 100%);
              border-radius: 16px;
              margin-bottom: 48px;
            }

            .hero-section h1 {
              font-size: 3rem;
              font-weight: 800;
              color: #0c120c;
              margin: 0 0 16px 0;
            }

            .hero-subtitle {
              font-size: 1.25rem;
              color: #0c120c;
              margin: 0;
              opacity: 0.9;
            }

            .mission-vision-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
              gap: 24px;
              margin-bottom: 64px;
            }

            .mv-card {
              background: #ecebf3;
              padding: 40px;
              border-radius: 16px;
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
            }

            .mv-icon {
              color: #c7d6d5;
              margin-bottom: 20px;
            }

            .mv-card h2 {
              font-size: 1.75rem;
              font-weight: 700;
              color: #0c120c;
              margin: 0 0 16px 0;
            }

            .mv-card p {
              color: #4a5568;
              line-height: 1.7;
              margin: 0;
              font-size: 1rem;
            }

            .team-section {
              margin-bottom: 64px;
            }

            .team-header {
              text-align: center;
              margin-bottom: 48px;
            }

            .team-header svg {
              color: #c7d6d5;
              margin-bottom: 16px;
            }

            .team-header h2 {
              font-size: 2.5rem;
              font-weight: 800;
              color: #0c120c;
              margin: 0 0 12px 0;
            }

            .team-header p {
              font-size: 1.1rem;
              color: #6c757d;
              margin: 0;
            }

            .team-grid {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 40px;
              flex-wrap: nowrap;
              overflow-x: auto;
            }

            .team-card {
              text-align: center;
              transition: transform 0.2s;
              flex-shrink: 0;
            }

            .team-card:hover {
              transform: scale(1.1);
            }

            .member-avatar {
              margin-bottom: 12px;
            }

            .member-avatar img {
              border: 3px solid #c7d6d5;
              border-radius: 50%;
              background: white;
              padding: 4px;
            }

            .team-card h3 {
              font-size: 1rem;
              font-weight: 600;
              color: #0c120c;
              margin: 0;
            }

            .cta-section {
              text-align: center;
              padding: 64px 24px;
              background: linear-gradient(135deg, #c7d6d5 0%, #b0c5c4 100%);
              border-radius: 16px;
            }

            .cta-section h2 {
              font-size: 2.5rem;
              font-weight: 800;
              color: #0c120c;
              margin: 0 0 16px 0;
            }

            .cta-section p {
              font-size: 1.1rem;
              color: #0c120c;
              margin: 0 0 32px 0;
              opacity: 0.9;
            }

            .cta-button {
              padding: 16px 48px;
              background: #0c120c;
              color: #ecebf3;
              border: none;
              border-radius: 8px;
              font-weight: 700;
              font-size: 1.1rem;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }

            .cta-button:hover {
              background: #1a1f1a;
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            }

            @media (max-width: 768px) {
              .hero-section h1 {
                font-size: 2rem;
              }

              .team-grid {
                gap: 24px;
                justify-content: flex-start;
                padding: 0 20px;
              }

              .mission-vision-grid {
                grid-template-columns: 1fr;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
