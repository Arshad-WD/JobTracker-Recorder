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
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login", // Redirect to login on error
    },
    debug: process.env.NODE_ENV === "development",
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === "production" ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) {
                        console.log(`[AUTH] User not found: ${credentials.email}`);
                        return null;
                    }

                    if (!user.hashedPassword) {
                        console.log(`[AUTH] User has no password (OAuth user?): ${credentials.email}`);
                        // User exists but has no password (e.g. Google user)
                        // They should use Google login
                        return null;
                    }

                    const isValid = await bcrypt.compare(
                        credentials.password,
                        user.hashedPassword
                    );

                    if (!isValid) {
                        console.log(`[AUTH] Invalid password for: ${credentials.email}`);
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        image: user.image,
                    };
                } catch (error) {
                    console.error("[AUTH] Authorization error:", error);
                    return null;
                }
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
            console.log(`[AUTH] Session created for user: ${session.user?.email}`);
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
