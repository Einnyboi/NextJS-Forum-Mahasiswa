'use client'
import React from "react";
import { historyData, HistoryItem } from "@/lib/historydata";
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
                return sortableItems.sort((a, b) => a.date.getTime() - b.date.getTime());
            case 'most-likes':
                return sortableItems.sort((a, b) => b.likes - a.likes);
            case 'most-comments':
                return sortableItems.sort((a, b) => b.replies - a.replies);
            case 'newest':
            default:
                return sortableItems.sort((a, b) => b.date.getTime() - a.date.getTime());
        }
    }, [sortBy]);

    return (
        <main className="font-sans">
            <Head>
                <title>History User</title>
            </Head>

            <div className="min-h-screen bg-secondary py-10 font-sans">
                <div className="max-w-4xl mx-auto p-4">
                    <div className="mb-6">

                        {/* Header dan Filter */}
                        <div className="flex justify-between items-center mb-10 pb-5 border-b border-gray-500">
                            <h2 className="text-[2.488rem] font-bold text-brand-black font-lato mb-0 ">History</h2>
                            <div className="flex items-center space-x-2 mt-5">
                                <label htmlFor="filter-select" className="text-[1.2rem] text-brand-black ">Urutkan berdasarkan:</label>
                                <select
                                    name="filter"
                                    id="filter-select"
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    className="p-1 border border-gray-100 rounded-md text-[1rem]"
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
                                    <article className="bg-primary p-10 mb-5 rounded-xl text-brand-black bg-primary transition duration-300 ease-in-out 
                                                        hover:bg-[#b8c5c4] hover:-translate-y-0.5 hover:shadow-xl font-sans" key={post.id}>
                                        
                                        {/* Baris Judul */}
                                        <h5 className="text-[1.44rem] font-bold mb-1 text-brand-black hover:text-secondary font-lato pb-3"><Link href={post.url}>{post.title}</Link></h5>

                                        <div className="text-sm text-brand-black mb-2">
                                            {/* Tipe Aktivitas dan Kategori */}
                                            <span className="font-semibold">{post.type}</span> in category 
                                            <Link className="text-red-600 hover:underline ml-1 font-medium" id="kategori" href={`/category/${post.category}`}>{post.category}</Link>
                                        </div>

                                        {/* Konten/Excerpt */}
                                        <p className="text-brand-black mb-3">{post.content}</p>

                                        {/* Footer */}
                                        <div className="pt-2 text-xs text-gray-800 border-t border-gray-500 flex space-x-2">
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