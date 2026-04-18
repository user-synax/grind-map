import { db } from '@/db/index';
import { roadmaps, topics } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { deleteTopic } from '@/actions/admin';
import { revalidatePath } from 'next/cache';
import AddTopicDialog from '@/components/AddTopicDialog';
import EditTopicDialog from '@/components/EditTopicDialog';

async function getRoadmapWithTopics(id: string) {
  const roadmap = await db.select().from(roadmaps).where(eq(roadmaps.id, id));
  if (roadmap.length === 0) return null;

  const roadmapTopics = await db
    .select()
    .from(topics)
    .where(eq(topics.roadmapId, id))
    .orderBy(topics.orderIndex);

  return { roadmap: roadmap[0], topics: roadmapTopics };
}

async function handleDeleteTopic(id: string, roadmapId: string) {
  'use server';
  await deleteTopic(id, roadmapId);
  revalidatePath(`/admin/roadmaps/${roadmapId}/topics`);
}

export default async function RoadmapTopicsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getRoadmapWithTopics(id);

  if (!data) {
    return <div>Roadmap not found</div>;
  }

  const { roadmap, topics } = data;

  return (
    <div className="min-h-screen bg-[#171717] text-[#fafafa]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/roadmaps">
              <Button variant="ghost" size="icon" className="bg-[#0f0f0f] text-[#fafafa] border-[#2e2e2e] hover:bg-[#242424]">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-semibold mb-2 text-[#fafafa]">{roadmap.title}</h1>
              <p className="text-[#898989]">Manage topics for this roadmap</p>
            </div>
          </div>
          <AddTopicDialog roadmapId={id} />
        </div>

        <div className="space-y-4">
          {topics.map((topic) => (
            <Card key={topic.id} className="bg-[#0f0f0f] border-[#2e2e2e]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#898989] text-sm font-mono">#{topic.orderIndex}</span>
                      <CardTitle className="text-[#fafafa]">{topic.title}</CardTitle>
                    </div>
                    {topic.description && (
                      <p className="text-[#898989] text-sm mb-2">{topic.description}</p>
                    )}
                    {topic.resourceUrl && (
                      <a
                        href={topic.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00c573] hover:underline text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Resource
                      </a>
                    )}
                    {topic.timeToLearnDays !== null && (
                      <p className="text-[#898989] text-sm mt-2">
                        {topic.timeToLearnDays} day{topic.timeToLearnDays !== 1 ? 's' : ''} to learn
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <EditTopicDialog topic={topic} />
                    <form action={handleDeleteTopic.bind(null, topic.id, id)}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="text-[#ef4444] hover:bg-[#ef4444] hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
