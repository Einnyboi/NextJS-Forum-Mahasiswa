'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PostData } from '@/lib/api';

// Helper: Warna avatar acak berdasarkan huruf depan
function getAvatarColor(letter: string) {
    const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#009688', '#FF5722', '#795548', '#607D8B'];
    const index = letter ? letter.charCodeAt(0) % colors.length : 0;
    return colors[index];
}

interface ThreadCardProps {
    thread: PostData;
    clickable?: boolean; // Opsional: Default true (bisa diklik)
}

export const ThreadCard = ({ thread, clickable = true }: ThreadCardProps) => {
    const router = useRouter();
    
    // State Lokal untuk interaksi visual
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50)); // Simulasi angka like

    // Ambil inisial nama untuk avatar
    const initial = thread.author ? thread.author.charAt(0).toUpperCase() : '?';

    // 1. Fungsi Navigasi ke Detail Page
    const handleCardClick = (e: React.MouseEvent) => {
        // Jika mode clickable aktif, pindah ke halaman detail
        if (clickable) {
            router.push(`/thread/${thread.id}`);
        }
    };

    // 2. Fungsi Like (Cegah Navigasi)
    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation(); // PENTING: Mencegah klik tembus ke kartu
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    // 3. Fungsi Komentar (Cegah Navigasi)
    const handleCommentClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // PENTING: Mencegah klik tembus ke kartu
        // Jika di halaman list, bisa diarahkan ke detail dan langsung scroll ke komen
        if (clickable) {
            router.push(`/thread/${thread.id}`);
        }
    };

    return (
        <div 
            className="thread-card" 
            onClick={handleCardClick}
            style={{ 
                cursor: clickable ? 'pointer' : 'default',
                transition: 'background-color 0.2s' 
            }}
        >
            {/* --- HEADER: AVATAR & INFO --- */}
            <div className="thread-header">
                <div className="author-info">
                    <div 
                        className="author-avatar" 
                        style={{ backgroundColor: getAvatarColor(initial) }}
                    >
                        {initial}
                    </div>
                    <div>
                        <div className="author-name">{thread.author}</div>
                        <div className="post-date" style={{fontSize: '0.75rem', color: '#999'}}>
                            {thread.date || 'Baru saja'}
                        </div>
                    </div>
                </div>
                
                {/* Badge Kategori */}
                <span className={`category-badge ${thread.category}`} style={{fontSize: '0.7rem'}}>
                    {thread.category}
                </span>
            </div>

            {/* --- BODY: JUDUL & KONTEN --- */}
            <div className="thread-body my-3" style={{padding: '0 1rem'}}>
                <h3 className="thread-title">{thread.title}</h3>
                
                <p className="thread-content">
                    {/* Jika di list (clickable), potong teks yang terlalu panjang */}
                    {clickable && thread.content.length > 150 
                        ? `${thread.content.substring(0, 150)}...` 
                        : thread.content
                    }
                </p>
            </div>

            {/* --- FOOTER: TOMBOL AKSI --- */}
            <div className="thread-footer">
                
                {/* Tombol Like */}
                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        cursor: 'pointer',
                        color: isLiked ? '#e0245e' : '#657786' // Merah jika dilike
                    }}
                    onClick={handleLike}
                >
                    <span style={{fontSize: '1.2rem'}}>{isLiked ? '❤️' : '🤍'}</span>
                    <span style={{fontSize: '0.9rem', fontWeight: 600}}>{likeCount}</span>
                </div>

                {/* Tombol Comment */}
                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        cursor: 'pointer', 
                        color: '#657786', 
                        marginLeft: '20px' 
                    }}
                    onClick={handleCommentClick}
                >
                    <span style={{fontSize: '1.2rem'}}>💬</span>
                    <span style={{fontSize: '0.9rem', fontWeight: 600}}>Comment</span>
                </div>

                {/* Tombol Share (Visual Saja) */}
                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        cursor: 'pointer', 
                        color: '#657786', 
                        marginLeft: 'auto' // Dorong ke kanan
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <span style={{fontSize: '1.2rem'}}>🔄</span>
                </div>

            </div>
        </div>
    );
};