'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types';
import Image from 'next/image';
import { User as UserIcon, Image as ImageIcon, Save, X } from 'lucide-react';

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

      alert("Profile updated successfully!");
      router.push('/profile'); 
      router.refresh(); 

    } catch (error) {
      console.error(error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-form-container">
      {/* Avatar Preview */}
      <div className="avatar-preview-section">
        <div className="avatar-preview">
          <Image
            src={avatar || user.avatarUrl}
            alt="Avatar preview"
            width={120}
            height={120}
            className="rounded-circle"
            unoptimized
            style={{ objectFit: 'cover' }}
          />
        </div>
        <p className="preview-label">Profile Picture Preview</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label className="form-label">
            <UserIcon size={18} />
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <ImageIcon size={18} />
            Avatar URL
          </label>
          <input
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="form-input"
            placeholder="https://example.com/avatar.jpg"
          />
          <p className="form-hint">Use an image hosting service like Imgur or Postimages</p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="btn-cancel"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-save"
          >
            <Save size={18} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .edit-form-container {
          background: #ecebf3;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        }

        .avatar-preview-section {
          text-align: center;
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 2px solid #c7d6d5;
        }

        .avatar-preview {
          display: inline-block;
          border: 4px solid #c7d6d5;
          border-radius: 50%;
          margin-bottom: 12px;
        }

        .preview-label {
          color: #6c757d;
          font-size: 0.875rem;
          margin: 0;
        }

        .profile-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #0c120c;
          margin-bottom: 8px;
          font-size: 0.95rem;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #c7d6d5;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          color: #0c120c;
          transition: all 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: #b0c5c4;
          box-shadow: 0 0 0 3px rgba(199, 214, 213, 0.2);
        }

        .form-hint {
          margin-top: 6px;
          font-size: 0.8rem;
          color: #6c757d;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 2px solid #c7d6d5;
        }

        .btn-cancel,
        .btn-save {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: white;
          color: #6c757d;
          border: 2px solid #dee2e6;
        }

        .btn-cancel:hover {
          background: #f8f9fa;
          border-color: #c7d6d5;
          color: #0c120c;
        }

        .btn-save {
          background: #c7d6d5;
          color: #0c120c;
          box-shadow: 0 2px 8px rgba(199, 214, 213, 0.3);
        }

        .btn-save:hover:not(:disabled) {
          background: #b0c5c4;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(199, 214, 213, 0.4);
        }

        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .edit-form-container {
            padding: 24px;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}