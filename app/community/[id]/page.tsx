'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ThreadCard } from "@/components/features/thread/ThreadCard";
import CommunityCard from "@/components/features/community/CommunityCard";
import { api, PostData, CommunityData } from "@/lib/api";
import { Paperclip } from 'lucide-react';

// --- KOMPONEN MODAL CREATE POST (Khusus Komunitas) ---
interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    userEmail: string;
    communityId: string;
}

const CreatePostModal = ({ isOpen, onClose, onSubmit, userEmail, communityId }: CreateModalProps) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState<'community' | 'event'>('community');
    const [eventDate, setEventDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        let dateString = new Date().toLocaleDateString('id-ID');
        if (category === 'event' && eventDate) {
            const dateObj = new Date(eventDate);
            dateString = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        const success = await api.posts.create({
            title,
            content,
            imageUrl,
            author: userEmail || "Anonymous",
            category: category,
            communityId: communityId,
            date: dateString,
            createdAt: new Date()
        });

        setIsSubmitting(false);
        if (success) {
            setTitle("");
            setContent("");
            setImageUrl("");
            setCategory('community');
            setEventDate("");
            onSubmit();
            onClose();
        } else {
            alert("Failed to post.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Create New Discussion</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Post Type</label>
                        <select
                            className="form-input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as 'community' | 'event')}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                            <option value="community">Post</option>
                            <option value="event">Event</option>
                        </select>
                    </div>

                    {category === 'event' && (
                        <div className="form-group mt-3">
                            <label className="form-label">Event Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Topic Title</label>
                        <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>

                    {/* Image Upload */}
                    <div className="form-group">
                        <label className="btn btn-light btn-sm d-flex align-items-center gap-2 w-auto" style={{ width: 'fit-content', cursor: 'pointer' }}>
                            <Paperclip size={18} />
                            <span>Add Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </label>

                        {imageUrl && (
                            <div className="mt-2 position-relative" style={{ width: 'fit-content' }}>
                                <img src={imageUrl} alt="Preview" style={{ maxHeight: '200px', borderRadius: '8px' }} />
                                <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                    onClick={() => setImageUrl("")}
                                    style={{ padding: '2px 6px', fontSize: '10px' }}
                                >
                                    &times;
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Discussion Content</label>
                        <textarea className="form-textarea" value={content} onChange={e => setContent(e.target.value)} required />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? "Posting..." : "Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- HALAMAN UTAMA ---
export default function CommunityDetailPage() {
    const params = useParams();
    const router = useRouter();
    const communityId = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [community, setCommunity] = useState<CommunityData | null>(null);
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Check user session from localStorage
    useEffect(() => {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            if (session.isLoggedIn) {
                setUser({
                    email: session.email,
                    role: session.role,
                    fullName: session.fullName
                });
            }
        }
    }, []);

    // Fetch community data
    const fetchCommunity = async () => {
        try {
            const communities = await api.communities.getAll();
            const foundCommunity = communities.find((c: any) => c.id === communityId);
            if (foundCommunity) {
                setCommunity(foundCommunity as CommunityData);
            }
        } catch (error) {
            console.error('Error fetching community:', error);
        }
    };

    // Fetch posts
    const fetchPosts = async () => {
        setLoading(true);
        const data = await api.posts.getByCommunity(communityId);
        setPosts(data);
        setLoading(false);
    };

    useEffect(() => {
        if (communityId) {
            fetchCommunity();
            fetchPosts();
        }
    }, [communityId, user]);

    return (
        <div>
            <Navbar onNavChange={() => router.push('/')} isLoggedIn={!!user} userRole={user?.role} />

            <div className="main-dashboard-layout">
                <Sidebar activeView="community" onMenuClick={(view) => router.push(view === 'home' ? '/' : `/${view}`)} />

                <div className="main-content">

                    {/* WRAPPER UTAMA: RIGHT PANEL CARD */}
                    <div className="right-panel-card">

                        {/* Back Button & Header */}
                        <div className="d-flex align-items-center mb-4 gap-3">
                            <div className="bg-light p-2 rounded-3 d-inline-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', cursor: 'pointer', position: 'relative', zIndex: 50 }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push('/community');
                                    }}
                                    className="btn btn-link text-decoration-none p-0 d-flex align-items-center justify-content-center text-dark"
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <span className="fw-bold fs-5">&lt;</span>
                                </button>
                            </div>
                            {/* Judul Halaman: Nama Komunitas */}
                            <h2 className="m-0 fw-bold fs-4 text-dark">{community?.name || 'Community'}</h2>
                        </div>

                        {/* Header Komunitas Menggunakan CommunityCard */}
                        <div className="mb-4">
                            {community ? (
                                <CommunityCard
                                    community={community}
                                    isJoined={false}
                                />
                            ) : (
                                <div className="p-4 bg-light rounded shadow-sm text-center">Loading community info...</div>
                            )}
                        </div>

                        {/* Tombol Buat Diskusi */}
                        <div className="mb-4">
                            {user ? (
                                <button className="btn-create-test w-100" onClick={() => setIsModalOpen(true)}>
                                    + Create New Discussion in {community?.name}
                                </button>
                            ) : (
                                <div className="alert alert-warning">Login to start a discussion.</div>
                            )}
                        </div>

                        {/* List Threads */}
                        {loading ? (
                            <p className="state-message">Loading discussions...</p>
                        ) : posts.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {posts.map(post => (
                                    <ThreadCard key={post.id} thread={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="state-message">
                                <p>No discussions in this community yet.</p>
                                <p className="small">Be the first to start a topic!</p>
                            </div>
                        )}
                    </div>

                    {/* Modal Popup */}
                    <CreatePostModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={fetchPosts}
                        userEmail={user?.email}
                        communityId={communityId}
                    />

                </div>
            </div>
        </div>
    );
}