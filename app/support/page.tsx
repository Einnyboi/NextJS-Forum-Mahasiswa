'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/features/important/navbar';
import Sidebar from '@/components/features/important/sidebar';
import { HelpCircle, Mail, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function SupportPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

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

  const faqs = [
    {
      question: "How do I create a community?",
      answer: "To create a community, navigate to the Community page and click the 'Create Community' button. Fill in the required information including community name, description, and upload images for the profile and banner."
    },
    {
      question: "How do I join a community?",
      answer: "Browse communities on the Community page and click the 'Join' button on any community card. Once joined, the community will appear in your profile under 'Joined Communities'."
    },
    {
      question: "Can I edit my profile?",
      answer: "Yes! Go to your profile page and click the 'Edit Profile' button. You can update your name and avatar URL. Make sure to save your changes when done."
    },
    {
      question: "How do I create a post?",
      answer: "Navigate to a community you've joined and click the 'Create Post' button. Fill in the title, content, and optionally add an image URL. Your post will be visible to all community members."
    },
    {
      question: "What image hosting services can I use?",
      answer: "We recommend using free image hosting services like Imgur, Postimages, or ImgBB. Upload your image to any of these services and paste the direct image URL into FoMa."
    },
    {
      question: "How do I view my post history?",
      answer: "Click on 'My Posts' button on your profile page, or navigate to the User History section from the sidebar. You'll see all posts you've created across different communities."
    },
    {
      question: "Can I delete or edit my posts?",
      answer: "Yes, you can manage your posts from the User History page. You have options to edit or delete your own posts at any time."
    },
    {
      question: "What are the community guidelines?",
      answer: "FoMa promotes respectful, constructive discussions. Please be courteous to other members, avoid spam, and share relevant content. Administrators can moderate content to maintain community standards."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

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
          <div className="support-container">
            {/* Header */}
            <div className="support-header">
              <HelpCircle size={48} className="header-icon" />
              <h1>Support Center</h1>
              <p>Find answers to common questions and get help with FoMa</p>
            </div>

            {/* Quick Contact Cards */}
            <div className="contact-cards">
              <div className="contact-card">
                <Mail size={32} />
                <h3>Email Support</h3>
                <p>Get help via email</p>
                <a href="mailto:support@foma.com" className="contact-link">
                  support@foma.com
                </a>
              </div>

              <div className="contact-card">
                <MessageCircle size={32} />
                <h3>Community Help</h3>
                <p>Ask the community</p>
                <a href="/community" className="contact-link">
                  Visit Communities
                </a>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <button 
                      className="faq-question"
                      onClick={() => toggleFAQ(index)}
                    >
                      <span>{faq.question}</span>
                      {openFAQ === index ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    {openFAQ === index && (
                      <div className="faq-answer">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Help */}
            <div className="additional-help">
              <h3>Still need help?</h3>
              <p>Can't find what you're looking for? Our team is here to assist you.</p>
              <button 
                className="help-button"
                onClick={() => window.location.href = 'mailto:support@foma.com'}
              >
                Contact Support Team
              </button>
            </div>
          </div>

          <style jsx>{`
            .main-content {
              padding-top: 28px;
            }

            .support-container {
              max-width: 900px;
              margin: 0 auto;
            }

            .support-header {
              text-align: center;
              padding: 48px 24px;
              background: #ecebf3;
              border-radius: 16px;
              margin-bottom: 32px;
            }

            .header-icon {
              color: #c7d6d5;
              margin-bottom: 16px;
            }

            .support-header h1 {
              font-size: 2.5rem;
              font-weight: 800;
              color: #0c120c;
              margin: 0 0 12px 0;
            }

            .support-header p {
              font-size: 1.1rem;
              color: #6c757d;
              margin: 0;
            }

            .contact-cards {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
              gap: 24px;
              margin-bottom: 48px;
            }

            .contact-card {
              background: #ecebf3;
              border-radius: 12px;
              padding: 32px;
              text-align: center;
              transition: transform 0.2s, box-shadow 0.2s;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .contact-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            }

            .contact-card svg {
              color: #c7d6d5;
              margin-bottom: 16px;
            }

            .contact-card h3 {
              font-size: 1.25rem;
              font-weight: 700;
              color: #0c120c;
              margin: 0 0 8px 0;
            }

            .contact-card p {
              color: #6c757d;
              margin: 0 0 16px 0;
            }

            .contact-link {
              display: inline-block;
              color: #c7d6d5;
              font-weight: 600;
              text-decoration: none;
              transition: color 0.2s;
            }

            .contact-link:hover {
              color: #b0c5c4;
              text-decoration: underline;
            }

            .faq-section {
              margin-bottom: 48px;
            }

            .faq-section h2 {
              font-size: 2rem;
              font-weight: 700;
              color: #0c120c;
              margin-bottom: 24px;
            }

            .faq-list {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            .faq-item {
              background: #ecebf3;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }

            .faq-question {
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 20px 24px;
              background: none;
              border: none;
              font-size: 1rem;
              font-weight: 600;
              color: #0c120c;
              text-align: left;
              cursor: pointer;
              transition: background 0.2s;
            }

            .faq-question:hover {
              background: rgba(199, 214, 213, 0.2);
            }

            .faq-answer {
              padding: 0 24px 20px 24px;
              color: #4a5568;
              line-height: 1.6;
              animation: slideDown 0.2s ease;
            }

            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .additional-help {
              text-align: center;
              padding: 48px 24px;
              background: linear-gradient(135deg, #c7d6d5 0%, #b0c5c4 100%);
              border-radius: 16px;
              color: #0c120c;
            }

            .additional-help h3 {
              font-size: 1.75rem;
              font-weight: 700;
              margin: 0 0 12px 0;
            }

            .additional-help p {
              font-size: 1rem;
              margin: 0 0 24px 0;
              opacity: 0.9;
            }

            .help-button {
              padding: 12px 32px;
              background: #0c120c;
              color: #ecebf3;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 1rem;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }

            .help-button:hover {
              background: #1a1f1a;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            @media (max-width: 768px) {
              .support-header h1 {
                font-size: 2rem;
              }

              .contact-cards {
                grid-template-columns: 1fr;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
