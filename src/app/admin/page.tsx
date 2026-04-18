import { db } from '@/db/index';
import { users, roadmaps, topics, userProgress } from '@/db/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminLogout } from '@/actions/admin';
import { LogOut, Users, Map, BookOpen, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function getAdminStats() {
  const [userCount, roadmapCount, topicCount, progressCount] = await Promise.all([
    db.select().from(users).then((res) => res.length),
    db.select().from(roadmaps).then((res) => res.length),
    db.select().from(topics).then((res) => res.length),
    db.select().from(userProgress).then((res) => res.length),
  ]);

  return { userCount, roadmapCount, topicCount, progressCount };
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  async function handleLogout() {
    'use server';
    await adminLogout();
    revalidatePath('/admin');
  }

  return (
    <div className="min-h-screen bg-[#171717] text-[#fafafa]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold mb-2 text-[#fafafa]">Admin Dashboard</h1>
            <p className="text-[#898989]">Manage your application</p>
          </div>
          <form action={handleLogout}>
            <Button
              type="submit"
              variant="outline"
              className="bg-[#0f0f0f] text-[#fafafa] border-[#2e2e2e] hover:bg-[#242424] hover:border-[#363636]"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-[#0f0f0f] border-[#2e2e2e]">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm text-[#898989] font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-[#fafafa]">{stats.userCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f0f] border-[#2e2e2e]">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm text-[#898989] font-medium flex items-center gap-2">
                <Map className="h-4 w-4" />
                Total Roadmaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-[#fafafa]">{stats.roadmapCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f0f] border-[#2e2e2e]">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm text-[#898989] font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Total Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-[#fafafa]">{stats.topicCount}</div>
            </CardContent>
          </Card>

          <Card className="bg-[#0f0f0f] border-[#2e2e2e]">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm text-[#898989] font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progress Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-[#fafafa]">{stats.progressCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/roadmaps">
            <Card className="bg-[#0f0f0f] border-[#2e2e2e] hover:border-[#3ecf8e] transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-[#fafafa] flex items-center gap-3">
                  <Map className="h-6 w-6 text-[#3ecf8e]" />
                  Manage Roadmaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#898989]">Create, edit, and delete learning roadmaps</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card className="bg-[#0f0f0f] border-[#2e2e2e] hover:border-[#3ecf8e] transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-[#fafafa] flex items-center gap-3">
                  <Users className="h-6 w-6 text-[#3ecf8e]" />
                  View Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#898989]">View and manage user accounts</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
