import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  getDoc, 
  addDoc, 
  query, 
  orderBy, 
  where, 
  updateDoc, 
  arrayUnion, 
  arrayRemove
} from "firebase/firestore";
import { db } from "./firebase"; 

// --- DEFINISI TIPE DATA ---
export interface PostData {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'community' | 'event';
  date: string;
  createdAt?: any;
  isVisible?: boolean; // <-- INI YANG DICARI HALAMAN ADMIN
}

export interface CommunityData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  members?: string[]; 
}

export interface CommentData {
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: any;
}

// --- API OBJECT ---
export const api = {

  // 1. ADMIN
  admin: {
    getAllUsers: async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) { return []; }
    },
    deleteUser: async (id: string) => {
        try { await deleteDoc(doc(db, "users", id)); return true; } 
        catch (e) { return false; }
    }
  },

  // 2. POSTS
  posts: {
    getAll: async (): Promise<PostData[]> => {
      try {
        const q = query(collection(db, "posts")); 
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PostData[];
      } catch (e) { return []; }
    },

    getById: async (postId: string): Promise<PostData | null> => {
      try {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as PostData : null;
      } catch (e) { return null; }
    },

    getByCommunity: async (communityId: string) => {
      try {
        const q = query(
            collection(db, "posts"), 
            where("communityId", "==", communityId),
            where("isVisible", "==", true)
        );
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PostData[];
      } catch (e) { return []; }
    },

    create: async (data: any) => {
      try {
        await addDoc(collection(db, "posts"), { ...data, isVisible: true, createdAt: new Date() });
        return true;
      } catch (e) { return false; }
    },

    delete: async (id: string) => {
      try { await deleteDoc(doc(db, "posts", id)); return true; } 
      catch (e) { return false; }
    },

    // --- FUNGSI INI YANG MEMBUAT ADMIN ERROR JIKA HILANG ---
    toggleVisibility: async (id: string, status: boolean) => {
        try { await updateDoc(doc(db, "posts", id), { isVisible: !status }); return true; } 
        catch (e) { return false; }
    },
    // -------------------------------------------------------

    like: async (id: string) => { return; }
  },
  
  // 3. COMMUNITIES
  communities: {
    create: async (data: any) => {
      try { await addDoc(collection(db, "communities"), { ...data, members: [], createdAt: new Date() }); return true; } 
      catch (e) { return false; }
    },
    getAll: async () => {
      try {
        const snap = await getDocs(collection(db, "communities"));
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) { return []; }
    },
    join: async (u: string, c: string) => {
      try { await updateDoc(doc(db, "communities", c), { members: arrayUnion(u) }); return true; } catch (e) { return false; }
    },
    leave: async (u: string, c: string) => {
      try { await updateDoc(doc(db, "communities", c), { members: arrayRemove(u) }); return true; } catch (e) { return false; }
    },
  },

  // 4. COMMENTS
  comments: {
    getByPost: async (postId: string) => {
      try {
        const q = query(collection(db, "comments"), where("postId", "==", postId));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CommentData[];
      } catch (e) { return []; }
    },
    create: async (data: any) => {
      try { await addDoc(collection(db, "comments"), { ...data, createdAt: new Date() }); return true; } 
      catch (e) { return false; }
    }
  }
};