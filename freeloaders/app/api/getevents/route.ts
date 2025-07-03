import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        console.log('getting events from prisma');
        const events = await prisma.event.findMany({ 
            include: { 
                organization: true, 
                comments: {
                    include: {
                        student: true
                    }
                }
            }
        });
        
        // debugging 
        // console.log(events);
        
        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error('Error getting events:', error);
        return NextResponse.json({ error: 'Failed to get events' }, { status: 500 });
    }
}
