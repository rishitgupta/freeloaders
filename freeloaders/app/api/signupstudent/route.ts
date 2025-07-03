import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { display_name, email, password, confirmPassword } = await request.json();

    // Validate the inputs
    if (!display_name || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // Check if the student email already exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        calpoly_email: email,
      },
    });

    if (existingStudent) {
      return NextResponse.json({ error: "Email is already in use" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new student in the database
    const newStudent = await prisma.student.create({
      data: {
        display_name,
        calpoly_email : email,
        password: hashedPassword,
        profile_photo: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",  // Default profile picture
      },
    });

      return NextResponse.json({ student: { id: newStudent.id, username: newStudent.display_name, email: newStudent.calpoly_email } }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
