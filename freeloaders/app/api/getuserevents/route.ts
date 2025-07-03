import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch events specific to a user by userId
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Check if userId is provided
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const current_time = new Date().toISOString();

    // Fetch events linked to the user's organization
    const userEvents = await prisma.event.findMany({
      where: {
        organizationId: parseInt(userId), 
        // end_time: {
        //   gte: current_time, 
        // },
      },
      orderBy: {
        start_time: 'asc',
      },
    });

    return NextResponse.json(userEvents, { status: 200 });
  } catch (error) {
    console.error('Error fetching user-specific events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}
