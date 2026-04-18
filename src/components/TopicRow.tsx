'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import TopicDetailDialog from './TopicDetailDialog';
import { updateTopicStatus } from '@/actions/progress';

const STATUS_COLORS = {
  not_started: 'bg-[#242424] text-[#898989] hover:bg-[#363636]',
  in_progress: 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]',
  done: 'bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573]',
  needs_revision: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
};

const STATUS_BADGE_COLORS = {
  not_started: 'bg-[#242424] text-[#898989]',
  in_progress: 'bg-[#8b5cf6] text-white',
  done: 'bg-[#3ecf8e] text-[#0f0f0f]',
  needs_revision: 'bg-[#ef4444] text-white',
};

interface TopicRowProps {
  topic: {
    id: string;
    title: string;
    description: string | null;
    resourceUrl: string | null;
    timeToLearnDays: number | null;
  };
  currentStatus: string;
  roadmapId: string;
}

export default function TopicRow({ topic, currentStatus, roadmapId }: TopicRowProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="bg-[#171717] border-[#2e2e2e] hover:border-[#363636] transition-colors">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setDialogOpen(true)}
                  className="text-lg font-medium text-[#fafafa] hover:text-[#8b5cf6] transition-colors text-left cursor-pointer"
                >
                  {topic.title}
                </button>
                <Badge className={STATUS_BADGE_COLORS[currentStatus as keyof typeof STATUS_BADGE_COLORS]}>
                  {currentStatus
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#898989]">
                {topic.timeToLearnDays ? (
                  <span>⏱ {topic.timeToLearnDays} days</span>
                ) : (
                  <span>⏱ —</span>
                )}
                {topic.resourceUrl && (
                  <a
                    href={topic.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#8b5cf6] hover:text-[#7c3aed] transition-colors"
                  >
                    Learn <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['not_started', 'in_progress', 'done', 'needs_revision'] as const).map(
                (status) => (
                  <form
                    key={status}
                    action={() => updateTopicStatus(topic.id, status, roadmapId)}
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

      <TopicDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        topic={topic}
        currentStatus={currentStatus}
        roadmapId={roadmapId}
      />
    </>
  );
}
