"use client";
import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const pathname = usePathname();
    const navItems = [
        { href: "/server", text: "Server" },
        { href: "/client", text: "Client" },
        { href: "/admin", text: "Admin" },
        { href: "/settings", text: "Settings" },
    ];

    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[85%] shadow-sm">
            <div className="flex gap-x-2">
                {navItems.map(({ href, text }) => (
                    <Button
                        key={href}
                        asChild
                        variant={pathname === href ? "default" : "outline"}
                    >
                        <Link href={href}>{text}</Link>
                    </Button>
                ))}
            </div>
            <UserButton />
        </nav>
    );
};
