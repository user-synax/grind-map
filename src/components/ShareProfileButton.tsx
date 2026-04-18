'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareProfileButtonProps {
  username: string;
}

export default function ShareProfileButton({ username }: ShareProfileButtonProps) {
  const handleShare = () => {
    const profileUrl = `${window.location.origin}/u/${username}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile link copied!');
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className="bg-[#0f0f0f] text-[#fafafa] border-[#2e2e2e] hover:bg-[#242424] cursor-pointer"
    >
      Share Profile
    </Button>
  );
}
