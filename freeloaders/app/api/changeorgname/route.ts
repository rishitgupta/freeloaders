import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
    try {
        const { id, newName } = await request.json();

        if (!id || !newName) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const updatedOrg = await prisma.organization.update({
            where: { id: Number(id) },
            data: { display_name: newName },
        });

        return NextResponse.json(updatedOrg, { status: 200 });
    } catch (error) {
        console.error('Error updating organization name:', error);
        return NextResponse.json({ error: 'Failed to update organization name' }, { status: 500 });
    }
}