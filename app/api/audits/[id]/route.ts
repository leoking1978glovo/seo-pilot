import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const audit = await prisma.audit.findUnique({
      where: { id },
      include: { website: true, checks: true },
    });
    if (!audit) {
      return NextResponse.json({ error: 'Auditoría no encontrada' }, { status: 404 });
    }
    return NextResponse.json(audit);
  } catch {
    return NextResponse.json({ error: 'Error al obtener auditoría' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.audit.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar auditoría' }, { status: 500 });
  }
}