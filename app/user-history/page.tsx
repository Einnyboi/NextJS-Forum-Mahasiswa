'use client'
import React from "react";
import { historyData} from "@/lib/historydata";
import { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";

export default function HistoryPage() {
    const [sortBy, setSortBy] = useState('newest');

    // Tambahkan tipe untuk event
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(event.target.value);
    };

    const sortedActivities = useMemo(() => {
        // pake historyData
        const sortableItems = [...historyData]; 

        switch (sortBy) {
            case 'oldest':
                // mengurutkan dari tanggal terlama ke terbaru
                return sortableItems.sort((a, b) => a.date.getTime() - b.date.getTime());
            case 'most-likes':
                // megurutkan dari yang paling banyak like
                return sortableItems.sort((a, b) => b.likes - a.likes);
            case 'most-comments':
                // mengurutkan dari yang paling banyak komentar
                return sortableItems.sort((a, b) => b.replies - a.replies);
            case 'newest':
            default: // default untuk 'newest' 
                // mengurutkan dari tanggal terbaru ke terlama
                return sortableItems.sort((a, b) => b.date.getTime() - a.date.getTime());
        }
    }, [sortBy]);

    return (
        <main className="font-sans">
            <Head>
                <title>History User</title>
            </Head>

            <div className="min-vh-100 py-5" style={{ backgroundColor: 'var(--white-color)' }}>
                <div className="container p-4">
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
                        <div id="activity-container">

                            {/* Pindahkan deklarasi const di dalam map, sebelum return */}
                            {sortedActivities.map(post => {
                                // Deklarasi variabel (di dalam scope fungsi map)
                                const formattedDate = post.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                                return ( 
                                    <article className="card activity-post-card p-5 mb-4 rounded-4" style={{ backgroundColor: 'var(--primary-color)' }} key={post.id}>
                                        
                                        {/* Baris Judul */}
                                        <h5 className="post-title pb-2" style={{fontSize:'var(--h5-size)'}}>
                                            <Link 
                                                href={post.url}
                                            >
                                                {post.title}
                                            </Link>
                                        </h5>

                                        <div className="small text-secondary mb-2">
                                            {/* Tipe Aktivitas dan Kategori */}
                                            <span className="fw-semibold">{post.type}</span> in category 
                                            <Link className="text-danger hover-underline ms-1 fw-medium" id="kategori" href={`/category/${post.category}`}>{post.category}</Link>
                                        </div>

                                        {/* Konten/Excerpt */}
                                        <p className="mb-3" style={{color:'var(--secondary-color)'}}>{post.content}</p>

                                        {/* Footer */}
                                        <div className="pt-2 small text-muted border-top border-secondary d-flex gap-2">
                                            <span>{formattedDate}</span> <span>|</span> <span>{post.likes} Likes</span> <span>|</span> <span>{post.replies} Replies</span>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}