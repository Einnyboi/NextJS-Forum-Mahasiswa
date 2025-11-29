// lib/db.ts - THE REAL DATABASE LAYER
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  query, 
  where 
} from 'firebase/firestore';
import { Post, Community, User } from './types';
import { get } from 'http';

// Helper to convert Firestore snapshots to our Types
const snapToData = (doc: any) => ({ id: doc.id, ...doc.data() });

export const dbService = {
  // ==============================
  // POSTS
  // ==============================
  posts: {
    getAll: async (): Promise<Post[]> => {
      const q = collection(db, 'posts');
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => snapToData(doc) as Post);
    },

    getById: async (id: string): Promise<Post | null> => {
      const docRef = doc(db, 'posts', id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? (snapToData(snapshot) as Post) : null;
    },

    getByCommunity: async (communityId: string): Promise<Post[]> => {
      const q = query(collection(db, 'posts'), where('communityId', '==', communityId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => snapToData(doc) as Post);
    },

    create: async (postData: any) => {
      // This replaces "posts.push()"
      // Firebase automatically generates the ID
      const docRef = await addDoc(collection(db, 'posts'), {
        ...postData,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        commentCount: 0,
      });
      return { id: docRef.id, ...postData };
    }
  },

  // ==============================
  // COMMUNITIES
  // ==============================
  communities: {
    getAll: async (): Promise<Community[]> => {
      const snapshot = await getDocs(collection(db, 'communities'));
      return snapshot.docs.map(doc => snapToData(doc) as Community);
    },

    getById: async (id: string): Promise<Community | null> => {
      const docRef = doc(db, 'communities', id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? (snapToData(snapshot) as Community) : null;
    },

    // This handles the complex logic of joining a community
    join: async (userId: string, communityId: string) => {
      try {
        // 1. Add community ID to the User's 'joinedCommunityIds' array
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          joinedCommunityIds: arrayUnion(communityId)
        });

        // 2. (Optional) Increment member count on Community
        // Note: Real apps usually use Cloud Functions for counters to be safe
        
        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false, error };
      }
    },

    leave: async (userId: string, communityId: string) => {
      try    {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          joinedCommunityIds: arrayRemove(communityId)
        });
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    isMember: async (userId: string, communityId: string) => {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        // Check if the array exists AND includes the ID
        return userData.joinedCommunityIds?.includes(communityId) || false;
      }
      return false;
    },
  },


  comments: {
    create: async (commentData: any) => {
      const docRef = await addDoc(collection(db, 'comments'), {
        ...commentData,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...commentData };
    },
    getByPost: async (postId: string): Promise<any[]> => {
      const q = query(collection(db, 'comments'), where('postId', '==', postId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => snapToData(doc));
    },
  },

  // ==============================
  // USERS
  // ==============================
  users: {
    getById: async (id: string): Promise<User | null> => {
      const docRef = doc(db, 'users', id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? (snapToData(snapshot) as User) : null;
    }
  }
};