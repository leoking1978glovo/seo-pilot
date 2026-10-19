import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener informes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content } = body;

    const report = await prisma.report.create({
      data: {
        title,
        content,
        user: { connect: { email: 'demo@seopilot.app' } },
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear informe' }, { status: 500 });
  }
}