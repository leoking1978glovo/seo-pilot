import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(keywords);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener keywords' }, { status: 500 });
  }
}

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