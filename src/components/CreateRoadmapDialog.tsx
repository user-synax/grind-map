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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createRoadmap } from '@/actions/admin';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateRoadmapDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = await createRoadmap(title, category, isDefault);

    if (result.success) {
      setOpen(false);
      setTitle('');
      setCategory('');
      setIsDefault(false);
      router.refresh();
    } else {
      alert(result.error || 'Failed to create roadmap');
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3ecf8e] text-[#0f0f0f] border-[#3ecf8e] hover:bg-[#00c573]">
          <Plus className="mr-2 h-4 w-4" />
          Create Roadmap
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0f0f0f] border-[#2e2e2e] text-[#fafafa]">
        <DialogHeader>
          <DialogTitle>Create New Roadmap</DialogTitle>
          <DialogDescription className="text-[#898989]">
            Add a new learning roadmap to the platform
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
              placeholder="Roadmap title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-[#b4b4b4]">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-[#171717] border-[#363636] text-[#fafafa]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-[#171717] border-[#363636]">
                <SelectItem value="dsa">DSA</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="system_design">System Design</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked: boolean | string) => setIsDefault(checked === 'on' || checked === true)}
              className="border-[#363636]"
            />
            <Label htmlFor="isDefault" className="text-[#b4b4b4]">
              Make this a default roadmap
            </Label>
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
              {loading ? 'Creating...' : 'Create Roadmap'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
