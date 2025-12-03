'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ThreadCard } from "@/components/features/thread/ThreadCard";
import CommunityCard from "@/components/features/community/CommunityCard"; // Import CommunityCard
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

        const success = await api.posts.create({
            title,
            content,
            imageUrl,
            author: userEmail || "Anonymous",
            category: 'community',
            communityId: communityId,
            date: new Date().toLocaleDateString('id-ID'),
            createdAt: new Date()
        });

        setIsSubmitting(false);
        if (success) {
            setTitle("");
            setContent("");
            setImageUrl("");
            onSubmit();
            onClose();
        } else {
            alert("Gagal memposting.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Buat Diskusi Baru</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Judul Topik</label>
                        <input type="text" className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>

                    {/* Image Upload */}
                    <div className="form-group">
                        <label className="btn btn-light btn-sm d-flex align-items-center gap-2 w-auto" style={{ width: 'fit-content', cursor: 'pointer' }}>
                            <Paperclip size={18} />
                            <span>Tambahkan Gambar</span>
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
                        <label className="form-label">Isi Diskusi</label>
                        <textarea className="form-textarea" value={content} onChange={e => setContent(e.target.value)} required />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? "Memposting..." : "Posting"}
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
                <Sidebar activeView="community" onMenuClick={(view) => router.push(`/${view}`)} />

                <div className="main-content">

                    {/* Back Button */}
                    <button
                        onClick={() => router.push('/community')}
                        className="btn btn-link text-decoration-none p-0 mb-3 d-flex align-items-center gap-2 text-muted"
                    >
                        &larr; Kembali ke Daftar Komunitas
                    </button>

                    {/* Header Komunitas Menggunakan CommunityCard */}
                    <div className="mb-4">
                        {community ? (
                            <CommunityCard
                                community={community}
                                isJoined={false}
                            />
                        ) : (
                            <div className="p-4 bg-white rounded shadow-sm">Memuat info komunitas...</div>
                        )}
                    </div>

                    {/* Tombol Buat Diskusi */}
                    <div className="mb-4">
                        {user ? (
                            <button className="btn-create-test w-100" onClick={() => setIsModalOpen(true)}>
                                + Buat Diskusi Baru di {community?.name}
                            </button>
                        ) : (
                            <div className="alert alert-warning">Login untuk membuat diskusi.</div>
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

                    {/* List Threads */}
                    {loading ? (
                        <p className="state-message">Memuat diskusi...</p>
                    ) : posts.length > 0 ? (
                        <div className="d-flex flex-column gap-3">
                            {posts.map(post => (
                                <ThreadCard key={post.id} thread={post} />
                            ))}
                        </div>
                    ) : (
                        <div className="state-message">
                            <p>Belum ada diskusi di komunitas ini.</p>
                            <p className="small">Jadilah yang pertama memulai topik!</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}