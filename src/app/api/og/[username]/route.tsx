import { ImageResponse } from 'next/og';
import { db } from '@/db/index';
import { users, userProgress, streaks } from '@/db/schema';
import { eq, and, count, sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const user = await db.select().from(users).where(eq(users.username, params.username));

  if (user.length === 0) {
    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          fontSize: 60,
          fontWeight: 600,
          color: '#fafafa',
        }}
      >
        User Not Found
      </div>,
      {
        width: 1200,
        height: 630,
      }
    );
  }

  const userData = user[0];
  const userId = userData.clerkId;

  // Fetch stats
  const combinedStats = await db.execute(sql`
    SELECT
      (SELECT COUNT(*) FROM "userProgress" WHERE "userId" = ${userId} AND status = 'done') as total_completed,
      COALESCE((SELECT "currentStreak" FROM streaks WHERE "userId" = ${userId}), 0) as current_streak
  `);

  const totalCompleted = Number(combinedStats.rows[0]?.total_completed) || 0;
  const currentStreak = Number(combinedStats.rows[0]?.current_streak) || 0;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#09090b',
          padding: 60,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 40,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#fafafa',
              letterSpacing: '-0.02em',
            }}
          >
            {userData.username}
          </div>
          
          <div
            style={{
              display: 'flex',
              gap: 60,
              fontSize: 36,
              fontWeight: 500,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ color: '#8b5cf6', fontSize: 48, fontWeight: 700 }}>
                {totalCompleted}
              </div>
              <div style={{ color: '#71717a', fontSize: 24 }}>
                Topics Completed
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <div style={{ color: '#8b5cf6', fontSize: 48, fontWeight: 700 }}>
                {currentStreak}
              </div>
              <div style={{ color: '#71717a', fontSize: 24 }}>
                Day Streak
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 24,
              color: '#52525b',
              marginTop: 20,
            }}
          >
            grindmap.com
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
