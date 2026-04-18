'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TopicDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const STATUS_COLORS = {
  not_started: 'bg-[#242424] text-[#898989] hover:bg-[#363636]',
  in_progress: 'bg-[#8b5cf6] text-white hover:bg-[#7c3aed]',
  done: 'bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573]',
  needs_revision: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
};

export default function TopicDetailDialog({
  open,
  onOpenChange,
  topic,
  currentStatus,
  roadmapId,
}: TopicDetailDialogProps) {
  const handleStatusUpdate = async (status: string) => {
    const { updateTopicStatus } = await import('@/actions/progress');
    await updateTopicStatus(topic.id, status, roadmapId);
    onOpenChange(false);
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#171717] border-[#2e2e2e] text-[#fafafa] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#fafafa]">{topic.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {topic.timeToLearnDays && (
            <div>
              <p className="text-[#898989] text-sm">Estimated time</p>
              <p className="text-lg font-medium text-[#fafafa]">{topic.timeToLearnDays} days to learn</p>
            </div>
          )}

          {topic.resourceUrl && (
            <div>
              <p className="text-[#898989] text-sm mb-2">Best Resource</p>
              <a
                href={topic.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573]">
                  Open Resource
                </Button>
              </a>
            </div>
          )}

          <div className="pt-4 border-t border-[#2e2e2e]">
            <p className="text-[#898989] text-sm mb-3">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {(['not_started', 'in_progress', 'done', 'needs_revision'] as const).map(
                (status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleStatusUpdate(status)}
                    className={`text-xs ${
                      currentStatus === status
                        ? STATUS_COLORS[status]
                        : 'bg-[#242424] text-[#898989] hover:bg-[#363636]'
                    }`}
                  >
                    {status
                      .split('_')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
