import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { organizationName, organizationEmail, contactPerson, password, confirmPassword, description } = await request.json();

    // Validate the inputs
    if (!organizationName || !organizationEmail || !contactPerson || !password || !confirmPassword || !description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Ensure passwords match
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // Check if the organization email already exists
    const existingOrganization = await prisma.organization.findFirst({
      where: {
        organization_email: organizationEmail,
      },
    });

    if (existingOrganization) {
      return NextResponse.json({ error: "Email is already in use" }, { status: 409 });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new organization in the database
    const newOrganization = await prisma.organization.create({
      data: {
        display_name: organizationName,
        organization_email: organizationEmail,
        point_of_contact: contactPerson,
        password: hashedPassword,
        description,
        profile_photo: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",  // Default profile picture
        cover_photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbpy2tMwk5uP2_cyuU4TTb-780DKGCx4Wp4g&s",  // Default cover photo
      },
    });

    // Return the new organization object (omit password for security)
    return NextResponse.json({
      organization: {
        id: newOrganization.id,
        display_name: newOrganization.display_name,
        organization_email: newOrganization.organization_email,
      },
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
