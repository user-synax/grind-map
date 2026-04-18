'use client';

import { useState } from 'react';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  userId: string;
  activityData: ActivityData[];
}

export default function ActivityHeatmap({ userId, activityData }: ActivityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);

  // Generate last 365 days
  const today = new Date();
  const days: { date: string; count: number }[] = [];
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const activity = activityData.find(d => d.date === dateStr);
    days.push({
      date: dateStr,
      count: activity?.count || 0,
    });
  }

  // Group by week for rendering
  const weeks: { date: string; count: number; dayOfWeek: number }[][] = [];
  let currentWeek: { date: string; count: number; dayOfWeek: number }[] = [];
  
  days.forEach((day, index) => {
    const dayOfWeek = new Date(day.date).getDay();
    currentWeek.push({ ...day, dayOfWeek });
    
    if (dayOfWeek === 6 || index === days.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Get color based on count
  const getColor = (count: number) => {
    if (count === 0) return '#27272a'; // zinc-800
    if (count <= 2) return '#4c1d95'; // violet-900
    if (count <= 5) return '#6d28d7'; // violet-700
    return '#8b5cf6'; // violet-500
  };

  // Get month labels
  const monthLabels: string[] = [];
  let lastMonth = '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  weeks.forEach((week, weekIndex) => {
    if (week.length > 0) {
      const date = new Date(week[0].date);
      const month = months[date.getMonth()];
      if (month !== lastMonth) {
        monthLabels.push(month);
        lastMonth = month;
      } else {
        monthLabels.push('');
      }
    }
  });

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-[#fafafa] mb-4">Activity (last 365 days)</h3>
      <div className="overflow-x-auto">
        <svg width={weeks.length * 13 + 30} height={130} className="activity-heatmap">
          {/* Month labels */}
          {monthLabels.map((label, i) => (
            <text
              key={i}
              x={i * 13 + 30}
              y={15}
              className="text-[10px] fill-[#898989]"
              fontSize="10"
            >
              {label}
            </text>
          ))}

          {/* Day labels */}
          <text x="0" y="35" className="text-[10px] fill-[#898989]" fontSize="10">Mon</text>
          <text x="0" y="55" className="text-[10px] fill-[#898989]" fontSize="10">Wed</text>
          <text x="0" y="75" className="text-[10px] fill-[#898989]" fontSize="10">Fri</text>

          {/* Heatmap cells */}
          {weeks.map((week, weekIndex) => (
            <g key={weekIndex}>
              {week.map((day, dayIndex) => {
                const x = weekIndex * 13 + 30;
                const y = day.dayOfWeek * 12 + 25;
                return (
                  <rect
                    key={`${day.date}-${dayIndex}`}
                    x={x}
                    y={y}
                    width={11}
                    height={11}
                    rx={2}
                    fill={getColor(day.count)}
                    onMouseEnter={() => setHoveredCell(day)}
                    onMouseLeave={() => setHoveredCell(null)}
                    className="cursor-pointer hover:stroke-[#fafafa] hover:stroke-[1px]"
                  />
                );
              })}
            </g>
          ))}

          {/* Tooltip */}
          {hoveredCell && (
            <g>
              <rect
                x={hoveredCell ? 100 : 0}
                y={95}
                width={150}
                height={30}
                rx={4}
                fill="#171717"
                stroke="#2e2e2e"
                strokeWidth={1}
              />
              <text
                x={hoveredCell ? 175 : 0}
                y={115}
                className="text-[11px] fill-[#fafafa]"
                fontSize="11"
                textAnchor="middle"
              >
                {hoveredCell.count} {hoveredCell.count === 1 ? 'topic' : 'topics'} on {hoveredCell.date}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-[#898989]">
        <span>Less</span>
        {[0, 1, 3, 6].map((count) => (
          <div
            key={count}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: getColor(count) }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
