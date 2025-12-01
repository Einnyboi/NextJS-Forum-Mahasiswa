import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  addDoc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { db } from "./firebase"; // Pastikan path ini sesuai dengan lokasi firebase.ts Anda

// Definisi Tipe Data Post
export interface PostData {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'community' | 'event';
  date: string;
  createdAt?: any;
}

export const api = {

  // --- BAGIAN ADMIN ---
  admin: {
    // Mengambil semua user (Kita simpan logika Firestore di sini nanti jika perlu)
    getAllUsers: async () => {
      // Logic ambil user dari Firestore 'users' collection
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
    deleteUser: async (userId: string) => {
        // Logic delete user (Hanya delete data di Firestore, Auth perlu Admin SDK)
        return {}; 
    }
  },

  // --- BAGIAN POSTS (HOMEPAGE & ADMIN) ---
  posts: {
    // 1. AMBIL SEMUA POST
    getAll: async (): Promise<PostData[]> => {
      try {
        const postsRef = collection(db, "posts");
        // Menggunakan query biasa dulu (tanpa orderBy untuk menghindari error index di awal)
        const q = query(postsRef); 
        const querySnapshot = await getDocs(q);
        
        const posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PostData[];
        
        return posts;
      } catch (error) {
        console.error("Error getting posts:", error);
        return [];
      }
    },

    // 2. AMBIL POST BERDASARKAN KOMUNITAS (FILTER)
    getByCommunity: async (communityId: string) => {
       // Logic filter Firestore nanti bisa ditambahkan di sini
       return [];
    },

    // 3. BUAT POST BARU (CREATE)
    create: async (data: any) => {
      try {
        await addDoc(collection(db, "posts"), {
            ...data,
            createdAt: new Date()
        });
        return true;
      } catch (error) {
        console.error("Error creating post:", error);
        return false;
      }
    },

    // 4. HAPUS POST (DELETE) - INI YANG DIPAKAI ADMIN
    delete: async (postId: string) => {
      try {
        await deleteDoc(doc(db, "posts", postId));
        return true;
      } catch (error) {
        console.error("Error deleting post:", error);
        return false;
      }
    },

    // 5. LIKE POST
    like: async (postId: string) => {
      // Logic like Firestore
      return;
    }
  },
  
  // --- BAGIAN COMMUNITIES ---
  communities: {
    join: async (userId: string, communityId: string) => { return; },
    leave: async (userId: string, communityId: string) => { return; },
  },

  // --- BAGIAN COMMENTS ---
  comments: {
    getByPost: async (postId: string) => { return []; },
    create: async (data: any) => { return; }
  }
};