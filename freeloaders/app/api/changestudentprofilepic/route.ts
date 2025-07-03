import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
    try {
        const { id, newProfilePicture } = await request.json();

        if (!id || !newProfilePicture) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const updatedOrg = await prisma.student.update({
            where: { id: Number(id) },
            data: { profile_photo: newProfilePicture },
        });

        return NextResponse.json(updatedOrg, { status: 200 });
    } catch (error) {
        console.error('Error updating student profile picture:', error);
        return NextResponse.json({ error: 'Failed to update student profile picture' }, { status: 500 });
    }
}