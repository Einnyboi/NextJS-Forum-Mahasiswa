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

  admin: {
    getAllUsers: async () => {
      // Pastikan path fetcher ini sesuai dengan backend Anda nanti
      // Untuk sementara bisa pakai fetcher atau return data dummy
      return []; 
    },
    deleteUser: async (userId: string) => {
      return {};
    }
  },

  // Threads page functions disini (Onel)
  posts: {
    // fungsi ambil semua post
    // GET /api/posts
    getAll : async () => {
      return fetcher('/api/posts');
    },

    // fungsi untuk ambil HANYA post dari commuity tertentu
    // GET /api/posts?communityId=comm-1
    getByCommunity: async (communityId: string) => {
      return fetcher(`/api/posts?communityId=${communityId}`);
    },

    // fungsi bikin post baru
    // POST /api/posts/create
    create: async (data: { title: string; content: string; communityId: string; authorId: string }) => {
      return fetcher('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    },

    // fungsi untuk like post
    // POST /api/posts/like
    like: async (postId: string) => {
      return fetcher('/api/posts/like', {
        method: 'POST',
        headers: {'Content-Type' : 'apllication/json'},
        body: JSON.stringify({postId}),
      });
    }
    
  },
  
  // Communities page functions disini (Cath)
  communities: {

    // fungsi untuk join community
    // POST /api/communities/join
    join: async (userId: string, communityId: string) => {
      return fetcher('/api/communities/join', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({userId, communityId}),
      });
    },

    //fungsi untuk leave Community
    // POST /api/communities/leave
    leave: async (userId: string, communityId: string) => {
      return fetcher('/api/communities/leave', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({userId, communityId}),
      });
    },
  },

  comments: {
    //fungsi untuk ambil comments dari post tertentu
    // GET /api/comments?postId=post-1
    getByPost: async (postId: string) =>{
      return fetcher(`/api/comments?postId=${postId}`);
    },

    //fungsi untuk create comment
    // POST /api/comments/create
    create: async (data:{postId:string; authorId:string; content:string}) =>{
      return fetcher('/api/comments/create', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(data),
      });
    }
  }
};