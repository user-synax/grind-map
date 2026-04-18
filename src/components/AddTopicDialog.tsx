'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createTopic } from '@/actions/admin';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddTopicDialog({ roadmapId }: { roadmapId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [timeToLearnDays, setTimeToLearnDays] = useState('');
  const [orderIndex, setOrderIndex] = useState('1');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = await createTopic(
      roadmapId,
      title,
      description || null,
      resourceUrl || null,
      timeToLearnDays ? parseInt(timeToLearnDays) : null,
      parseInt(orderIndex)
    );

    if (result.success) {
      setOpen(false);
      setTitle('');
      setDescription('');
      setResourceUrl('');
      setTimeToLearnDays('');
      setOrderIndex('1');
      router.refresh();
    } else {
      alert(result.error || 'Failed to create topic');
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3ecf8e] text-[#0f0f0f] border-[#3ecf8e] hover:bg-[#00c573]">
          <Plus className="mr-2 h-4 w-4" />
          Add Topic
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0f0f0f] border-[#2e2e2e] text-[#fafafa]">
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
          <DialogDescription className="text-[#898989]">
            Add a new topic to this roadmap
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#b4b4b4]">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-[#171717] border-[#363636] text-[#fafafa] placeholder-[#898989] focus:border-[#3ecf8e]"
              placeholder="Topic title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#b4b4b4]">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#171717] border-[#363636] text-[#fafafa] placeholder-[#898989] focus:border-[#3ecf8e]"
              placeholder="Topic description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resourceUrl" className="text-[#b4b4b4]">Resource URL</Label>
            <Input
              id="resourceUrl"
              type="url"
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              className="bg-[#171717] border-[#363636] text-[#fafafa] placeholder-[#898989] focus:border-[#3ecf8e]"
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timeToLearnDays" className="text-[#b4b4b4]">Days to Learn</Label>
              <Input
                id="timeToLearnDays"
                type="number"
                min="0"
                value={timeToLearnDays}
                onChange={(e) => setTimeToLearnDays(e.target.value)}
                className="bg-[#171717] border-[#363636] text-[#fafafa] placeholder-[#898989] focus:border-[#3ecf8e]"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderIndex" className="text-[#b4b4b4]">Order</Label>
              <Input
                id="orderIndex"
                type="number"
                min="1"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                required
                className="bg-[#171717] border-[#363636] text-[#fafafa] placeholder-[#898989] focus:border-[#3ecf8e]"
                placeholder="1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="bg-[#0f0f0f] text-[#fafafa] border-[#2e2e2e] hover:bg-[#242424]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#3ecf8e] text-[#0f0f0f] border-[#3ecf8e] hover:bg-[#00c573]"
            >
              {loading ? 'Adding...' : 'Add Topic'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
