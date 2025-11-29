// lib/db.ts
// this is the database layer, routes (app/api/...) rely on this to talk to firebase
// the difference with api.ts is that this one is backend only
// this file handles things like complex queries, joins, transactions, etc

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

    getByAuthor: async (authorId: string): Promise<Post[]> => {
      const q = query(collection(db, 'posts'), where('authorId', '==', authorId));
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

    join: async (userId: string, communityId: string) => {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          joinedCommunityIds: arrayUnion(communityId)
        });
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
        return userData.joinedCommunityIds?.includes(communityId) || false;
      }
      return false;
    },
  },

  // ==============================
  // EVENTS
  // ==============================
  events: {
    getUpcoming: async (): Promise<any[]> => {
      const now = new Date().toISOString();
      const q = query(collection(db, 'events'), where('date', '>=', now));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => snapToData(doc));
    },
    getById: async (id: string): Promise<any | null> => {
        const docRef = doc(db, 'events', id);
        const snapshot = await getDoc(docRef);
        return snapshot.exists() ? snapToData(snapshot) : null;
    }
  },

  // ==============================
  // COMMENTS
  // ==============================
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
    },
    getByEmail: async (email: string): Promise<User | null> => {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }
      return snapToData(snapshot.docs[0]) as User;
    },
    getProfile: async (): Promise<User | null> => {
      // For simplicity, we return a hardcoded user ID
      const userId = 'user-123'; // Replace with actual auth logic
      return dbService.users.getById(userId);
    },
    update: async (id: string, data: Partial<User>) => {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, data);
      return { id, ...data };
    }
  }
};