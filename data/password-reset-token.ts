import { prisma } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passswordResetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        return passswordResetToken;
    } catch {
        return null;
    }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passswordResetToken = await prisma.passwordResetToken.findFirst({
            where: { email },
        });

        return passswordResetToken;
    } catch {
        return null;
    }
};
