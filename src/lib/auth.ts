import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    // If no password provided, auto-create (demo mode)
                    if (!credentials.password) {
                        const newUser = await prisma.user.create({
                            data: {
                                email: credentials.email,
                                name: credentials.email.split("@")[0],
                            },
                        });
                        return {
                            id: newUser.id,
                            email: newUser.email,
                            name: newUser.name,
                            image: newUser.image,
                        };
                    }
                    return null;
                }

                // If user has a password, verify it
                if (user.hashedPassword && credentials.password) {
                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.hashedPassword
                    );
                    if (!isValid) return null;
                }

                // If user exists but no password set (e.g., Google user trying email login)
                // Allow login without password for backward compatibility
                if (!user.hashedPassword && !credentials.password) {
                    // allow
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
            }
            return session;
        },
        async jwt({ token, user }) {
            // Only query the database on initial sign-in (when user is present)
            // On subsequent requests, reuse the cached token data
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.picture = (user as { image?: string }).image;
            }
            return token;
        },
    },
};
