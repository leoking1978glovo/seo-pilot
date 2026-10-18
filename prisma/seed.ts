import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario demo
  const hashedPassword = await bcrypt.hash('demo1234', 12);

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

  // Crear sitios web de ejemplo
  const sites = [
    { name: 'Tienda TechGear', domain: 'tienda.ejemplo.com', country: 'ES', score: 78 },
    { name: 'Blog de Viajes Wanderlust', domain: 'blog.viajes.com', country: 'MX', score: 85 },
    { name: 'Clínica Dental Sonrisas', domain: 'clinicadental.sonrisas.com', country: 'ES', score: 92 },
    { name: 'SaaSFlow B2B', domain: 'app.saasflow.io', country: 'ES', score: 70 },
  ];

  const createdSites = [];
  for (const site of sites) {
    const s = await prisma.website.upsert({
      where: { domain: site.domain },
      update: {},
      create: {
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