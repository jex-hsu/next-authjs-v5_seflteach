"use server";

import { signIn } from "@/auth";
import { DEFAUTL_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }
    const { email, password } = validatedFields.data;
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAUTL_LOGIN_REDIRECT,
        });
        return { success: "login successfully!" };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }
        throw error;
    }
};