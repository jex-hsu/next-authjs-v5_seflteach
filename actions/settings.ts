"use server";

import { unstable_update } from "@/auth";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { SettingsSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { error: "Unauthorized!" };
    }

    const dbUser = await getUserById(user.id!);

    if (!dbUser) {
        return { error: "Unauthorized!" };
    }

    if (user.isOauth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email != user.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email already in use!" };
        }

        const verificationToken = await generateVerificationToken(values.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );

        return { success: "Verification email send!" };
    }

    if (values.password && values.newPassword != dbUser.password) {
        const passwordMatch = await bcrypt.compare(
            values.password,
            dbUser.password!,
        );

        if (!passwordMatch) {
            return { error: "Incorrent password" };
        }

        const hashedPassword = await bcrypt.hash(values.newPassword!, 10);

        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    const updatedUser = await prisma.user.update({
        where: { id: dbUser?.id },
        data: {
            ...values,
        },
    });

    unstable_update({
        user: {
            name: updatedUser.name,
            email: updatedUser.email,
            isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
            role: updatedUser.role,
        },
    });

    return { success: "Settings Updated!" };
};
