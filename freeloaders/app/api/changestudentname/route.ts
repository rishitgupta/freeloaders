import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
    try {
        const { id, newName } = await request.json();

        if (!id || !newName) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const updatedStudent = await prisma.student.update({
            where: { id: Number(id) },
            data: { display_name: newName },
        });

        return NextResponse.json(updatedStudent, { status: 200 });
    } catch (error) {
        console.error('Error updating student name:', error);
        return NextResponse.json({ error: 'Failed to update student name' }, { status: 500 });
    }
}
