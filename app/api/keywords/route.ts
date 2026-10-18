import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener todas las keywords
export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany({
      include: { website: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(keywords);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener keywords' }, { status: 500 });
  }
}

// POST: Crear una nueva keyword
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { websiteId, term, position, volume, difficulty } = body;

    const kw = await prisma.keyword.create({
      data: {
        websiteId,
        term,
        position: position || 0,
        volume: volume || 0,
        difficulty: difficulty || 0,
      },
    });

    return NextResponse.json(kw);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear keyword' }, { status: 500 });
  }
}