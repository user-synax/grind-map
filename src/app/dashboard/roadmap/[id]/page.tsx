import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/index';
import { roadmaps, topics, userProgress } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { updateTopicStatus } from '@/actions/progress';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const STATUS_COLORS = {
  not_started: 'bg-[#242424] text-[#898989] hover:bg-[#363636]',
  in_progress: 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]',
  done: 'bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573]',
  needs_revision: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
};

export default async function RoadmapPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    return <div>Please sign in to view this roadmap.</div>;
  }

  // Fetch roadmap details
  const roadmap = await db.select().from(roadmaps).where(eq(roadmaps.id, id));

  if (roadmap.length === 0) {
    return <div>Roadmap not found.</div>;
  }

  // Fetch topics in order
  const roadmapTopics = await db
    .select()
    .from(topics)
    .where(eq(topics.roadmapId, id))
    .orderBy(topics.orderIndex);

  // Fetch user progress for all topics in this roadmap
  const topicIds = roadmapTopics.map(t => t.id);
  const progress = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId)));

  const progressMap = new Map(progress.map((p) => [p.topicId, p.status]));

  const completedCount = roadmapTopics.filter(
    (topic) => progressMap.get(topic.id) === 'done'
  ).length;
  const progressPercent = roadmapTopics.length > 0
    ? Math.round((completedCount / roadmapTopics.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#171717] text-[#fafafa]">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-[#898989] hover:text-[#fafafa] mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-semibold mb-2">{roadmap[0].title}</h1>
              <Badge
                variant="outline"
                className="border-[rgba(62,207,142,0.3)] text-[#3ecf8e]"
              >
                {roadmap[0].category}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-[#3ecf8e]">{progressPercent}%</div>
              <div className="text-sm text-[#898989]">
                {completedCount} of {roadmapTopics.length} completed
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {roadmapTopics.map((topic) => {
            const currentStatus = progressMap.get(topic.id) || 'not_started';

            return (
              <Card
                key={topic.id}
                className="bg-[#171717] border-[#2e2e2e] hover:border-[#363636] transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-[#fafafa] mb-1">
                        {topic.title}
                      </h3>
                      {topic.description && (
                        <p className="text-[#898989] text-sm">
                          {topic.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(['not_started', 'in_progress', 'done', 'needs_revision'] as const).map(
                        (status) => (
                          <form
                            key={status}
                            action={async () => {
                              'use server';
                              await updateTopicStatus(topic.id, status, id);
                            }}
                          >
                            <Button
                              type="submit"
                              size="sm"
                              variant="ghost"
                              className={cn(
                                'text-xs',
                                currentStatus === status
                                  ? STATUS_COLORS[status]
                                  : 'bg-[#242424] text-[#898989] hover:bg-[#363636]'
                              )}
                            >
                              {status
                                .split('_')
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(' ')}
                            </Button>
                          </form>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
