import type { CommunityMember, Video } from '@/lib/community/types';
import type { Beta } from '@/lib/community/betas';

export const mockMembers: CommunityMember[] = [
  {
    id: 'mock-member-1',
    clerk_user_id: 'mock-clerk-1',
    email: 'sofia@brandwave.ai',
    name: 'Sofia Duarte',
    company: 'BrandWave',
    job_title: 'CMO',
    country: 'Argentina',
    linkedin_url: null,
    bio: 'Lidero growth y marca para productos SaaS B2B.',
    points: 1240,
    level: 'embajador',
    invite_code_used: null,
    is_founder: true,
    is_active: true,
    created_at: '2026-03-01T10:00:00.000Z',
    updated_at: '2026-04-01T10:00:00.000Z',
    avatar_url: null,
    preset_avatar_id: null,
  },
  {
    id: 'mock-member-2',
    clerk_user_id: 'mock-clerk-2',
    email: 'martin@retailnova.com',
    name: 'Martin Borda',
    company: 'RetailNova',
    job_title: 'Marketing Director',
    country: 'Mexico',
    linkedin_url: null,
    bio: 'Escalando adquisicion omnicanal en retail.',
    points: 680,
    level: 'referente',
    invite_code_used: null,
    is_founder: false,
    is_active: true,
    created_at: '2026-03-05T10:00:00.000Z',
    updated_at: '2026-04-02T10:00:00.000Z',
    avatar_url: null,
    preset_avatar_id: null,
  },
  {
    id: 'mock-member-3',
    clerk_user_id: 'mock-clerk-3',
    email: 'valen@horizonpay.io',
    name: 'Valentina Pardo',
    company: 'HorizonPay',
    job_title: 'Head of Growth',
    country: 'Chile',
    linkedin_url: null,
    bio: 'ABM + contenido para expansion regional.',
    points: 460,
    level: 'visible',
    invite_code_used: null,
    is_founder: false,
    is_active: true,
    created_at: '2026-03-07T10:00:00.000Z',
    updated_at: '2026-04-03T10:00:00.000Z',
    avatar_url: null,
    preset_avatar_id: null,
  },
];

export const mockBetas: Beta[] = [
  {
    id: 'mock-beta-1',
    name: 'Radar de Tendencias GEO',
    description: 'Detecta consultas emergentes y marcas citadas por categoria en 48h.',
    status: 'open',
    max_testers: 120,
    current_count: 77,
    launch_date: '2026-04-30T00:00:00.000Z',
    order_index: 1,
    created_at: '2026-03-10T00:00:00.000Z',
    user_access_status: null,
  },
  {
    id: 'mock-beta-2',
    name: 'Comparador de Share of Voice IA',
    description: 'Benchmark semanal por pais, industria y competidor.',
    status: 'waitlist',
    max_testers: 80,
    current_count: 80,
    launch_date: '2026-05-15T00:00:00.000Z',
    order_index: 2,
    created_at: '2026-03-14T00:00:00.000Z',
    user_access_status: 'waitlist',
  },
  {
    id: 'mock-beta-3',
    name: 'Planner de Contenido LLMO',
    description: 'Sugiere experimentos de contenido con foco en citabilidad.',
    status: 'soon',
    max_testers: null,
    current_count: 0,
    launch_date: '2026-06-01T00:00:00.000Z',
    order_index: 3,
    created_at: '2026-03-18T00:00:00.000Z',
    user_access_status: null,
  },
];

export const mockVideos: Video[] = [
  {
    id: 'mock-video-1',
    title: 'Framework CMO para ganar visibilidad en IA',
    description: 'Checklist de 30 minutos para priorizar iniciativas.',
    category: 'estrategia',
    level: 'intro',
    duration_min: 24,
    vimeo_id: null,
    thumbnail_url: null,
    order_index: 1,
    is_published: true,
    created_at: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 'mock-video-2',
    title: 'AEO aplicado a landing pages de alto intent',
    description: 'Mejores practicas con casos en LatAm.',
    category: 'aeo',
    level: 'intermedio',
    duration_min: 31,
    vimeo_id: null,
    thumbnail_url: null,
    order_index: 2,
    is_published: true,
    created_at: '2026-03-05T00:00:00.000Z',
  },
  {
    id: 'mock-video-3',
    title: 'Playbook GEO para equipos de growth',
    description: 'Como instrumentar senales y medir avances por sprint.',
    category: 'geo',
    level: 'avanzado',
    duration_min: 42,
    vimeo_id: null,
    thumbnail_url: null,
    order_index: 3,
    is_published: true,
    created_at: '2026-03-09T00:00:00.000Z',
  },
];

export interface MockConversationThread {
  id: string;
  title: string;
  trend: string;
  participants: number;
  messages: Array<{
    id: string;
    author: string;
    role: 'cmo' | 'growth' | 'brand' | 'product';
    at: string;
    body: string;
  }>;
}

export const mockConversationThreads: MockConversationThread[] = [
  {
    id: 'thread-1',
    title: 'Sube interes por "agentes de marca" en buscadores IA',
    trend: 'Search Trend +42% WoW',
    participants: 12,
    messages: [
      {
        id: 't1-m1',
        author: 'Sofia Duarte',
        role: 'cmo',
        at: '09:10',
        body: 'Vimos aumento fuerte en consultas de comparacion. ¿Alguien ya ajusto paginas de categoria?',
      },
      {
        id: 't1-m2',
        author: 'Nico Saez',
        role: 'growth',
        at: '09:16',
        body: 'Nos funciono agregar bloques de evidencia + FAQs con lenguaje mas directo.',
      },
      {
        id: 't1-m3',
        author: 'Flor Ares',
        role: 'brand',
        at: '09:21',
        body: 'Tambien mejoro cuando alineamos tono de marca en respuestas largas y snippets.',
      },
    ],
  },
  {
    id: 'thread-2',
    title: 'Benchmark ecommerce: cae CTR en creatives genericos',
    trend: 'CTR -18% en 3 industrias',
    participants: 9,
    messages: [
      {
        id: 't2-m1',
        author: 'Martin Borda',
        role: 'growth',
        at: '11:04',
        body: 'Probamos piezas con prueba social por vertical y el CTR recupero 11%.',
      },
      {
        id: 't2-m2',
        author: 'Lucia Rey',
        role: 'product',
        at: '11:12',
        body: 'Clave segmentar por nivel de conocimiento, no solo por interes.',
      },
    ],
  },
];
