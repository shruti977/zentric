import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedPassword: string) {
  const [salt, storedHash] = storedPassword.split(":");
  if (!salt || !storedHash) return false;

  const calculatedHash = scryptSync(password, salt, 64);
  const storedHashBuffer = Buffer.from(storedHash, "hex");
  return (
    storedHashBuffer.length === calculatedHash.length &&
    timingSafeEqual(storedHashBuffer, calculatedHash)
  );
}

// Validate required env vars
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set");
}

if (!process.env.NEXTAUTH_URL) {
  throw new Error("NEXTAUTH_URL is not set");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        name: { label: "Name", type: "text" },
        password: { label: "Password", type: "password" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();
        const requestedName =
          typeof credentials.name === "string"
            ? credentials.name.trim().replace(/\s+/g, " ").slice(0, 50)
            : "";
        const password = credentials.password;
        const mode = credentials.mode === "signup" ? "signup" : "signin";

        if (
          !email.includes("@") ||
          password.length < 8 ||
          password.length > 128
        ) {
          return null;
        }

        try {
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (mode === "signup") {
            if (requestedName.length < 2) return null;
            if (existingUser?.passwordHash) return null;

            if (existingUser) {
              return prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  name: requestedName,
                  passwordHash: hashPassword(password),
                },
              });
            }

            return prisma.user.create({
              data: {
                email,
                name: requestedName,
                passwordHash: hashPassword(password),
              },
            });
          }

          if (
            !existingUser
          ) {
            return null;
          }

          // Accounts created by the earlier passwordless demo do not have a
          // password yet. The first successful credentials sign-in upgrades
          // that existing account instead of leaving the user locked out.
          if (!existingUser.passwordHash) {
            return prisma.user.update({
              where: { id: existingUser.id },
              data: { passwordHash: hashPassword(password) },
            });
          }

          if (!verifyPassword(password, existingUser.passwordHash)) return null;

          return existingUser;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin?error=true",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
