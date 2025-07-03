import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { User } from './types/user';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
let user: User | null = null;

const authOptions = {
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // Find user by email in the student table first
        const student = await prisma.student.findFirst({
          where: { calpoly_email: credentials.email },
        });

        if (student) {
          // Compare the hashed password stored in DB with the entered password
          const isValid = await bcrypt.compare(credentials.password, student.password);
          if (isValid) {
            return {
              id: student.id,
              email: student.calpoly_email,
              display_name: student.display_name,
              profile_photo: student.profile_photo,
              role: "student",
            };
          }
        } else {
          // If not a student, check if it's an organization
          const organization = await prisma.organization.findFirst({
            where: { organization_email: credentials.email },
          });

          if (organization) {
            const isValid = await bcrypt.compare(credentials.password, organization.password);
            if (isValid) {
              return {
                id: organization.id,
                email: organization.organization_email,
                display_name: organization.display_name,
                profile_photo: organization.profile_photo,
                role: "organization",
              };
            }
          }
        }
        // If no valid user or password mismatch, return null
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id; 
      }
      if (token?.role) {
        session.user.role = token.role; 
      }  
      if (token?.email) {
        session.user.email = token.email; 
      }
      if (token?.display_name) {
        session.user.display_name = token.display_name; 
      }
      if (token?.profile_photo) {
        session.user.profile_photo = token.profile_photo; 
      }
  
      return session;
    },
    
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
        token.role = user.role; 
        token.email = user.email;
        token.display_name = user.display_name;
        token.profile_photo = user.profile_photo;
      }
      return token;
    },
  },  
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
