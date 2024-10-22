"use server";

import { signOut } from "@/auth";

export const logout = () => {
    return signOut();
};
