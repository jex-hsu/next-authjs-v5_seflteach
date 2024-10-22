"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
    const onClick = () => {
        logout();
    };

    return (
        <div className="bg-white p-10 rounded-xl">
            <Button onClick={onClick} type="submit" variant="outline">
                Sign out
            </Button>
        </div>
    );
};

export default SettingsPage;
