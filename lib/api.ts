import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  addDoc,
  query,
  orderBy,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "./firebase"; // Pastikan path ini benar

// --- DEFINISI TIPE DATA (TYPES) ---
export interface PostData {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'community' | 'event';
  date: string;
  createdAt?: any;
}

export interface CommunityData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  members?: string[]; // Array of User IDs
}

// --- API OBJECT ---
export const api = {

  // 1. BAGIAN ADMIN
  admin: {
    getAllUsers: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
    deleteUser: async (userId: string) => {
        // Note: Menghapus user dari Auth membutuhkan Admin SDK (Backend).
        // Di sini kita hanya bisa menghapus data profile mereka di Firestore.
        try {
            await deleteDoc(doc(db, "users", userId));
            return true;
        } catch (error) {
            console.error("Error deleting user data:", error);
            return false;
        }
    }
  },

  // 2. BAGIAN POSTS
  posts: {
    // Ambil semua post
    getAll: async (): Promise<PostData[]> => {
      try {
        const postsRef = collection(db, "posts");
        // Kita gunakan query tanpa orderBy dulu untuk menghindari error index Firestore
        const q = query(postsRef); 
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PostData[];
      } catch (error) {
        console.error("Error getting posts:", error);
        return [];
      }
    },

    // Ambil post by Community (Filter)
    getByCommunity: async (communityId: string) => {
       // Logic filter Firestore placeholder
       return [];
    },

    // Buat Post Baru
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

    // Hapus Post (Untuk Admin & User)
    delete: async (postId: string) => {
      try {
        await deleteDoc(doc(db, "posts", postId));
        return true;
      } catch (error) {
        console.error("Error deleting post:", error);
        return false;
      }
    },

    // Like Post
    like: async (postId: string) => {
      // Placeholder logic
      return;
    }
  },
  
  // 3. BAGIAN COMMUNITIES (Diubah ke Firebase Langsung)
  communities: {
    // Create Community
    create: async (data: {name: string; description: string; imageUrl: string}) => {
      try {
        await addDoc(collection(db, "communities"), {
            ...data,
            members: [],
            createdAt: new Date()
        });
        return true;
      } catch (error) {
        console.error("Error creating community:", error);
        return false;
      }
    },

    // Get All Communities
    getAll: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "communities"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching communities:", error);
        return [];
      }
    },

    // Join Community
    join: async (userId: string, communityId: string) => {
      try {
        const commRef = doc(db, "communities", communityId);
        // Tambahkan userId ke array 'members'
        await updateDoc(commRef, {
            members: arrayUnion(userId)
        });
        return true;
      } catch (error) {
        console.error("Error joining community:", error);
        return false;
      }
    },

    // Leave Community
    leave: async (userId: string, communityId: string) => {
      try {
        const commRef = doc(db, "communities", communityId);
        // Hapus userId dari array 'members'
        await updateDoc(commRef, {
            members: arrayRemove(userId)
        });
        return true;
      } catch (error) {
        console.error("Error leaving community:", error);
        return false;
      }
    },
  },

  // 4. BAGIAN COMMENTS
  comments: {
    getByPost: async (postId: string) => { return []; },
    create: async (data: any) => { return; }
  }
};