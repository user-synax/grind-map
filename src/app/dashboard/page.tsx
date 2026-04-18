import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db/index';
import { users, roadmaps, topics, userProgress, streaks } from '@/db/schema';
import { eq, and, count, sql, desc, gte } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import DashboardCharts from '@/components/DashboardCharts';
import ShareProfileButton from '@/components/ShareProfileButton';
import { PageEntrance, ScrollReveal, CardHover, StaggerGrid, ParallaxSection } from '@/components/GSAPAnimations';

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return <div>Please sign in to view your dashboard.</div>;
  }

  // Sync user to DB
  const existingUser = await db.select().from(users).where(eq(users.clerkId, userId));
  
  if (existingUser.length === 0) {
    await db.insert(users).values({
      clerkId: userId,
      username: user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'user',
      email: user.emailAddresses[0]?.emailAddress || '',
    });
  }

  // Fetch roadmaps with progress stats
  const roadmapsWithProgress = await db
    .select({
      id: roadmaps.id,
      title: roadmaps.title,
      category: roadmaps.category,
      totalTopics: count(topics.id),
      completedTopics: count(
        sql<number>`CASE WHEN ${userProgress.status} = 'done' THEN 1 END`
      ),
    })
    .from(roadmaps)
    .leftJoin(topics, eq(topics.roadmapId, roadmaps.id))
    .leftJoin(userProgress, and(
      eq(userProgress.topicId, topics.id),
      eq(userProgress.userId, userId)
    ))
    .where(eq(roadmaps.isDefault, true))
    .groupBy(roadmaps.id);

  // Fetch stats - Query 1: totalCompleted, activeRoadmaps, currentStreak combined
  const combinedStats = await db.execute(sql`
    SELECT
      (SELECT COUNT(*) FROM "userProgress" WHERE "userId" = ${userId} AND status = 'done') as total_completed,
      (SELECT COUNT(DISTINCT t."roadmapId") FROM "userProgress" up JOIN topics t ON up."topicId" = t.id WHERE up."userId" = ${userId}) as active_roadmaps,
      COALESCE((SELECT "currentStreak" FROM streaks WHERE "userId" = ${userId}), 0) as current_streak
  `);

  const totalCompleted = Number(combinedStats.rows[0]?.total_completed) || 0;
  const activeRoadmaps = Number(combinedStats.rows[0]?.active_roadmaps) || 0;
  const currentStreak = Number(combinedStats.rows[0]?.current_streak) || 0;

  // Query 2: weakestArea
  const weakestAreaResult = await db
    .select({
      category: roadmaps.category,
      count: count(),
    })
    .from(userProgress)
    .innerJoin(topics, eq(topics.id, userProgress.topicId))
    .innerJoin(roadmaps, eq(roadmaps.id, topics.roadmapId))
    .where(and(eq(userProgress.userId, userId), eq(userProgress.status, 'needs_revision')))
    .groupBy(roadmaps.category)
    .orderBy(desc(count()))
    .limit(1);

  const weakestArea = weakestAreaResult[0]?.category || 'None yet';

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

  const dbUser = existingUser[0] || (await db.select().from(users).where(eq(users.clerkId, userId)))[0];

  return (
    <PageEntrance>
      <div className="min-h-screen bg-[#171717] text-[#fafafa]">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-2 animate-entrance">
            <h1 className="text-4xl font-semibold">
              Welcome back, {dbUser?.username || 'User'}
            </h1>
            <ShareProfileButton username={dbUser?.username || 'user'} />
          </div>
          <p className="text-[#898989] mb-8 animate-entrance">Continue your learning journey</p>

        {/* Stats Bar */}
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 scroll-reveal">
            <Card className="bg-[#171717] border-[#2e2e2e] hover-card">
              <CardContent className="p-6">
                <div className="text-sm text-[#898989] mb-2">Topics Completed</div>
                <div className="text-3xl font-semibold text-[#8b5cf6]">{totalCompleted}</div>
              </CardContent>
            </Card>
            <Card className="bg-[#171717] border-[#2e2e2e] hover-card">
              <CardContent className="p-6">
                <div className="text-sm text-[#898989] mb-2">Current Streak</div>
                <div className="text-3xl font-semibold text-[#8b5cf6]">{currentStreak} days</div>
              </CardContent>
            </Card>
            <Card className="bg-[#171717] border-[#2e2e2e] hover-card">
              <CardContent className="p-6">
                <div className="text-sm text-[#898989] mb-2">Weakest Area</div>
                <div className="text-3xl font-semibold text-[#8b5cf6]">{weakestArea}</div>
              </CardContent>
            </Card>
            <Card className="bg-[#171717] border-[#2e2e2e] hover-card">
              <CardContent className="p-6">
                <div className="text-sm text-[#898989] mb-2">Active Roadmaps</div>
                <div className="text-3xl font-semibold text-[#8b5cf6]">{activeRoadmaps}</div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Roadmaps */}
        <ScrollReveal>
          <h2 className="text-2xl font-semibold mb-4 scroll-reveal">Your Roadmaps</h2>
        </ScrollReveal>
        <CardHover>
          <StaggerGrid>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roadmapsWithProgress.map((roadmap) => {
                const progress = roadmap.totalTopics > 0
                  ? Math.round((roadmap.completedTopics / roadmap.totalTopics) * 100)
                  : 0;

                const hasStarted = progress > 0;

                return (
                  <Card
                    key={roadmap.id}
                    className="bg-[#171717] border-[#2e2e2e] stagger-item hover-card"
                  >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-[#fafafa]">{roadmap.title}</CardTitle>
                    <Badge
                      variant="outline"
                      className="border-[rgba(62,207,142,0.3)] text-[#3ecf8e]"
                    >
                      {roadmap.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-[#898989]">
                    {roadmap.totalTopics} topics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#b4b4b4]">Progress</span>
                      <span className="text-[#fafafa]">{progress}%</span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2 bg-[#242424]"
                      style={{ backgroundColor: "#242424", '--progress-color': '#3ecf8e' } as React.CSSProperties}
                    />
                  </div>
                  <Link href={`/dashboard/roadmap/${roadmap.id}`} className="w-full cursor-pointer">
                    <Button
                      className={cn(
                        "w-full cursor-pointer",
                        hasStarted
                          ? "bg-[#0f0f0f] text-[#fafafa] border-[#2e2e2e] hover:bg-[#242424]"
                          : "bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573]"
                      )}
                      variant={hasStarted ? "outline" : "default"}
                    >
                      {hasStarted ? "Continue" : "Start"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
            </div>
          </StaggerGrid>
        </CardHover>

        {/* Charts */}
        <ParallaxSection speed={0.3}>
          <DashboardCharts userId={userId} activityData={activityData} />
        </ParallaxSection>
      </div>
    </div>
    </PageEntrance>
  );
}
