import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, email, password } = body;

    const updateData: any = { name, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar perfil' }, { status: 500 });
  }
}