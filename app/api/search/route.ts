// API Route Handler untuk Next.js App Router
// Menggunakan NextResponse dari next/server untuk menangani respons
import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db'; 
import { SearchResult } from '@/lib/types'; 

// Fungsi ini menangani semua permintaan HTTP GET ke endpoint /api/search.

export async function GET(request: Request) {
    try {
        // Ambil parameter 'q' (query string) dari URL
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        
        //  Validasi query
        if (!query) {
            // Jika query kosong, kembalikan array kosong (status 200 OK)
            // Menggunakan NextResponse.json()
            return NextResponse.json<SearchResult[]>([]);
        }

        //  Delegasi Logika Pencarian ke DB Service
        const searchResults = await dbService.search.getResults(query);
        
        // Kirim hasil gabungan ke frontend (status 200 OK secara default)
        return NextResponse.json<SearchResult[]>(searchResults);

    } catch (error) {
        console.error("Search API Error:", error);
        //  Kirim pesan error jika terjadi kegagalan (status 500 Internal Server Error)
        return NextResponse.json(
            { message: 'Internal server error during search.' }, 
            { status: 500 }
        );
    }
}