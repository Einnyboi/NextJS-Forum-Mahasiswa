'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// 1. Import our new function
import { updateUserInMockDB } from '@/lib/data';

export async function updateUser(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const avatar = formData.get('avatar') as string;

  // 2. Call our "database" update function
  try {
    await updateUserInMockDB(id, name, avatar);
  } catch (error) {
    console.error(error);
    // Handle the error (e.g., return an error message)
    return;
  }
  
  // 3. Invalidate the cache (this was already correct)
  revalidatePath('/profile');
  revalidatePath('/user-details');

  // 4. Redirect (this was already correct)
  redirect('/profile');
}