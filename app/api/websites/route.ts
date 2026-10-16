import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Obtener todos los sitios web
export async function GET() {
  try {
    const websites = await prisma.website.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(websites);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener sitios' }, { status: 500 });
  }
}

// POST: Crear un nuevo sitio web
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, domain, country } = body;

    const website = await prisma.website.create({
      data: {
        name,
        domain,
        country,
        user: { connect: { email: 'demo@seopilot.app' } },
      },
    });

    return NextResponse.json(website);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear sitio' }, { status: 500 });
  }
}

// DELETE: Eliminar un sitio web
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.website.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}