import sql from '@/lib/db';
import { awardPoints, awardBadge, getMemberPoints } from './gamification';

export async function getVideoProgress(memberId: number, videoId: number) {
  const rows = await sql`
    SELECT seconds, completed FROM video_progress
    WHERE member_id = ${memberId} AND video_id = ${videoId}
  `;
  return rows[0] ?? { seconds: 0, completed: false };
}

export async function getAllVideoProgress(memberId: number) {
  return sql`
    SELECT video_id, seconds, completed, updated_at
    FROM video_progress
    WHERE member_id = ${memberId}
  `;
}

export async function saveVideoProgress(
  memberId: number,
  videoId: number,
  seconds: number,
  duration: number,
) {
  const completed = duration > 0 && seconds / duration >= 0.9;

  const existing = await sql`
    SELECT completed FROM video_progress
    WHERE member_id = ${memberId} AND video_id = ${videoId}
  `;

  await sql`
    INSERT INTO video_progress (member_id, video_id, seconds, completed, updated_at)
    VALUES (${memberId}, ${videoId}, ${seconds}, ${completed}, NOW())
    ON CONFLICT (member_id, video_id) DO UPDATE SET
      seconds    = GREATEST(video_progress.seconds, EXCLUDED.seconds),
      completed  = video_progress.completed OR EXCLUDED.completed,
      updated_at = NOW()
  `;

  // Award points only on first completion
  if (completed && !existing[0]?.completed) {
    await awardPoints(memberId, 'video_completed', videoId);

    // Badge: 5 videos completed
    const completedCount = await sql`
      SELECT COUNT(*) AS cnt FROM video_progress
      WHERE member_id = ${memberId} AND completed = TRUE
    `;
    if (Number(completedCount[0].cnt) >= 5) {
      await awardBadge(memberId, 'video_addict');
    }
  }

  return { seconds, completed };
}
