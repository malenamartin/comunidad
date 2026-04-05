'use client';

import { useState } from 'react';

type Mode = 'invite' | 'request';

export function RequestAccessForm() {
  const [mode, setMode] = useState<Mode>('invite');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    code: '',
    email: '',
    name: '',
    company: '',
    jobTitle: '',
    country: '',
    linkedinUrl: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'invite' ? '/api/community/join' : '/api/community/request-access';
      const body =
        mode === 'invite'
          ? { code: form.code, email: form.email, name: form.name, company: form.company, jobTitle: form.jobTitle, country: form.country }
          : { email: form.email, name: form.name, company: form.company, jobTitle: form.jobTitle, country: form.country, linkedinUrl: form.linkedinUrl };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Ocurrió un error. Intenta de nuevo.');
      } else {
        setSuccess(true);
        if (mode === 'invite') {
          // Redirect to app after role assignment
          setTimeout(() => { window.location.href = '/comunidad'; }, 1500);
        }
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#FFFFFF',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '6px',
    letterSpacing: '0.03em',
  };

  if (success) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '32px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
        <p style={{ fontSize: '16px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
          {mode === 'invite' ? '¡Bienvenido a la comunidad!' : '¡Solicitud recibida!'}
        </p>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
          {mode === 'invite'
            ? 'Redirigiendo al feed...'
            : 'El equipo Fardo revisará tu solicitud y te contactará pronto.'}
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '28px',
        maxWidth: '480px',
        width: '100%',
      }}
    >
      {/* Mode toggle */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '3px',
          marginBottom: '24px',
        }}
      >
        {(['invite', 'request'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: '7px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              background: mode === m ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: mode === m ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.15s',
            }}
          >
            {m === 'invite' ? 'Tengo un código' : 'Solicitar acceso'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {mode === 'invite' && (
          <div>
            <label style={labelStyle}>Código de invitación *</label>
            <input
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="FARDO-CMO-ARG-001"
              required
              style={{ ...inputStyle, letterSpacing: '0.08em', textTransform: 'uppercase' }}
            />
          </div>
        )}

        <div>
          <label style={labelStyle}>Nombre completo *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" required style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@empresa.com" required style={inputStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Empresa</label>
            <input name="company" value={form.company} onChange={handleChange} placeholder="Acme Inc." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Cargo</label>
            <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="CMO" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>País</label>
          <input name="country" value={form.country} onChange={handleChange} placeholder="Argentina" style={inputStyle} />
        </div>

        {mode === 'request' && (
          <div>
            <label style={labelStyle}>LinkedIn</label>
            <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="linkedin.com/in/tu-perfil" style={inputStyle} />
          </div>
        )}

        {error && (
          <p style={{ fontSize: '13px', color: '#E07050', background: 'rgba(220,80,50,0.1)', borderRadius: '6px', padding: '8px 12px' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFFFFF',
            background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #D44A30, #C27A28)',
            transition: 'opacity 0.15s',
          }}
        >
          {loading
            ? 'Procesando...'
            : mode === 'invite'
            ? 'Acceder a la comunidad'
            : 'Enviar solicitud'}
        </button>
      </form>
    </div>
  );
}
