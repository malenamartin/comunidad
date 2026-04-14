'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { MemberAvatar } from '@/components/community/MemberAvatar';
import type { CommunityMember } from '@/lib/community/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
  invisible: { label: 'Invisible', color: 'rgba(255,255,255,0.4)' },
  visible:   { label: 'Visible',   color: '#90C050' },
  referente: { label: 'Referente', color: '#C8A040' },
  embajador: { label: 'Embajador', color: '#FF6A00' },
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '14px',
  color: '#FFFFFF',
  outline: 'none',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '6px',
  letterSpacing: '0.03em',
};

export default function PerfilPage() {
  const { data: member, mutate } = useSWR<CommunityMember>('/api/community/me', fetcher);
  const { data: avatarData } = useSWR<{
    presets: { id: number; name: string; image_url: string; order_index: number }[];
    selected: { preset_id: number | null; custom_avatar_url: string | null };
  }>('/api/community/avatars', fetcher);

  const [form, setForm] = useState({
    name: '',
    company: '',
    job_title: '',
    country: '',
    linkedin_url: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [presetAvatarId, setPresetAvatarId] = useState<number | null>(null);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name ?? '',
        company: member.company ?? '',
        job_title: member.job_title ?? '',
        country: member.country ?? '',
        linkedin_url: member.linkedin_url ?? '',
        bio: member.bio ?? '',
      });
    }
  }, [member]);

  useEffect(() => {
    if (avatarData) {
      setPresetAvatarId(avatarData.selected.preset_id ?? null);
      setCustomAvatarUrl(avatarData.selected.custom_avatar_url ?? '');
    }
  }, [avatarData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/community/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Error al guardar');
      } else {
        const updated = await res.json();
        mutate(updated, false);
        setSaved(true);
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  async function saveAvatar() {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/community/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preset_avatar_id: presetAvatarId,
          custom_avatar_url: customAvatarUrl.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Error al guardar avatar');
      } else {
        const updated = await res.json();
        mutate(updated, false);
        setSaved(true);
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  const levelStyle = member ? (LEVEL_LABELS[member.level] ?? LEVEL_LABELS.invisible) : null;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          marginBottom: '28px',
        }}
      >
        Mi perfil FARDO
      </h1>

      {member && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(255,255,255,0.03)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '28px',
          }}
        >
          <MemberAvatar name={member.name} size={52} avatarUrl={member.avatar_url} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF' }}>
                {member.name}
              </span>
              {member.is_founder && (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {levelStyle && (
                <span style={{ fontSize: '12px', fontWeight: 600, color: levelStyle.color }}>
                  {levelStyle.label}
                </span>
              )}
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                {member.points} puntos
              </span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Nombre completo *</label>
          <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Empresa</label>
            <input name="company" value={form.company} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Cargo</label>
            <input
              name="job_title"
              value={form.job_title}
              onChange={handleChange}
              placeholder="CMO"
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>País</label>
          <input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="Argentina"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>LinkedIn URL</label>
          <input
            name="linkedin_url"
            value={form.linkedin_url}
            onChange={handleChange}
            placeholder="linkedin.com/in/tu-perfil"
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Contá quién sos, qué estás construyendo y en qué te gustaría conectar..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {error && (
          <p
            style={{
              fontSize: '13px',
              color: '#E07050',
              background: 'rgba(220,80,50,0.1)',
              borderRadius: '6px',
              padding: '8px 12px',
            }}
          >
            {error}
          </p>
        )}

        {saved && (
          <p
            style={{
              fontSize: '13px',
              color: '#90C050',
              background: 'rgba(120,180,60,0.1)',
              borderRadius: '6px',
              padding: '8px 12px',
            }}
          >
            Perfil actualizado. Ahora sí: más señal, menos fricción.
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFFFFF',
            background: saving
              ? 'rgba(255,255,255,0.1)'
              : 'linear-gradient(135deg, #FF6A00, #E05A00)',
          }}
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>

      <div
        style={{
          marginTop: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '16px',
        }}
      >
        <h2 style={{ fontSize: '15px', color: '#fff', marginBottom: '12px' }}>Avatar de perfil</h2>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginBottom: '12px' }}>
          Elegí un avatar oficial o pegá uno propio. Tu perfil también comunica marca.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))', gap: '8px', marginBottom: '14px' }}>
          {avatarData?.presets?.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setPresetAvatarId(preset.id)}
              style={{
                borderRadius: '10px',
                border: presetAvatarId === preset.id ? '1px solid #FF6A00' : '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.03)',
                padding: '8px',
                cursor: 'pointer',
              }}
              title={preset.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preset.image_url} alt={preset.name} style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '999px', objectFit: 'cover' }} />
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '12px' }}>
          <label style={labelStyle}>URL de avatar personalizado</label>
          <input
            value={customAvatarUrl}
            onChange={(e) => setCustomAvatarUrl(e.target.value)}
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        <button
          type="button"
          onClick={saveAvatar}
          disabled={saving}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            color: '#FFFFFF',
            background: saving
              ? 'rgba(255,255,255,0.1)'
              : 'linear-gradient(135deg, #FF6A00, #E05A00)',
          }}
        >
          {saving ? 'Guardando avatar...' : 'Guardar avatar'}
        </button>
      </div>
    </div>
  );
}
