import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const maxDuration = 60;

export async function GET(request: Request) {
  // Seguridad: solo Vercel Cron (o quien tenga el secret)
  const auth = request.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const apiKey = process.env.PAGESPEED_API_KEY;
  const user = await prisma.user.findUnique({ where: { email: 'demo@seopilot.app' } });
  if (!apiKey || !user) {
    return NextResponse.json({ error: 'Configuración incompleta (key o usuario)' }, { status: 500 });
  }

  // Elegir el sitio con la auditoría más antigua (o sin auditorías)
  const websites = await prisma.website.findMany({
    include: { audits: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });
  if (websites.length === 0) {
    return NextResponse.json({ message: 'No hay sitios web' });
  }
  websites.sort((a, b) => {
    const da = a.audits[0]?.createdAt ?? new Date(0);
    const db = b.audits[0]?.createdAt ?? new Date(0);
    return da.getTime() - db.getTime();
  });
  const website = websites[0];

  try {
    const target = website.domain.startsWith('http')
      ? website.domain
      : `https://${website.domain}`;
    const psiUrl =
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` +
      `?url=${encodeURIComponent(target)}` +
      `&key=${apiKey}` +
      `&strategy=mobile` +
      `&category=performance&category=seo&category=accessibility&category=best-practices`;

    const psiRes = await fetch(psiUrl);
    if (!psiRes.ok) {
      return NextResponse.json({ error: 'PageSpeed rechazó la petición' }, { status: 502 });
    }
    const data = await psiRes.json();
    const cats = data.lighthouseResult?.categories ?? {};
    const pct = (x?: number) => Math.round((x ?? 0) * 100);
    const perf = pct(cats.performance?.score);
    const seo = pct(cats.seo?.score);
    const acc = pct(cats.accessibility?.score);
    const bp = pct(cats['best-practices']?.score);
    const overall = Math.round((perf + seo + acc + bp) / 4);
    const sev = (s: number) => (s >= 90 ? 'info' : s >= 50 ? 'warning' : 'critical');

    await prisma.audit.create({
      data: {
        websiteId: website.id,
        userId: user.id,
        score: overall,
        status: overall >= 90 ? 'completed' : 'warning',
        checks: {
          create: [
            { type: 'performance', severity: sev(perf), status: 'completed', message: `Rendimiento: ${perf}/100` },
            { type: 'seo', severity: sev(seo), status: 'completed', message: `SEO: ${seo}/100` },
            { type: 'accessibility', severity: sev(acc), status: 'completed', message: `Accesibilidad: ${acc}/100` },
            { type: 'best-practices', severity: sev(bp), status: 'completed', message: `Buenas prácticas: ${bp}/100` },
          ],
        },
      },
    });
    await prisma.website.update({ where: { id: website.id }, data: { score: overall } });

    return NextResponse.json({ audited: website.domain, score: overall });
  } catch (error) {
    console.error('Error en cron de auditorías:', error);
    return NextResponse.json({ error: 'Error al auditar' }, { status: 500 });
  }
}