'use server';

import { cookies } from 'next/headers';
import { db } from '@/db/index';
import { roadmaps, topics } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function adminLogin(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return { success: false, error: 'Admin credentials not configured' };
  }

  if (email === adminEmail && password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', adminPassword, {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 24 hours
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid credentials' };
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return { success: true };
}

export async function createRoadmap(title: string, category: string, isDefault: boolean) {
  try {
    await db.insert(roadmaps).values({
      title,
      category,
      isDefault,
      createdBy: 'admin',
    });
    revalidatePath('/admin/roadmaps');
    return { success: true };
  } catch (error) {
    console.error('Error creating roadmap:', error);
    return { success: false, error: 'Failed to create roadmap' };
  }
}

export async function deleteRoadmap(id: string) {
  try {
    await db.delete(roadmaps).where(eq(roadmaps.id, id));
    revalidatePath('/admin/roadmaps');
    return { success: true };
  } catch (error) {
    console.error('Error deleting roadmap:', error);
    return { success: false, error: 'Failed to delete roadmap' };
  }
}

export async function createTopic(
  roadmapId: string,
  title: string,
  description: string | null,
  resourceUrl: string | null,
  timeToLearnDays: number | null,
  orderIndex: number
) {
  try {
    await db.insert(topics).values({
      roadmapId,
      title,
      description,
      resourceUrl,
      timeToLearnDays,
      orderIndex,
    });
    revalidatePath(`/admin/roadmaps/${roadmapId}/topics`);
    return { success: true };
  } catch (error) {
    console.error('Error creating topic:', error);
    return { success: false, error: 'Failed to create topic' };
  }
}

export async function updateTopic(
  id: string,
  title: string,
  description: string | null,
  resourceUrl: string | null,
  timeToLearnDays: number | null,
  orderIndex: number
) {
  try {
    await db
      .update(topics)
      .set({
        title,
        description,
        resourceUrl,
        timeToLearnDays,
        orderIndex,
      })
      .where(eq(topics.id, id));
    revalidatePath(`/admin/roadmaps/[id]/topics`);
    return { success: true };
  } catch (error) {
    console.error('Error updating topic:', error);
    return { success: false, error: 'Failed to update topic' };
  }
}

export async function deleteTopic(id: string, roadmapId: string) {
  try {
    await db.delete(topics).where(eq(topics.id, id));
    revalidatePath(`/admin/roadmaps/${roadmapId}/topics`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting topic:', error);
    return { success: false, error: 'Failed to delete topic' };
  }
}
