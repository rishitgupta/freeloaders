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

        console.log('getting student from prisma');

        // Fetch the student by ID from Prisma
        const student = await prisma.student.findUnique({ 
            where: { id: Number(reqId) }, // Make sure reqId is a number
        });

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        // Return the student data
        return NextResponse.json(student, { status: 200 });
    } catch (error) {
        console.error('Error getting student:', error);
        return NextResponse.json({ error: 'Failed to get student' }, { status: 500 });
    }
}
