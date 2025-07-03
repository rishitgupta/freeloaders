import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Get the `reqId` from the query parameters
        const reqId = request.nextUrl.searchParams.get('reqId');
        
        if (!reqId) {
            return NextResponse.json({ error: 'Missing reqId parameter' }, { status: 400 });
        }

        console.log('getting organization from prisma');

        // Fetch the organization by ID from Prisma
        const organization = await prisma.organization.findUnique({ 
            where: { id: Number(reqId) }, // Make sure reqId is a number
        });

        if (!organization) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        // Return the organization data
        return NextResponse.json(organization, { status: 200 });
    } catch (error) {
        console.error('Error getting organization:', error);
        return NextResponse.json({ error: 'Failed to get organization' }, { status: 500 });
    }
}