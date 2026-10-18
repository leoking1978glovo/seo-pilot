import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const websites = await prisma.website.findMany();
    const websiteMap = new Map(websites.map(w => [w.id, w]));

    const keywordsWithWebsite = keywords.map(k => ({
      ...k,
      website: websiteMap.get(k.websiteId),
    }));

    return NextResponse.json(keywordsWithWebsite);
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