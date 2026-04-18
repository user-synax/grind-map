import { auth } from '@clerk/nextjs/server';
import { db } from '@/db/index';
import { roadmaps, topics, userProgress } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import TopicRow from '@/components/TopicRow';
import { PageEntrance, ScrollReveal, StaggerGrid, ParallaxSection } from '@/components/GSAPAnimations';

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

  // Calculate total roadmap time
  const totalTime = roadmapTopics.reduce((sum, topic) => sum + (topic.timeToLearnDays || 0), 0);

  return (
    <PageEntrance>
      <div className="min-h-screen bg-[#171717] text-[#fafafa]">
        <div className="container mx-auto px-4 py-12">
          <ScrollReveal>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-[#898989] hover:text-[#fafafa] mb-6 transition-colors scroll-reveal"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mb-8 scroll-reveal">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-semibold mb-2 animate-entrance">{roadmap[0].title}</h1>
                  <Badge
                    variant="outline"
                    className="border-[rgba(62,207,142,0.3)] text-[#3ecf8e] animate-entrance"
                  >
                    {roadmap[0].category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold text-[#3ecf8e] animate-entrance">{progressPercent}%</div>
                  <div className="text-sm text-[#898989] animate-entrance">
                    {completedCount} of {roadmapTopics.length} completed
                  </div>
                </div>
              </div>

              {/* Total roadmap time */}
              <div className="bg-[#171717] border-[#2e2e2e] rounded-lg p-4 animate-entrance">
                <p className="text-lg font-medium text-[#fafafa]">
                  ~{totalTime} days to complete this roadmap
                </p>
                <p className="text-sm text-[#898989]">Based on 1-2 hours per day</p>
              </div>
            </div>
          </ScrollReveal>

          <StaggerGrid>
            <div className="space-y-4">
              {roadmapTopics.map((topic) => {
                const currentStatus = progressMap.get(topic.id) || 'not_started';

                return (
                  <div key={topic.id} className="stagger-item">
                    <TopicRow
                      topic={topic}
                      currentStatus={currentStatus}
                      roadmapId={id}
                    />
                  </div>
                );
              })}
            </div>
          </StaggerGrid>
        </div>
      </div>
    </PageEntrance>
  );
}
