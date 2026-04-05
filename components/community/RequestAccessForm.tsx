'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';

type Mode = 'invite' | 'request';

interface Props {
  theme?: 'dark' | 'light';
}

const PENDING_KEY = 'fardo_pending_invite';

export function RequestAccessForm({ theme = 'dark' }: Props) {
  const { isSignedIn, isLoaded } = useAuth();
  const [mode, setMode] = useState<Mode>('invite');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const autoSubmitted = useRef(false);

  const [form, setForm] = useState({
    code: '',
    email: '',
    name: '',
    company: '',
    jobTitle: '',
    country: '',
    linkedinUrl: '',
  });

  // When signed in, check for pending invite data and auto-submit
  useEffect(() => {
    if (!isLoaded || !isSignedIn || autoSubmitted.current) return;
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return;
    try {
      const pending = JSON.parse(raw);
      sessionStorage.removeItem(PENDING_KEY);
      autoSubmitted.current = true;
      setMode('invite');
      setForm((prev) => ({ ...prev, ...pending }));
      // Small delay so state is set before submit
      setTimeout(() => submitJoin(pending), 100);
    } catch {
      sessionStorage.removeItem(PENDING_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submitJoin(data: typeof form) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/community/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: data.code,
          email: data.email,
          name: data.name,
          company: data.company,
          jobTitle: data.jobTitle,
          country: data.country,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Ocurrió un error. Intenta de nuevo.');
      } else {
        setSuccess(true);
        setTimeout(() => { window.location.href = '/comunidad'; }, 1500);
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (mode === 'request') {
      setLoading(true);
      try {
        const res = await fetch('/api/community/request-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            name: form.name,
            company: form.company,
            jobTitle: form.jobTitle,
            country: form.country,
            linkedinUrl: form.linkedinUrl,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? 'Ocurrió un error. Intenta de nuevo.');
        } else {
          setSuccess(true);
        }
      } catch {
        setError('Error de conexión. Intenta de nuevo.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Invite code flow: requires authentication
    if (!isSignedIn) {
      // Save form data and redirect to sign-in/sign-up
      sessionStorage.setItem(PENDING_KEY, JSON.stringify({
        code: form.code,
        email: form.email,
        name: form.name,
        company: form.company,
        jobTitle: form.jobTitle,
        country: form.country,
      }));
      window.location.href = '/sign-up';
      return;
    }

    await submitJoin(form);
  }

  const isLight = theme === 'light';

  const inputStyle: React.CSSProperties = isLight
    ? {
        width: '100%',
        background: '#F9F9F9',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '14px',
        color: '#0A0A0A',
        outline: 'none',
      }
    : {
        width: '100%',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '14px',
        color: '#FFFFFF',
        outline: 'none',
      };

  const labelStyle: React.CSSProperties = isLight
    ? {
        display: 'block',
        fontSize: '12px',
        fontWeight: 500,
        color: '#666',
        marginBottom: '6px',
        letterSpacing: '0.03em',
      }
    : {
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
          background: isLight ? '#F5F5F5' : 'rgba(255,255,255,0.03)',
          border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
        <p style={{ fontSize: '16px', fontWeight: 600, color: isLight ? '#0A0A0A' : '#FFFFFF', marginBottom: '8px' }}>
          {mode === 'invite' ? '¡Bienvenido a la comunidad!' : '¡Solicitud recibida!'}
        </p>
        <p style={{ fontSize: '14px', color: isLight ? '#666' : 'rgba(255,255,255,0.5)' }}>
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
        background: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.03)',
        border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '28px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: isLight ? '0 4px 24px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {/* Mode toggle */}
      <div
        style={{
          display: 'flex',
          background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
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
              background: mode === m
                ? (isLight ? '#FFFFFF' : 'rgba(255,255,255,0.1)')
                : 'transparent',
              color: mode === m
                ? (isLight ? '#0A0A0A' : '#FFFFFF')
                : (isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)'),
              boxShadow: mode === m && isLight ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
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
          <p style={{ fontSize: '13px', color: '#D44A30', background: isLight ? 'rgba(212,74,48,0.08)' : 'rgba(220,80,50,0.1)', borderRadius: '6px', padding: '8px 12px' }}>
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
            background: loading
              ? (isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.1)')
              : 'linear-gradient(135deg, #D44A30, #C27A28)',
            transition: 'opacity 0.15s',
          }}
        >
          {loading
            ? 'Procesando...'
            : mode === 'invite'
            ? (isSignedIn ? 'Acceder a la comunidad' : 'Continuar con el código →')
            : 'Enviar solicitud'}
        </button>

        {mode === 'invite' && !isSignedIn && isLoaded && (
          <p style={{ fontSize: '12px', color: isLight ? '#999' : 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
            Te vamos a pedir que crees tu cuenta antes de ingresar.{' '}
            <a href="/sign-in" style={{ color: '#D44A30', textDecoration: 'none' }}>
              ¿Ya tenés cuenta?
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
