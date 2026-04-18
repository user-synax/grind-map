import { db } from '@/db/index';
import { roadmaps, topics } from '@/db/schema';
import { count } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteRoadmap } from '@/actions/admin';
import { revalidatePath } from 'next/cache';
import CreateRoadmapDialog from '@/components/CreateRoadmapDialog';

async function getRoadmapsWithTopicCount() {
  const roadmapsWithTopics = await db
    .select({
      id: roadmaps.id,
      title: roadmaps.title,
      category: roadmaps.category,
      isDefault: roadmaps.isDefault,
    })
    .from(roadmaps)
    .orderBy(roadmaps.createdAt);

  const topicCounts = await db
    .select({
      roadmapId: topics.roadmapId,
      count: count(topics.id),
    })
    .from(topics)
    .groupBy(topics.roadmapId);

  const countMap = new Map(topicCounts.map((t) => [t.roadmapId, t.count]));

  return roadmapsWithTopics.map((roadmap) => ({
    ...roadmap,
    topicCount: countMap.get(roadmap.id) || 0,
  }));
}

async function handleDeleteRoadmap(id: string) {
  'use server';
  await deleteRoadmap(id);
  revalidatePath('/admin/roadmaps');
}

export default async function AdminRoadmapsPage() {
  const roadmaps = await getRoadmapsWithTopicCount();

  return (
    <div className="min-h-screen bg-[#171717] text-[#fafafa]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="bg-[#0f0f0f] text-[#fafafa] border-[#2e2e2e] hover:bg-[#242424]">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-semibold mb-2 text-[#fafafa]">Manage Roadmaps</h1>
              <p className="text-[#898989]">Create, edit, and delete learning roadmaps</p>
            </div>
          </div>
          <CreateRoadmapDialog />
        </div>

        <div className="space-y-4">
          {roadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="bg-[#0f0f0f] border-[#2e2e2e]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-[#fafafa]">{roadmap.title}</CardTitle>
                      <Badge
                        variant="outline"
                        className="border-[rgba(62,207,142,0.3)] text-[#3ecf8e]"
                      >
                        {roadmap.category}
                      </Badge>
                      {roadmap.isDefault && (
                        <Badge className="bg-[#8b5cf6] text-white">Default</Badge>
                      )}
                    </div>
                    <p className="text-[#898989] text-sm">{roadmap.topicCount} topics</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/roadmaps/${roadmap.id}/topics`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#0f0f0f] text-[#fafafa] border-[#2e2e2e] hover:bg-[#242424]"
                      >
                        Manage Topics
                      </Button>
                    </Link>
                    <form action={handleDeleteRoadmap.bind(null, roadmap.id)}>
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
