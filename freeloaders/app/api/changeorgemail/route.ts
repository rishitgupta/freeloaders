import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; 

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
    const { id, newEmail, password } = await request.json();

    // Validation checks for missing fields
    if (!newEmail || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(newEmail)) {
        return NextResponse.json({ error: 'Please enter a valid email' }, { status: 400 });
    }
    
    try {
        // Fetch the user's current password hash from the database
        const user = await prisma.organization.findFirst({
            where: { id: id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const uniqueEmail = await prisma.organization.findFirst({
          where: { organization_email: newEmail }, 
        });

        if (uniqueEmail) {
          return NextResponse.json({ error: 'Email already in use.' }, { status: 409 });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 403 });
        }

        // Proceed with updating the email
        const updatedUser = await prisma.organization.update({
            where: { id: Number(id) }, 
            data: { organization_email: newEmail},
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Error updating email:', error);
        return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
    }
}