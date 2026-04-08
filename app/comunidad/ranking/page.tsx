'use client';

import { useState, useEffect } from 'react';

const LEVEL_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  platinum: { bg: '#E8E0FF', text: '#5B21B6', label: 'Platinum' },
  gold:     { bg: '#FEF3C7', text: '#92400E', label: 'Gold'     },
  silver:   { bg: '#F1F5F9', text: '#475569', label: 'Silver'   },
  bronze:   { bg: '#FEF0E7', text: '#92400E', label: 'Bronze'   },
};

const POINT_ACTIONS: Record<string, { label: string; emoji: string }> = {
  post_created:      { label: 'Post publicado',      emoji: '✍️'  },
  comment_created:   { label: 'Comentario',          emoji: '💬'  },
  reaction_received: { label: 'Reacción recibida',   emoji: '❤️'  },
  video_completed:   { label: 'Video completado',    emoji: '🎬'  },
  profile_completed: { label: 'Perfil completado',   emoji: '👤'  },
  invite_accepted:   { label: 'Invitación aceptada', emoji: '🤝'  },
  daily_login:       { label: 'Login diario',        emoji: '📅'  },
  benchmark_viewed:  { label: 'Benchmark visto',     emoji: '📊'  },
  event_attended:    { label: 'Evento asistido',     emoji: '🎟️' },
};

export default function RankingPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myPoints, setMyPoints] = useState<any>(null);
  const [myBadges, setMyBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/community/gamification/leaderboard').then(r => r.json()),
      fetch('/api/community/gamification/points').then(r => r.json()),
      fetch('/api/community/gamification/badges').then(r => r.json()),
    ]).then(([lb, pts, bdg]) => {
      setLeaderboard(lb);
      setMyPoints(pts);
      setMyBadges(bdg);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: '48px', textAlign: 'center', color: '#fff', opacity: 0.4 }}>Cargando...</div>;

  const myLevel = LEVEL_COLORS[myPoints?.level ?? 'bronze'];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

      {/* My stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Mis puntos</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#fff' }}>{(myPoints?.total_points ?? 0).toLocaleString()}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Nivel</p>
          <span style={{ display: 'inline-block', background: myLevel.bg, color: myLevel.text, borderRadius: '100px', padding: '4px 14px', fontSize: '14px', fontWeight: 600 }}>
            {myLevel.label}
          </span>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Badges</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {myBadges.length === 0
              ? <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Ninguno aún</span>
              : myBadges.map((b: any) => (
                  <span key={b.slug} title={b.name} style={{ fontSize: '20px' }}>{b.icon}</span>
                ))
            }
          </div>
        </div>
      </div>

      {/* Points history */}
      {myPoints?.history?.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '12px', letterSpacing: '0.06em' }}>ÚLTIMOS PUNTOS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myPoints.history.slice(0, 5).map((h: any, i: number) => {
              const meta = POINT_ACTIONS[h.action] ?? { label: h.action, emoji: '⚡' };
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{meta.emoji} {meta.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#FF6A00' }}>+{h.points}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Ranking global</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {leaderboard.map((m: any, i: number) => {
          const lvl = LEVEL_COLORS[m.level] ?? LEVEL_COLORS.bronze;
          const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
          return (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px 18px' }}>
              <span style={{ width: '32px', textAlign: 'center', fontSize: i < 3 ? '20px' : '14px', fontWeight: 700, color: i < 3 ? undefined : 'rgba(255,255,255,0.3)' }}>{medal}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{m.name}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{m.company ?? m.country}</p>
              </div>
              <span style={{ background: lvl.bg, color: lvl.text, borderRadius: '100px', padding: '2px 10px', fontSize: '11px', fontWeight: 600 }}>{lvl.label}</span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff', minWidth: '60px', textAlign: 'right' }}>{Number(m.total_points).toLocaleString()}</span>
            </div>
          );
        })}
        {leaderboard.length === 0 && (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '32px' }}>Todavía no hay puntos registrados.</p>
        )}
      </div>
    </div>
  );
}
