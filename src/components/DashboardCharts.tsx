'use client';

import ActivityHeatmap from './ActivityHeatmap';

interface DashboardChartsProps {
  userId: string;
  activityData: { date: string; count: number }[];
}

export default function DashboardCharts({ userId, activityData }: DashboardChartsProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-[#fafafa] mb-4 mt-8">Activity</h2>
      <div className="bg-[#171717] border-[#2e2e2e] rounded-lg p-6 w-full flex justify-center">
        <ActivityHeatmap userId={userId} activityData={activityData} />
      </div>
    </div>
  );
}
