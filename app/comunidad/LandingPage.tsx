import { RequestAccessForm } from '@/components/community/RequestAccessForm';
import { BarChart2, BookOpen, Zap, Calendar, Users } from 'lucide-react';

const BENEFITS = [
  {
    icon: BarChart2,
    title: 'Benchmarks exclusivos',
    description:
      'Datos reales de Citation Rate, SOV y LLMO Score por industria y período. Comparate con las mejores marcas de LatAm.',
  },
  {
    icon: BookOpen,
    title: 'Academia privada',
    description:
      'Videos de AEO, GEO y LLMO pensados para CMOs y Brand Directors. Sin teoría vacía, puro impacto.',
  },
  {
    icon: Zap,
    title: 'Acceso anticipado a betas',
    description:
      'Probá antes que nadie las nuevas features de Fardo. Tu feedback moldea el producto.',
  },
  {
    icon: Calendar,
    title: 'Eventos y masterclasses',
    description:
      'Precios especiales para miembros y acceso a grabaciones. Presenciales, virtuales e híbridos en toda LatAm.',
  },
  {
    icon: Users,
    title: 'Directorio de pares',
    description:
      'Conectate con CMOs y Marketing Managers que están construyendo marcas visibles en la IA.',
  },
];

export function LandingPage() {
  return (
    <div style={{ color: '#FFFFFF' }}>
      {/* Header */}
      <header
        style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <span style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.03em' }}>
          far<span style={{ color: '#D44A30' }}>do</span>
        </span>
        <a
          href="/sign-in"
          style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
        >
          Ya soy miembro →
        </a>
      </header>

      {/* Hero */}
      <section
        style={{ position: 'relative', padding: '80px 24px 100px', textAlign: 'center', overflow: 'hidden' }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(212,74,48,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: '720px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(212,74,48,0.1)',
              border: '1px solid rgba(212,74,48,0.25)',
              borderRadius: '100px',
              padding: '6px 16px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#D44A30',
              letterSpacing: '0.05em',
              marginBottom: '28px',
            }}
          >
            ACCESO POR INVITACIÓN
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 6vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '20px',
            }}
          >
            La comunidad exclusiva donde las marcas
            <br />
            <span style={{ color: '#D44A30' }}>dejan de ser invisibles en la IA</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.6,
              maxWidth: '560px',
              margin: '0 auto 48px',
            }}
          >
            Benchmarks propietarios, academia privada y acceso anticipado a las herramientas que
            están redefiniendo cómo las marcas aparecen en ChatGPT, Perplexity y Google AI.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RequestAccessForm />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: 'clamp(22px, 3vw, 32px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          Lo que encontrás adentro
        </h2>
        <p
          style={{
            fontSize: '15px',
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center',
            marginBottom: '48px',
          }}
        >
          Solo para CMOs, Marketing Managers y Brand Directors de LatAm.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(212,74,48,0.12)',
                    border: '1px solid rgba(212,74,48,0.2)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <Icon size={18} color="#D44A30" />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', marginBottom: '8px' }}>
                  {benefit.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '24px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.25)',
          fontSize: '13px',
        }}
      >
        © 2026 Fardo. Comunidad exclusiva para líderes de marketing en LatAm.
      </footer>
    </div>
  );
}
