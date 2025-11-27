import { Community } from './types';
// lib/api.ts

async function fetcher(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'An error occurred');
  }
  return res.json();
}

export const api = {

  // ... (Kode posts yang sudah ada biarkan saja) ...
  posts: {
     // ...
     getAll : async () => {
      return fetcher('/api/posts');
    },
    // ...
  },
  
  // ... (Kode communities biarkan saja) ...
  communities: {
    // ...
  },

  // ... (Kode comments biarkan saja) ...
  comments: {
    // ...
  },

  // --- TAMBAHKAN BAGIAN INI UNTUK ADMIN ---
  admin: {
    // Mengambil semua user untuk tabel "Kelola Pengguna"
    // GET /api/users (Anda perlu membuat route ini nanti di backend)
    getAllUsers: async () => {
      return fetcher('/api/users'); 
    },

    // Menghapus user
    // DELETE /api/users?id=123
    deleteUser: async (userId: string) => {
      return fetcher(`/api/users?id=${userId}`, {
        method: 'DELETE',
      });
    }
  }
  // ----------------------------------------
};