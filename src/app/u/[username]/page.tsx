import { db } from '@/db/index';
import { users, userProgress, streaks, topics } from '@/db/schema';
import { eq, and, count, sql, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import { Metadata } from 'next';

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await db.select().from(users).where(eq(users.username, username));

  if (user.length === 0) {
    return {
      title: 'User Not Found',
    };
  }

  const userId = user[0].clerkId;

  // Fetch stats
  const totalCompletedResult = await db
    .select({ count: count() })
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.status, 'done')));

  const totalCompleted = totalCompletedResult[0]?.count || 0;

  const streakResult = await db
    .select({ currentStreak: streaks.currentStreak })
    .from(streaks)
    .where(eq(streaks.userId, userId));

  const currentStreak = streakResult[0]?.currentStreak || 0;

  return {
    title: `${username}'s Grindmap`,
    description: `${username} has completed ${totalCompleted} topics with a ${currentStreak} day streak`,
    openGraph: {
      title: `${username}'s Grindmap`,
      description: `${username} has completed ${totalCompleted} topics with a ${currentStreak} day streak`,
      images: [`/api/og/${username}`],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const user = await db.select().from(users).where(eq(users.username, username));

  if (user.length === 0) {
    notFound();
  }

  const userData = user[0];
  const userId = userData.clerkId;

  // Fetch stats
  const combinedStats = await db.execute(sql`
    SELECT
      (SELECT COUNT(*) FROM "userProgress" WHERE "userId" = ${userId} AND status = 'done') as total_completed,
      COALESCE((SELECT "currentStreak" FROM streaks WHERE "userId" = ${userId}), 0) as current_streak,
      COALESCE((SELECT "longestStreak" FROM streaks WHERE "userId" = ${userId}), 0) as longest_streak
  `);

  const totalCompleted = Number(combinedStats.rows[0]?.total_completed) || 0;
  const currentStreak = Number(combinedStats.rows[0]?.current_streak) || 0;
  const longestStreak = Number(combinedStats.rows[0]?.longest_streak) || 0;

  // Fetch activityData - group by date, last 365 days (using both updatedAt and lastReviewedAt)
  const activityDataResult = await db.execute(sql`
    SELECT 
      DATE(activity_date) as date,
      COUNT(*) as count
    FROM (
      SELECT "updatedAt" as activity_date FROM "userProgress" WHERE "userId" = ${userId} AND "updatedAt" IS NOT NULL
      UNION ALL
      SELECT "lastReviewedAt" as activity_date FROM "userProgress" WHERE "userId" = ${userId} AND "lastReviewedAt" IS NOT NULL
    ) all_activity
    WHERE activity_date >= CURRENT_DATE - INTERVAL '365 days'
    GROUP BY DATE(activity_date)
    ORDER BY date DESC
  `);

  const activityData = activityDataResult.rows.map((row: any) => ({
    date: row.date,
    count: Number(row.count),
  }));

  return (
    <div className="min-h-screen bg-[#171717] text-[#fafafa]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold mb-2">{userData.username}</h1>
          <p className="text-[#898989]">
            Joined {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[#171717] border-[#2e2e2e]">
            <CardContent className="p-6">
              <div className="text-sm text-[#898989] mb-2">Topics Completed</div>
              <div className="text-3xl font-semibold text-[#8b5cf6]">{totalCompleted}</div>
            </CardContent>
          </Card>
          <Card className="bg-[#171717] border-[#2e2e2e]">
            <CardContent className="p-6">
              <div className="text-sm text-[#898989] mb-2">Current Streak</div>
              <div className="text-3xl font-semibold text-[#8b5cf6]">{currentStreak} days</div>
            </CardContent>
          </Card>
          <Card className="bg-[#171717] border-[#2e2e2e]">
            <CardContent className="p-6">
              <div className="text-sm text-[#898989] mb-2">Longest Streak</div>
              <div className="text-3xl font-semibold text-[#8b5cf6]">{longestStreak} days</div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Heatmap */}
        <Card className="bg-[#171717] border-[#2e2e2e]">
          <CardContent className="p-6">
            <ActivityHeatmap userId={userId} activityData={activityData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
