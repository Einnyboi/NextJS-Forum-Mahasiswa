'use client'
import React, { useState, useMemo, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { api } from "@/lib/api";
import { Post } from '@/lib/types';
import Navbar from '@/components/features/important/navbar';
import Sidebar from '@/components/features/important/sidebar';

export default function HistoryPage() {
    const [sortBy, setSortBy] = useState('newest');
    const [posts, setPosts] = useState<Post[]>([]); 
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Get user from localStorage
    const getCurrentUserId = () => {
        if (typeof window === 'undefined') return null;
        const sessionData = localStorage.getItem('userSession');
        if (!sessionData) return null;
        try {
            const parsed = JSON.parse(sessionData);
            return parsed?.id || parsed?.uid || parsed?.userId || null;
        } catch {
            return null;
        }
    };

    // Check user session
    useEffect(() => {
        const checkUserSession = () => {
            try {
                const sessionData = localStorage.getItem('userSession');
                if (sessionData) {
                    const session = JSON.parse(sessionData);
                    if (session.isLoggedIn) {
                        setUser(session);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error reading session:", error);
                setUser(null);
            }
        };

        checkUserSession();
        window.addEventListener('storage', checkUserSession);
        return () => window.removeEventListener('storage', checkUserSession);
    }, []);

    // LOGIKA FETCHING DATA
    useEffect(() => {
        const currentUserId = getCurrentUserId();
        
        if (!currentUserId) {
            setPosts([]); 
            return;
        }

        const loadPosts = async () => {
            setIsLoadingPosts(true); 
            try {
                // Panggil API Fetcher dengan ID pengguna yang sudah login
                const data: Post[] = await api.posts.getUserPosts(currentUserId);
                setPosts(data);
            } catch (error) {
                console.error("Error fetching user history:", error);
                setPosts([]); 
            } finally {
                setIsLoadingPosts(false);
            }
        };

        loadPosts();
    }, []);
    
    // Handler untuk perubahan sorting
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(event.target.value);
    };

    const sortedActivities = useMemo(() => {
        const sortableItems = [...posts]; 

        switch (sortBy) {
            case 'oldest':
                // mengurutkan dari tanggal terlama ke terbaru
                return sortableItems.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            case 'most-likes':
                // megurutkan dari yang paling banyak like
                return sortableItems.sort((a, b) => b.likeCount - a.likeCount);
            case 'most-comments':
                // mengurutkan dari yang paling banyak komentar
                return sortableItems.sort((a, b) => b.commentCount - a.commentCount);
            case 'newest':
            default: // default untuk 'newest' 
                // mengurutkan dari tanggal terbaru ke terlama
                return sortableItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }, [sortBy, posts]);

    // Conditional Rendering Content
    let content;

    if (isLoadingPosts) {
        content = <p className="text-center text-muted py-5">Loading your post history...</p>;
    } else if (sortedActivities.length === 0) {
        content = <p className="text-center text-muted py-5">No activities found for this user.</p>;
    } else {
        // Tampilan List Postingan Normal
        content = (
            <div id="activity-container">
                {sortedActivities.map(post => {
                    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                    return ( 
                        <article className="card activity-post-card p-5 mb-4 rounded-4" style={{ backgroundColor: 'var(--primary-color)' }} key={post.id}>
                            <h5 className="post-title pb-2" style={{fontSize:'var(--h5-size)'}}>
                                <Link href={`/thread/${post.id}`}>{post.title}</Link>
                            </h5>
                            
                            <div className="small text-secondary mb-2">
                                Posted in 
                                <Link className="text-secondary hover-underline ms-1 fw-bold" id="kategori" href={`/community/${post.communityId}`}>{post.communityName}</Link>
                                {post.tag && <span className="text-muted ms-2">| {post.tag}</span>}
                            </div>

                            <p className="mb-3" style={{color:'var(--secondary-color)'}}>{post.content}</p>

                            <div className="pt-2 small text-muted border-top border-secondary d-flex gap-2">
                                <span>{formattedDate}</span> <span>|</span> 
                                <span>{post.likeCount} Likes</span> <span>|</span> 
                                <span>{post.commentCount} Replies</span>
                            </div>
                        </article>
                    );
                })}
            </div>
        );
    }

    return (
        <div>
            <Head>
                <title>History User</title>
            </Head>

            {/* NAVBAR DITEMPATKAN DI LUAR CONTAINER UTAMA */}
            <Navbar 
                onNavChange={() => {}}
                isLoggedIn={!!user}
            />
            
            <div className="main-container hide-scrollbar">
                <div className="main-dashboard-layout">
                    
                    {/* SIDEBAR DITEMPATKAN DI KIRI */}
                    <Sidebar />
                    
                    {/* KONTEN UTAMA HISTORY DITEMPATKAN DI KANAN */}
                    <div className="main-content px-5">
                        <main className="font-sans">
                            <div className="min-vh-100 rounded-4 py-5" style={{ backgroundColor: 'var(--white-color)' }}>
                                <div className="container px-5 pb-3">
                                    <div className="mb-4">

                                        {/* Header dan Filter */}
                                        <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom border-secondary-subtle">
                                            <h2 className="h2 fw-bold" style={{ fontSize: '2.488rem', fontFamily: 'var(--h2-size)'}}>History</h2>
                                            <div className="d-flex align-items-center gap-2 mt-3">
                                                <label htmlFor="filter-select" className="fs-5" style={{color:'var(--secondary-color)'}}>Sort by:</label>
                                                <select
                                                    name="filter"
                                                    id="filter-select"
                                                    value={sortBy}
                                                    onChange={handleSortChange}
                                                    className="form-select form-select-sm border rounded-3 fs-6" style={{ width: 'auto' }}
                                                >
                                                    <option value="newest">Newest</option>
                                                    <option value="oldest">Oldest</option>
                                                    <option value="most-likes">Most Liked</option>
                                                    <option value="most-comments">Most Commented</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Container Daftar Aktivitas User */}
                                        {content}
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
}