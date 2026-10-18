import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes (en orden inverso de dependencias)
  await prisma.keywordHistory.deleteMany({});
  await prisma.keyword.deleteMany({});
  await prisma.auditCheck.deleteMany({});
  await prisma.audit.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.website.deleteMany({});
  await prisma.user.deleteMany({});

  console.log(' Datos anteriores eliminados');

  // Crear usuario demo
  const hashedPassword = await bcrypt.hash('demo1234', 12);

  const user = await prisma.user.create({
    data: {
      email: 'demo@seopilot.app',
      name: 'Usuario Demo',
      password: hashedPassword,
    },
  });

  console.log('✅ Usuario demo creado:', user.email);

  // Crear sitios web de ejemplo
  const sites = [
    { name: 'Tienda TechGear', domain: 'tienda.ejemplo.com', country: 'ES', score: 78 },
    { name: 'Blog de Viajes Wanderlust', domain: 'blog.viajes.com', country: 'MX', score: 85 },
    { name: 'Clínica Dental Sonrisas', domain: 'clinicadental.sonrisas.com', country: 'ES', score: 92 },
    { name: 'SaaSFlow B2B', domain: 'app.saasflow.io', country: 'ES', score: 70 },
  ];

  const createdSites = [];
  for (const site of sites) {
    const s = await prisma.website.create({
      data: {
        name: site.name,
        domain: site.domain,
        country: site.country,
        score: site.score,
        userId: user.id,
      },
    });
    createdSites.push(s);
  }

  console.log('✅ 4 sitios web creados');

  // Crear auditorías de ejemplo
  const audits = [
    { websiteId: createdSites[0].id, score: 78, status: 'completed' },
    { websiteId: createdSites[1].id, score: 85, status: 'completed' },
    { websiteId: createdSites[2].id, score: 92, status: 'completed' },
    { websiteId: createdSites[3].id, score: 70, status: 'warning' },
  ];

  for (const audit of audits) {
    await prisma.audit.create({
      data: {
        websiteId: audit.websiteId,
        userId: user.id,
        score: audit.score,
        status: audit.status,
      },
    });
  }

  console.log('✅ 4 auditorías creadas');

  // Crear keywords de ejemplo
  const keywordsData = [
    { websiteId: createdSites[0].id, term: 'tienda de tecnología', position: 3, volume: 12000, difficulty: 45 },
    { websiteId: createdSites[0].id, term: 'comprar gadgets online', position: 7, volume: 8500, difficulty: 60 },
    { websiteId: createdSites[1].id, term: 'blog de viajes', position: 2, volume: 22000, difficulty: 70 },
    { websiteId: createdSites[1].id, term: 'destinos turísticos 2026', position: 5, volume: 15000, difficulty: 55 },
    { websiteId: createdSites[2].id, term: 'clínica dental', position: 1, volume: 18000, difficulty: 80 },
    { websiteId: createdSites[3].id, term: 'software B2B', position: 12, volume: 9500, difficulty: 90 },
  ];

  for (const kw of keywordsData) {
    await prisma.keyword.create({ data: kw });
  }

  console.log('✅ 6 keywords creadas');

  // Crear informes de ejemplo
  const reportsData = [
    {
      userId: user.id,
      title: 'Análisis SEO Q4 2026',
      content: 'El rendimiento SEO ha mejorado un 15% respecto al trimestre anterior. Las keywords principales muestran posiciones estables en el top 10.',
    },
    {
      userId: user.id,
      title: 'Auditoría Técnica - Diciembre',
      content: 'Se identificaron 4 errores críticos de indexación y 12 problemas de velocidad de carga. Se recomienda priorizar la optimización de imágenes.',
    },
    {
      userId: user.id,
      title: 'Estrategia de Contenidos 2027',
      content: 'Propuesta de creación de 24 artículos optimizados para keywords de larga cola con volumen medio-alto. Enfoque en contenido evergreen.',
    },
  ];

  for (const report of reportsData) {
    await prisma.report.create({ data: report });
  }

  console.log('✅ 3 informes creados');
  console.log('🎉 Seed completado!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });