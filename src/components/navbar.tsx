'use client';

import { SignOutButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();
  const hideNavbar = pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up';

  if (hideNavbar) {
    return null;
  }

  return (
    <nav className="border-b border-[#2e2e2e] bg-[#171717]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-[#fafafa]">GrindMap</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-[#fafafa] hover:text-[#3ecf8e]">
                Dashboard
              </Button>
            </Link>
            <UserButton />
            <SignOutButton>
              <Button variant="ghost" className="text-[#fafafa] hover:text-[#ef4444]">
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
