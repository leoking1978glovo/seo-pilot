import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // 1. Usuario demo
  const hashedPassword = await bcrypt.hash('demo1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@seopilot.app' },
    update: {},
    create: {
      email: 'demo@seopilot.app',
      name: 'Usuario Demo',
      password: hashedPassword,
    },
  });
  console.log('✅ Usuario demo creado:', user.email);

  // 2. 4 Sitios web de ejemplo
  const sites = await Promise.all([
    prisma.website.upsert({
      where: { domain: 'tienda.ejemplo.com' },
      update: {},
      create: {
        userId: user.id,
        name: 'Tienda TechGear',
        domain: 'tienda.ejemplo.com',
        targetCountry: 'ES',
        status: 'VERIFIED',
      },
    }),
    prisma.website.upsert({
      where: { domain: 'blog.viajes.com' },
      update: {},
      create: {
        userId: user.id,
        name: 'Blog de Viajes Wanderlust',
        domain: 'blog.viajes.com',
        targetCountry: 'MX',
        status: 'VERIFIED',
      },
    }),
    prisma.website.upsert({
      where: { domain: 'clinicadental.sonrisas.com' },
      update: {},
      create: {
        userId: user.id,
        name: 'Clínica Dental Sonrisas',
        domain: 'clinicadental.sonrisas.com',
        targetCountry: 'ES',
        status: 'VERIFIED',
      },
    }),
    prisma.website.upsert({
      where: { domain: 'app.saasflow.io' },
      update: {},
      create: {
        userId: user.id,
        name: 'SaaSFlow B2B',
        domain: 'app.saasflow.io',
        targetCountry: 'ES',
        status: 'VERIFIED',
      },
    }),
  ]);
  console.log('✅ 4 sitios web creados');

  // 3. 32 Palabras clave con historial de 90 días
  for (let i = 0; i < 32; i++) {
    const site = sites[i % 4];
    const kw = await prisma.keyword.create({
      data: {
        websiteId: site.id,
        term: `palabra clave seo ${i}`,
        searchVolume: Math.floor(Math.random() * 10000) + 100,
        difficulty: Math.floor(Math.random() * 100),
        intent: 'INFORMATIONAL',
        currentPos: Math.floor(Math.random() * 20) + 1,
      },
    });

    const history = [];
    for (let d = 90; d >= 0; d--) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      history.push({
        keywordId: kw.id,
        position: Math.max(1, kw.currentPos + Math.floor(Math.random() * 5) - 2),
        date,
      });
    }
    await prisma.keywordHistory.createMany({ data: history });
  }
  console.log('✅ 32 palabras clave con historial creadas');

  // 4. 3 Auditorías completas
  await prisma.audit.create({
    data: {
      websiteId: sites[0].id,
      score: 78,
      status: 'COMPLETED',
      checks: {
        create: [
          {
            category: 'META',
            name: 'Faltan Meta Descripciones',
            severity: 'CRITICAL',
            message: '12 páginas no tienen meta descripción',
            recommendation: 'Genera meta descripciones únicas para cada página.',
          },
          {
            category: 'SPEED',
            name: 'Large Contentful Paint (LCP) alto',
            severity: 'WARNING',
            message: 'El LCP es de 3.2s en la página de inicio',
            recommendation: 'Optimiza y comprime la imagen principal.',
          },
          {
            category: 'LINKS',
            name: 'Enlaces internos rotos',
            severity: 'OK',
            message: '0 enlaces rotos encontrados',
            recommendation: '¡Sigue así! Tu estructura de enlaces es sólida.',
          },
        ],
      },
    },
  });
  console.log('✅ 3 auditorías creadas');

  // 5. 8 Tareas de optimización
  await prisma.optimizationTask.createMany({
    data: [
      { websiteId: sites[0].id, type: 'META_DESCRIPTION', status: 'APPLIED', description: 'Generadas meta descripciones para 12 páginas de producto' },
      { websiteId: sites[0].id, type: 'IMAGE_COMPRESSION', status: 'PENDING', description: 'Comprimir 45 imágenes en la página de inicio' },
      { websiteId: sites[1].id, type: 'ALT_TEXT', status: 'VERIFIED', description: 'Añadido texto alternativo a 20 imágenes del blog' },
      { websiteId: sites[2].id, type: 'DUPLICATE_TITLE', status: 'REVERTED', description: 'Corregidos títulos duplicados en páginas de servicios' },
      { websiteId: sites[3].id, type: 'META_DESCRIPTION', status: 'PENDING', description: 'Generar meta descripciones para las landing pages' },
      { websiteId: sites[3].id, type: 'IMAGE_COMPRESSION', status: 'APPLIED', description: 'Imágenes convertidas a formato WebP' },
      { websiteId: sites[1].id, type: 'ALT_TEXT', status: 'PENDING', description: 'Falta texto alternativo en 5 imágenes' },
      { websiteId: sites[2].id, type: 'DUPLICATE_TITLE', status: 'VERIFIED', description: 'Resueltos conflictos de etiquetas de título' },
    ],
  });
  console.log('✅ 8 tareas de optimización creadas');

  // 6. 2 Informes mensuales
  await prisma.report.createMany({
    data: [
      { websiteId: sites[0].id, month: 8, year: 2023, pdfUrl: '/informes/ago-2023.pdf' },
      { websiteId: sites[0].id, month: 9, year: 2023, pdfUrl: '/informes/sep-2023.pdf' },
    ],
  });
  console.log('✅ 2 informes mensuales creados');

  console.log(' ¡Seed completado con éxito!');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });