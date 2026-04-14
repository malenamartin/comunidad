'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { MessageSquare, TrendingUp } from 'lucide-react';
import { timeAgo } from '@/lib/utils';
import type { Comment, Post } from '@/lib/community/types';
import { mockConversationThreads } from '@/lib/community/mockData';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ConversacionesPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [windowMode, setWindowMode] = useState<'24h' | '7d'>('7d');
  const [newThreadBody, setNewThreadBody] = useState('');
  const [newMessageBody, setNewMessageBody] = useState('');
  const [creatingThread, setCreatingThread] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [moderationMsg, setModerationMsg] = useState('');

  const { data: discussionFeed, isLoading: feedLoading, mutate: mutateFeed } = useSWR<{ posts: Post[]; total: number }>(
    '/api/community/posts?type=discusion&limit=40',
    fetcher,
  );

  const liveThreads = discussionFeed?.posts ?? [];
  const hasLiveThreads = liveThreads.length > 0;
  const selectedId = selectedThreadId ?? liveThreads[0]?.id ?? null;

  const { data: comments, mutate: mutateComments } = useSWR<Comment[]>(
    selectedId && hasLiveThreads ? `/api/community/posts/${selectedId}/comments` : null,
    fetcher,
  );

  const { data: canModerate } = useSWR<boolean>('/api/admin/posts', async (url: string) => {
    const response = await fetch(url);
    return response.ok;
  });

  const mockActiveThread = useMemo(() => {
    if (hasLiveThreads) return null;
    return mockConversationThreads[0];
  }, [hasLiveThreads]);

  const rankedThreads = useMemo(() => {
    const now = Date.now();
    const cutoff = windowMode === '24h' ? now - 24 * 60 * 60 * 1000 : now - 7 * 24 * 60 * 60 * 1000;
    return liveThreads
      .filter((thread) => new Date(thread.created_at).getTime() >= cutoff)
      .map((thread) => ({
        ...thread,
        score: thread.comments_count * 4 + thread.likes_count * 2 + thread.views,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [liveThreads, windowMode]);

  async function createThread() {
    const body = newThreadBody.trim();
    if (!body || creatingThread) return;
    setCreatingThread(true);
    try {
      const title = body.length > 64 ? `${body.slice(0, 64)}...` : body;
      await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Tendencia: ${title}`,
          body,
          post_type: 'discusion',
        }),
      });
      setNewThreadBody('');
      await mutateFeed();
    } finally {
      setCreatingThread(false);
    }
  }

  async function sendMessage() {
    const body = newMessageBody.trim();
    if (!body || !selectedId || sendingMessage) return;
    setSendingMessage(true);
    try {
      await fetch(`/api/community/posts/${selectedId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      setNewMessageBody('');
      await mutateComments();
      await mutateFeed();
    } finally {
      setSendingMessage(false);
    }
  }

  async function moderateThread(action: 'pin' | 'unpin' | 'delete') {
    if (!selectedId) return;
    const postId = Number(selectedId);
    if (!Number.isFinite(postId)) {
      setModerationMsg('No se pudo moderar este hilo (ID inválido).');
      return;
    }

    if (action === 'delete') {
      const ok = window.confirm('¿Eliminar este hilo de conversación?');
      if (!ok) return;
      const response = await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      setModerationMsg(response.ok ? 'Hilo eliminado.' : 'No se pudo eliminar el hilo.');
      await mutateFeed();
      setSelectedThreadId(null);
      return;
    }

    const response = await fetch('/api/admin/posts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, pinned: action === 'pin' }),
    });
    setModerationMsg(response.ok ? `Hilo ${action === 'pin' ? 'fijado' : 'desfijado'} correctamente.` : 'No se pudo actualizar el hilo.');
    await mutateFeed();
  }

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '32px 24px' }}>
      <section style={{ background: 'var(--fardo-color-bg-base)', border: '1px solid var(--fardo-color-border-default)', borderRadius: '20px', padding: '18px', marginBottom: '14px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--fardo-orange-500)', marginBottom: '8px' }}>
          CONVERSACIONES
        </p>
        <h1 style={{ fontSize: '24px', color: 'var(--fardo-color-text-primary)', marginBottom: '6px' }}>
          Conversaciones que mueven decisiones
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--fardo-color-text-secondary)', lineHeight: 1.6 }}>
          Traé señales de mercado, contrastá aprendizajes con otros CMOs y salí con una acción concreta.
        </p>
        <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
          {[
            'Publicá una tendencia con contexto y fuente.',
            'Contá qué acción concreta tomaste.',
            'Respondé al menos dos aportes de otros miembros.',
          ].map((item) => (
            <div key={item} style={{ border: '1px solid var(--fardo-color-border-default)', borderRadius: '12px', background: 'var(--fardo-color-bg-subtle)', padding: '8px 10px', fontSize: '12px', color: 'var(--fardo-color-text-secondary)' }}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', alignItems: 'start' }}>
        <aside style={{ background: 'var(--fardo-color-bg-base)', border: '1px solid var(--fardo-color-border-default)', borderRadius: '20px', padding: '14px', position: 'sticky', top: '124px' }}>
          <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-secondary)', marginBottom: '8px' }}>Abrir hilo de tendencia</p>
          <textarea
            value={newThreadBody}
            onChange={(e) => setNewThreadBody(e.target.value)}
            placeholder="Ej: Esta semana subió fuerte la búsqueda comparativa en GEO..."
            rows={3}
            style={{ width: '100%', border: '1px solid var(--fardo-color-border-default)', borderRadius: '14px', padding: '10px 12px', resize: 'vertical', background: 'var(--fardo-color-bg-subtle)', color: 'var(--fardo-color-text-primary)', fontSize: '13px', fontFamily: 'inherit', marginBottom: '8px' }}
          />
          <button onClick={createThread} style={{ width: '100%', border: '1px solid var(--fardo-orange-400)', background: 'var(--fardo-orange-400)', color: '#fff', borderRadius: '12px', padding: '10px 12px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', marginBottom: '10px' }}>
            {creatingThread ? 'Publicando...' : 'Publicar hilo'}
          </button>

          <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)', marginBottom: '8px' }}>Hilos activos</p>
          {feedLoading ? (
            <div style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)' }}>Cargando hilos...</div>
          ) : hasLiveThreads ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {liveThreads.map((thread) => {
                const selected = selectedId === thread.id;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    style={{ width: '100%', textAlign: 'left', border: selected ? '1px solid var(--fardo-orange-200)' : '1px solid var(--fardo-color-border-default)', background: selected ? 'var(--fardo-orange-50)' : 'var(--fardo-color-bg-subtle)', borderRadius: '14px', padding: '10px', cursor: 'pointer' }}
                  >
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fardo-color-text-primary)', marginBottom: '4px' }}>{thread.title}</p>
                    <p style={{ fontSize: '11px', color: 'var(--fardo-color-text-muted)' }}>{thread.comments_count} mensajes · {timeAgo(thread.created_at)}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {mockConversationThreads.map((thread) => (
                <div key={thread.id} style={{ border: '1px solid var(--fardo-color-border-default)', background: 'var(--fardo-color-bg-subtle)', borderRadius: '14px', padding: '10px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fardo-color-text-primary)', marginBottom: '3px' }}>{thread.title}</p>
                  <p style={{ fontSize: '11px', color: 'var(--fardo-color-text-muted)' }}>{thread.trend}</p>
                </div>
              ))}
            </div>
          )}
        </aside>

        <section style={{ background: 'var(--fardo-color-bg-base)', border: '1px solid var(--fardo-color-border-default)', borderRadius: '20px', padding: '14px', minHeight: '560px', display: 'flex', flexDirection: 'column' }}>
          {hasLiveThreads ? (
            <>
              <header style={{ border: '1px solid var(--fardo-color-border-default)', borderRadius: '14px', background: 'var(--fardo-color-bg-subtle)', padding: '12px', marginBottom: '10px' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fardo-color-text-primary)' }}>{liveThreads.find((item) => item.id === selectedId)?.title ?? 'Conversacion'}</p>
                <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-secondary)' }}>Espacio para compartir señal real, no opiniones al voleo.</p>
                {canModerate && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => moderateThread('pin')} style={moderationBtnStyle}>Fijar hilo</button>
                    <button onClick={() => moderateThread('unpin')} style={moderationBtnStyle}>Quitar fijado</button>
                    <button onClick={() => moderateThread('delete')} style={moderationDangerBtnStyle}>Eliminar hilo</button>
                  </div>
                )}
                {moderationMsg && <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)', marginTop: '6px' }}>{moderationMsg}</p>}
              </header>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                {(comments ?? []).map((message) => (
                  <div key={message.id} style={{ alignSelf: 'stretch', border: '1px solid var(--fardo-color-border-default)', borderRadius: '14px', background: 'var(--fardo-color-bg-subtle)', padding: '10px 12px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)', marginBottom: '4px' }}>{message.author_name} · {timeAgo(message.created_at)}</p>
                    <span style={messageBadgeStyle(message.body)}>{messageBadgeLabel(message.body)}</span>
                    <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-primary)', lineHeight: 1.55 }}>{message.body}</p>
                  </div>
                ))}
                {!comments?.length && <div style={{ fontSize: '13px', color: 'var(--fardo-color-text-muted)', padding: '10px' }}>Todavía no hay mensajes. Abrí la conversación con contexto y fuente.</div>}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <input
                  value={newMessageBody}
                  onChange={(e) => setNewMessageBody(e.target.value)}
                  placeholder="Sumá insight, dato o pregunta concreta..."
                  style={{ flex: 1, border: '1px solid var(--fardo-color-border-default)', borderRadius: '12px', padding: '10px 12px', background: 'var(--fardo-color-bg-subtle)', color: 'var(--fardo-color-text-primary)', fontSize: '13px' }}
                />
                <button onClick={sendMessage} style={{ border: '1px solid var(--fardo-orange-400)', background: 'var(--fardo-orange-400)', color: '#fff', borderRadius: '12px', padding: '10px 14px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
                  {sendingMessage ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </>
          ) : (
            <>
              <header style={{ border: '1px solid var(--fardo-orange-200)', borderRadius: '14px', background: 'var(--fardo-orange-50)', padding: '12px', marginBottom: '10px' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--fardo-color-text-primary)', marginBottom: '4px' }}>Modo demo de conversaciones</p>
                <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-secondary)' }}>Todavía no hay hilos reales. Creá el primero y activá la señal de la comunidad.</p>
              </header>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {mockActiveThread?.messages.map((message) => (
                  <div key={message.id} style={{ border: '1px solid var(--fardo-color-border-default)', borderRadius: '14px', background: 'var(--fardo-color-bg-subtle)', padding: '10px 12px' }}>
                    <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)', marginBottom: '4px' }}>
                      <MessageSquare size={12} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                      {message.author} · {message.at}
                    </p>
                    <span style={messageBadgeStyle(message.body)}>{messageBadgeLabel(message.body)}</span>
                    <p style={{ fontSize: '13px', color: 'var(--fardo-color-text-primary)', lineHeight: 1.5 }}>{message.body}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '10px', border: '1px dashed var(--fardo-color-border-default)', borderRadius: '14px', padding: '10px', fontSize: '12px', color: 'var(--fardo-color-text-secondary)' }}>
                <TrendingUp size={14} style={{ marginRight: '5px', verticalAlign: 'text-bottom' }} />
                Tip FARDO: compartí señal con fuente y próxima acción. Menos humo, más ejecución.
              </div>
            </>
          )}
        </section>
      </div>

      <section style={{ marginTop: '14px', background: 'var(--fardo-color-bg-base)', border: '1px solid var(--fardo-color-border-default)', borderRadius: '20px', padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', gap: '10px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '15px', color: 'var(--fardo-color-text-primary)' }}>Tendencias destacadas</h2>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => setWindowMode('24h')} style={windowChipStyle(windowMode === '24h')}>24h</button>
            <button onClick={() => setWindowMode('7d')} style={windowChipStyle(windowMode === '7d')}>7d</button>
          </div>
        </div>
        {rankedThreads.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
            {rankedThreads.map((thread) => (
              <button key={thread.id} onClick={() => setSelectedThreadId(thread.id)} style={{ textAlign: 'left', border: '1px solid var(--fardo-color-border-default)', borderRadius: '12px', background: 'var(--fardo-color-bg-subtle)', padding: '10px', cursor: 'pointer' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fardo-color-text-primary)', marginBottom: '4px' }}>{thread.title}</p>
                <p style={{ fontSize: '11px', color: 'var(--fardo-color-text-muted)' }}>Score {thread.score} · {thread.comments_count} mensajes · {thread.likes_count} likes</p>
              </button>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '12px', color: 'var(--fardo-color-text-muted)' }}>Aún no hay actividad suficiente para armar ranking de {windowMode}.</p>
        )}
      </section>
    </div>
  );
}

