import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
    try {
        const { id, newDescription } = await request.json();

        if (!id || !newDescription) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const updatedOrg = await prisma.organization.update({
            where: { id: Number(id) },
            data: { description: newDescription },
        });

        return NextResponse.json(updatedOrg, { status: 200 });
    } catch (error) {
        console.error('Error updating organization description:', error);
        return NextResponse.json({ error: 'Failed to update organization description' }, { status: 500 });
    }
}