import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener todas las auditorías
export async function GET() {
  try {
    const audits = await prisma.audit.findMany({
      include: { website: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(audits);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener auditorías' }, { status: 500 });
  }
}

// POST: Crear una nueva auditoría
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { websiteId, score, status } = body;

    const audit = await prisma.audit.create({
      data: {
        websiteId,
        score: score || 0,
        status: status || 'completed',
        user: { connect: { email: 'demo@seopilot.app' } },
      },
    });

    return NextResponse.json(audit);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear auditoría' }, { status: 500 });
  }
}