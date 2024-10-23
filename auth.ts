import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { getAccountByUserId } from "./data/account";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getUserById } from "./data/user";
import { prisma } from "./lib/db";

declare module "next-auth" {
    interface Session {
        user: {
            role: UserRole;
            isTwoFactorEnabled: boolean;
            isOauth: boolean;
        } & DefaultSession["user"];
    }
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            // Allow Oauth without email verification
            if (account?.provider !== "credentials") return true;

            const existingUser = await getUserById(user.id!);

            // Prevent sign in without email verification
            if (!existingUser?.emailVerified) return false;

            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConformation =
                    await getTwoFactorConfirmationByUserId(existingUser.id);

                if (!twoFactorConformation) return false;

                // Delete two factor confirmation for next sign in
                await prisma.twoFactorConfirmation.delete({
                    where: { id: twoFactorConformation.id },
                });
            }

            return true;
        },

        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            const existingAccount = await getAccountByUserId(existingUser.id);

            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
            token.isOauth = !!existingAccount;

            return token;
        },

        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (session.user) {
                session.user.name = token.name;
                session.user.email = token.email!;
                session.user.role = token.role as UserRole;
                session.user.isTwoFactorEnabled =
                    token.isTwoFactorEnabled as boolean;
                session.user.isOauth = token.isOauth as boolean;
            }

            return session;
        },
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
});
