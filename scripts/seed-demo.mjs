import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL');
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, {
  max: 1,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const firstNames = ['Sofi', 'Mauro', 'Paula', 'Nico', 'Carla', 'Juli', 'Marti', 'Luz', 'Fede', 'Bruno'];
const lastNames = ['Gomez', 'Lopez', 'Diaz', 'Ruiz', 'Perez', 'Silva', 'Acosta', 'Mendez', 'Sosa', 'Ibarra'];
const companies = ['Mercado Pulse', 'Andes Retail', 'Delta Foods', 'Nova Travel', 'Horizon Tech', 'Claro Media'];
const countries = ['Argentina', 'Mexico', 'Chile', 'Colombia', 'Peru', 'Uruguay'];
const postTypes = ['benchmark', 'beta', 'educacion', 'evento', 'discusion', 'anuncio'];
const videoCategories = ['aeo', 'geo', 'llmo', 'estrategia', 'casos', 'ecommerce'];
const trendTopics = [
  'Suben busquedas comparativas en IA',
  'Caida de CTR en ads genericos',
  'Mayor citacion de marcas con paginas de evidencia',
  'Aumento de consultas transaccionales en ecommerce',
  'Mejor rendimiento de creatividades con prueba social',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function chance(p) {
  return Math.random() < p;
}

async function seedMembers(target = 18) {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM community_members`;
  if (count >= target) return;

  const toCreate = target - count;
  for (let i = 0; i < toCreate; i += 1) {
    const name = `${pick(firstNames)} ${pick(lastNames)}`;
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}+demo${Date.now()}${i}@example.com`;
    await sql`
      INSERT INTO community_members (
        clerk_user_id, email, name, company, job_title, country, is_founder
      ) VALUES (
        ${`demo-user-${Date.now()}-${i}`},
        ${email},
        ${name},
        ${pick(companies)},
        ${chance(0.5) ? 'CMO' : 'Marketing Lead'},
        ${pick(countries)},
        ${chance(0.15)}
      )
    `;
  }
}

async function seedVideos(target = 12) {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM videos`;
  if (count >= target) return;

  const toCreate = target - count;
  for (let i = 0; i < toCreate; i += 1) {
    const category = pick(videoCategories);
    await sql`
      INSERT INTO videos (title, description, category, level, duration_min, order_index, is_published)
      VALUES (
        ${`Clase demo ${i + 1}: ${category.toUpperCase()} aplicado a CMO`},
        ${'Caso práctico con framework y checklist para implementar esta semana.'},
        ${category},
        ${pick(['intro', 'intermedio', 'avanzado'])},
        ${20 + Math.floor(Math.random() * 30)},
        ${i + 1},
        ${true}
      )
    `;
  }
}

async function seedPosts(target = 24) {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM posts`;
  if (count >= target) return;

  const members = await sql`SELECT id, name, company FROM community_members ORDER BY created_at ASC LIMIT 40`;
  if (!members.length) return;

  const toCreate = target - count;
  for (let i = 0; i < toCreate; i += 1) {
    const author = pick(members);
    const postType = pick(postTypes);
    const topic = pick(trendTopics);
    const bodyByType = {
      benchmark: `Dato de semana: ${topic}. Compartimos variacion por industria, implicancias y 2 acciones recomendadas para ejecutar en menos de 7 dias.`,
      beta: `Abrimos validacion controlada sobre: ${topic}. Buscamos equipos que quieran probar workflow y reportar resultados.`,
      educacion: `Mini playbook sobre ${topic}: como detectarlo, medir impacto y decidir la siguiente iteracion sin friccion.`,
      evento: `Vamos a conversar sobre ${topic} con casos reales de LatAm. Sumate con tus aprendizajes y preguntas.`,
      discusion: `¿Que estan viendo sobre ${topic}? Dejen contexto, metricas y que decidieron hacer esta semana.`,
      anuncio: `Actualizacion de comunidad: se prioriza ${topic} en contenidos, benchmarks y conversaciones de esta quincena.`,
    };
    const created = await sql`
      INSERT INTO posts (author_id, title, body, post_type, is_pinned, is_published)
      VALUES (
        ${author.id},
        ${`[${postType.toUpperCase()}] ${topic}`},
        ${bodyByType[postType]},
        ${postType},
        ${chance(0.12)},
        ${true}
      )
      RETURNING id
    `;

    const postId = created[0].id;
    const commentCount = 1 + Math.floor(Math.random() * 4);
    for (let c = 0; c < commentCount; c += 1) {
      const commenter = pick(members);
      await sql`
        INSERT INTO comments (post_id, author_id, body, is_published)
        VALUES (
          ${postId},
          ${commenter.id},
          ${pick([
            'Excelente punto. Nosotros vimos algo similar en campanas regionales.',
            'En nuestro caso mejoro cuando segmentamos por nivel de intencion.',
            '¿Tienen benchmark por pais? Estamos viendo diferencias fuertes.',
            'Probamos esta semana y nos dio resultado en CTR y conversion.',
          ])},
          true
        )
      `;
    }

    const reactionCount = 1 + Math.floor(Math.random() * 8);
    for (let r = 0; r < reactionCount; r += 1) {
      const reactor = pick(members);
      await sql`
        INSERT INTO reactions (post_id, member_id, reaction_type)
        VALUES (${postId}, ${reactor.id}, 'like')
        ON CONFLICT (post_id, member_id) DO NOTHING
      `;
    }
  }
}

async function seedBetas(target = 4) {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM betas`;
  if (count >= target) return;
  const toCreate = target - count;

  for (let i = 0; i < toCreate; i += 1) {
    await sql`
      INSERT INTO betas (name, description, status)
      VALUES (
        ${pick([
          'Radar GEO por industria',
          'Copilot de experimentos LLMO',
          'Alertas de visibilidad por competidor',
          'Editor de snippets citables',
        ])},
        ${'Acceso anticipado para validar hipotesis de adquisicion, posicionamiento y share de visibilidad.'},
        ${pick(['open', 'waitlist', 'soon'])}
      )
    `;
  }
}

async function seedEvents(target = 6) {
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM events`;
  if (count >= target) return;
  const toCreate = target - count;

  for (let i = 0; i < toCreate; i += 1) {
    const days = 4 + i * 3;
    await sql`
      INSERT INTO events (title, description, event_type, location, starts_at, price_members, is_published)
      VALUES (
        ${`CMO Session #${i + 1}`},
        ${'Sesión enfocada en visibilidad de marca en IA y experimentación en canales emergentes.'},
        ${pick(['online', 'presencial'])},
        ${pick(['Zoom', 'CABA', 'CDMX', 'Bogotá'])},
        ${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()},
        ${0},
        ${true}
      )
    `;
  }
}

async function run() {
  try {
    console.log('Seeding demo content...');
    await seedMembers();
    await seedVideos();
    await seedPosts();
    await seedBetas();
    await seedEvents();
    console.log('Done: demo content ready.');
  } finally {
    await sql.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
