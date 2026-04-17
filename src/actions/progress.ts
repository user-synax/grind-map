import 'server-only';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/db/index';
import { userProgress, streaks } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function updateTopicStatus(topicId: string, status: string, roadmapId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Check if progress already exists
  const existingProgress = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.topicId, topicId)));

  const updateValues: any = {
    status,
    updatedAt: new Date(),
  };

  if (status === 'done') {
    updateValues.lastReviewedAt = new Date();
  }

  if (existingProgress.length > 0) {
    // Update existing record
    await db
      .update(userProgress)
      .set(updateValues)
      .where(eq(userProgress.id, existingProgress[0].id));
  } else {
    // Insert new record
    await db.insert(userProgress).values({
      id: randomUUID(),
      userId,
      topicId,
      ...updateValues,
    });
  }

  // Update streak
  await updateStreak(userId);

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/roadmap/${roadmapId}`);
}

async function updateStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Fetch current streak
  const currentStreak = await db.select().from(streaks).where(eq(streaks.userId, userId));

  if (currentStreak.length === 0) {
    // No streak exists, create new one
    await db.insert(streaks).values({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: today.toISOString().split('T')[0],
    });
  } else {
    const streak = currentStreak[0];
    const lastActiveDate = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;

    if (!lastActiveDate) {
      // No last active date, set to today
      await db.update(streaks)
        .set({
          currentStreak: 1,
          longestStreak: Math.max(1, streak.longestStreak || 0),
          lastActiveDate: today.toISOString().split('T')[0],
        })
        .where(eq(streaks.userId, userId));
    } else {
      const lastActiveMidnight = new Date(lastActiveDate);
      lastActiveMidnight.setHours(0, 0, 0, 0);

      if (lastActiveMidnight.getTime() === yesterday.getTime()) {
        // Last active was yesterday, increment streak
        const newStreak = (streak.currentStreak || 0) + 1;
        await db.update(streaks)
          .set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, streak.longestStreak || 0),
            lastActiveDate: today.toISOString().split('T')[0],
          })
          .where(eq(streaks.userId, userId));
      } else if (lastActiveMidnight.getTime() === today.getTime()) {
        // Last active was today, do nothing
        // Streak already counted for today
      } else {
        // Last active was older, reset streak
        await db.update(streaks)
          .set({
            currentStreak: 1,
            lastActiveDate: today.toISOString().split('T')[0],
          })
          .where(eq(streaks.userId, userId));
      }
    }
  }
}
