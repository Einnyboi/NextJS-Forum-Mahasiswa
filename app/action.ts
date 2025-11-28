'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { dbService } from '@/lib/db';

export async function updateUser(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const avatar = formData.get('avatar') as string;

  try {
    await dbService.users.update(id, {
       name : name, 
       avatarUrl : avatar
    });
  } catch (error) {
    console.error(error);
    return;
  }
  
  revalidatePath('/profile');
  revalidatePath('/user-details');
  
  redirect('/profile');
}