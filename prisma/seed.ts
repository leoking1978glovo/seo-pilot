import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Crear usuario demo
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

  // Crear sitios web de ejemplo
  const sites = [
    { name: 'Tienda TechGear', domain: 'tienda.ejemplo.com', country: 'ES', score: 78 },
    { name: 'Blog de Viajes Wanderlust', domain: 'blog.viajes.com', country: 'MX', score: 85 },
    { name: 'Clínica Dental Sonrisas', domain: 'clinicadental.sonrisas.com', country: 'ES', score: 92 },
    { name: 'SaaSFlow B2B', domain: 'app.saasflow.io', country: 'ES', score: 70 },
  ];

  for (const site of sites) {
    await prisma.website.upsert({
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
  }

  console.log('✅ 4 sitios web creados');
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