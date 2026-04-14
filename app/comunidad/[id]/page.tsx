'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import useSWR from 'swr';
import { MemberAvatar } from '@/components/community/MemberAvatar';
import { timeAgo } from '@/lib/utils';
import type { Post, Comment } from '@/lib/community/types';

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (r.status === 403) throw new Error('forbidden');
    return r.json();
  });

function CommentItem({
  comment,
  onReply,
}: {
  comment: Comment;
  onReply: (parentId: string) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
        <MemberAvatar name={comment.author_name} size={28} avatarUrl={comment.author_avatar_url} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#FFFFFF' }}>
              {comment.author_name}
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
              {timeAgo(comment.created_at)}
            </span>
          </div>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {comment.body}
          </p>
          <button
            onClick={() => onReply(comment.id)}
            style={{
              marginTop: '6px',
              fontSize: '12px',
              color: 'rgba(255,255,255,0.35)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Responder
          </button>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div
          style={{
            marginLeft: '38px',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            paddingLeft: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const { data: post, mutate: mutatePost, error: postError } = useSWR<Post>(
    id ? `/api/community/posts/${id}` : null,
    fetcher
  );
  const { data: comments, mutate: mutateComments } = useSWR<Comment[]>(
    id ? `/api/community/posts/${id}/comments` : null,
    fetcher
  );

  const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (postError?.message === 'forbidden') router.replace('/comunidad');
  }, [postError, router]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/community/posts/${id}/view`, { method: 'POST' }).catch(() => {});
  }, [id]);

  async function handleLike() {
    if (!post || likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${id}/react`, { method: 'POST' });
      const data = await res.json();
      mutatePost(
        (prev) =>
          prev
            ? {
                ...prev,
                user_liked: data.liked,
                likes_count: data.liked ? prev.likes_count + 1 : prev.likes_count - 1,
              }
            : prev,
        false
      );
    } finally {
      setLikeLoading(false);
    }
  }

  async function handleCommentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`/api/community/posts/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: commentBody.trim(), parent_id: replyTo }),
      });
      setCommentBody('');
      setReplyTo(undefined);
      mutateComments();
    } finally {
      setSubmitting(false);
    }
  }

  if (!post) {
    return (
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
        <div
          style={{
            height: '200px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 24px' }}>
      <Link
        href="/comunidad"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '13px',
          textDecoration: 'none',
          marginBottom: '24px',
        }}
      >
        <ArrowLeft size={14} /> Volver al feed
      </Link>

      <article
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '28px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <MemberAvatar name={post.author_name} size={36} avatarUrl={post.author_avatar_url} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#FFFFFF' }}>
                {post.author_name}
              </span>
              {post.author_is_founder && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#FF6A00',
                    background: 'rgba(255,106,0,0.12)',
                    border: '1px solid rgba(255,106,0,0.25)',
                    borderRadius: '3px',
                    padding: '1px 5px',
                  }}
                >
                  FUNDADOR
                </span>
              )}
            </div>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
              {post.author_company && `${post.author_company} · `}
              {timeAgo(post.created_at)}
            </span>
          </div>
        </div>

        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            marginBottom: '16px',
            lineHeight: 1.35,
          }}
        >
          {post.title}
        </h1>

        <div
          style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            marginBottom: '24px',
          }}
        >
          {post.body}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '16px',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            <Eye size={14} /> {post.views}
          </span>
          <button
            onClick={handleLike}
            disabled={likeLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '13px',
              color: post.user_liked ? '#FF6A00' : 'rgba(255,255,255,0.35)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Heart size={14} fill={post.user_liked ? '#FF6A00' : 'none'} />
            {post.likes_count}
          </button>
        </div>
      </article>

      {/* Comments */}
      <section>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '20px' }}>
          Comentarios {comments?.length ? `(${comments.length})` : ''}
        </h2>

        {comments && comments.length > 0 && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}
          >
            {comments.map((c) => (
              <CommentItem key={c.id} comment={c} onReply={setReplyTo} />
            ))}
          </div>
        )}

        <form
          onSubmit={handleCommentSubmit}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          {replyTo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                Respondiendo a un comentario
              </span>
              <button
                type="button"
                onClick={() => setReplyTo(undefined)}
                style={{
                  fontSize: '12px',
                  color: '#FF6A00',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          )}
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Dejá tu comentario..."
            rows={3}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: '14px',
              lineHeight: 1.6,
              resize: 'none',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={submitting || !commentBody.trim()}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                cursor: submitting || !commentBody.trim() ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                color: '#FFFFFF',
                background:
                  submitting || !commentBody.trim()
                    ? 'rgba(255,255,255,0.08)'
                    : 'linear-gradient(135deg, #FF6A00, #E05A00)',
              }}
            >
              {submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
