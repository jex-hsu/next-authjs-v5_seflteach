import { Session } from "next-auth";
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const session = useSession();
    return session.data?.user as Session["user"];
};
