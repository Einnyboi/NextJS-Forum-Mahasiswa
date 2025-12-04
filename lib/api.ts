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

// Helper function for fetching
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

// --- DEFINISI TIPE DATA ---
export interface PostData {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'community' | 'event';
  date: string;
  createdAt?: any;
  isVisible?: boolean;
  communityId?: string;
  imageUrl?: string; // NEW: Optional image URL
  upvotes?: number; // NEW
  downvotes?: number; // NEW
  votedBy?: { [userId: string]: 'up' | 'down' }; // NEW
  commentCount?: number; // NEW
}

export interface CommunityData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  bannerUrl?: string;
  members?: string[];
  memberCount?: number;
  upvotes?: number;
  downvotes?: number;
  votedBy?: { [userId: string]: 'up' | 'down' };
}

export interface CommentData {
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: any;
  imageUrl?: string; // NEW
  likes?: number; // NEW
  likedBy?: { [userId: string]: boolean }; // NEW
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
        await addDoc(collection(db, "posts"), {
          ...data,
          isVisible: true,
          upvotes: 0,
          downvotes: 0,
          votedBy: {},
          commentCount: 0,
          createdAt: new Date()
        });
        return true;
      } catch (e) { return false; }
    },

    getUserPosts: async (userId: string) => {
      return fetcher(`/api/posts/user-history?userId=${userId}`);
    },

    delete: async (id: string) => {
      try { await deleteDoc(doc(db, "posts", id)); return true; }
      catch (e) { return false; }
    },

    toggleVisibility: async (id: string, status: boolean) => {
      try { await updateDoc(doc(db, "posts", id), { isVisible: !status }); return true; }
      catch (e) { return false; }
    },

    // NEW: Post Voting Functions
    upvote: async (postId: string, userId: string) => {
      try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) return false;

        const data = postSnap.data();
        const votedBy = data.votedBy || {};
        const currentVote = votedBy[userId];

        let upvotes = data.upvotes || 0;
        let downvotes = data.downvotes || 0;

        if (currentVote === 'up') {
          upvotes--;
          delete votedBy[userId];
        } else if (currentVote === 'down') {
          downvotes--;
          upvotes++;
          votedBy[userId] = 'up';
        } else {
          upvotes++;
          votedBy[userId] = 'up';
        }

        await updateDoc(postRef, { upvotes, downvotes, votedBy });
        return true;
      } catch (e) { return false; }
    },

    downvote: async (postId: string, userId: string) => {
      try {
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) return false;

        const data = postSnap.data();
        const votedBy = data.votedBy || {};
        const currentVote = votedBy[userId];

        let upvotes = data.upvotes || 0;
        let downvotes = data.downvotes || 0;

        if (currentVote === 'down') {
          downvotes--;
          delete votedBy[userId];
        } else if (currentVote === 'up') {
          upvotes--;
          downvotes++;
          votedBy[userId] = 'down';
        } else {
          downvotes++;
          votedBy[userId] = 'down';
        }

        await updateDoc(postRef, { upvotes, downvotes, votedBy });
        return true;
      } catch (e) { return false; }
    }
  },

  // 3. COMMUNITIES
  communities: {
    create: async (data: any) => {
      try {
        await addDoc(collection(db, "communities"), {
          ...data,
          members: [],
          upvotes: 0,
          downvotes: 0,
          votedBy: {},
          createdAt: new Date()
        });
        return true;
      } catch (e) { return false; }
    },

    getAll: async (): Promise<CommunityData[]> => {
      try {
        const snap = await getDocs(collection(db, "communities"));
        const communities = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CommunityData[];

        // Sort by vote score (upvotes - downvotes) descending
        return communities.sort((a, b) => {
          const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
          const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
          return scoreB - scoreA;
        });
      } catch (e) { return []; }
    },

    getById: async (communityId: string): Promise<CommunityData | null> => {
      try {
        const docRef = doc(db, "communities", communityId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as CommunityData : null;
      } catch (e) { return null; }
    },

    join: async (communityId: string, userEmail: string) => {
      try {
        console.log('[JOIN] Starting join process:', { communityId, userEmail });
        const communityRef = doc(db, "communities", communityId);
        const communitySnap = await getDoc(communityRef);
        
        if (!communitySnap.exists()) {
          console.error('[JOIN] Community not found:', communityId);
          return false;
        }
        
        const data = communitySnap.data();
        const members = data.members || [];
        console.log('[JOIN] Current members:', members);
        
        // Check if already a member
        if (members.includes(userEmail)) {
          console.log('[JOIN] User already a member');
          return true;
        }
        
        // Update community
        console.log('[JOIN] Updating community document...');
        await updateDoc(communityRef, { 
          members: arrayUnion(userEmail),
          memberCount: members.length + 1
        });
        console.log('[JOIN] Community updated successfully. New member count:', members.length + 1);
        
        // Update user's joined communities
        const usersQuery = query(collection(db, "users"), where("email", "==", userEmail));
        const userSnap = await getDocs(usersQuery);
        
        if (!userSnap.empty) {
          const userDoc = userSnap.docs[0];
          console.log('[JOIN] Updating user document:', userDoc.id);
          await updateDoc(doc(db, "users", userDoc.id), {
            joinedCommunityIds: arrayUnion(communityId)
          });
          console.log('[JOIN] User document updated successfully');
        } else {
          console.warn('[JOIN] User document not found for email:', userEmail);
        }
        
        console.log('[JOIN] Join process completed successfully');
        return true; 
      }
      catch (e) { 
        console.error('[JOIN] Error joining community:', e);
        return false; 
      }
    },

    leave: async (communityId: string, userEmail: string) => {
      try {
        console.log('[LEAVE] Starting leave process:', { communityId, userEmail });
        const communityRef = doc(db, "communities", communityId);
        const communitySnap = await getDoc(communityRef);
        
        if (!communitySnap.exists()) {
          console.error('[LEAVE] Community not found:', communityId);
          return false;
        }
        
        const data = communitySnap.data();
        const members = data.members || [];
        console.log('[LEAVE] Current members:', members);
        
        // Update community
        console.log('[LEAVE] Updating community document...');
        await updateDoc(communityRef, { 
          members: arrayRemove(userEmail),
          memberCount: Math.max(0, members.length - 1)
        });
        console.log('[LEAVE] Community updated successfully. New member count:', Math.max(0, members.length - 1));
        
        // Update user's joined communities
        const usersQuery = query(collection(db, "users"), where("email", "==", userEmail));
        const userSnap = await getDocs(usersQuery);
        
        if (!userSnap.empty) {
          const userDoc = userSnap.docs[0];
          console.log('[LEAVE] Updating user document:', userDoc.id);
          await updateDoc(doc(db, "users", userDoc.id), {
            joinedCommunityIds: arrayRemove(communityId)
          });
          console.log('[LEAVE] User document updated successfully');
        } else {
          console.warn('[LEAVE] User document not found for email:', userEmail);
        }
        
        console.log('[LEAVE] Leave process completed successfully');
        return true; 
      }
      catch (e) { 
        console.error('[LEAVE] Error leaving community:', e);
        return false; 
      }
    },

    upvote: async (communityId: string, userId: string) => {
      try {
        const communityRef = doc(db, "communities", communityId);
        const communitySnap = await getDoc(communityRef);

        if (!communitySnap.exists()) return false;

        const data = communitySnap.data();
        const votedBy = data.votedBy || {};
        const currentVote = votedBy[userId];

        let upvotes = data.upvotes || 0;
        let downvotes = data.downvotes || 0;

        if (currentVote === 'up') {
          upvotes--;
          delete votedBy[userId];
        } else if (currentVote === 'down') {
          downvotes--;
          upvotes++;
          votedBy[userId] = 'up';
        } else {
          upvotes++;
          votedBy[userId] = 'up';
        }

        await updateDoc(communityRef, { upvotes, downvotes, votedBy });
        return true;
      } catch (e) { return false; }
    },

    downvote: async (communityId: string, userId: string) => {
      try {
        const communityRef = doc(db, "communities", communityId);
        const communitySnap = await getDoc(communityRef);

        if (!communitySnap.exists()) return false;

        const data = communitySnap.data();
        const votedBy = data.votedBy || {};
        const currentVote = votedBy[userId];

        let upvotes = data.upvotes || 0;
        let downvotes = data.downvotes || 0;

        if (currentVote === 'down') {
          downvotes--;
          delete votedBy[userId];
        } else if (currentVote === 'up') {
          upvotes--;
          downvotes++;
          votedBy[userId] = 'down';
        } else {
          downvotes++;
          votedBy[userId] = 'down';
        }

        await updateDoc(communityRef, { upvotes, downvotes, votedBy });
        return true;
      } catch (e) { return false; }
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
      try {
        // 1. Add Comment
        await addDoc(collection(db, "comments"), {
          ...data,
          likes: 0,
          likedBy: {},
          createdAt: new Date()
        });

        // 2. Increment Post Comment Count
        const postRef = doc(db, "posts", data.postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
          const currentCount = postSnap.data().commentCount || 0;
          await updateDoc(postRef, { commentCount: currentCount + 1 });
        }

        return true;
      }
      catch (e) { return false; }
    },

    // NEW: Toggle Like Comment
    toggleLike: async (commentId: string, userId: string) => {
      try {
        const commentRef = doc(db, "comments", commentId);
        const commentSnap = await getDoc(commentRef);

        if (!commentSnap.exists()) return false;

        const data = commentSnap.data();
        const likedBy = data.likedBy || {};
        const isLiked = likedBy[userId];

        let likes = data.likes || 0;

        if (isLiked) {
          likes--;
          delete likedBy[userId];
        } else {
          likes++;
          likedBy[userId] = true;
        }

        await updateDoc(commentRef, { likes, likedBy });
        return true;
      } catch (e) { return false; }
    }
  },

  // FUNGSI UNTUK PENCARIAN
  search: {
    getResults: async (query: string) => {
      return fetcher(`/api/search?q=${encodeURIComponent(query)}`);
    },
  },
};