function messageBadgeLabel(body: string): string {
  const text = body.toLowerCase();
  if (text.includes('accion') || text.includes('test') || text.includes('implement')) return 'Accion';
  if (text.includes('dato') || text.includes('%') || text.includes('benchmark')) return 'Dato';
  if (text.includes('pregunta') || text.includes('?')) return 'Pregunta';
  return 'Insight';
}

function messageBadgeStyle(body: string): React.CSSProperties {
  const label = messageBadgeLabel(body);
  const styleByLabel: Record<string, { color: string; background: string; border: string }> = {
    Accion: { color: 'var(--fardo-green-600)', background: 'var(--fardo-green-50)', border: '1px solid rgba(39,106,67,0.25)' },
    Dato: { color: 'var(--fardo-blue-500)', background: 'var(--fardo-blue-50)', border: '1px solid rgba(4,98,212,0.25)' },
    Pregunta: { color: 'var(--fardo-amber-600)', background: 'var(--fardo-amber-50)', border: '1px solid rgba(191,118,23,0.25)' },
    Insight: { color: 'var(--fardo-orange-500)', background: 'var(--fardo-orange-50)', border: '1px solid rgba(255,106,0,0.25)' },
  };
  const style = styleByLabel[label];
  return {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '999px',
    fontSize: '10px',
    fontWeight: 700,
    color: style.color,
    background: style.background,
    border: style.border,
    marginBottom: '6px',
    letterSpacing: '0.03em',
  };
}

function windowChipStyle(active: boolean): React.CSSProperties {
  return {
    border: active ? '1px solid var(--fardo-orange-200)' : '1px solid var(--fardo-color-border-default)',
    background: active ? 'var(--fardo-orange-50)' : 'var(--fardo-color-bg-subtle)',
    color: active ? 'var(--fardo-orange-500)' : 'var(--fardo-color-text-secondary)',
    borderRadius: '999px',
    padding: '5px 10px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  };
}

const moderationBtnStyle: React.CSSProperties = {
  border: '1px solid var(--fardo-color-border-default)',
  background: 'var(--fardo-color-bg-base)',
  color: 'var(--fardo-color-text-secondary)',
  borderRadius: '10px',
  padding: '6px 10px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};

const moderationDangerBtnStyle: React.CSSProperties = {
  border: '1px solid rgba(185,54,54,0.35)',
  background: 'var(--fardo-red-50)',
  color: 'var(--fardo-red-600)',
  borderRadius: '10px',
  padding: '6px 10px',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};
