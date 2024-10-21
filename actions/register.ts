"use server";

import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }
    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        return { error: "Email already in use!" };
    }
    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });
    // TODO: Send verification token email
    return { success: "User created!" };
};
