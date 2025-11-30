import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase'; 
import { onAuthStateChanged } from 'firebase/auth'; 

export function useCurrentUserId() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => { 
      if (user) {
        setUserId(user.uid); 
      } else {
        setUserId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
    
  }, []);

  return { userId, loading };
}