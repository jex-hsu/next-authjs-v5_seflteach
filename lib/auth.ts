import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { Session } from "next-auth";

export const currentUser = async () => {
    const session = await auth();
    return session?.user as Session["user"];
};

export const currentRole = async () => {
    const session = await auth();
    return session?.user.role as UserRole;
};
