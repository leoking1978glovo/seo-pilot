// Endpoint de auditoria real via PageSpeed Insights
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { websiteId } = body;

    const website = await prisma.website.findUnique({ where: { id: websiteId } });
    if (!website) {
      return NextResponse.json({ error: 'Sitio no encontrado' }, { status: 404 });
    }

    const apiKey = process.env.PAGESPEED_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'PAGESPEED_API_KEY no configurada' }, { status: 500 });
    }

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
      const errText = await psiRes.text();
      console.error('PageSpeed API error:', errText);
      return NextResponse.json({ error: 'Error al consultar PageSpeed Insights' }, { status: 502 });
    }

    const data = await psiRes.json();
    const cats = data.lighthouseResult?.categories ?? {};
    const pct = (x?: number) => Math.round((x ?? 0) * 100);

    const perf = pct(cats.performance?.score);
    const seo = pct(cats.seo?.score);
    const acc = pct(cats.accessibility?.score);
    const bp = pct(cats['best-practices']?.score);
    const overall = Math.round((perf + seo + acc + bp) / 4);
    const status = overall >= 90 ? 'completed' : 'warning';

    const sev = (score: number) => (score >= 90 ? 'info' : score >= 50 ? 'warning' : 'critical');

    const user = await prisma.user.findUnique({ where: { email: 'demo@seopilot.app' } });
    if (!user) {
      return NextResponse.json({ error: 'Usuario demo no encontrado' }, { status: 500 });
    }

    const audit = await prisma.audit.create({
      data: {
        websiteId,
        userId: user.id,
        score: overall,
        status,
        checks: {
          create: [
            { type: 'performance', severity: sev(perf), status: 'completed', message: `Rendimiento: ${perf}/100` },
            { type: 'seo', severity: sev(seo), status: 'completed', message: `SEO: ${seo}/100` },
            { type: 'accessibility', severity: sev(acc), status: 'completed', message: `Accesibilidad: ${acc}/100` },
            { type: 'best-practices', severity: sev(bp), status: 'completed', message: `Buenas prácticas: ${bp}/100` },
          ],
        },
      },
      include: { checks: true },
    });

    await prisma.website.update({
      where: { id: websiteId },
      data: { score: overall },
    });

    return NextResponse.json(audit);
  } catch (error) {
    console.error('Error en auditoría real:', error);
    return NextResponse.json({ error: 'Error al ejecutar auditoría' }, { status: 500 });
  }
}