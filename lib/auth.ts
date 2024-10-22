import { auth } from "@/auth";
import { Session } from "next-auth";

export const currentUser = async () => {
    const session = await auth();
    return session?.user as Session["user"];
};
