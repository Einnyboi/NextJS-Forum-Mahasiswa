'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/features/important/navbar';
import Sidebar from '@/components/features/important/sidebar';
import { User, Bell, Lock, Palette, Globe, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(true);
  const [eventReminders, setEventReminders] = useState(true);
  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
      const session = JSON.parse(sessionData);
      if (session.isLoggedIn) {
        setUser(session);
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSaveSettings = () => {
    setLoading(true);
    setMessage('');

    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion feature will be implemented soon.');
    }
  };

  if (!user) {
    return null;
  }

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
          <div className="settings-container">
            <div className="settings-header">
              <h1>Settings</h1>
              <p>Manage your account preferences and settings</p>
            </div>

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {/* Account Settings */}
            <div className="settings-section">
              <div className="section-header">
                <User size={24} />
                <h2>Account Settings</h2>
              </div>
              <div className="section-content">
                <div className="setting-item">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={user.email} 
                    disabled 
                    className="setting-input disabled"
                  />
                  <span className="setting-hint">Your email cannot be changed</span>
                </div>
                <div className="setting-item">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={user.name} 
                    disabled 
                    className="setting-input disabled"
                  />
                  <span className="setting-hint">Edit your profile to change your username</span>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="settings-section">
              <div className="section-header">
                <Bell size={24} />
                <h2>Notifications</h2>
              </div>
              <div className="section-content">
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Email Notifications</label>
                    <span className="setting-hint">Receive email updates about your activity</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Push Notifications</label>
                    <span className="setting-hint">Receive push notifications in your browser</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Community Updates</label>
                    <span className="setting-hint">Get notified about new posts in your communities</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={communityUpdates}
                      onChange={(e) => setCommunityUpdates(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-toggle">
                  <div className="toggle-info">
                    <label>Event Reminders</label>
                    <span className="setting-hint">Receive reminders about upcoming events</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={eventReminders}
                      onChange={(e) => setEventReminders(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="settings-section">
              <div className="section-header">
                <Palette size={24} />
                <h2>Appearance</h2>
              </div>
              <div className="section-content">
                <div className="setting-item">
                  <label>Theme</label>
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="setting-select"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                  <span className="setting-hint">Choose your preferred theme</span>
                </div>
              </div>
            </div>

            {/* Language Settings */}
            <div className="settings-section">
              <div className="section-header">
                <Globe size={24} />
                <h2>Language & Region</h2>
              </div>
              <div className="section-content">
                <div className="setting-item">
                  <label>Language</label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="setting-select"
                  >
                    <option value="en">English</option>
                    <option value="id">Bahasa Indonesia</option>
                  </select>
                  <span className="setting-hint">Select your preferred language</span>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="settings-section">
              <div className="section-header">
                <Lock size={24} />
                <h2>Privacy & Security</h2>
              </div>
              <div className="section-content">
                <button className="secondary-button">
                  Change Password
                </button>
                <span className="setting-hint">Update your password regularly for security</span>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="settings-section danger-section">
              <div className="section-header">
                <Trash2 size={24} />
                <h2>Danger Zone</h2>
              </div>
              <div className="section-content">
                <div className="danger-content">
                  <div>
                    <label>Delete Account</label>
                    <span className="setting-hint">Permanently delete your account and all data</span>
                  </div>
                  <button className="danger-button" onClick={handleDeleteAccount}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="settings-actions">
              <button 
                className="save-button"
                onClick={handleSaveSettings}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <style jsx>{`
            .main-content {
              padding-top: 28px;
            }

            .settings-container {
              max-width: 800px;
              margin: 0 auto;
            }

            .settings-header {
              margin-bottom: 32px;
            }

            .settings-header h1 {
              font-size: 2.5rem;
              font-weight: 800;
              color: #0c120c;
              margin: 0 0 8px 0;
            }

            .settings-header p {
              font-size: 1rem;
              color: #6c757d;
              margin: 0;
            }

            .success-message {
              background: #d4edda;
              color: #155724;
              padding: 12px 16px;
              border-radius: 8px;
              margin-bottom: 24px;
              border: 1px solid #c3e6cb;
            }

            .settings-section {
              background: #ecebf3;
              border-radius: 16px;
              padding: 32px;
              margin-bottom: 24px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            }

            .danger-section {
              background: #fff5f5;
              border: 1px solid #feb2b2;
            }

            .section-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 24px;
              color: #0c120c;
            }

            .section-header h2 {
              font-size: 1.5rem;
              font-weight: 700;
              margin: 0;
            }

            .section-content {
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            .setting-item {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            .setting-item label {
              font-weight: 600;
              color: #0c120c;
              font-size: 0.95rem;
            }

            .setting-input {
              padding: 12px 16px;
              border: 2px solid #d1d5db;
              border-radius: 8px;
              font-size: 1rem;
              transition: border-color 0.2s;
            }

            .setting-input:focus {
              outline: none;
              border-color: #c7d6d5;
            }

            .setting-input.disabled {
              background: #f3f4f6;
              cursor: not-allowed;
            }

            .setting-select {
              padding: 12px 16px;
              border: 2px solid #d1d5db;
              border-radius: 8px;
              font-size: 1rem;
              background: white;
              cursor: pointer;
              transition: border-color 0.2s;
            }

            .setting-select:focus {
              outline: none;
              border-color: #c7d6d5;
            }

            .setting-hint {
              font-size: 0.85rem;
              color: #6c757d;
            }

            .setting-toggle {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
            }

            .toggle-info {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }

            .toggle-info label {
              font-weight: 600;
              color: #0c120c;
              font-size: 0.95rem;
            }

            .toggle-switch {
              position: relative;
              display: inline-block;
              width: 52px;
              height: 28px;
            }

            .toggle-switch input {
              opacity: 0;
              width: 0;
              height: 0;
            }

            .slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: #cbd5e0;
              transition: 0.3s;
              border-radius: 28px;
            }

            .slider:before {
              position: absolute;
              content: "";
              height: 20px;
              width: 20px;
              left: 4px;
              bottom: 4px;
              background-color: white;
              transition: 0.3s;
              border-radius: 50%;
            }

            input:checked + .slider {
              background-color: #c7d6d5;
            }

            input:checked + .slider:before {
              transform: translateX(24px);
            }

            .secondary-button {
              padding: 12px 24px;
              background: white;
              color: #0c120c;
              border: 2px solid #c7d6d5;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            }

            .secondary-button:hover {
              background: #c7d6d5;
              transform: translateY(-2px);
            }

            .danger-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .danger-content > div {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }

            .danger-content label {
              font-weight: 600;
              color: #0c120c;
              font-size: 0.95rem;
            }

            .danger-button {
              padding: 12px 24px;
              background: #dc3545;
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
            }

            .danger-button:hover {
              background: #c82333;
              transform: translateY(-2px);
            }

            .settings-actions {
              display: flex;
              justify-content: flex-end;
              margin-top: 32px;
            }

            .save-button {
              padding: 14px 40px;
              background: #c7d6d5;
              color: #0c120c;
              border: none;
              border-radius: 8px;
              font-weight: 700;
              font-size: 1rem;
              cursor: pointer;
              transition: all 0.2s;
            }

            .save-button:hover:not(:disabled) {
              background: #b0c5c4;
              transform: translateY(-2px);
            }

            .save-button:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }

            @media (max-width: 768px) {
              .settings-header h1 {
                font-size: 2rem;
              }

              .settings-section {
                padding: 24px;
              }

              .danger-content {
                flex-direction: column;
                align-items: flex-start;
                gap: 16px;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
