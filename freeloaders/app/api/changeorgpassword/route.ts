import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

const prisma = new PrismaClient();

// PUT request to change email
export async function PUT(request: NextRequest) {
    const { id, password, newPassword, confirmPassword } = await request.json(); // Get email and password from the request body

    // Validation checks for missing fields
    if (!newPassword || !password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (newPassword != confirmPassword) {
        return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 });
    }
    
    try {
        // Fetch the user's current password hash from the database
        const user = await prisma.organization.findFirst({
            where: { id: id }, // Find user by their ID
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Incorrect password' }, { status: 403 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Proceed with updating the email
        const updatedUser = await prisma.organization.update({
            where: { id: Number(id) }, 
            data: { password: hashedPassword },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Error updating password:', error);
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
}