import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/db/index';
import { users, roadmaps, topics, userProgress } from '@/db/schema';
import { eq, and, count, sql } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

  const dbUser = existingUser[0] || (await db.select().from(users).where(eq(users.clerkId, userId)))[0];

  return (
    <div className="min-h-screen bg-[#171717] text-[#fafafa]">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-semibold mb-2">
          Welcome back, {dbUser?.username || 'User'}
        </h1>
        <p className="text-[#898989] mb-8">Continue your learning journey</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapsWithProgress.map((roadmap) => {
            const progress = roadmap.totalTopics > 0
              ? Math.round((roadmap.completedTopics / roadmap.totalTopics) * 100)
              : 0;
            
            const hasStarted = progress > 0;

            return (
              <Card
                key={roadmap.id}
                className="bg-[#171717] border-[#2e2e2e] hover:border-[#363636] transition-colors"
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
                      style={{ backgroundColor: "#242424" }}
                    />
                  </div>
                  <Link href={`/dashboard/roadmap/${roadmap.id}`} className="w-full">
                    <Button
                      className={cn(
                        "w-full",
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
      </div>
    </div>
  );
}
