import { NextResponse } from 'next/server'; 
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// *for creating a comment*
export async function POST(req: Request) {
    try {
      const { text, studentId, eventId } = await req.json();
      
      if (text.trim() == '') {
        return NextResponse.json({ error: "Please include text!" }, { status: 400} );
      }

      const newComment = await prisma.comment.create({
        data: {
          text: text.trim(),
          studentId: parseInt(studentId, 10),
          eventId: parseInt(eventId, 10)
        },
      });
  
      return NextResponse.json(newComment, { status: 200 });

    } catch (error) {
      console.error('Error adding comment:', error);
      return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
    }
  }